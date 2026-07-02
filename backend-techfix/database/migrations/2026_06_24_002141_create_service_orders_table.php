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
        Schema::create('service_orders', function (Blueprint $table) {
            $table->id();
            $table->date('fecha_ingreso');
            $table->text('diagnostico_inicial');
            $table->string('estado', 50);
            $table->string('prioridad', 20);
            $table->date('fecha_estimada_entrega')->nullable();
            $table->text('observaciones')->nullable();
            $table->decimal('costo_total', 10, 2)->default(0);
            $table->string('codigo_orden', 20)->nullable()->unique();
            $table->foreignId('client_id')->constrained();
            $table->foreignId('device_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->index('client_id');
            $table->index('device_id');
            $table->index('user_id');
            $table->index('estado');
            $table->index('prioridad');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_orders');
    }
};
