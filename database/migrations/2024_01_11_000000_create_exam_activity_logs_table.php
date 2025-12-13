<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_exam_id')->constrained('student_exams')->onDelete('cascade');
            $table->enum('activity_type', ['tab_switch', 'fullscreen_exit', 'answer_change', 'bookmark_toggle']);
            $table->foreignId('question_id')->nullable()->constrained('questions')->onDelete('set null');
            $table->timestamp('created_at');
            
            $table->index('student_exam_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_activity_logs');
    }
};
