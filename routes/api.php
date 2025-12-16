<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DailyLogController;
use App\Http\Controllers\Api\StudyPlanController;

Route::prefix('v1')->group(function () {
    // Public Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/user', [AuthController::class, 'user']);
        
        // Daily Logs
            Route::get('/study-resources', [\App\Http\Controllers\Api\Admin\StudyResourceController::class, 'index']);
            Route::post('/study-resources', [\App\Http\Controllers\Api\Admin\StudyResourceController::class, 'store']);
            Route::get('/study-resources/{id}', [\App\Http\Controllers\Api\Admin\StudyResourceController::class, 'show']);
            Route::put('/study-resources/{id}', [\App\Http\Controllers\Api\Admin\StudyResourceController::class, 'update']);
            Route::delete('/study-resources/{id}', [\App\Http\Controllers\Api\Admin\StudyResourceController::class, 'destroy']);
            Route::post('/study-resources/{id}/approve', [\App\Http\Controllers\Api\Admin\StudyResourceController::class, 'approve']);
            Route::post('/study-resources/{id}/disapprove', [\App\Http\Controllers\Api\Admin\StudyResourceController::class, 'disapprove']);

            // Weekly Schedules Management
            Route::get('/weekly-schedules', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'index']);
            Route::post('/weekly-schedules', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'store']);
            Route::get('/weekly-schedules/{id}', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'show']);
            Route::put('/weekly-schedules/{id}', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'update']);
            Route::delete('/weekly-schedules/{id}', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'destroy']);
            Route::post('/weekly-schedules/{id}/publish', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'publish']);
            Route::post('/weekly-schedules/{id}/unpublish', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'unpublish']);
            Route::post('/weekly-schedules/{id}/resources', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'attachResource']);
            Route::delete('/weekly-schedules/{id}/resources/{resourceId}', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'detachResource']);
            Route::put('/weekly-schedules/{id}/resources/{resourceId}/order', [\App\Http\Controllers\Api\Admin\WeeklyScheduleController::class, 'updateResourceOrder']);


        // Student Exam Routes
        Route::prefix('exams')->group(function () {
            Route::get('/available', [\App\Http\Controllers\Api\StudentExamController::class, 'available']);
            Route::post('/{exam}/start', [\App\Http\Controllers\Api\StudentExamController::class, 'start']);
            Route::get('/student-exams/{studentExam}/questions', [\App\Http\Controllers\Api\StudentExamController::class, 'getQuestions']);
            Route::post('/student-exams/{studentExam}/submit-answer', [\App\Http\Controllers\Api\StudentExamController::class, 'submitAnswer']);
            Route::post('/student-exams/{studentExam}/bookmark', [\App\Http\Controllers\Api\StudentExamController::class, 'toggleBookmark']);
            Route::post('/student-exams/{studentExam}/log-activity', [\App\Http\Controllers\Api\StudentExamController::class, 'logActivity']);
            Route::post('/student-exams/{studentExam}/submit', [\App\Http\Controllers\Api\StudentExamController::class, 'submit']);
            Route::get('/student-exams/{studentExam}/results', [\App\Http\Controllers\Api\StudentExamController::class, 'results']);
            Route::get('/student-exams/{studentExam}/resume', [\App\Http\Controllers\Api\StudentExamController::class, 'resume']);
        });

        // Student Weekly Resources Routes
        Route::prefix('resources')->group(function () {
            Route::get('/weekly-schedule/current', [\App\Http\Controllers\Api\StudentResourceController::class, 'getCurrentWeekSchedule']);
            Route::get('/my-resources', [\App\Http\Controllers\Api\StudentResourceController::class, 'getMyResources']);
            Route::post('/{id}/complete', [\App\Http\Controllers\Api\StudentResourceController::class, 'markAsCompleted']);
            Route::post('/{id}/incomplete', [\App\Http\Controllers\Api\StudentResourceController::class, 'markAsIncomplete']);
            Route::post('/{id}/notes', [\App\Http\Controllers\Api\StudentResourceController::class, 'addNotes']);
        });
    });
});


