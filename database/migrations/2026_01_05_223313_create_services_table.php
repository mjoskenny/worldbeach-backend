<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
    $table->id();

    $table->string('name');
    $table->string('slug')->unique();

    $table->text('description');

    $table->integer('price');

    $table->string('duration')->nullable();
    $table->string('category')->nullable();

    $table->string('icon')->nullable();   // e.g. lucide icon name
    $table->string('color')->nullable();  // e.g. #00B4D8

    $table->json('features')->nullable(); // ["wifi","Drinks"]

    $table->string('image')->nullable();
    $table->boolean('available')->default(true);

    $table->timestamps();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
