<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// HU-07: Agrega el indicador de devolución al cliente para el componente retirado.
// Esto permite al técnico documentar si la pieza dañada se entrega al cliente
// o se desecha/almacena, cumpliendo el criterio: "Opción de indicar si el
// componente retirado se devolvió al cliente."
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('component_swaps', function (Blueprint $table) {
            $table->boolean('devuelto_al_cliente')->default(false)->after('observaciones');
        });
    }

    public function down(): void
    {
        Schema::table('component_swaps', function (Blueprint $table) {
            $table->dropColumn('devuelto_al_cliente');
        });
    }
};
