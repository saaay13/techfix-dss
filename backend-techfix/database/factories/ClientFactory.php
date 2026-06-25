<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->firstName(),
            'apellido' => fake()->lastName(),
            'telefono' => fake()->numerify('7#######'),
            'correo' => fake()->unique()->safeEmail(),
            'ci' => fake()->unique()->numerify('########'),
            'activo' => true,
        ];
    }
}
