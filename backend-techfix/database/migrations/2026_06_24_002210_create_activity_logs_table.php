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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->text('descripcion_personalizada')->nullable();
            $table->foreignId('service_order_item_id')->constrained();
            $table->foreignId('activity_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->boolean('completed')->default(false);
            $table->index('service_order_item_id');
            $table->index('activity_id');
            $table->index('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
