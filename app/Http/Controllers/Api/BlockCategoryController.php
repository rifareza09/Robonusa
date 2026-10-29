<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlockCategoryController extends Controller
{
    /**
     * Mengambil daftar kategori blok aktif.
     * Opsional: include_blocks=true untuk eager load definisi blok di setiap kategori.
     */
    public function index(Request $request): JsonResponse
    {
        $includeBlocks = filter_var($request->query('include_blocks', false), FILTER_VALIDATE_BOOLEAN);

        $query = BlockCategory::active()
            ->select(['id', 'name', 'slug', 'description', 'color_hex', 'sort_order']);

        if ($includeBlocks) {
            $query->with(['blockDefinitions' => function ($q) {
                $q->active()
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
            }]);
        }

        $categories = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }
}
