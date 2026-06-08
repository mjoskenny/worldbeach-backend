<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('reservations')) {
            Schema::create('reservations', function (Blueprint $table) {
                $table->id();
                $table->string('reservation_id')->unique();
                $table->string('customer_name');
                $table->string('customer_email');
                $table->string('customer_phone');
                $table->date('reservation_date');
                $table->string('reservation_time', 10);
                $table->unsignedInteger('guest_count');
                $table->string('table_name')->nullable();
                $table->text('special_requests')->nullable();
                $table->text('confirmation_notes')->nullable();
                $table->string('status')->default('pending');
                $table->timestamp('booked_at');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
