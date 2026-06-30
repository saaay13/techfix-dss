<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Admin',
            'apellido' => 'TechFix',
            'email' => 'admin@techfix.com',
            'password' => bcrypt('12345678'),
            'telefono' => '70000000',
            'role_id' => 1,
            'activo' => true,
        ]);
        DB::table('users')->insert([
            'name' => 'Tecnico',
            'apellido' => 'Sanabria',
            'email' => 'tecnico@techfix.com',
            'password' => bcrypt('12345678'),
            'telefono' => '70000000',
            'role_id' => 2,
            'activo' => true,
        ]);
    }
}
