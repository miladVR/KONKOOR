import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dailyLogService } from '../../services/dailyLogService';

export default function DailyLogForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            log_date: new Date().toISOString().split('T')[0],
            quality_score: 5,
        }
    });
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subjects = [
        'ریاضی',
        'فیزیک',
        'شیمی',
        'زیست',
        'زبان',
        'عربی',
        'دینی',
        'ادبیات',
    ];

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setServerError('');
            await dailyLogService.createLog(data);
            navigate('/daily-logs');
        } catch (error) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('خطایی در ثبت گزارش رخ داد.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4" dir="rtl">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ثبت گزارش روزانه</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        بازگشت
                    </button>
                </div>

                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* تاریخ */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                تاریخ *
                            </label>
                            <input
                                type="date"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.log_date ? 'border-red-500' : ''}`}
                                {...register("log_date", { required: "تاریخ الزامی است" })}
                            />
                            {errors.log_date && <p className="text-red-500 text-xs mt-1">{errors.log_date.message}</p>}
                        </div>

                        {/* نام درس */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                نام درس *
                            </label>
                            <select
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.subject ? 'border-red-500' : ''}`}
                                {...register("subject", { required: "نام درس الزامی است" })}
                            >
                                <option value="">انتخاب کنید</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                        </div>
                    </div>

                    {/* مبحث */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            مبحث (اختیاری)
                        </label>
                        <input
                            type="text"
                            placeholder="مثال: معادلات درجه دوم"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            {...register("topic")}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* ساعت مطالعه */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                ساعت مطالعه *
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="18"
                                placeholder="2.5"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.hours_studied ? 'border-red-500' : ''}`}
                                {...register("hours_studied", {
                                    required: "ساعت مطالعه الزامی است",
                                    min: { value: 0, message: "حداقل 0 ساعت" },
                                    max: { value: 18, message: "حداکثر 18 ساعت" }
                                })}
                            />
                            {errors.hours_studied && <p className="text-red-500 text-xs mt-1">{errors.hours_studied.message}</p>}
                        </div>

                        {/* تعداد تست */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                تعداد تست *
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="50"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.test_count ? 'border-red-500' : ''}`}
                                {...register("test_count", {
                                    required: "تعداد تست الزامی است",
                                    min: { value: 0, message: "حداقل 0 تست" }
                                })}
                            />
                            {errors.test_count && <p className="text-red-500 text-xs mt-1">{errors.test_count.message}</p>}
                        </div>

                        {/* نمره کیفیت */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                نمره کیفیت (1-10)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                {...register("quality_score", {
                                    min: { value: 1, message: "حداقل 1" },
                                    max: { value: 10, message: "حداکثر 10" }
                                })}
                            />
                            {errors.quality_score && <p className="text-red-500 text-xs mt-1">{errors.quality_score.message}</p>}
                        </div>
                    </div>

                    {/* یادداشت */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            یادداشت (اختیاری)
                        </label>
                        <textarea
                            rows="3"
                            placeholder="توضیحات اضافی..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            {...register("notes")}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {isSubmitting ? 'در حال ثبت...' : 'ثبت گزارش'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
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
