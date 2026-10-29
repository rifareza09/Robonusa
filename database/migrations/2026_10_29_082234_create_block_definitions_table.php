<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('block_definitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('block_category_id')
                  ->constrained('block_categories')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();
            $table->string('block_type')->unique()->comment('Identifier unik blok, e.g. event_start, motion_forward');
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->string('block_shape')->comment('e.g. hat, stack, cap, value, boolean');
            $table->json('parameter_schema')->nullable()->comment('Skema parameter blok, BUKAN kode JavaScript');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['block_category_id', 'is_active', 'sort_order']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('block_definitions');
    }
};
