<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentExam extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'exam_id',
        'session_id',
        'started_at',
        'submitted_at',
        'total_score',
        'percentage',
        'status',
        'tab_switches_count',
        'fullscreen_exits_count',
        'question_order',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'total_score' => 'decimal:2',
        'percentage' => 'decimal:2',
        'tab_switches_count' => 'integer',
        'fullscreen_exits_count' => 'integer',
        'question_order' => 'array',
    ];

    /**
     * Get the student who took the exam
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the exam
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Get all answers for this exam attempt
     */
    public function answers()
    {
        return $this->hasMany(StudentAnswer::class);
    }

    /**
     * Get all activity logs
     */
    public function activityLogs()
    {
        return $this->hasMany(ExamActivityLog::class);
    }

    /**
     * Check if exam time has expired
     */
    public function isTimeExpired()
    {
        if (!$this->started_at || !$this->exam) {
            return false;
        }

        $endTime = $this->started_at->addMinutes($this->exam->duration);
        return now()->isAfter($endTime);
    }

    /**
     * Get remaining time in seconds
     */
    public function getRemainingTime()
    {
        if (!$this->started_at || !$this->exam) {
            return 0;
        }

        $endTime = $this->started_at->addMinutes($this->exam->duration);
        $remaining = now()->diffInSeconds($endTime, false);
        
        return max(0, $remaining);
    }
}
