<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'manage-users',
            'view-all-logs',
            'manage-roles',
            'view-stats',
            'view-students', // For assistants
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles and Assign Permissions
        
        // 1. Admin
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        // 2. Assistant
        $assistantRole = Role::firstOrCreate(['name' => 'assistant']);
        $assistantRole->syncPermissions(['view-students', 'view-all-logs']);

        // 3. Student
        $studentRole = Role::firstOrCreate(['name' => 'student']);
        // Students don't need specific permissions yet, they just have the role

        // Create a Default Admin User if not exists
        $adminEmail = 'admin@example.com';
        if (!User::where('email', $adminEmail)->exists()) {
            $admin = User::create([
                'name' => 'مدیر سیستم',
                'mobile' => '09120000000',
                'email' => $adminEmail,
                'password' => bcrypt('Admin1234!'),
            ]);
            $admin->assignRole($adminRole);
        }
    }
}
