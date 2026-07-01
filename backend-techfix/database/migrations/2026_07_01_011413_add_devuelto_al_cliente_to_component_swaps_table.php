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
