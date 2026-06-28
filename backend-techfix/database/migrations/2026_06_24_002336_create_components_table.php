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
        Schema::create('components', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->integer('cantidad');
            $table->integer('stock_minimo');
            $table->decimal('precio_unitario', 10, 2);
            $table->boolean('activo')->default(true);
            $table->foreignId('category_id')->constrained();
            $table->index('category_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('components');
    }
};
