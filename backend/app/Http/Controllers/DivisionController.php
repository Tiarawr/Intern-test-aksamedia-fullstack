<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Division;
use Illuminate\Validation\Rule;

class DivisionController extends Controller
{
    public function index(Request $request)
    {
        $query = Division::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        $divisions = $query->paginate(10);  // Paginate the results

        return response()->json([
            'status' => 'success',
            'message' => 'Divisions fetched successfully',
            'data' => [
                'divisions' => $divisions->items(),
            ],
            'pagination' => [
                'current_page' => $divisions->currentPage(),
                'per_page' => $divisions->perPage(),
                'total' => $divisions->total(),
                'last_page' => $divisions->lastPage(),
                'from' => $divisions->firstItem(),
                'to' => $divisions->lastItem(),
                'links' => $divisions->getUrlRange(1, $divisions->lastPage()),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:divisions,name',
        ]);

        try {
            $division = Division::create([
                'name' => $request->name,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Division created successfully',
                'data' => [
                    'division' => $division,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create division',
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('divisions', 'name')->ignore($id),
            ],
        ]);

        try {
            $division = Division::findOrFail($id);
            $division->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Division updated successfully',
                'data' => [
                    'division' => $division,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update division',
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $division = Division::findOrFail($id);
            
            // Check if division has employees
            if ($division->employees()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete division that has employees',
                ], 400);
            }

            $division->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Division deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete division',
            ], 500);
        }
    }
}
