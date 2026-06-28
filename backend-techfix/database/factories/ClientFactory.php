<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'nombre'   => fake()->firstName(),
            'apellido' => fake()->lastName(),
            'telefono' => fake()->numerify('77#######'),
            'correo'   => fake()->unique()->safeEmail(),
            'ci'       => fake()->unique()->numerify('########'),
            'activo'   => true,
        ];
    }
}
