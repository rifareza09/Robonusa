<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExampleProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExampleProjectController extends Controller
{
    /**
     * Mengambil daftar proyek contoh aktif.
     * Filter opsional:
     * - difficulty: 'pemula', 'menengah', 'mahir'
     * - include_workspace: boolean (default true)
     */
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'difficulty'        => 'nullable|string|in:pemula,menengah,mahir,beginner,intermediate,advanced',
            'include_workspace' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter query tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $includeWorkspace = filter_var($request->query('include_workspace', true), FILTER_VALIDATE_BOOLEAN);

        $columns = [
            'id',
            'name',
            'slug',
            'description',
            'difficulty',
            'thumbnail',
            'sort_order',
        ];

        if ($includeWorkspace) {
            $columns[] = 'workspace_json';
        }

        $query = ExampleProject::active()->select($columns);

        if ($difficulty = $request->query('difficulty')) {
            $mapped = match ($difficulty) {
                'beginner'     => 'pemula',
                'intermediate' => 'menengah',
                'advanced'     => 'mahir',
                default        => $difficulty,
            };
            $query->where('difficulty', $mapped);
        }

        $projects = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $projects,
        ]);
    }

    /**
     * Mengambil detail proyek contoh berdasarkan slug, termasuk workspace_json.
     */
    public function show(string $slug): JsonResponse
    {
        // Validasi format slug
        $validator = Validator::make(['slug' => $slug], [
            'slug' => 'required|string|regex:/^[a-z0-9-]+$/|max:150',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Format slug tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $project = ExampleProject::active()
            ->where('slug', $slug)
            ->select([
                'id',
                'name',
                'slug',
                'description',
                'difficulty',
                'thumbnail',
                'workspace_json',
                'sort_order',
            ])
            ->first();

        if (! $project) {
            return response()->json([
                'success' => false,
                'message' => "Proyek contoh dengan slug '{$slug}' tidak ditemukan.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $project,
        ]);
    }
}
