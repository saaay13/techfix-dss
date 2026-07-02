<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('service_types')->insert([
            ['nombre' => 'Mantenimiento preventivo', 'descripcion' => 'Limpieza y revisión general del equipo', 'precio' => 120, 'activo' => true],
            ['nombre' => 'Mantenimiento correctivo', 'descripcion' => 'Reparación de fallos de hardware o software', 'precio' => 250, 'activo' => true],
            ['nombre' => 'Upgrade', 'descripcion' => 'Actualización de componentes o software', 'precio' => 200, 'activo' => true],
            ['nombre' => 'Instalación', 'descripcion' => 'Instalación de software, drivers o periféricos', 'precio' => 80, 'activo' => true],
            ['nombre' => 'Diagnóstico', 'descripcion' => 'Evaluación técnica del equipo', 'precio' => 90, 'activo' => true],
            ['nombre' => 'Recuperación de datos', 'descripcion' => 'Rescate de información de discos dañados', 'precio' => 350, 'activo' => true],
        ]);
    }
}
