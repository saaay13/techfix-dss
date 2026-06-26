<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'apellido' => 'TechFix',
            'email' => 'admin@techfix.com',
            'password' => bcrypt('admin123'),
            'telefono' => '0987654321',
            'role_id' => 1,
            'activo' => true,
        ]);

        User::create([
            'name' => 'Técnico',
            'apellido' => 'TechFix',
            'email' => 'tecnico@techfix.com',
            'password' => bcrypt('tec123'),
            'telefono' => '0987654322',
            'role_id' => 2,
            'activo' => true,
        ]);
    }
}
