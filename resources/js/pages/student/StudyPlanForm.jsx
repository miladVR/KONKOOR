import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { studyPlanService } from '../../services/studyPlanService';

const DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', '‌چهارشنبه', 'پنج‌شنبه', 'جمعه'];
const SUBJECTS = ['ریاضی', 'فیزیک', 'شیمی', 'زیست', 'زبان', 'عربی', 'دینی', 'ادبیات'];

export default function StudyPlanForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            week_start_date: new Date().toISOString().split('T')[0],
            items: [],
        }
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'items' });
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit) {
            loadPlan();
        }
    }, [id]);

    const loadPlan = async () => {
        try {
            const plan = await studyPlanService.getPlan(id);
            setValue('week_start_date', plan.week_start_date);
            setValue('items', plan.items || []);
        } catch (error) {
            setServerError('خطا در بارگذاری برنامه');
        }
    };

    const addItem = () => {
        append({
            day_of_week: 0,
            subject: '',
            topic: '',
            hours: 2,
            test_count: 0,
        });
    };

    const onSubmit = async (data) => {
        if (data.items.length === 0) {
            setServerError('حداقل یک برنامه روزانه اضافه کنید.');
            return;
        }

        try {
            setIsSubmitting(true);
            setServerError('');

            if (isEdit) {
                await studyPlanService.updatePlan(id, data);
            } else {
                await studyPlanService.createPlan(data);
            }

            navigate('/study-plans');
        } catch (error) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('خطایی رخ داد.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4" dir="rtl">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? 'ویرایش برنامه مطالعاتی' : 'ایجاد برنامه مطالعاتی'}
                    </h1>
                    <button
                        onClick={() => navigate('/study-plans')}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400"
                    >
                        بازگشت
                    </button>
                </div>

                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Week Start Date */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            تاریخ شروع هفته (شنبه) *
                        </label>
                        <input
                            type="date"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.week_start_date ? 'border-red-500' : ''}`}
                            {...register("week_start_date", { required: "تاریخ شروع الزامی است" })}
                        />
                        {errors.week_start_date && <p className="text-red-500 text-xs mt-1">{errors.week_start_date.message}</p>}
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold">
                                برنامه روزانه
                            </label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                                + افزودن
                            </button>
                        </div>

                        {fields.length === 0 && (
                            <div className="text-gray-500 text-center py-4 border border-dashed rounded">
                                هیچ برنامه‌ای اضافه نشده است
                            </div>
                        )}

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="border border-gray-300 rounded p-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">برنامه #{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            حذف
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Day of Week */}
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">روز هفته *</label>
                                            <select
                                                className="w-full py-2 px-3 border rounded text-sm"
                                                {...register(`items.${index}.day_of_week`, { required: true })}
                                            >
                                                {DAYS.map((day, idx) => (
                                                    <option key={idx} value={idx}>{day}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">درس *</label>
                                            <select
                                                className="w-full py-2 px-3 border rounded text-sm"
                                                {...register(`items.${index}.subject`, { required: true })}
                                            >
                                                <option value="">انتخاب کنید</option>
                                                {SUBJECTS.map(subject => (
                                                    <option key={subject} value={subject}>{subject}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Topic */}
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">مبحث</label>
                                            <input
                                                type="text"
                                                placeholder="مثلاً: معادلات"
                                                className="w-full py-2 px-3 border rounded text-sm"
                                                {...register(`items.${index}.topic`)}
                                            />
                                        </div>

                                        {/* Hours */}
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">ساعت *</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                max="18"
                                                className="w-full py-2 px-3 border rounded text-sm"
                                                {...register(`items.${index}.hours`, { required: true, min: 0, max: 18 })}
                                            />
                                        </div>

                                        {/* Test Count */}
                                        <div className="col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">تعداد تست *</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full py-2 px-3 border rounded text-sm"
                                                {...register(`items.${index}.test_count`, { required: true, min: 0 })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {isSubmitting ? 'در حال ذخیره...' : (isEdit ? 'به‌روزرسانی' : 'ایجاد برنامه')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/study-plans')}
                            className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded"
                        >
                            انصراف
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
