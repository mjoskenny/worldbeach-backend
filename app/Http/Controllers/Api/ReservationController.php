<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json(
            Reservation::latest('booked_at')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required|date_format:H:i',
            'guest_count' => 'required|integer|min:1|max:50',
            'special_requests' => 'nullable|string',
        ]);

        $reservation = Reservation::create([
            'reservation_id' => 'RES' . now()->format('ymdHis') . random_int(100, 999),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'guest_count' => $validated['guest_count'],
            'special_requests' => $validated['special_requests'] ?? null,
            'status' => 'pending',
            'booked_at' => now(),
        ]);

        app(AdminNotificationService::class)->create(
            'reservation',
            'New reservation submitted',
            sprintf(
                '%s requested a table for %d guest(s) on %s at %s.',
                $reservation->customer_name,
                $reservation->guest_count,
                $reservation->reservation_date,
                $reservation->reservation_time
            ),
            'high',
            'reservation',
            $reservation->reservation_id,
            [
                'guest_count' => $reservation->guest_count,
                'status' => $reservation->status,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully.',
            'reservation' => $reservation,
        ], 201);
    }

    public function update(Request $request, string $reservationId)
    {
        $reservation = Reservation::where('reservation_id', $reservationId)->firstOrFail();

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required|date_format:H:i',
            'guest_count' => 'required|integer|min:1|max:50',
            'table_name' => 'nullable|string|max:255',
            'special_requests' => 'nullable|string',
            'confirmation_notes' => 'nullable|string|max:1000',
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $wasConfirmed = $reservation->status === 'confirmed';

        $reservation->update([
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'guest_count' => $validated['guest_count'],
            'table_name' => $validated['table_name'] ?? null,
            'special_requests' => $validated['special_requests'] ?? null,
            'confirmation_notes' => $validated['confirmation_notes'] ?? null,
            'status' => $validated['status'],
        ]);

        app(AdminNotificationService::class)->create(
            'system',
            'Reservation updated',
            sprintf(
                'Reservation %s for %s is now %s.',
                $reservation->reservation_id,
                $reservation->customer_name,
                $reservation->status
            ),
            $reservation->status === 'cancelled' ? 'high' : 'medium',
            'reservation',
            $reservation->reservation_id,
            [
                'status' => $reservation->status,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Reservation updated successfully.',
            'reservation' => $reservation->fresh(),
            'just_confirmed' => ! $wasConfirmed && $reservation->status === 'confirmed',
        ]);
    }

    public function destroy(string $reservationId)
    {
        $reservation = Reservation::where('reservation_id', $reservationId)->firstOrFail();
        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservation deleted successfully.',
        ]);
    }
}
