<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // e.g., "برنامه هفته اول - مهر 1403"
            $table->integer('week_number');
            $table->year('year');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['week_number', 'year', 'is_published']);
        });
        
        // Pivot table for schedule-resource relationship
        Schema::create('schedule_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('weekly_schedules')->onDelete('cascade');
            $table->foreignId('resource_id')->constrained('study_resources')->onDelete('cascade');
            $table->integer('order')->default(0); // Display order
            $table->timestamps();
            
            $table->unique(['schedule_id', 'resource_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_resources');
        Schema::dropIfExists('weekly_schedules');
    }
};
