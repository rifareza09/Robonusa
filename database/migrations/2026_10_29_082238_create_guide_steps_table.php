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
        Schema::create('guide_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guide_id')
                  ->constrained('guides')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
            $table->unsignedSmallInteger('step_number');
            $table->string('title');
            $table->text('instruction');
            $table->string('target_element')->nullable()->comment('CSS selector atau ID elemen UI untuk onboarding');
            $table->timestamps();

            $table->unique(['guide_id', 'step_number']);
            $table->index(['guide_id', 'step_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guide_steps');
    }
};
