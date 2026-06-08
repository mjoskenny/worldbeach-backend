<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('spaces', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', ['indoor','outdoor','private'])->default('indoor');
            $table->string('image')->nullable();
            $table->integer('capacity')->default(0);
            $table->string('size')->nullable();
            $table->json('features')->nullable(); // store array of features
            $table->decimal('price_per_hour', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spaces');
    }
};
