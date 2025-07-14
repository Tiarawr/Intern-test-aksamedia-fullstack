<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Debug incoming request
        Log::info('Login attempt', [
            'username' => $request->username,
            'has_password' => !empty($request->password),
            'request_data' => $request->all()
        ]);

        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            Log::info('User not found', ['username' => $request->username]);
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            Log::info('Password mismatch', ['username' => $request->username]);
            return response()->json([
                'status' => 'error', 
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('API Token')->plainTextToken;
        
        Log::info('Login successful', ['username' => $request->username]);
        
        return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'token' => $token,
                    'admin' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'phone' => $user->phone,
                        'email' => $user->email,
                    ],
                ],
            ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful',
        ]);
    }
}
