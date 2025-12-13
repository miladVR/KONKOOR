<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentResourceProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'resource_id',
        'is_completed',
        'completed_at',
        'student_notes',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function resource()
    {
        return $this->belongsTo(StudyResource::class, 'resource_id');
    }

    // Methods
    public function markAsCompleted()
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    public function markAsIncomplete()
    {
        $this->update([
            'is_completed' => false,
            'completed_at' => null,
        ]);
    }

    public function addNotes($notes)
    {
        $this->update(['student_notes' => $notes]);
    }
}
