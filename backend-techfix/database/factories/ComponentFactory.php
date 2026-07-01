<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ComponentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->unique()->randomElement([
                'Disco Duro SSD 240GB',
                'Disco Duro HDD 1TB',
                'Memoria RAM 8GB DDR4',
                'Memoria RAM 16GB DDR4',
                'Fuente de poder 500W',
                'Batería Laptop',
                'Teclado USB',
                'Mouse óptico',
                'Ventilador CPU',
                'Pantalla 15.6"',
            ]),
            'descripcion' => fake()->optional()->sentence(),
            'cantidad' => fake()->numberBetween(5, 50),
            'stock_minimo' => fake()->numberBetween(2, 10),
            'precio_unitario' => fake()->randomFloat(2, 10, 500),
            'activo' => true,
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}
