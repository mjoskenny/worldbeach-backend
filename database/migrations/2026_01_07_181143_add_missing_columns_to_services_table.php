<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'name')) {
                $table->string('name');
            }

            if (!Schema::hasColumn('services', 'slug')) {
                $table->string('slug')->unique();
            }

            if (!Schema::hasColumn('services', 'description')) {
                $table->text('description');
            }

            if (!Schema::hasColumn('services', 'price')) {
                $table->integer('price');
            }

            if (!Schema::hasColumn('services', 'duration')) {
                $table->string('duration')->nullable();
            }

            if (!Schema::hasColumn('services', 'category')) {
                $table->string('category')->nullable();
            }

            if (!Schema::hasColumn('services', 'image')) {
                $table->string('image')->nullable();
            }

            if (!Schema::hasColumn('services', 'available')) {
                $table->boolean('available')->default(true);
            }

            if (!Schema::hasColumn('services', 'features')) {
                $table->json('features')->nullable();
            }
        });
    }

    public function down(): void
    {
        // optional rollback
    }
};
