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
        if (! Schema::hasTable('categories')) {
            return;
        }

        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'type')) {
                $table->enum('type', ['menu', 'event', 'space'])->default('menu')->after('name');
            }

            if (! Schema::hasColumn('categories', 'icon')) {
                $table->string('icon')->nullable()->after('type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('categories')) {
            return;
        }

        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'type')) {
                $table->dropColumn('type');
            }

            if (Schema::hasColumn('categories', 'icon')) {
                $table->dropColumn('icon');
            }
        });
    }
};
