<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
            'email' => 'advisor@konkoor.test',
            'mobile' => '09123456790',
            'password' => Hash::make('advisor123'),
        ]);
        $advisor->assignRole('assistant');

        // Student User
        $student = User::create([
            'name' => 'علی احمدی',
            'email' => 'student@konkoor.test',
            'mobile' => '09123456791',
            'password' => Hash::make('student123'),
        ]);
        $student->assignRole('student');

        $this->command->info('✅ Demo users created successfully!');
        $this->command->info('Admin: admin@konkoor.test / admin123');
        $this->command->info('Advisor: advisor@konkoor.test / advisor123');
        $this->command->info('Student: student@konkoor.test / student123');
    }
}
