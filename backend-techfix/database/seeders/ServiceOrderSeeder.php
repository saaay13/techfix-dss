<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceOrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            [
                'fecha_ingreso' => now()->subDays(5)->toDateString(),
                'diagnostico_inicial' => 'Pantalla no enciende, posible fallo de hardware',
                'estado' => 'Diagnóstico',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->addDays(2)->toDateString(),
                'observaciones' => 'Cliente reporta que dejó caer el equipo',
                'costo_total' => 250,
                'client_id' => 1,
                'device_id' => 1,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 2, 'precio' => 250, 'descripcion' => 'Reparación de pantalla'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subDays(3)->toDateString(),
                'diagnostico_inicial' => 'Limpieza general y mantenimiento preventivo',
                'estado' => 'En reparación',
                'prioridad' => 'Baja',
                'fecha_estimada_entrega' => now()->addDays(5)->toDateString(),
                'observaciones' => null,
                'costo_total' => 180,
                'client_id' => 2,
                'device_id' => 3,
                'user_id' => 2,
                'items' => [
                    ['service_type_id' => 1, 'precio' => 120, 'descripcion' => 'Limpieza interna'],
                    ['service_type_id' => 4, 'precio' => 60, 'descripcion' => 'Cambio de pasta térmica'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subDays(1)->toDateString(),
                'diagnostico_inicial' => 'Actualización de firmware y configuración',
                'estado' => 'Recibido',
                'prioridad' => 'Media',
                'fecha_estimada_entrega' => now()->addDays(7)->toDateString(),
                'observaciones' => 'Cliente solicitó presupuesto antes de continuar',
                'costo_total' => 100,
                'client_id' => 3,
                'device_id' => 4,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 3, 'precio' => 100, 'descripcion' => 'Actualización de BIOS'],
                ],
            ],
        ];

        foreach ($orders as $order) {
            $items = $order['items'];
            unset($order['items']);

            $order['created_at'] = now()->subDays(rand(1, 5));
            $order['updated_at'] = now();

            $orderId = DB::table('service_orders')->insertGetId($order);

            foreach ($items as $item) {
                DB::table('service_order_items')->insert([
                    'service_order_id' => $orderId,
                    'service_type_id' => $item['service_type_id'],
                    'descripcion' => $item['descripcion'] ?? null,
                    'precio' => $item['precio'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
