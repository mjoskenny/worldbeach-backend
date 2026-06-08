<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('event_ticket_orders')) {
            Schema::create('event_ticket_orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_id')->unique();
                $table->foreignId('event_id')->constrained()->cascadeOnDelete();
                $table->foreignId('event_variant_id')->constrained('event_variants')->cascadeOnDelete();
                $table->string('customer_name');
                $table->string('customer_email');
                $table->string('customer_phone');
                $table->unsignedInteger('quantity');
                $table->decimal('unit_price', 10, 2);
                $table->decimal('total_amount', 10, 2);
                $table->string('payment_method');
                $table->string('ussd_code')->nullable();
                $table->string('status')->default('pending');
                $table->timestamp('ordered_at');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('event_ticket_orders');
    }
};
