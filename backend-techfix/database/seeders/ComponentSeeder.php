<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComponentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('components')->insert([
            [
                'nombre' => 'Disco Duro SSD 480GB',
                'descripcion' => 'Disco de estado sólido SATA III, 2.5 pulgadas',
                'cantidad' => 10,
                'stock_minimo' => 3,
                'precio_unitario' => 350.00,
                'activo' => true,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Memoria RAM DDR4 8GB',
                'descripcion' => 'Módulo de memoria RAM para laptop, 3200MHz',
                'cantidad' => 15,
                'stock_minimo' => 5,
                'precio_unitario' => 180.00,
                'activo' => true,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Batería Laptop Universal',
                'descripcion' => 'Batería compatible con múltiples marcas, 11.1V 4400mAh',
                'cantidad' => 5,
                'stock_minimo' => 2,
                'precio_unitario' => 250.00,
                'activo' => true,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Cargador Laptop 65W',
                'descripcion' => 'Adaptador de corriente universal 65W con puntas intercambiables',
                'cantidad' => 8,
                'stock_minimo' => 4,
                'precio_unitario' => 120.00,
                'activo' => true,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Pantalla LCD 15.6 pulgadas',
                'descripcion' => 'Pantalla de repuesto HD 1366x768 para laptop',
                'cantidad' => 3,
                'stock_minimo' => 1,
                'precio_unitario' => 450.00,
                'activo' => true,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
