<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->integer('duration'); // دقیقه
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->boolean('is_published')->default(false);
            $table->boolean('is_practice_mode')->default(false);
            $table->boolean('randomize_questions')->default(false);
            $table->boolean('randomize_options')->default(false);
            $table->boolean('enable_anti_cheating')->default(true);
            $table->boolean('require_fullscreen')->default(false);
            $table->decimal('passing_score', 5, 2)->default(50.00);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
