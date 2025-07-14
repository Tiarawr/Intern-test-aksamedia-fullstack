<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Memanggil semua seeders
        $this->call([
            DivisionSeeder::class,
            UserSeeder::class,
            EmployeeSeeder::class,
        ]);
    }
}
