<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudyResource extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'resource_type',
        'file_path',
        'external_url',
        'exam_id',
        'subject',
        'week_number',
        'year',
        'created_by',
        'is_approved',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'week_number' => 'integer',
        'year' => 'integer',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function schedules()
    {
        return $this->belongsToMany(WeeklySchedule::class, 'schedule_resources')
                    ->withPivot('order')
                    ->withTimestamps()
                    ->orderByPivot('order');
    }

    public function studentProgress()
    {
        return $this->hasMany(StudentResourceProgress::class, 'resource_id');
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeBySubject($query, $subject)
    {
        return $query->where('subject', $subject);
    }

    public function scopeByWeek($query, $weekNumber, $year = null)
    {
        $query->where('week_number', $weekNumber);
        
        if ($year) {
            $query->where('year', $year);
        }
        
        return $query;
    }

    public function scopeByAdvisor($query, $advisorId)
    {
        return $query->where('created_by', $advisorId);
    }

    // Methods
    public function approve($approverUserId)
    {
        $this->update([
            'is_approved' => true,
            'approved_by' => $approverUserId,
            'approved_at' => now(),
        ]);
    }

    public function disapprove()
    {
        $this->update([
            'is_approved' => false,
            'approved_by' => null,
            'approved_at' => null,
        ]);
    }

    // Helpers
    public function getFileUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }
}
