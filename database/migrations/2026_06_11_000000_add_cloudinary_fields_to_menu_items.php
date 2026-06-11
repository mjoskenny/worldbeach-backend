<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('menu_items')) {
            Schema::table('menu_items', function (Blueprint $table) {
                if (! Schema::hasColumn('menu_items', 'image_url')) {
                    $table->string('image_url')->nullable()->after('image');
                }

                if (! Schema::hasColumn('menu_items', 'image_public_id')) {
                    $table->string('image_public_id')->nullable()->after('image_url');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('menu_items')) {
            Schema::table('menu_items', function (Blueprint $table) {
                if (Schema::hasColumn('menu_items', 'image_public_id')) {
                    $table->dropColumn('image_public_id');
                }

                if (Schema::hasColumn('menu_items', 'image_url')) {
                    $table->dropColumn('image_url');
                }
            });
        }
    }
};
