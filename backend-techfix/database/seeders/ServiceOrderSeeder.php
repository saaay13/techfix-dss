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
                'fecha_ingreso' => now()->subMonths(11)->toDateString(),
                'diagnostico_inicial' => 'Pantalla no enciende, posible fallo de hardware',
                'estado' => 'Entregado',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->subMonths(11)->addDays(3)->toDateString(),
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
                'fecha_ingreso' => now()->subMonths(10)->toDateString(),
                'diagnostico_inicial' => 'Limpieza general y mantenimiento preventivo',
                'estado' => 'Entregado',
                'prioridad' => 'Baja',
                'fecha_estimada_entrega' => now()->subMonths(10)->addDays(5)->toDateString(),
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
                'fecha_ingreso' => now()->subMonths(9)->toDateString(),
                'diagnostico_inicial' => 'Actualización de firmware y configuración',
                'estado' => 'Finalizado',
                'prioridad' => 'Media',
                'fecha_estimada_entrega' => now()->subMonths(9)->addDays(7)->toDateString(),
                'observaciones' => 'Cliente solicitó presupuesto antes de continuar',
                'costo_total' => 100,
                'client_id' => 3,
                'device_id' => 4,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 3, 'precio' => 100, 'descripcion' => 'Actualización de BIOS'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonths(8)->toDateString(),
                'diagnostico_inicial' => 'Disco duro dañado, reemplazo urgente',
                'estado' => 'Entregado',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->subMonths(8)->addDays(2)->toDateString(),
                'observaciones' => 'Datos respaldados correctamente',
                'costo_total' => 450,
                'client_id' => 4,
                'device_id' => 5,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 6, 'precio' => 350, 'descripcion' => 'Recuperación de datos'],
                    ['service_type_id' => 4, 'precio' => 100, 'descripcion' => 'Instalación de SSD nuevo'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonths(7)->toDateString(),
                'diagnostico_inicial' => 'Sobrecalentamiento y apagados inesperados',
                'estado' => 'Entregado',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->subMonths(7)->addDays(4)->toDateString(),
                'costo_total' => 200,
                'client_id' => 1,
                'device_id' => 1,
                'user_id' => 2,
                'items' => [
                    ['service_type_id' => 2, 'precio' => 150, 'descripcion' => 'Cambio de ventilador'],
                    ['service_type_id' => 1, 'precio' => 50, 'descripcion' => 'Limpieza de disipador'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonths(6)->toDateString(),
                'diagnostico_inicial' => 'Pantalla rota por caída',
                'estado' => 'Entregado',
                'prioridad' => 'Media',
                'fecha_estimada_entrega' => now()->subMonths(6)->addDays(5)->toDateString(),
                'costo_total' => 350,
                'client_id' => 5,
                'device_id' => 1,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 2, 'precio' => 350, 'descripcion' => 'Cambio de pantalla'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonths(5)->toDateString(),
                'diagnostico_inicial' => 'Virus y lentitud extrema',
                'estado' => 'Entregado',
                'prioridad' => 'Baja',
                'fecha_estimada_entrega' => now()->subMonths(5)->addDays(6)->toDateString(),
                'costo_total' => 180,
                'client_id' => 2,
                'device_id' => 3,
                'user_id' => 2,
                'items' => [
                    ['service_type_id' => 1, 'precio' => 180, 'descripcion' => 'Limpieza de virus y optimización'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonths(4)->toDateString(),
                'diagnostico_inicial' => 'No enciende, fuente dañada',
                'estado' => 'Entregado',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->subMonths(4)->addDays(3)->toDateString(),
                'costo_total' => 300,
                'client_id' => 3,
                'device_id' => 2,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 2, 'precio' => 300, 'descripcion' => 'Cambio de fuente de poder'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonths(3)->toDateString(),
                'diagnostico_inicial' => 'Actualización a Windows 11',
                'estado' => 'Entregado',
                'prioridad' => 'Baja',
                'fecha_estimada_entrega' => now()->subMonths(3)->addDays(2)->toDateString(),
                'costo_total' => 120,
                'client_id' => 4,
                'device_id' => 5,
                'user_id' => 2,
                'items' => [
                    ['service_type_id' => 3, 'precio' => 80, 'descripcion' => 'Upgrade a Windows 11'],
                    ['service_type_id' => 4, 'precio' => 40, 'descripcion' => 'Instalación de drivers'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonths(2)->toDateString(),
                'diagnostico_inicial' => 'Batería no carga, revisión completa',
                'estado' => 'Entregado',
                'prioridad' => 'Media',
                'fecha_estimada_entrega' => now()->subMonths(2)->addDays(4)->toDateString(),
                'costo_total' => 280,
                'client_id' => 1,
                'device_id' => 1,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 2, 'precio' => 280, 'descripcion' => 'Cambio de batería'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subMonth()->toDateString(),
                'diagnostico_inicial' => 'Diagnóstico general por bajo rendimiento',
                'estado' => 'Finalizado',
                'prioridad' => 'Baja',
                'fecha_estimada_entrega' => now()->subMonth()->addDays(3)->toDateString(),
                'costo_total' => 90,
                'client_id' => 3,
                'device_id' => 4,
                'user_id' => 2,
                'items' => [
                    ['service_type_id' => 5, 'precio' => 90, 'descripcion' => 'Diagnóstico completo'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subDays(15)->toDateString(),
                'diagnostico_inicial' => 'Pantalla azul recurrente, posible RAM dañada',
                'estado' => 'Diagnóstico',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->addDays(3)->toDateString(),
                'observaciones' => 'Esperando respuesta del cliente para autorizar cambio',
                'costo_total' => 0,
                'client_id' => 5,
                'device_id' => 2,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 5, 'precio' => 0, 'descripcion' => 'Diagnóstico de memoria RAM'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subDays(10)->toDateString(),
                'diagnostico_inicial' => 'No carga el sistema operativo',
                'estado' => 'Diagnóstico',
                'prioridad' => 'Alta',
                'fecha_estimada_entrega' => now()->addDays(5)->toDateString(),
                'costo_total' => 0,
                'client_id' => 1,
                'device_id' => 1,
                'user_id' => 2,
                'items' => [
                    ['service_type_id' => 5, 'precio' => 0, 'descripcion' => 'Diagnóstico de disco duro'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subDays(7)->toDateString(),
                'diagnostico_inicial' => 'Limpieza de polvo y mantenimiento preventivo',
                'estado' => 'En reparación',
                'prioridad' => 'Baja',
                'fecha_estimada_entrega' => now()->addDays(7)->toDateString(),
                'costo_total' => 130,
                'client_id' => 2,
                'device_id' => 3,
                'user_id' => 2,
                'items' => [
                    ['service_type_id' => 1, 'precio' => 70, 'descripcion' => 'Limpieza general'],
                    ['service_type_id' => 4, 'precio' => 60, 'descripcion' => 'Reemplazo de pasta térmica'],
                ],
            ],
            [
                'fecha_ingreso' => now()->subDays(3)->toDateString(),
                'diagnostico_inicial' => 'Revisión de conectividad WiFi',
                'estado' => 'Recibido',
                'prioridad' => 'Media',
                'fecha_estimada_entrega' => now()->addDays(5)->toDateString(),
                'costo_total' => 0,
                'client_id' => 4,
                'device_id' => 5,
                'user_id' => 1,
                'items' => [
                    ['service_type_id' => 5, 'precio' => 0, 'descripcion' => 'Diagnóstico de red'],
                ],
            ],
        ];

        foreach ($orders as $order) {
            $items = $order['items'];
            unset($order['items']);

            $order['created_at'] = $order['fecha_ingreso'] . ' 10:00:00';
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
