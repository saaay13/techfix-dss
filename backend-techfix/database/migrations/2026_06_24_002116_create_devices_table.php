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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_equipo', 50);
            $table->string('marca');
            $table->string('modelo');
            $table->string('numero_serie')->unique();
            $table->string('estado_fisico', 50)->nullable();
            $table->boolean('activo')->default(true);
            $table->foreignId('client_id')->constrained();
            $table->index('client_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
