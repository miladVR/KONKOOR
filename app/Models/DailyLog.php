<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'log_date',
        'subject',
        'topic',
        'hours_studied',
        'test_count',
        'quality_score',
        'notes',
    ];

    protected $casts = [
        'log_date' => 'date',
        'hours_studied' => 'decimal:2',
        'test_count' => 'integer',
        'quality_score' => 'integer',
    ];

    /**
     * Get the user that owns the daily log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
