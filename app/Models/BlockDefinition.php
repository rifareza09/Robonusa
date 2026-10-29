<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class BlockDefinition extends Model
{
    protected $fillable = [
        'block_category_id',
        'block_type',
        'display_name',
        'description',
        'block_shape',
        'parameter_schema',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'parameter_schema' => 'array',
        'sort_order'        => 'integer',
        'is_active'         => 'boolean',
    ];

    /**
     * Relasi: definisi blok milik satu kategori.
     */
    public function blockCategory(): BelongsTo
    {
        return $this->belongsTo(BlockCategory::class);
    }

    /**
     * Scope: hanya definisi blok yang aktif, diurutkan berdasarkan sort_order.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
