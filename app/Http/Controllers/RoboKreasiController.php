<?php

namespace App\Http\Controllers;

use App\Models\BlockCategory;
use App\Models\BlockDefinition;
use App\Models\ExampleProject;
use App\Models\Guide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoboKreasiController extends Controller
{
    /**
     * Menampilkan halaman depan Racero Scratch (Landing Page).
     */
    public function home(): Response
    {
        return Inertia::render('RoboKreasi/Home');
    }

    /**
     * Menampilkan halaman Contoh Proyek (dedicated page sesuai Figma).
     */
    public function exampleProjects(): Response
    {
        $exampleProjects = ExampleProject::active()
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
            ->get();

        return Inertia::render('RoboKreasi/ExampleProjects', [
            'exampleProjects' => $exampleProjects,
        ]);
    }

    /**
     * Menampilkan halaman workspace RoboKreasi via Inertia.js.
     * Mengirim props sesuai kontrak resmi:
     * - blockCategories
     * - blockDefinitions
     * - exampleProjects
     * - guides
     */
    public function workspace(Request $request): Response
    {
        $blockCategories = BlockCategory::active()
            ->select(['id', 'name', 'slug', 'description', 'color_hex', 'sort_order'])
            ->get();

        $blockDefinitions = BlockDefinition::active()
            ->select([
                'id',
                'block_category_id',
                'block_type',
                'display_name',
                'description',
                'block_shape',
                'parameter_schema',
                'sort_order',
            ])
            ->get();

        $exampleProjects = ExampleProject::active()
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
            ->get();

        $guides = Guide::active()
            ->with(['steps' => function ($query) {
                $query->orderBy('step_number')
                    ->select(['id', 'guide_id', 'step_number', 'title', 'instruction', 'target_element']);
            }])
            ->select(['id', 'title', 'description'])
            ->get();

        return Inertia::render('RoboKreasi/Workspace', [
            'blockCategories'  => $blockCategories,
            'blockDefinitions' => $blockDefinitions,
            'exampleProjects'  => $exampleProjects,
            'guides'           => $guides,
        ]);
    }
}
