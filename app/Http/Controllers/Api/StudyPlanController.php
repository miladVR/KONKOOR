<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudyPlanRequest;
use App\Models\StudyPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudyPlanController extends Controller
{
    /**
     * Display a listing of the user's study plans.
     */
    public function index(Request $request)
    {
        $plans = StudyPlan::where('user_id', $request->user()->id)
            ->with('items')
            ->orderBy('week_start_date', 'desc')
            ->paginate(10);

        return response()->json($plans);
    }

    /**
     * Store a newly created study plan.
     */
    public function store(StoreStudyPlanRequest $request)
    {
        DB::beginTransaction();
        
        try {
            $plan = StudyPlan::create([
                'user_id' => $request->user()->id,
                'week_start_date' => $request->week_start_date,
                'status' => 'active',
                'created_by' => $request->user()->id,
            ]);

            foreach ($request->items as $item) {
                $plan->items()->create($item);
            }

            DB::commit();

            return response()->json([
                'message' => 'برنامه با موفقیت ایجاد شد.',
                'plan' => $plan->load('items'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'خطا در ایجاد برنامه.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified study plan.
     */
    public function show(Request $request, $id)
    {
        $plan = StudyPlan::where('user_id', $request->user()->id)
            ->with('items')
            ->findOrFail($id);

        return response()->json($plan);
    }

    /**
     * Update the specified study plan.
     */
    public function update(StoreStudyPlanRequest $request, $id)
    {
        $plan = StudyPlan::where('user_id', $request->user()->id)
            ->findOrFail($id);

        DB::beginTransaction();

        try {
            $plan->update([
                'week_start_date' => $request->week_start_date,
            ]);

            // Delete old items and create new ones
            $plan->items()->delete();

            foreach ($request->items as $item) {
                $plan->items()->create($item);
            }

            DB::commit();

            return response()->json([
                'message' => 'برنامه با موفقیت به‌روزرسانی شد.',
                'plan' => $plan->load('items'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'خطا در به‌روزرسانی برنامه.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified study plan.
     */
    public function destroy(Request $request, $id)
    {
        $plan = StudyPlan::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $plan->delete();

        return response()->json([
            'message' => 'برنامه با موفقیت حذف شد.',
        ]);
    }

    /**
     * Get the current week's study plan.
     */
    public function current(Request $request)
    {
        $startOfWeek = now()->startOfWeek(); // شنبه

        $plan = StudyPlan::where('user_id', $request->user()->id)
            ->where('week_start_date', $startOfWeek->toDateString())
            ->with('items')
            ->first();

        if (!$plan) {
            return response()->json([
                'message' => 'برنامه‌ای برای هفته جاری وجود ندارد.',
                'plan' => null,
            ], 404);
        }

        return response()->json($plan);
    }
}
