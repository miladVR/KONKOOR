<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDailyLogRequest;
use App\Models\DailyLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DailyLogController extends Controller
{
    /**
     * Display a listing of the user's daily logs.
     */
    public function index(Request $request)
    {
        $query = DailyLog::where('user_id', $request->user()->id)
            ->orderBy('log_date', 'desc');

        // Filter by date range if provided
        if ($request->has('from_date')) {
            $query->where('log_date', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->where('log_date', '<=', $request->to_date);
        }

        $logs = $query->paginate(20);

        return response()->json($logs);
    }

    /**
     * Store a newly created daily log.
     */
    public function store(StoreDailyLogRequest $request)
    {
        $log = DailyLog::create([
            'user_id' => $request->user()->id,
            'log_date' => $request->log_date,
            'subject' => $request->subject,
            'topic' => $request->topic,
            'hours_studied' => $request->hours_studied,
            'test_count' => $request->test_count,
            'quality_score' => $request->quality_score,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'گزارش با موفقیت ثبت شد.',
            'log' => $log,
        ], 201);
    }

    /**
     * Display the specified daily log.
     */
    public function show(Request $request, $id)
    {
        $log = DailyLog::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($log);
    }

    /**
     * Update the specified daily log.
     */
    public function update(StoreDailyLogRequest $request, $id)
    {
        $log = DailyLog::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $log->update($request->validated());

        return response()->json([
            'message' => 'گزارش با موفقیت به‌روزرسانی شد.',
            'log' => $log,
        ]);
    }

    /**
     * Remove the specified daily log.
     */
    public function destroy(Request $request, $id)
    {
        $log = DailyLog::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $log->delete();

        return response()->json([
            'message' => 'گزارش با موفقیت حذف شد.',
        ]);
    }

    /**
     * Get statistics for the user's daily logs.
     */
    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        // Overall stats
        $totalLogs = DailyLog::where('user_id', $userId)->count();
        $totalHours = DailyLog::where('user_id', $userId)->sum('hours_studied');
        $totalTests = DailyLog::where('user_id', $userId)->sum('test_count');
        $avgQuality = DailyLog::where('user_id', $userId)
            ->whereNotNull('quality_score')
            ->avg('quality_score');

        // Last 7 days stats
        $last7Days = DailyLog::where('user_id', $userId)
            ->where('log_date', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(log_date) as date'),
                DB::raw('SUM(hours_studied) as total_hours'),
                DB::raw('SUM(test_count) as total_tests')
            )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        // Subject breakdown
        $subjectStats = DailyLog::where('user_id', $userId)
            ->select(
                'subject',
                DB::raw('SUM(hours_studied) as total_hours'),
                DB::raw('SUM(test_count) as total_tests'),
                DB::raw('COUNT(*) as log_count')
            )
            ->groupBy('subject')
            ->orderBy('total_hours', 'desc')
            ->get();

        return response()->json([
            'overall' => [
                'total_logs' => $totalLogs,
                'total_hours' => round($totalHours, 2),
                'total_tests' => $totalTests,
                'avg_quality' => round($avgQuality, 2),
            ],
            'last_7_days' => $last7Days,
            'by_subject' => $subjectStats,
        ]);
    }
}
