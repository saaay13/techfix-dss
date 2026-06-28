<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceOrderSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('service_orders')->insert([
            [
                'fecha_ingreso' => now()->subDays(5)->toDateString(),
                'diagnostico_inicial' => 'Pantalla no enciende, posible fallo de hardware',
                'estado' => 'Diagnóstico',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->addDays(2)->toDateString(),
                'observaciones' => 'Cliente reporta que dejó caer el equipo',
                'costo_total' => 0,
                'client_id' => 1,
                'device_id' => 1,
                'service_type_id' => 2,
                'user_id' => 1,
                'created_at' => now()->subDays(5),
                'updated_at' => now(),
            ],
            [
                'fecha_ingreso' => now()->subDays(3)->toDateString(),
                'diagnostico_inicial' => 'Limpieza general y mantenimiento preventivo',
                'estado' => 'En reparación',
                'prioridad' => 'Baja',
                'fecha_estimada_entrega' => now()->addDays(5)->toDateString(),
                'observaciones' => null,
                'costo_total' => 0,
                'client_id' => 2,
                'device_id' => 3,
                'service_type_id' => 1,
                'user_id' => 2,
                'created_at' => now()->subDays(3),
                'updated_at' => now(),
            ],
            [
                'fecha_ingreso' => now()->subDays(1)->toDateString(),
                'diagnostico_inicial' => 'Actualización de firmware y configuración',
                'estado' => 'Recibido',
                'prioridad' => 'Media',
                'fecha_estimada_entrega' => now()->addDays(7)->toDateString(),
                'observaciones' => 'Cliente solicitó presupuesto antes de continuar',
                'costo_total' => 0,
                'client_id' => 3,
                'device_id' => 4,
                'service_type_id' => 3,
                'user_id' => 1,
                'created_at' => now()->subDays(1),
                'updated_at' => now(),
            ],
        ]);
    }
}
