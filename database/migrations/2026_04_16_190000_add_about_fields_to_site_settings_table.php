<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('about_title')->nullable()->after('tagline');
            $table->text('about_description')->nullable()->after('about_title');
            $table->text('about_mission')->nullable()->after('about_description');
            $table->text('about_vision')->nullable()->after('about_mission');
            $table->text('about_history')->nullable()->after('about_vision');
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'about_title',
                'about_description',
                'about_mission',
                'about_vision',
                'about_history',
            ]);
        });
    }
};
