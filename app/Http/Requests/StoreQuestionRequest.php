<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['admin', 'assistant']);
    }

    public function rules(): array
    {
        return [
            'subject' => 'required|in:ریاضی,فیزیک,شیمی,زیست,ادبیات,عربی,زبان,دینی',
            'difficulty' => 'required|in:آسان,متوسط,سخت',
            'question_text' => 'required|string',
            'question_image' => 'nullable|image|max:2048',
            'has_formula' => 'boolean',
            'option_a' => 'required|string|max:500',
            'option_b' => 'required|string|max:500',
            'option_c' => 'required|string|max:500',
            'option_d' => 'required|string|max:500',
            'option_a_image' => 'nullable|image|max:2048',
            'option_b_image' => 'nullable|image|max:2048',
            'option_c_image' => 'nullable|image|max:2048',
            'option_d_image' => 'nullable|image|max:2048',
            'correct_answer' => 'required|in:a,b,c,d',
            'explanation' => 'nullable|string',
            'points' => 'required|numeric|min:0|max:100',
            'negative_points' => 'nullable|numeric|max:0',
        ];
    }

    public function messages(): array
    {
        return [
            'subject.required' => 'موضوع سوال الزامی است.',
            'subject.in' => 'موضوع سوال معتبر نیست.',
            'difficulty.required' => 'سطح سختی الزامی است.',
            'difficulty.in' => 'سطح سختی معتبر نیست.',
            'question_text.required' => 'متن سوال الزامی است.',
            'question_image.image' => 'فایل باید یک تصویر باشد.',
            'question_image.max' => 'حجم تصویر نباید بیشتر از 2MB باشد.',
            'option_a.required' => 'گزینه الف الزامی است.',
            'option_b.required' => 'گزینه ب الزامی است.',
            'option_c.required' => 'گزینه ج الزامی است.',
            'option_d.required' => 'گزینه د الزامی است.',
            'correct_answer.required' => 'پاسخ صحیح الزامی است.',
            'correct_answer.in' => 'پاسخ صحیح باید یکی از گزینه‌های a, b, c, d باشد.',
            'points.required' => 'امتیاز سوال الزامی است.',
            'points.min' => 'امتیاز نمی‌تواند منفی باشد.',
            'negative_points.max' => 'امتیاز منفی باید کمتر یا مساوی صفر باشد.',
        ];
    }
}
