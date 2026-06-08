<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->enum('order_type', ['dine-in', 'takeaway', 'delivery']);
            $table->string('table_number')->nullable();
            $table->string('table_id')->nullable();
            $table->text('delivery_address')->nullable();
            $table->text('special_notes')->nullable();
            $table->json('items');
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_method');
            $table->string('ussd_code')->nullable();
            $table->enum('order_status', ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])->default('pending');
            $table->timestamp('ordered_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
