<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('activities')->insert([
            ['nombre' => 'Limpieza interna', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Cambio de pasta térmica', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Formateo', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Instalación de Windows', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Actualización de BIOS', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Revisión de hardware', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Diagnóstico de falla', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
