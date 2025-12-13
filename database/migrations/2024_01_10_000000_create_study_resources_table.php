<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('resource_type', ['book', 'pdf', 'video', 'test', 'link', 'worksheet']);
            $table->string('file_path')->nullable(); // For uploaded files
            $table->string('external_url')->nullable(); // For external links/videos
            $table->foreignId('exam_id')->nullable()->constrained('exams')->onDelete('set null'); // For test type
            $table->string('subject'); // e.g., 'ریاضی', 'فیزیک'
            $table->integer('week_number'); // 1-40 (for 40 weeks)
            $table->year('year'); // e.g., 1403
            $table->foreignId('created_by')->constrained('users'); // Advisor who created
            $table->boolean('is_approved')->default(false);
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['week_number', 'year', 'is_approved']);
            $table->index(['created_by', 'is_approved']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_resources');
    }
};
