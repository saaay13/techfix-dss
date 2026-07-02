<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $payments = [];

        for ($i = 0; $i < 12; $i++) {
            $daysAgo = $i * 30 + rand(1, 15);
            $fecha = now()->subDays($daysAgo)->format('Y-m-d');
            $payments[] = [
                'service_order_id' => rand(1, 11),
                'monto' => rand(100, 600),
                'fecha' => $fecha,
                'metodo_pago' => ['Efectivo', 'Tarjeta', 'Transferencia'][array_rand(['Efectivo', 'Tarjeta', 'Transferencia'])],
                'created_at' => $fecha . ' 12:00:00',
                'updated_at' => now(),
            ];
        }

        DB::table('payments')->insert($payments);
    }
}
