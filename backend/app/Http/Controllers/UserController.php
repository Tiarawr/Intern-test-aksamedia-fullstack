<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Get the authenticated user's profile
     */
    public function profile()
    {
        /** @var User $user */
        $user = Auth::user();
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Update the authenticated user's profile
     */
    public function updateProfile(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);

        // If user wants to change password, verify current password
        if ($request->filled('new_password')) {
            if (!$request->filled('current_password')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Current password is required when changing password'
                ], 400);
            }

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Current password is incorrect'
                ], 400);
            }
        }

        // Update user data
        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        
        if ($request->filled('new_password')) {
            $user->password = Hash::make($request->new_password);
        }
        
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }
}
