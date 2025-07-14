<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // Import Str class

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin user if not exists
        if (!User::where('username', 'admin')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@test.com',
                'email_verified_at' => now(),
                'password' => Hash::make('pastibisa'),
                'username' => 'admin',
                'phone' => '081234567890',
                'remember_token' => Str::random(10),
            ]);
        }

        // Create test user if not exists
        if (!User::where('username', 'testuser')->exists()) {
            User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('pastibisa'),
                'username' => 'testuser',
                'phone' => '081234567891',
                'remember_token' => Str::random(10),
            ]);
        }
    }
}
