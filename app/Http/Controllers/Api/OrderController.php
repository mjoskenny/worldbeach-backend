<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
    /**
     * Get session data (table info from QR code scan)
     */
    public function getSessionData(Request $request)
    {
        return response()->json([
            'table_number' => session('table_number'),
            'table_id' => session('table_id'),
            'has_table' => session()->has('table_number') && session()->has('table_id'),
        ]);
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_email' => 'nullable|email',
            'order_type' => 'required|in:dine-in,takeaway,delivery',
            'table_number' => 'nullable|string|max:50',
            'table_id' => 'nullable|string|max:50',
            'delivery_address' => 'nullable|string',
            'special_notes' => 'nullable|string',
            'items' => 'required|array',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'ussd_code' => 'nullable|string',
        ]);

        // Create order
        $order = Order::create([
            'order_id' => 'WB' . now()->format('ymdHis') . random_int(100, 999),
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? null,
            'order_type' => $validated['order_type'],
            'table_number' => $validated['table_number'] ?? null,
            'table_id' => $validated['table_id'] ?? null,
            'delivery_address' => $validated['delivery_address'] ?? null,
            'special_notes' => $validated['special_notes'] ?? null,
            'items' => $validated['items'],
            'total_amount' => $validated['total_amount'],
            'payment_method' => $validated['payment_method'],
            'ussd_code' => $validated['ussd_code'] ?? null,
            'order_status' => 'pending',
            'ordered_at' => now(),
        ]);

        app(AdminNotificationService::class)->create(
            'order',
            'New order received',
            sprintf(
                'Order %s from %s for %s has been placed.',
                $order->order_id,
                $order->customer_name,
                number_format((float) $order->total_amount, 2)
            ),
            'high',
            'order',
            $order->order_id,
            [
                'customer_name' => $order->customer_name,
                'total_amount' => (float) $order->total_amount,
                'order_status' => $order->order_status,
            ]
        );

        // Clear table session after order is placed when this request has web session state.
        if ($request->hasSession()) {
            $request->session()->forget(['table_number', 'table_id']);
        }

        return response()->json([
            'success' => true,
            'order_id' => $order->order_id,
            'message' => 'Order created successfully',
            'order' => $order,
        ], 201);
    }

    /**
     * Get order details
     */
    public function show($orderId)
    {
        $order = Order::where('order_id', $orderId)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    /**
     * Get all orders (admin)
     */
    public function index()
    {
        $orders = Order::latest()->paginate(50);
        return response()->json($orders);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $orderId)
    {
        $order = Order::where('order_id', $orderId)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->update([
            'order_status' => $request->status,
        ]);

        app(AdminNotificationService::class)->create(
            'system',
            'Order status updated',
            sprintf('Order %s is now %s.', $order->order_id, $order->order_status),
            in_array($order->order_status, ['cancelled'], true) ? 'high' : 'medium',
            'order',
            $order->order_id,
            [
                'order_status' => $order->order_status,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'order' => $order,
        ]);
    }
}
