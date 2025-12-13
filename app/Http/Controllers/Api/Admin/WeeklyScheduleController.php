<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WeeklySchedule;
use Illuminate\Http\Request;

class WeeklyScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = WeeklySchedule::with(['creator', 'resources']);

        if ($request->has('week_number')) {
            $query->byWeek($request->week_number, $request->year);
        }

        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        $schedules = $query->latest()->paginate(20);

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'week_number' => 'required|integer|min:1|max:52',
            'year' => 'required|integer|min:1400|max:1500',
            'description' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        $schedule = WeeklySchedule::create($validated);

        return response()->json($schedule->load('creator'), 201);
    }

    public function show($id)
    {
        $schedule = WeeklySchedule::with(['creator', 'resources.creator', 'resources.exam'])->findOrFail($id);
        
        return response()->json($schedule);
    }

    public function update(Request $request, $id)
    {
        $schedule = WeeklySchedule::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'week_number' => 'sometimes|integer|min:1|max:52',
            'year' => 'sometimes|integer|min:1400|max:1500',
            'description' => 'nullable|string',
        ]);

        $schedule->update($validated);

        return response()->json($schedule->load(['creator', 'resources']));
    }

    public function destroy($id)
    {
        $schedule = WeeklySchedule::findOrFail($id);
        $schedule->delete();

        return response()->json(['message' => 'برنامه هفتگی با موفقیت حذف شد']);
    }

    public function publish($id)
    {
        $schedule = WeeklySchedule::findOrFail($id);
        $schedule->publish();

        return response()->json([
            'message' => 'برنامه هفتگی منتشر شد',
            'schedule' => $schedule
        ]);
    }

    public function unpublish($id)
    {
        $schedule = WeeklySchedule::findOrFail($id);
        $schedule->unpublish();

        return response()->json([
            'message' => 'انتشار برنامه هفتگی لغو شد',
            'schedule' => $schedule
        ]);
    }

    public function attachResource(Request $request, $id)
    {
        $validated = $request->validate([
            'resource_id' => 'required|exists:study_resources,id',
            'order' => 'sometimes|integer|min:0',
        ]);

        $schedule = WeeklySchedule::findOrFail($id);
        $schedule->attachResource($validated['resource_id'], $validated['order'] ?? 0);

        return response()->json([
            'message' => 'منبع به برنامه اضافه شد',
            'schedule' => $schedule->load('resources')
        ]);
    }

    public function detachResource($id, $resourceId)
    {
        $schedule = WeeklySchedule::findOrFail($id);
        $schedule->detachResource($resourceId);

        return response()->json([
            'message' => 'منبع از برنامه حذف شد',
            'schedule' => $schedule->load('resources')
        ]);
    }

    public function updateResourceOrder(Request $request, $id, $resourceId)
    {
        $validated = $request->validate([
            'order' => 'required|integer|min:0',
        ]);

        $schedule = WeeklySchedule::findOrFail($id);
        $schedule->updateResourceOrder($resourceId, $validated['order']);

        return response()->json([
            'message' => 'ترتیب منبع به‌روزرسانی شد',
            'schedule' => $schedule->load('resources')
        ]);
    }
}
