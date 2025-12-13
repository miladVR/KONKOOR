<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'subject',
        'difficulty',
        'question_text',
        'question_image',
        'has_formula',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'option_a_image',
        'option_b_image',
        'option_c_image',
        'option_d_image',
        'correct_answer',
        'explanation',
        'points',
        'negative_points',
        'created_by',
    ];

    protected $casts = [
        'has_formula' => 'boolean',
        'points' => 'decimal:2',
        'negative_points' => 'decimal:2',
    ];

    /**
     * Get the user who created this question
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all exams that include this question
     */
    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_question')
            ->withPivot('order')
            ->withTimestamps();
    }

    /**
     * Get all student answers for this question
     */
    public function studentAnswers()
    {
        return $this->hasMany(StudentAnswer::class);
    }
}
