<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudyPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'week_start_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'week_start_date' => 'date',
    ];

    /**
     * Get the user that owns the study plan.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who created the plan.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the items for the study plan.
     */
    public function items()
    {
        return $this->hasMany(StudyPlanItem::class)->orderBy('day_of_week');
    }
}
