<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HostEventRequest extends Model
{
    protected $fillable = [
        'request_id',
        'event_name',
        'event_type',
        'event_date',
        'start_time',
        'end_time',
        'expected_guests',
        'budget',
        'description',
        'special_requirements',
        'contact_name',
        'contact_email',
        'contact_phone',
        'status',
        'confirmation_notes',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];
}
