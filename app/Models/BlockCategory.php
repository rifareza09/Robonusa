<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class BlockCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color_hex',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active'  => 'boolean',
    ];

    /**
     * Relasi: satu kategori memiliki banyak definisi blok.
     */
    public function blockDefinitions(): HasMany
    {
        return $this->hasMany(BlockDefinition::class);
    }

    /**
     * Scope: hanya kategori yang aktif, diurutkan berdasarkan sort_order.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
