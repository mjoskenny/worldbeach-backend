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
    Schema::create('events', function (Blueprint $table) {
        $table->id(); // auto increment ID
        $table->string('title');
        $table->date('date');
        $table->time('time');
        $table->text('description')->nullable();
        $table->string('image')->nullable();
        $table->enum('status', ['upcoming', 'past', 'cancelled'])->default('upcoming');
        $table->timestamps(); // created_at & updated_at
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
