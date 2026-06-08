<?php

namespace App\Services;

use App\Models\AdminNotification;

class AdminNotificationService
{
    public function create(
        string $type,
        string $title,
        string $message,
        string $priority = 'medium',
        ?string $entityType = null,
        mixed $entityId = null,
        array $meta = []
    ): AdminNotification {
        return AdminNotification::create([
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'priority' => $priority,
            'entity_type' => $entityType,
            'entity_id' => $entityId === null ? null : (string) $entityId,
            'meta' => $meta ?: null,
        ]);
    }
}
