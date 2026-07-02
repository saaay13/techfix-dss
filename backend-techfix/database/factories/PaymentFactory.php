<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    private static array $metodos = ['Efectivo', 'Transferencia', 'Tarjeta', 'QR'];

    public function definition(): array
    {
        return [
            'monto' => fake()->randomFloat(2, 10, 500),
            'metodo_pago' => fake()->randomElement(self::$metodos),
            'fecha' => now()->toDateString(),
            'service_order_id' => \App\Models\ServiceOrder::factory(),
        ];
    }
}
