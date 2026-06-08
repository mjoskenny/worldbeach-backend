<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('tagline')->nullable();
            $table->string('phone', 50);
            $table->string('secondary_phone', 50)->nullable();
            $table->string('email');
            $table->string('secondary_email')->nullable();
            $table->text('address');
            $table->string('weekday_hours', 100);
            $table->string('weekend_hours', 100);
            $table->string('facebook_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('map_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
