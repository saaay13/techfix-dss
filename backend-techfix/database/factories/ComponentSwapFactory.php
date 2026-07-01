<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ComponentSwapFactory extends Factory
{
    public function definition(): array
    {
        return [
            'service_order_id' => \App\Models\ServiceOrder::factory(),
            'observaciones' => fake()->optional()->sentence(),
            'devuelto_al_cliente' => fake()->boolean(),
        ];
    }
}
