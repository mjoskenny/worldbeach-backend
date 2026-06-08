<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('host_event_requests')) {
            Schema::create('host_event_requests', function (Blueprint $table) {
                $table->id();
                $table->string('request_id')->unique();
                $table->string('event_name');
                $table->string('event_type');
                $table->date('event_date');
                $table->string('start_time', 10)->nullable();
                $table->string('end_time', 10)->nullable();
                $table->unsignedInteger('expected_guests')->nullable();
                $table->string('budget')->nullable();
                $table->text('description')->nullable();
                $table->text('special_requirements')->nullable();
                $table->string('contact_name');
                $table->string('contact_email');
                $table->string('contact_phone');
                $table->string('status')->default('pending');
                $table->text('confirmation_notes')->nullable();
                $table->timestamp('submitted_at');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('host_event_requests');
    }
};
