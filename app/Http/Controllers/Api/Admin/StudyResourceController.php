<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudyResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudyResourceController extends Controller
{
    public function index(Request $request)
    {
        $query = StudyResource::with(['creator', 'approver', 'exam']);

        // Filters
        if ($request->has('subject')) {
            $query->bySubject($request->subject);
        }

        if ($request->has('week_number')) {
            $query->byWeek($request->week_number, $request->year);
        }

        if ($request->has('resource_type')) {
            $query->where('resource_type', $request->resource_type);
        }

        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->boolean('is_approved'));
        }

        if ($request->has('created_by')) {
            $query->byAdvisor($request->created_by);
        }

        $resources = $query->latest()->paginate(20);

        return response()->json($resources);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'resource_type' => 'required|in:book,pdf,video,test,link,worksheet',
            'file' => 'nullable|file|max:10240', // 10MB max
            'external_url' => 'nullable|url',
            'exam_id' => 'nullable|exists:exams,id',
            'subject' => 'required|string|max:100',
            'week_number' => 'required|integer|min:1|max:52',
            'year' => 'required|integer|min:1400|max:1500',
        ]);

        // Handle file upload
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('resources', 'public');
            $validated['file_path'] = $path;
        }

        $validated['created_by'] = auth()->id();

        $resource = StudyResource::create($validated);

        return response()->json($resource->load(['creator', 'exam']), 201);
    }

    public function show($id)
    {
        $resource = StudyResource::with(['creator', 'approver', 'exam', 'schedules'])->findOrFail($id);
        
        return response()->json($resource);
    }

    public function update(Request $request, $id)
    {
        $resource = StudyResource::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'resource_type' => 'sometimes|in:book,pdf,video,test,link,worksheet',
            'file' => 'nullable|file|max:10240',
            'external_url' => 'nullable|url',
            'exam_id' => 'nullable|exists:exams,id',
            'subject' => 'sometimes|string|max:100',
            'week_number' => 'sometimes|integer|min:1|max:52',
            'year' => 'sometimes|integer|min:1400|max:1500',
        ]);

        // Handle file upload
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($resource->file_path) {
                Storage::disk('public')->delete($resource->file_path);
            }
            
            $path = $request->file('file')->store('resources', 'public');
            $validated['file_path'] = $path;
        }

        $resource->update($validated);

        return response()->json($resource->load(['creator', 'approver', 'exam']));
    }

    public function destroy($id)
    {
        $resource = StudyResource::findOrFail($id);
        
        // Delete associated file
        if ($resource->file_path) {
            Storage::disk('public')->delete($resource->file_path);
        }
        
        $resource->delete();

        return response()->json(['message' => 'منبع با موفقیت حذف شد']);
    }

    public function approve($id)
    {
        $resource = StudyResource::findOrFail($id);
        $resource->approve(auth()->id());

        return response()->json([
            'message' => 'منبع با موفقیت تایید شد',
            'resource' => $resource->load(['creator', 'approver'])
        ]);
    }

    public function disapprove($id)
    {
        $resource = StudyResource::findOrFail($id);
        $resource->disapprove();

        return response()->json([
            'message' => 'تایید منبع لغو شد',
            'resource' => $resource
        ]);
    }
}
