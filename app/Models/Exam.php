<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'start_time',
        'end_time',
        'is_published',
        'is_practice_mode',
        'randomize_questions',
        'randomize_options',
        'enable_anti_cheating',
        'require_fullscreen',
        'passing_score',
        'created_by',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_published' => 'boolean',
        'is_practice_mode' => 'boolean',
        'randomize_questions' => 'boolean',
        'randomize_options' => 'boolean',
        'enable_anti_cheating' => 'boolean',
        'require_fullscreen' => 'boolean',
        'passing_score' => 'decimal:2',
    ];

    /**
     * Get the user who created this exam
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all questions for this exam
     */
    public function questions()
    {
        return $this->belongsToMany(Question::class, 'exam_question')
            ->withPivot('order')
            ->withTimestamps()
            ->orderBy('exam_question.order');
    }

    /**
     * Get all student exam attempts
     */
    public function studentExams()
    {
        return $this->hasMany(StudentExam::class);
    }

    /**
     * Check if exam is currently active
     */
    public function isActive()
    {
        $now = now();
        return $this->is_published && 
               $now->between($this->start_time, $this->end_time);
    }

    /**
     * Check if exam has ended
     */
    public function hasEnded()
    {
        return now()->isAfter($this->end_time);
    }
}
