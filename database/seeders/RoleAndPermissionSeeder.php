<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view study plans',
            'create study plans',
            'edit study plans',
            'delete study plans',
            'view daily logs',
            'view transactions',
            'manage payments',
            'view study resources',
            'create study resources',
            'edit study resources',
            'delete study resources',
            'approve study resources',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::create(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $assistant = Role::create(['name' => 'assistant']);
        $assistant->givePermissionTo([
            'view users',
            'view study plans',
            'create study plans',
            'edit study plans',
            'view daily logs',
            'view study resources',
            'create study resources',
            'edit study resources',
            'approve study resources',
        ]);

        $student = Role::create(['name' => 'student']);
        $student->givePermissionTo([
            'view study plans',
            'view daily logs',
        ]);
    }
}
