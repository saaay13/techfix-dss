<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_type_id')->constrained();
            $table->string('descripcion', 500)->nullable();
            $table->decimal('precio', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_order_items');
    }
};
