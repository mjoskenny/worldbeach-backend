<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HostEventRequest;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;

class HostEventRequestController extends Controller
{
    public function index()
    {
        return response()->json(
            HostEventRequest::latest('submitted_at')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_type' => 'required|string|max:100',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'expected_guests' => 'nullable|integer|min:1|max:5000',
            'budget' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'special_requirements' => 'nullable|string',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:50',
        ]);

        $hostEventRequest = HostEventRequest::create([
            'request_id' => 'HOST' . now()->format('ymdHis') . random_int(100, 999),
            'event_name' => $validated['event_name'],
            'event_type' => $validated['event_type'],
            'event_date' => $validated['event_date'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'expected_guests' => $validated['expected_guests'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'description' => $validated['description'] ?? null,
            'special_requirements' => $validated['special_requirements'] ?? null,
            'contact_name' => $validated['contact_name'],
            'contact_email' => $validated['contact_email'],
            'contact_phone' => $validated['contact_phone'],
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        app(AdminNotificationService::class)->create(
            'host-request',
            'New host event request',
            sprintf(
                '%s requested %s on %s.',
                $hostEventRequest->contact_name,
                $hostEventRequest->event_type,
                $hostEventRequest->event_date
            ),
            'high',
            'host_event_request',
            $hostEventRequest->request_id,
            [
                'expected_guests' => $hostEventRequest->expected_guests,
                'status' => $hostEventRequest->status,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Host event request created successfully.',
            'request' => $hostEventRequest,
        ], 201);
    }

    public function update(Request $request, string $requestId)
    {
        $hostEventRequest = HostEventRequest::where('request_id', $requestId)->firstOrFail();
        $wasConfirmed = $hostEventRequest->status === 'confirmed';

        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_type' => 'required|string|max:100',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'expected_guests' => 'nullable|integer|min:1|max:5000',
            'budget' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'special_requirements' => 'nullable|string',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:50',
            'status' => 'required|in:pending,contacted,confirmed,declined',
            'confirmation_notes' => 'nullable|string|max:1000',
        ]);

        $hostEventRequest->update([
            'event_name' => $validated['event_name'],
            'event_type' => $validated['event_type'],
            'event_date' => $validated['event_date'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'expected_guests' => $validated['expected_guests'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'description' => $validated['description'] ?? null,
            'special_requirements' => $validated['special_requirements'] ?? null,
            'contact_name' => $validated['contact_name'],
            'contact_email' => $validated['contact_email'],
            'contact_phone' => $validated['contact_phone'],
            'status' => $validated['status'],
            'confirmation_notes' => $validated['confirmation_notes'] ?? null,
        ]);

        app(AdminNotificationService::class)->create(
            'system',
            'Host event request updated',
            sprintf(
                'Host request %s is now %s.',
                $hostEventRequest->request_id,
                $hostEventRequest->status
            ),
            $hostEventRequest->status === 'declined' ? 'high' : 'medium',
            'host_event_request',
            $hostEventRequest->request_id,
            [
                'status' => $hostEventRequest->status,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Host event request updated successfully.',
            'request' => $hostEventRequest->fresh(),
            'just_confirmed' => ! $wasConfirmed && $hostEventRequest->status === 'confirmed',
        ]);
    }

    public function destroy(string $requestId)
    {
        $hostEventRequest = HostEventRequest::where('request_id', $requestId)->firstOrFail();
        $hostEventRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Host event request deleted successfully.',
        ]);
    }
}
