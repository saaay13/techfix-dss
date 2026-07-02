<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            ServiceTypeSeeder::class,
            ClientSeeder::class,
            DeviceSeeder::class,
            ServiceOrderSeeder::class,
            CategorySeeder::class,
            ComponentSeeder::class,
            ActivitySeeder::class,
            PaymentSeeder::class,
        ]);
    }
}
