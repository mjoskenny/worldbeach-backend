<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = AdminNotification::latest()
            ->take(100)
            ->get()
            ->map(fn (AdminNotification $notification) => $this->transform($notification));

        return response()->json([
            'notifications' => $notifications,
            'summary' => [
                'total' => $notifications->count(),
                'unread' => $notifications->where('read', false)->count(),
                'high_priority' => $notifications->where('priority', 'high')->count(),
                'today' => $notifications->filter(
                    fn (array $notification) => str_starts_with($notification['timestamp'], now()->toDateString())
                )->count(),
            ],
        ]);
    }

    public function markRead(AdminNotification $notification): JsonResponse
    {
        $notification->update([
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Notification marked as read.',
            'notification' => $this->transform($notification->fresh()),
        ]);
    }

    public function markAllRead(): JsonResponse
    {
        AdminNotification::whereNull('read_at')->update([
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function destroy(AdminNotification $notification): JsonResponse
    {
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted.',
        ]);
    }

    public function clear(): JsonResponse
    {
        AdminNotification::query()->delete();

        return response()->json([
            'message' => 'All notifications cleared.',
        ]);
    }

    public function stream(Request $request): StreamedResponse
    {
        $lastId = (int) $request->query('last_id', 0);

        return response()->stream(function () use ($lastId) {
            @ini_set('output_buffering', 'off');
            @ini_set('zlib.output_compression', false);

            $currentLastId = $lastId;
            $startedAt = now();

            while (now()->diffInSeconds($startedAt) < 30) {
                $latest = AdminNotification::where('id', '>', $currentLastId)
                    ->orderBy('id')
                    ->get();

                if ($latest->isNotEmpty()) {
                    $currentLastId = (int) $latest->last()->id;

                    echo 'data: '.json_encode([
                        'notifications' => $latest->map(fn (AdminNotification $notification) => $this->transform($notification))->values(),
                        'last_id' => $currentLastId,
                    ])."\n\n";

                    ob_flush();
                    flush();
                }

                sleep(5);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    private function transform(AdminNotification $notification): array
    {
        return [
            'id' => (string) $notification->id,
            'type' => $notification->type,
            'title' => $notification->title,
            'message' => $notification->message,
            'priority' => $notification->priority,
            'read' => $notification->read_at !== null,
            'timestamp' => optional($notification->created_at)->toIso8601String(),
            'entity_type' => $notification->entity_type,
            'entity_id' => $notification->entity_id,
            'meta' => $notification->meta ?? [],
        ];
    }
}
