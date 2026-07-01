<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceTypeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->unique()->randomElement([
                'Mantenimiento preventivo',
                'Mantenimiento correctivo',
                'Upgrade',
                'Instalación',
                'Diagnóstico',
                'Recuperación de datos',
            ]),
            'descripcion' => fake()->optional()->sentence(),
            'precio' => fake()->randomFloat(2, 50, 1000),
            'activo' => true,
        ];
    }
}
