<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'order_type', // dine-in, takeaway, delivery
        'table_number',
        'table_id',
        'delivery_address',
        'special_notes',
        'items', // JSON
        'total_amount',
        'payment_method',
        'ussd_code',
        'order_status', // pending, confirmed, completed, cancelled
        'ordered_at',
    ];

    protected $casts = [
        'items' => 'array',
        'ordered_at' => 'datetime',
    ];
}
