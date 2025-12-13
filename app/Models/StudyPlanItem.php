<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyPlanItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'study_plan_id',
        'day_of_week',
        'subject',
        'topic',
        'hours',
        'test_count',
        'is_completed',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'hours' => 'decimal:2',
        'test_count' => 'integer',
        'is_completed' => 'boolean',
    ];

    /**
     * Get the study plan that owns the item.
     */
    public function studyPlan()
    {
        return $this->belongsTo(StudyPlan::class);
    }
}
