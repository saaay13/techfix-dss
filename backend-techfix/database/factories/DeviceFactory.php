<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DeviceFactory extends Factory
{
    private static array $tipos = [
        'PC', 'Laptop', 'PlayStation', 'Xbox', 'Nintendo', 'Celular', 'Electrónica general',
    ];

    private static array $estados = ['Bueno', 'Regular', 'Malo'];

    public function definition(): array
    {
        return [
            'tipo_equipo' => fake()->randomElement(self::$tipos),
            'marca' => fake()->company(),
            'modelo' => fake()->word() . ' ' . fake()->bothify('##?#'),
            'numero_serie' => fake()->unique()->bothify('SN########'),
            'estado_fisico' => fake()->optional()->randomElement(self::$estados),
            'activo' => true,
            'client_id' => \App\Models\Client::factory(),
        ];
    }
}
