<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->enum('subject', ['ریاضی', 'فیزیک', 'شیمی', 'زیست', 'ادبیات', 'عربی', 'زبان', 'دینی']);
            $table->enum('difficulty', ['آسان', 'متوسط', 'سخت']);
            $table->text('question_text');
            $table->string('question_image')->nullable();
            $table->boolean('has_formula')->default(false);
            $table->string('option_a');
            $table->string('option_b');
            $table->string('option_c');
            $table->string('option_d');
            $table->string('option_a_image')->nullable();
            $table->string('option_b_image')->nullable();
            $table->string('option_c_image')->nullable();
            $table->string('option_d_image')->nullable();
            $table->enum('correct_answer', ['a', 'b', 'c', 'd']);
            $table->text('explanation')->nullable();
            $table->decimal('points', 5, 2)->default(1.00);
            $table->decimal('negative_points', 5, 2)->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
