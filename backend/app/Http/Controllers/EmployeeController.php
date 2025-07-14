<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('division');

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('division_id')) {
            $query->where('division_id', $request->division_id);
        }

        // Allow custom per_page, default to 8
        $perPage = $request->get('per_page', 8);
        $employees = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Employees fetched successfully',
            'data' => [
                'employees' => $employees->items(),
            ],
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048', // Accept file uploads, including svg
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:employees,phone',
            'division' => 'required|exists:divisions,id',
            'position' => 'required|string|max:255',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('employees', 'public');
        }

        $employee = Employee::create([
            'image' => $imagePath,
            'name' => $request->name,
            'phone' => $request->phone,
            'division_id' => $request->division, // Note: request uses 'division', db uses 'division_id'
            'position' => $request->position,
        ]);

        // Load the employee with division relationship for response
        $employee->load('division');

        return response()->json([
            'status' => 'success',
            'message' => 'Employee created successfully',
            'data' => ['employee' => $employee],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee not found',
            ], 404);
        }

        $request->validate([
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048', // Accept file uploads
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                Rule::unique('employees', 'phone')->ignore($employee->id),
            ],
            'division' => 'required|exists:divisions,id',
            'position' => 'required|string|max:255',
        ]);

        $imagePath = $employee->image; // Keep existing image by default
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($employee->image && Storage::disk('public')->exists($employee->image)) {
                Storage::disk('public')->delete($employee->image);
            }
            $imagePath = $request->file('image')->store('employees', 'public');
        }

        $employee->update([
            'image' => $imagePath,
            'name' => $request->name,
            'phone' => $request->phone,
            'division_id' => $request->division, // Note: request uses 'division', db uses 'division_id'
            'position' => $request->position,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Employee updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee not found',
            ], 404);
        }

        $employee->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Employee deleted successfully',
        ]);
    }
}
