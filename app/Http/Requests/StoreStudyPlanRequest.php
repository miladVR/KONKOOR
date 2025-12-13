<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudyPlanRequest extends FormRequest
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
            'week_start_date' => ['required', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.day_of_week' => ['required', 'integer', 'min:0', 'max:6'],
            'items.*.subject' => ['required', 'string', 'max:255'],
            'items.*.topic' => ['nullable', 'string', 'max:255'],
            'items.*.hours' => ['required', 'numeric', 'min:0', 'max:18'],
            'items.*.test_count' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'week_start_date.required' => 'تاریخ شروع هفته الزامی است.',
            'items.required' => 'حداقل یک برنامه روزانه اضافه کنید.',
            'items.min' => 'حداقل یک برنامه روزانه اضافه کنید.',
            'items.*.day_of_week.required' => 'روز هفته الزامی است.',
            'items.*.day_of_week.min' => 'روز هفته باید بین 0 تا 6 باشد.',
            'items.*.day_of_week.max' => 'روز هفته باید بین 0 تا 6 باشد.',
            'items.*.subject.required' => 'نام درس الزامی است.',
            'items.*.hours.required' => 'ساعت مطالعه الزامی است.',
            'items.*.hours.max' => 'ساعت مطالعه نمی‌تواند بیشتر از ۱۸ ساعت باشد.',
            'items.*.test_count.required' => 'تعداد تست الزامی است.',
        ];
    }
}
