<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Address;

class AuthController extends Controller
{
    // RF-001: Register
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'zone' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'last_name' => $validated['last_name'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'role' => 'customer',
            'points_balance' => 50, // Welcome points
            'status' => 'active',
        ]);

        if (!empty($validated['address'])) {
            Address::create([
                'user_id' => $user->id,
                'title' => 'Principal',
                'address' => $validated['address'],
                'city' => $validated['city'] ?? 'Santa Cruz',
                'zone' => $validated['zone'] ?? 'Centro',
                'is_default' => true,
            ]);
        }

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user->load('addresses'),
        ], 201);
    }

    // RF-002: Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Tu cuenta se encuentra inactiva'], 403);
        }

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user->load('addresses'),
        ]);
    }

    // RF-005: Update Profile
    public function updateProfile(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'last_name' => 'nullable|string',
            'phone' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'password' => 'nullable|string|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user->load('addresses'),
        ]);
    }

    // Addresses
    public function addAddress(Request $request, $userId)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'zone' => 'required|string',
            'reference' => 'nullable|string',
            'is_default' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_default'])) {
            Address::where('user_id', $userId)->update(['is_default' => false]);
        }

        $address = Address::create(array_merge($validated, ['user_id' => $userId]));

        return response()->json([
            'message' => 'Dirección agregada con éxito',
            'address' => $address,
            'addresses' => Address::where('user_id', $userId)->get(),
        ], 201);
    }
}
