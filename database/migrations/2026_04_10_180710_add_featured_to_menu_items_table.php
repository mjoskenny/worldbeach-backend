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
        if (! Schema::hasTable('menu_items') || Schema::hasColumn('menu_items', 'featured')) {
            return;
        }

        Schema::table('menu_items', function (Blueprint $table) {
            $table->boolean('featured')->default(false)->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('menu_items') || ! Schema::hasColumn('menu_items', 'featured')) {
            return;
        }

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('featured');
        });
    }
};
