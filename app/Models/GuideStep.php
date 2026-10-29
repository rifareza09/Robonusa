<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideStep extends Model
{
    protected $fillable = [
        'guide_id',
        'step_number',
        'title',
        'instruction',
        'target_element',
    ];

    protected $casts = [
        'step_number' => 'integer',
    ];

    /**
     * Relasi: langkah panduan milik satu panduan.
     */
    public function guide(): BelongsTo
    {
        return $this->belongsTo(Guide::class);
    }
}
