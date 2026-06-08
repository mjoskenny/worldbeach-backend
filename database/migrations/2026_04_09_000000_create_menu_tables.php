<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('menu_items')) {
            Schema::create('menu_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('category_id')->constrained()->cascadeOnDelete();
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('price', 10, 2)->default(0);
                $table->decimal('variant_price', 10, 2)->nullable();
                $table->string('image')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('qr_categories')) {
            Schema::create('qr_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('image')->nullable();
                $table->integer('position')->default(0);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('qr_menu_items')) {
            Schema::create('qr_menu_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('qr_category_id')->constrained('qr_categories')->cascadeOnDelete();
                $table->string('name');
                $table->text('description')->nullable();
                $table->integer('price')->nullable();
                $table->string('image')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->integer('position')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_menu_items');
        Schema::dropIfExists('qr_categories');
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('categories');
    }
};
