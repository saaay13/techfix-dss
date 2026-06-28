<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DeviceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('devices')->insert([
            [
                'tipo_equipo' => 'Laptop',
                'marca' => 'Dell',
                'modelo' => 'XPS 15',
                'numero_serie' => 'SN001',
                'estado_fisico' => 'Bueno',
                'activo' => true,
                'client_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipo_equipo' => 'PC',
                'marca' => 'HP',
                'modelo' => 'Pavilion',
                'numero_serie' => 'SN002',
                'estado_fisico' => 'Regular',
                'activo' => true,
                'client_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipo_equipo' => 'Celular',
                'marca' => 'Samsung',
                'modelo' => 'Galaxy S24',
                'numero_serie' => 'SN003',
                'estado_fisico' => 'Malo',
                'activo' => true,
                'client_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipo_equipo' => 'PlayStation',
                'marca' => 'Sony',
                'modelo' => 'PS5',
                'numero_serie' => 'SN004',
                'estado_fisico' => 'Bueno',
                'activo' => true,
                'client_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tipo_equipo' => 'Laptop',
                'marca' => 'Lenovo',
                'modelo' => 'ThinkPad X1',
                'numero_serie' => 'SN005',
                'estado_fisico' => 'Regular',
                'activo' => true,
                'client_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
