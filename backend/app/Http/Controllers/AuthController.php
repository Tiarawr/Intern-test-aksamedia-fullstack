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
        // Comprehensive debug logging
        Log::info('=== LOGIN ATTEMPT DEBUG ===', [
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'raw_content' => $request->getContent(),
            'input_all' => $request->all(),
            'input_only' => $request->only(['username', 'password']),
            'has_username' => $request->has('username'),
            'has_password' => $request->has('password'),
            'username_value' => $request->input('username'),
            'password_value' => $request->has('password') ? 'EXISTS' : 'MISSING',
            'is_json' => $request->isJson(),
            'json_data' => $request->json() ? $request->json()->all() : 'NO_JSON',
        ]);

        // Manual JSON parsing fallback
        $username = $request->input('username');
        $password = $request->input('password');
        
        // If normal input parsing fails, try manual JSON parsing
        if (!$username || !$password) {
            $rawContent = $request->getContent();
            Log::info('Attempting manual JSON parsing', [
                'raw_content' => $rawContent,
            ]);
            
            // Clean the JSON (remove trailing comma)
            $cleanedJson = preg_replace('/,\s*}/', '}', $rawContent);
            $cleanedJson = preg_replace('/,\s*]/', ']', $cleanedJson);
            
            $jsonData = json_decode($cleanedJson, true);
            
            Log::info('Manual JSON parsing result', [
                'cleaned_json' => $cleanedJson,
                'parsed_json' => $jsonData,
                'json_error' => json_last_error_msg(),
            ]);
            
            if ($jsonData && is_array($jsonData)) {
                $username = $jsonData['username'] ?? null;
                $password = $jsonData['password'] ?? null;
            }
        }

        Log::info('Final parsed values', [
            'username' => $username,
            'has_password' => !empty($password),
        ]);

        if (!$username || !$password) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username and password are required',
                'debug' => [
                    'content_type' => $request->header('Content-Type'),
                    'raw_content' => $request->getContent(),
                    'parsed_input' => $request->all(),
                ]
            ], 422);
        }

        $user = User::where('username', $username)->first();

        if (!$user) {
            Log::info('User not found', ['username' => $username]);
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }

        if (!Hash::check($password, $user->password)) {
            Log::info('Password mismatch', ['username' => $username]);
            return response()->json([
                'status' => 'error', 
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('API Token')->plainTextToken;
        
        Log::info('Login successful', ['username' => $username]);
        
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
