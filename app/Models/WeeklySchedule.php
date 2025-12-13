<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WeeklySchedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'week_number',
        'year',
        'description',
        'created_by',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'week_number' => 'integer',
        'year' => 'integer',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function resources()
    {
        return $this->belongsToMany(StudyResource::class, 'schedule_resources')
                    ->withPivot('order')
                    ->withTimestamps()
                    ->orderByPivot('order');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByWeek($query, $weekNumber, $year = null)
    {
        $query->where('week_number', $weekNumber);
        
        if ($year) {
            $query->where('year', $year);
        }
        
        return $query;
    }

    public function scopeCurrent($query)
    {
        // Calculate current week of the year
        $currentWeekNumber = now()->weekOfYear;
        $currentYear = now()->year;
        
        return $query->where('week_number', $currentWeekNumber)
                    ->where('year', $currentYear)
                    ->where('is_published', true);
    }

    // Methods
    public function publish()
    {
        $this->update([
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    public function unpublish()
    {
        $this->update([
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    public function attachResource($resourceId, $order = 0)
    {
        $this->resources()->attach($resourceId, ['order' => $order]);
    }

    public function detachResource($resourceId)
    {
        $this->resources()->detach($resourceId);
    }

    public function updateResourceOrder($resourceId, $order)
    {
        $this->resources()->updateExistingPivot($resourceId, ['order' => $order]);
    }
}
