<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('service_types')->insert([
            ['nombre' => 'Mantenimiento preventivo', 'activo' => true],
            ['nombre' => 'Mantenimiento correctivo', 'activo' => true],
            ['nombre' => 'Upgrade', 'activo' => true],
            ['nombre' => 'Instalación', 'activo' => true],
            ['nombre' => 'Diagnóstico', 'activo' => true],
            ['nombre' => 'Recuperación de datos', 'activo' => true],
        ]);
    }
}
