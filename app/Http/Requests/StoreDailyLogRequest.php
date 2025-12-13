<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyLogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'log_date' => ['required', 'date', 'before_or_equal:today'],
            'subject' => ['required', 'string', 'max:255'],
            'topic' => ['nullable', 'string', 'max:255'],
            'hours_studied' => ['required', 'numeric', 'min:0', 'max:18'],
            'test_count' => ['required', 'integer', 'min:0'],
            'quality_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'log_date.required' => 'تاریخ الزامی است.',
            'log_date.before_or_equal' => 'تاریخ نمی‌تواند در آینده باشد.',
            'subject.required' => 'نام درس الزامی است.',
            'hours_studied.required' => 'ساعت مطالعه الزامی است.',
            'hours_studied.max' => 'ساعت مطالعه نمی‌تواند بیشتر از ۱۸ ساعت باشد.',
            'test_count.required' => 'تعداد تست الزامی است.',
            'quality_score.min' => 'نمره کیفیت باید بین ۱ تا ۱۰ باشد.',
            'quality_score.max' => 'نمره کیفیت باید بین ۱ تا ۱۰ باشد.',
        ];
    }
}
