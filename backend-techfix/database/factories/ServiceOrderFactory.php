<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceOrderFactory extends Factory
{
    private static array $prioridades = ['Baja', 'Media', 'Alta'];

    public function definition(): array
    {
        return [
            'fecha_ingreso' => now()->toDateString(),
            'diagnostico_inicial' => fake()->sentence(10),
            'estado' => 'Recibido',
            'prioridad' => fake()->randomElement(self::$prioridades),
            'fecha_estimada_entrega' => fake()->optional()->dateTimeBetween('now', '+2 weeks')?->format('Y-m-d'),
            'observaciones' => fake()->optional()->sentence(),
            'costo_total' => 0,
            'client_id' => \App\Models\Client::factory(),
            'device_id' => \App\Models\Device::factory(),
            'service_type_id' => \App\Models\ServiceType::factory(),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
