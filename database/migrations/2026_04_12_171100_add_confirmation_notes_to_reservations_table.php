<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('reservations') && ! Schema::hasColumn('reservations', 'confirmation_notes')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->text('confirmation_notes')->nullable()->after('special_requests');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('reservations') && Schema::hasColumn('reservations', 'confirmation_notes')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->dropColumn('confirmation_notes');
            });
        }
    }
};
