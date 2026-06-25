<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DeviceFactory extends Factory
{
    private static array $tiposEquipo = [
        'Laptop', 'Desktop', 'Impresora', 'Monitor', 'Tablet',
        'Smartphone', 'Router', 'Switch', 'Servidor', 'UPS',
    ];

    private static array $marcas = [
        'HP', 'Dell', 'Lenovo', 'Apple', 'Samsung',
        'Epson', 'Canon', 'Cisco', 'IBM', 'Asus',
    ];

    private static array $estadosFisicos = [
        'Bueno', 'Regular', 'Malo', 'Dañado',
    ];

    public function definition(): array
    {
        return [
            'tipo_equipo' => fake()->randomElement(self::$tiposEquipo),
            'marca' => fake()->randomElement(self::$marcas),
            'modelo' => fake()->bothify('??-####'),
            'numero_serie' => fake()->unique()->bothify('SN-####-????'),
            'estado_fisico' => fake()->optional()->randomElement(self::$estadosFisicos),
            'activo' => true,
            'client_id' => \App\Models\Client::factory(),
        ];
    }
}
