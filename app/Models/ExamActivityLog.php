<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamActivityLog extends Model
{
    use HasFactory;

    public $timestamps = false; // فقط created_at داریم

    protected $fillable = [
        'student_exam_id',
        'activity_type',
        'question_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get the student exam
     */
    public function studentExam()
    {
        return $this->belongsTo(StudentExam::class);
    }

    /**
     * Get the related question (if any)
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
