<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComponentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->word(),
            'descripcion' => fake()->sentence(),
            'cantidad' => fake()->numberBetween(1, 100),
            'stock_minimo' => fake()->numberBetween(1, 10),
            'precio_unitario' => fake()->randomFloat(2, 5, 500),
            'category_id' => Category::factory(),
            'activo' => true,
        ];
    }
}