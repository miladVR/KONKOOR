<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExamRequest;
use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExamController extends Controller
{
    public function index()
    {
        $exams = Exam::with('creator:id,name')
            ->withCount('questions', 'studentExams')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($exams);
    }

    public function store(StoreExamRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $questionIds = $data['questions'];
            unset($data['questions']);

            $data['created_by'] = auth()->id();
            $exam = Exam::create($data);

            // اختصاص سوالات به آزمون
            $questions = [];
            foreach ($questionIds as $order => $questionId) {
                $questions[$questionId] = ['order' => $order];
            }
            $exam->questions()->attach($questions);

            DB::commit();

            return response()->json([
                'message' => 'آزمون با موفقیت ایجاد شد.',
                'exam' => $exam->load('creator:id,name', 'questions')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'خطا در ایجاد آزمون.'], 500);
        }
    }

    public function show(Exam $exam)
    {
        return response()->json($exam->load('creator:id,name', 'questions'));
    }

    public function update(StoreExamRequest $request, Exam $exam)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $questionIds = $data['questions'];
            unset($data['questions']);

            $exam->update($data);

            // به‌روزرسانی سوالات
            $questions = [];
            foreach ($questionIds as $order => $questionId) {
                $questions[$questionId] = ['order' => $order];
            }
            $exam->questions()->sync($questions);

            DB::commit();

            return response()->json([
                'message' => 'آزمون با موفقیت ویرایش شد.',
                'exam' => $exam->load('creator:id,name', 'questions')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'خطا در ویرایش آزمون.'], 500);
        }
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();
        return response()->json(['message' => 'آزمون با موفقیت حذف شد.']);
    }

    public function publish(Exam $exam)
    {
        $exam->update(['is_published' => true]);
        return response()->json(['message' => 'آزمون با موفقیت منتشر شد.']);
    }

    public function analytics(Exam $exam)
    {
        $studentExams = $exam->studentExams()->where('status', 'graded')->get();

        if ($studentExams->isEmpty()) {
            return response()->json([
                'message' => 'هنوز هیچ دانش‌آموزی در این آزمون شرکت نکرده است.'
            ]);
        }

        $scores = $studentExams->pluck('total_score');
        
        $analytics = [
            'total_participants' => $studentExams->count(),
            'average_score' => round($scores->avg(), 2),
            'highest_score' => $scores->max(),
            'lowest_score' => $scores->min(),
            'median_score' => round($scores->median(), 2),
            'pass_count' => $studentExams->where('total_score', '>=', $exam->passing_score)->count(),
            'fail_count' => $studentExams->where('total_score', '<', $exam->passing_score)->count(),
        ];

        return response()->json($analytics);
    }
}
