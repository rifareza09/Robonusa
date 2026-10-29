<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockCategory;
use App\Models\BlockDefinition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlockDefinitionController extends Controller
{
    /**
     * Mengambil daftar metadata definisi blok aktif.
     * Mendukung filter:
     * - category: slug atau ID kategori (divalidasi)
     */
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'category' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $query = BlockDefinition::active()
            ->select([
                'id',
                'block_category_id',
                'block_type',
                'display_name',
                'description',
                'block_shape',
                'parameter_schema',
                'sort_order',
            ]);

        if ($categoryFilter = $request->query('category')) {
            $category = is_numeric($categoryFilter)
                ? BlockCategory::find($categoryFilter)
                : BlockCategory::where('slug', $categoryFilter)->first();

            if (! $category) {
                return response()->json([
                    'success' => false,
                    'message' => "Kategori '{$categoryFilter}' tidak ditemukan.",
                    'data'    => [],
                ], 404);
            }

            $query->where('block_category_id', $category->id);
        }

        $blocks = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $blocks,
        ]);
    }
}
