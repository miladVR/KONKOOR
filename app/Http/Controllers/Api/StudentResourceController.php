<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudyResource;
use App\Models\WeeklySchedule;
use App\Models\StudentResourceProgress;
use Illuminate\Http\Request;

class StudentResourceController extends Controller
{
    public function getCurrentWeekSchedule()
    {
        $schedule = WeeklySchedule::with(['resources' => function ($query) {
            $query->approved()->with(['creator', 'exam']);
        }])->current()->first();

        if (!$schedule) {
            return response()->json(['message' => 'برنامه‌ای برای این هفته یافت نشد'], 404);
        }

        // Get progress for each resource
        $studentId = auth()->id();
        $resources = $schedule->resources->map(function ($resource) use ($studentId) {
            $progress = StudentResourceProgress::where('student_id', $studentId)
                ->where('resource_id', $resource->id)
                ->first();

            $resource->progress = $progress;
            return $resource;
        });

        $schedule->resources = $resources;

        return response()->json($schedule);
    }

    public function getMyResources(Request $request)
    {
        $query = StudyResource::approved()
            ->with(['creator', 'exam'])
            ->where('created_by', auth()->user()->advisor_id); // Assuming student has advisor_id

        // Filter by completion status
        if ($request->has('completed')) {
            $studentId = auth()->id();
            $query->whereHas('studentProgress', function ($q) use ($studentId, $request) {
                $q->where('student_id', $studentId)
                  ->where('is_completed', $request->boolean('completed'));
            });
        }

        $resources = $query->latest()->paginate(20);

        // Attach progress for each resource
        $studentId = auth()->id();
        $resources->getCollection()->transform(function ($resource) use ($studentId) {
            $resource->progress = StudentResourceProgress::where('student_id', $studentId)
                ->where('resource_id', $resource->id)
                ->first();
            return $resource;
        });

        return response()->json($resources);
    }

    public function markAsCompleted($id)
    {
        $resource = StudyResource::approved()->findOrFail($id);
        $studentId = auth()->id();

        $progress = StudentResourceProgress::firstOrCreate(
            [
                'student_id' => $studentId,
                'resource_id' => $resource->id,
            ]
        );

        $progress->markAsCompleted();

        return response()->json([
            'message' => 'منبع به عنوان تکمیل شده علامت‌گذاری شد',
            'progress' => $progress
        ]);
    }

    public function markAsIncomplete($id)
    {
        $resource = StudyResource::approved()->findOrFail($id);
        $studentId = auth()->id();

        $progress = StudentResourceProgress::where('student_id', $studentId)
            ->where('resource_id', $resource->id)
            ->first();

        if ($progress) {
            $progress->markAsIncomplete();
        }

        return response()->json([
            'message' => 'منبع به عنوان ناتمام علامت‌گذاری شد',
            'progress' => $progress
        ]);
    }

    public function addNotes(Request $request, $id)
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $resource = StudyResource::approved()->findOrFail($id);
        $studentId = auth()->id();

        $progress = StudentResourceProgress::firstOrCreate(
            [
                'student_id' => $studentId,
                'resource_id' => $resource->id,
            ]
        );

        $progress->addNotes($validated['notes']);

        return response()->json([
            'message' => 'یادداشت با موفقیت ذخیره شد',
            'progress' => $progress
        ]);
    }
}
