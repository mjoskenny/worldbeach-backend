<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventTicketOrder;
use App\Models\EventVariant;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EventTicketOrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'event_variant_id' => 'required|exists:event_variants,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string|max:50',
            'ussd_code' => 'nullable|string|max:50',
        ]);

        $result = DB::transaction(function () use ($validated) {
            $event = Event::with('variants')->findOrFail($validated['event_id']);

            /** @var EventVariant $variant */
            $variant = EventVariant::where('id', $validated['event_variant_id'])
                ->where('event_id', $event->id)
                ->lockForUpdate()
                ->firstOrFail();

            $remainingTickets = max(0, (int) $variant->capacity - (int) $variant->tickets_sold);

            if ($validated['quantity'] > $remainingTickets) {
                throw ValidationException::withMessages([
                    'quantity' => ["Only {$remainingTickets} ticket(s) left for {$variant->name}."],
                ]);
            }

            $order = EventTicketOrder::create([
                'order_id' => 'EVT' . now()->format('ymdHis') . random_int(100, 999),
                'event_id' => $event->id,
                'event_variant_id' => $variant->id,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'quantity' => $validated['quantity'],
                'unit_price' => $variant->price,
                'total_amount' => $variant->price * $validated['quantity'],
                'payment_method' => $validated['payment_method'],
                'ussd_code' => $validated['ussd_code'] ?? null,
                'status' => 'pending',
                'ordered_at' => now(),
            ]);

            $variant->increment('tickets_sold', $validated['quantity']);
            $event->refresh()->load(['category', 'variants']);

            return [
                'order' => $order,
                'event' => $event,
            ];
        });

        app(AdminNotificationService::class)->create(
            'event',
            'New ticket order received',
            sprintf(
                '%s bought %d ticket(s) for %s.',
                $result['order']->customer_name,
                $result['order']->quantity,
                $result['event']->title
            ),
            'high',
            'event_ticket_order',
            $result['order']->order_id,
            [
                'event_id' => $result['event']->id,
                'quantity' => $result['order']->quantity,
                'total_amount' => (float) $result['order']->total_amount,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Ticket order created successfully.',
            'order' => $result['order'],
            'event' => $result['event'],
        ], 201);
    }
}
