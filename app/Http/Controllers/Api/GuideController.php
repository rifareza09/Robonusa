<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GuideController extends Controller
{
    /**
     * Mengambil daftar panduan interaktif aktif beserta langkah-langkahnya (eager loaded).
     */
    public function index(Request $request): JsonResponse
    {
        $guides = Guide::active()
            ->with(['steps' => function ($query) {
                $query->orderBy('step_number')
                    ->select(['id', 'guide_id', 'step_number', 'title', 'instruction', 'target_element']);
            }])
            ->select(['id', 'title', 'description'])
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $guides,
        ]);
    }

    /**
     * Mengambil detail satu panduan interaktif beserta langkah-langkahnya.
     */
    public function show(mixed $id): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'ID panduan tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $guide = Guide::active()
            ->with(['steps' => function ($query) {
                $query->orderBy('step_number')
                    ->select(['id', 'guide_id', 'step_number', 'title', 'instruction', 'target_element']);
            }])
            ->select(['id', 'title', 'description'])
            ->find($id);

        if (! $guide) {
            return response()->json([
                'success' => false,
                'message' => "Panduan dengan ID {$id} tidak ditemukan.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $guide,
        ]);
    }
}
