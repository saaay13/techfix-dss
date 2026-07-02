<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivityServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['activity_id' => 1, 'service_type_id' => 1],
            ['activity_id' => 2, 'service_type_id' => 1],
            ['activity_id' => 6, 'service_type_id' => 1],
            ['activity_id' => 6, 'service_type_id' => 2],
            ['activity_id' => 7, 'service_type_id' => 2],
            ['activity_id' => 3, 'service_type_id' => 3],
            ['activity_id' => 4, 'service_type_id' => 3],
            ['activity_id' => 5, 'service_type_id' => 3],
            ['activity_id' => 4, 'service_type_id' => 4],
            ['activity_id' => 7, 'service_type_id' => 5],
            ['activity_id' => 6, 'service_type_id' => 5],
        ];

        foreach ($rows as $row) {
            DB::table('activity_service_type')->updateOrInsert(
                $row,
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
