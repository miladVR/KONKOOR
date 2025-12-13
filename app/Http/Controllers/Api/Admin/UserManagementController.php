<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('mobile', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->role !== 'all') {
            $query->role($request->role);
        }

        $users = $query->latest()->paginate(10);

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|unique:users,mobile',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name',
            'subscription_expires_at' => 'nullable|date',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'mobile' => $validated['mobile'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'subscription_expires_at' => $validated['subscription_expires_at'] ?? null,
        ]);

        $user->assignRole($validated['role']);

        return response()->json(['message' => 'User created successfully', 'user' => $user->load('roles')], 201);
    }

    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'mobile' => ['sometimes', 'required', 'string', Rule::unique('users')->ignore($user->id)],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|required|exists:roles,name',
            'subscription_expires_at' => 'nullable|date',
        ]);

        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'mobile' => $validated['mobile'] ?? $user->mobile,
            'email' => $validated['email'] ?? $user->email,
            'subscription_expires_at' => array_key_exists('subscription_expires_at', $validated) 
                ? $validated['subscription_expires_at'] 
                : $user->subscription_expires_at,
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        if (!empty($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return response()->json(['message' => 'User updated successfully', 'user' => $user->load('roles')]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting self
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete yourself'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function assignRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::findOrFail($id);
        $user->syncRoles([$request->role]);

        return response()->json(['message' => 'Role assigned successfully', 'user' => $user->load('roles')]);
    }

    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'students' => User::role('student')->count(),
            'assistants' => User::role('assistant')->count(),
            'admins' => User::role('admin')->count(),
            'daily_logs' => \App\Models\DailyLog::count(),
            'study_plans' => \App\Models\StudyPlan::count(),
        ]);
    }
}
