<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('clients')->insert([
            [
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'telefono' => '77123456',
                'correo' => 'juan.perez@email.com',
                'ci' => '1234567',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'María',
                'apellido' => 'García',
                'telefono' => '77234567',
                'correo' => 'maria.garcia@email.com',
                'ci' => '2345678',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Carlos',
                'apellido' => 'López',
                'telefono' => '77345678',
                'correo' => 'carlos.lopez@email.com',
                'ci' => '3456789',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ana',
                'apellido' => 'Martínez',
                'telefono' => '77456789',
                'correo' => 'ana.martinez@email.com',
                'ci' => '4567890',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Pedro',
                'apellido' => 'Rodríguez',
                'telefono' => '77567890',
                'correo' => 'pedro.rodriguez@email.com',
                'ci' => '5678901',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
