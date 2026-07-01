<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SwapDetailFactory extends Factory
{
    private static array $tipos = ['retirado', 'instalado'];

    public function definition(): array
    {
        return [
            'component_swap_id' => \App\Models\ComponentSwap::factory(),
            'component_id' => \App\Models\Component::factory(),
            'tipo' => fake()->randomElement(self::$tipos),
            'cantidad' => fake()->numberBetween(1, 5),
        ];
    }
}
