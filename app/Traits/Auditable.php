<?php

namespace App\Traits;

use App\Services\AuditService;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            AuditService::log(
                'created',
                get_class($model),
                $model->id,
                null,
                $model->toArray()
            );
        });

        static::updated(function ($model) {
            $oldValues = $model->getOriginal();
            $newValues = $model->getChanges();

            // Ignore updated_at if it's the only change
            if (count($newValues) === 1 && isset($newValues['updated_at'])) {
                return;
            }

            AuditService::log(
                'updated',
                get_class($model),
                $model->id,
                $oldValues,
                $newValues
            );
        });

        static::deleted(function ($model) {
            AuditService::log(
                'deleted',
                get_class($model),
                $model->id,
                $model->toArray(),
                null
            );
        });
    }
}
