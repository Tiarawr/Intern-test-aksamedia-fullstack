<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Division;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        // Get existing divisions
        $divisions = Division::all();

        if ($divisions->count() > 0) {
            Employee::create([
                'name' => 'John Doe',
                'phone' => '081234567890',
                'division_id' => $divisions->first()->id,
                'position' => 'Software Engineer',
            ]);

            Employee::create([
                'name' => 'Jane Smith',
                'phone' => '081234567891',
                'division_id' => $divisions->first()->id,
                'position' => 'Product Manager',
            ]);

            if ($divisions->count() > 1) {
                Employee::create([
                    'name' => 'Bob Johnson',
                    'phone' => '081234567892',
                    'division_id' => $divisions->skip(1)->first()->id,
                    'position' => 'Marketing Specialist',
                ]);
            }
        }
    }
}
