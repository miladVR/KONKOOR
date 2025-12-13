<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_exam_id',
        'question_id',
        'selected_answer',
        'is_bookmarked',
        'time_spent',
        'is_correct',
        'points_earned',
        'answered_at',
    ];

    protected $casts = [
        'is_bookmarked' => 'boolean',
        'time_spent' => 'integer',
        'is_correct' => 'boolean',
        'points_earned' => 'decimal:2',
        'answered_at' => 'datetime',
    ];

    /**
     * Get the student exam attempt
     */
    public function studentExam()
    {
        return $this->belongsTo(StudentExam::class);
    }

    /**
     * Get the question
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Check if answer is correct and calculate points
     */
    public function gradeAnswer()
    {
        $question = $this->question;
        
        if (!$question || !$this->selected_answer) {
            $this->is_correct = false;
            $this->points_earned = 0;
            return;
        }

        $this->is_correct = ($this->selected_answer === $question->correct_answer);
        
        if ($this->is_correct) {
            $this->points_earned = $question->points;
        } else {
            // Apply negative points if configured
            $this->points_earned = $question->negative_points ? -abs($question->negative_points) : 0;
        }
    }
}
