<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamActivityLog;
use App\Models\StudentAnswer;
use App\Models\StudentExam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentExamController extends Controller
{
    /**
     * دریافت لیست آزمون‌های قابل شرکت
     */
    public function available()
    {
        $now = now();
        $userId = auth()->id();

        $exams = Exam::where('is_published', true)
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            ->whereDoesntHave('studentExams', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->whereIn('status', ['in_progress', 'submitted', 'graded']);
            })
            ->withCount('questions')
            ->get();

        return response()->json($exams);
    }

    /**
     * شروع آزمون
     */
    public function start(Exam $exam)
    {
        // بررسی اینکه آزمون فعال است
        if (!$exam->isActive()) {
            return response()->json(['message' => 'این آزمون در حال حاضر فعال نیست.'], 403);
        }

        // بررسی اینکه کاربر قبلاً در این آزمون شرکت نکرده
        $existingAttempt = StudentExam::where('exam_id', $exam->id)
            ->where('user_id', auth()->id())
            ->whereIn('status', ['in_progress', 'submitted'])
            ->first();

        if ($existingAttempt) {
            return response()->json(['message' => 'شما قبلاً در این آزمون شرکت کرده‌اید.'], 403);
        }

        DB::beginTransaction();
        try {
            // ایجاد رکورد StudentExam
            $studentExam = StudentExam::create([
                'user_id' => auth()->id(),
                'exam_id' => $exam->id,
                'session_id' => Str::uuid(),
                'started_at' => now(),
                'status' => 'in_progress',
            ]);

            // دریافت سوالات
            $questions = $exam->questions;

            // تصادفی‌سازی ترتیب سوالات (در صورت فعال بودن)
            if ($exam->randomize_questions) {
                $questions = $questions->shuffle();
                $studentExam->question_order = $questions->pluck('id')->toArray();
                $studentExam->save();
            } else {
                $studentExam->question_order = $questions->pluck('id')->toArray();
                $studentExam->save();
            }

            // ایجاد رکورد StudentAnswer برای هر سوال
            foreach ($questions as $question) {
                StudentAnswer::create([
                    'student_exam_id' => $studentExam->id,
                    'question_id' => $question->id,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'آزمون با موفقیت شروع شد.',
                'student_exam_id' => $studentExam->id,
                'session_id' => $studentExam->session_id,
                'remaining_time' => $studentExam->getRemainingTime(),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'خطا در شروع آزمون.'], 500);
        }
    }

    /**
     * دریافت سوالات آزمون
     */
    public function getQuestions(StudentExam $studentExam)
    {
        // بررسی دسترسی
        if ($studentExam->user_id !== auth()->id()) {
            return response()->json(['message' => 'عدم دسترسی.'], 403);
        }

        // بررسی session_id (جلوگیری از ورود همزمان)
        if (request()->header('X-Session-ID') !== $studentExam->session_id) {
            return response()->json(['message' => 'session معتبر نیست. شما از دستگاه دیگری وارد شده‌اید.'], 403);
        }

        $exam = $studentExam->exam;
        $questions = $exam->questions()->with(['studentAnswers' => function ($query) use ($studentExam) {
            $query->where('student_exam_id', $studentExam->id);
        }])->get();

        // مرتب‌سازی بر اساس question_order ذخیره شده
        if ($studentExam->question_order) {
            $questions = $questions->sortBy(function ($question) use ($studentExam) {
                return array_search($question->id, $studentExam->question_order);
            })->values();
        }

        // تصادفی‌سازی گزینه‌ها (در صورت فعال بودن)
        if ($exam->randomize_options) {
            $questions->transform(function ($question) {
                $options = [
                    ['key' => 'a', 'text' => $question->option_a, 'image' => $question->option_a_image],
                    ['key' => 'b', 'text' => $question->option_b, 'image' => $question->option_b_image],
                    ['key' => 'c', 'text' => $question->option_c, 'image' => $question->option_c_image],
                    ['key' => 'd', 'text' => $question->option_d, 'image' => $question->option_d_image],
                ];
                $question->randomized_options = collect($options)->shuffle()->values();
                return $question;
            });
        }

        // حذف correct_answer از پاسخ (امنیت)
        $questions->makeHidden(['correct_answer', 'explanation']);

        return response()->json([
            'exam' => $exam->only(['title', 'duration', 'is_practice_mode', 'enable_anti_cheating', 'require_fullscreen']),
            'questions' => $questions,
            'remaining_time' => $studentExam->getRemainingTime(),
        ]);
    }

    /**
     * ثبت پاسخ یک سوال (Auto-save)
     */
    public function submitAnswer(Request $request, StudentExam $studentExam)
    {
        // بررسی دسترسی
        if ($studentExam->user_id !== auth()->id()) {
            return response()->json(['message' => 'عدم دسترسی.'], 403);
        }

        // بررسی session
        if ($request->header('X-Session-ID') !== $studentExam->session_id) {
            return response()->json(['message' => 'session معتبر نیست.'], 403);
        }

        $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_answer' => 'nullable|in:a,b,c,d',
            'time_spent' => 'nullable|integer|min:0',
        ]);

        $answer = StudentAnswer::where('student_exam_id', $studentExam->id)
            ->where('question_id', $request->question_id)
            ->first();

        if (!$answer) {
            return response()->json(['message' => 'سوال یافت نشد.'], 404);
        }

        $answer->update([
            'selected_answer' => $request->selected_answer,
            'time_spent' => $request->time_spent,
            'answered_at' => now(),
        ]);

        // ثبت فعالیت
        if ($request->selected_answer) {
            ExamActivityLog::create([
                'student_exam_id' => $studentExam->id,
                'activity_type' => 'answer_change',
                'question_id' => $request->question_id,
            ]);
        }

        return response()->json(['message' => 'پاسخ ثبت شد.']);
    }

    /**
     * علامت‌گذاری سوال
     */
    public function toggleBookmark(Request $request, StudentExam $studentExam)
    {
        // بررسی دسترسی
        if ($studentExam->user_id !== auth()->id()) {
            return response()->json(['message' => 'عدم دسترسی.'], 403);
        }

        $request->validate([
            'question_id' => 'required|exists:questions,id',
        ]);

        $answer = StudentAnswer::where('student_exam_id', $studentExam->id)
            ->where('question_id', $request->question_id)
            ->first();

        if (!$answer) {
            return response()->json(['message' => 'سوال یافت نشد.'], 404);
        }

        $answer->is_bookmarked = !$answer->is_bookmarked;
        $answer->save();

        // ثبت فعالیت
        ExamActivityLog::create([
            'student_exam_id' => $studentExam->id,
            'activity_type' => 'bookmark_toggle',
            'question_id' => $request->question_id,
        ]);

        return response()->json(['is_bookmarked' => $answer->is_bookmarked]);
    }

    /**
     * ثبت فعالیت (tab switch, fullscreen exit)
     */
    public function logActivity(Request $request, StudentExam $studentExam)
    {
        // بررسی دسترسی
        if ($studentExam->user_id !== auth()->id()) {
            return response()->json(['message' => 'عدم دسترسی.'], 403);
        }

        $request->validate([
            'activity_type' => 'required|in:tab_switch,fullscreen_exit',
        ]);

        // افزایش شمارنده
        if ($request->activity_type === 'tab_switch') {
            $studentExam->increment('tab_switches_count');
        } elseif ($request->activity_type === 'fullscreen_exit') {
            $studentExam->increment('fullscreen_exits_count');
        }

        // ثبت لاگ
        ExamActivityLog::create([
            'student_exam_id' => $studentExam->id,
            'activity_type' => $request->activity_type,
        ]);

        return response()->json(['message' => 'فعالیت ثبت شد.']);
    }

    /**
     * تحویل نهایی آزمون
     */
    public function submit(StudentExam $studentExam)
    {
        // بررسی دسترسی
        if ($studentExam->user_id !== auth()->id()) {
            return response()->json(['message' => 'عدم دسترسی.'], 403);
        }

        if ($studentExam->status !== 'in_progress') {
            return response()->json(['message' => 'این آزمون قبلاً تحویل داده شده است.'], 403);
        }

        DB::beginTransaction();
        try {
            // تصحیح پاسخ‌ها
            $answers = $studentExam->answers()->with('question')->get();
            $totalScore = 0;

            foreach ($answers as $answer) {
                $answer->gradeAnswer();
                $answer->save();
                $totalScore += $answer->points_earned ?? 0;
            }

            // محاسبه درصد
            $totalPossiblePoints = $answers->sum(function ($answer) {
                return $answer->question->points ?? 0;
            });
            $percentage = $totalPossiblePoints > 0 ? ($totalScore / $totalPossiblePoints) * 100 : 0;

            // به‌روزرسانی StudentExam
            $studentExam->update([
                'submitted_at' => now(),
                'total_score' => $totalScore,
                'percentage' => round($percentage, 2),
                'status' => 'graded',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'آزمون با موفقیت تحویل داده شد.',
                'total_score' => $totalScore,
                'percentage' => round($percentage, 2),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'خطا در تحویل آزمون.'], 500);
        }
    }

    /**
     * مشاهده نتایج و کارنامه
     */
    public function results(StudentExam $studentExam)
    {
        // بررسی دسترسی
        if ($studentExam->user_id !== auth()->id()) {
            return response()->json(['message' => 'عدم دسترسی.'], 403);
        }

        if ($studentExam->status !== 'graded') {
            return response()->json(['message' => 'آزمون هنوز تصحیح نشده است.'], 403);
        }

        $exam = $studentExam->exam;
        $answers = $studentExam->answers()->with('question')->get();

        // آمار کلی
        $correctCount = $answers->where('is_correct', true)->count();
        $wrongCount = $answers->where('is_correct', false)->where('selected_answer', '!=', null)->count();
        $unansweredCount = $answers->whereNull('selected_answer')->count();

        // آمار بر اساس موضوع
        $subjectStats = $answers->groupBy(function ($answer) {
            return $answer->question->subject;
        })->map(function ($group) {
            return [
                'total' => $group->count(),
                'correct' => $group->where('is_correct', true)->count(),
                'wrong' => $group->where('is_correct', false)->where('selected_answer', '!=', null)->count(),
            ];
        });

        return response()->json([
            'exam' => $exam->only(['title', 'passing_score', 'is_practice_mode']),
            'student_exam' => $studentExam->only(['total_score', 'percentage', 'started_at', 'submitted_at', 'tab_switches_count', 'fullscreen_exits_count']),
            'stats' => [
                'total_questions' => $answers->count(),
                'correct' => $correctCount,
                'wrong' => $wrongCount,
                'unanswered' => $unansweredCount,
            ],
            'subject_breakdown' => $subjectStats,
            'answers' => $answers,
        ]);
    }

    /**
     * ادامه آزمون بعد از قطع اتصال
     */
    public function resume(StudentExam $studentExam)
    {
        // بررسی دسترسی
        if ($studentExam->user_id !== auth()->id()) {
            return response()->json(['message' => 'عدم دسترسی.'], 403);
        }

        if ($studentExam->status !== 'in_progress') {
            return response()->json(['message' => 'این آزمون قابل ادامه نیست.'], 403);
        }

        // بررسی زمان
        if ($studentExam->isTimeExpired()) {
            // تحویل خودکار
            $this->submit($studentExam);
            return response()->json(['message' => 'زمان آزمون به پایان رسیده و خودکار تحویل داده شد.'], 403);
        }

        return response()->json([
            'message' => 'آزمون قابل ادامه است.',
            'student_exam_id' => $studentExam->id,
            'session_id' => $studentExam->session_id,
            'remaining_time' => $studentExam->getRemainingTime(),
        ]);
    }
}
