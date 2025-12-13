<?php

namespace App\Models;
    protected $fillable = [
        'name',
        'email',
        'mobile',
        'password',
        'grade',
        'city',
        'assistant_id',
        'subscription_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'subscription_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the assistant for this student.
     */
    public function assistant()
    {
        return $this->belongsTo(User::class, 'assistant_id');
    }

    /**
     * Get the students for this assistant.
     */
    public function students()
    {
        return $this->hasMany(User::class, 'assistant_id');
    }

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function username()
    {
        return 'mobile';
    }

    /**
     * Check if subscription is active.
     */
    public function hasActiveSubscription(): bool
    {
        return $this->subscription_expires_at && 
               $this->subscription_expires_at->isFuture();
    }
}
