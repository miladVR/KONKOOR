<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['admin', 'assistant']);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|integer|min:1|max:300',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'is_practice_mode' => 'boolean',
            'randomize_questions' => 'boolean',
            'randomize_options' => 'boolean',
            'enable_anti_cheating' => 'boolean',
            'require_fullscreen' => 'boolean',
            'passing_score' => 'required|numeric|min:0|max:100',
            'questions' => 'required|array|min:1',
            'questions.*' => 'required|exists:questions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'عنوان آزمون الزامی است.',
            'title.max' => 'عنوان آزمون نباید بیشتر از 255 کاراکتر باشد.',
            'description.required' => 'توضیحات آزمون الزامی است.',
            'duration.required' => 'مدت زمان آزمون الزامی است.',
            'duration.min' => 'مدت زمان آزمون حداقل باید 1 دقیقه باشد.',
            'duration.max' => 'مدت زمان آزمون حداکثر 300 دقیقه (5 ساعت) است.',
            'start_time.required' => 'زمان شروع آزمون الزامی است.',
            'start_time.after' => 'زمان شروع آزمون باید در آینده باشد.',
            'end_time.required' => 'زمان پایان آزمون الزامی است.',
            'end_time.after' => 'زمان پایان باید بعد از زمان شروع باشد.',
            'passing_score.required' => 'نمره قبولی الزامی است.',
            'passing_score.min' => 'نمره قبولی نمی‌تواند منفی باشد.',
            'passing_score.max' => 'نمره قبولی نباید بیشتر از 100 باشد.',
            'questions.required' => 'حداقل یک سوال باید انتخاب شود.',
            'questions.*.exists' => 'یکی از سوالات انتخاب شده معتبر نیست.',
        ];
    }
}
