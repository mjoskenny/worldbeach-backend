<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@worldbeach.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('@Worldbeach25'),
                'is_admin' => true,
            ]
        );
    }
}