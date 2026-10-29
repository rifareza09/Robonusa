<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ExampleProject extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'difficulty',
        'thumbnail',
        'workspace_json',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'workspace_json' => 'array',
        'sort_order'      => 'integer',
        'is_active'       => 'boolean',
    ];

    /**
     * Scope: hanya proyek yang aktif, diurutkan berdasarkan sort_order.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
