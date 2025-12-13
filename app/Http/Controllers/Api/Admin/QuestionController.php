<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        $query = Question::with('creator:id,name');

        // فیلتر بر اساس subject
        if ($request->has('subject')) {
            $query->where('subject', $request->subject);
        }

        // فیلتر بر اساس difficulty
        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        // جستجو در متن سوال
        if ($request->has('search')) {
            $query->where('question_text', 'like', '%' . $request->search . '%');
        }

        $questions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($questions);
    }

    public function store(StoreQuestionRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = auth()->id();

        // آپلود تصویر سوال
        if ($request->hasFile('question_image')) {
            $data['question_image'] = $request->file('question_image')->store('questions', 'public');
        }

        // آپلود تصاویر گزینه‌ها
        foreach (['a', 'b', 'c', 'd'] as $option) {
            $field = "option_{$option}_image";
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('questions/options', 'public');
            }
        }

        $question = Question::create($data);

        return response()->json([
            'message' => 'سوال با موفقیت ایجاد شد.',
            'question' => $question->load('creator:id,name')
        ], 201);
    }

    public function show(Question $question)
    {
        return response()->json($question->load('creator:id,name'));
    }

    public function update(StoreQuestionRequest $request, Question $question)
    {
        $data = $request->validated();

        // آپلود تصویر سوال
        if ($request->hasFile('question_image')) {
            // حذف تصویر قبلی
            if ($question->question_image) {
                Storage::disk('public')->delete($question->question_image);
            }
            $data['question_image'] = $request->file('question_image')->store('questions', 'public');
        }

        // آپلود تصاویر گزینه‌ها
        foreach (['a', 'b', 'c', 'd'] as $option) {
            $field = "option_{$option}_image";
            if ($request->hasFile($field)) {
                $oldField = $question->{$field};
                if ($oldField) {
                    Storage::disk('public')->delete($oldField);
                }
                $data[$field] = $request->file($field)->store('questions/options', 'public');
            }
        }

        $question->update($data);

        return response()->json([
            'message' => 'سوال با موفقیت ویرایش شد.',
            'question' => $question->load('creator:id,name')
        ]);
    }

    public function destroy(Question $question)
    {
        // حذف تصاویر
        if ($question->question_image) {
            Storage::disk('public')->delete($question->question_image);
        }

        foreach (['a', 'b', 'c', 'd'] as $option) {
            $field = "option_{$option}_image";
            if ($question->{$field}) {
                Storage::disk('public')->delete($question->{$field});
            }
        }

        $question->delete();

        return response()->json(['message' => 'سوال با موفقیت حذف شد.']);
    }

    /**
     * ایمپورت سوالات از Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        // TODO: پیاده‌سازی ایمپورت Excel با Laravel Excel
        return response()->json(['message' => 'این قابلیت به زودی فعال می‌شود.'], 501);
    }

    /**
     * اکسپورت سوالات به Excel
     */
    public function export()
    {
        // TODO: پیاده‌سازی اکسپورت Excel با Laravel Excel
        return response()->json(['message' => 'این قابلیت به زودی فعال می‌شود.'], 501);
    }

    /**
     * دانلود قالب Excel
     */
    public function template()
    {
        // TODO: برگرداندن فایل قالب Excel
        return response()->json(['message' => 'این قابلیت به زودی فعال می‌شود.'], 501);
    }
}
