<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ComponentUsageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'cantidad' => fake()->numberBetween(1, 5),
            'precio_unitario' => fake()->randomFloat(2, 10, 300),
            'service_order_id' => \App\Models\ServiceOrder::factory(),
            'component_id' => \App\Models\Component::factory(),
        ];
    }
}