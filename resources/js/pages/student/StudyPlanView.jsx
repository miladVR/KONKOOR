import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studyPlanService } from '../../services/studyPlanService';

const DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

export default function StudyPlanView() {
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentPlan();
    }, []);

    const fetchCurrentPlan = async () => {
        try {
            setLoading(true);
            const response = await studyPlanService.getCurrentPlan();
            setCurrentPlan(response.plan || response);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('');
                setCurrentPlan(null);
            } else {
                setError('خطا در بارگذاری برنامه');
            }
        } finally {
            setLoading(false);
        }
    };

    const getDayItems = (dayOfWeek) => {
        if (!currentPlan || !currentPlan.items) return [];
        return currentPlan.items.filter(item => item.day_of_week === dayOfWeek);
    };

    const getDayTotals = (dayOfWeek) => {
        const items = getDayItems(dayOfWeek);
        return {
            hours: items.reduce((sum, item) => sum + parseFloat(item.hours || 0), 0),
            tests: items.reduce((sum, item) => sum + parseInt(item.test_count || 0), 0),
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-gray-700 dark:text-gray-300">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">برنامه مطالعاتی هفتگی</h1>
                        <div className="flex gap-3">
                            {currentPlan && (
                                <Link
                                    to={`/study-plans/edit/${currentPlan.id}`}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    ویرایش برنامه
                                </Link>
                            )}
                            <Link
                                to="/study-plans/create"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                + ایجاد برنامه جدید
                            </Link>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                بازگشت
                            </button>
                        </div>
                    </div>

                    {currentPlan && (
                        <div className="text-gray-600 dark:text-gray-400">
                            هفته شروع: {currentPlan.week_start_date}
                        </div>
                    )}
                </div>

                {/* No Plan Message */}
                {!currentPlan && !error && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-500 dark:text-gray-400 mb-4">
                            برنامه‌ای برای هفته جاری وجود ندارد
                        </div>
                        <Link
                            to="/study-plans/create"
                            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                        >
                            ایجاد برنامه جدید
                        </Link>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Weekly Calendar */}
                {currentPlan && (
                    <div className="grid grid-cols-7 gap-3">
                        {DAYS.map((day, index) => {
                            const items = getDayItems(index);
                            const totals = getDayTotals(index);

                            return (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                                    {/* Day Header */}
                                    <div className="bg-blue-500 text-white p-3 text-center font-bold">
                                        {day}
                                    </div>

                                    {/* Day Content */}
                                    <div className="p-3">
                                        {items.length === 0 ? (
                                            <div className="text-gray-400 text-sm text-center py-4">
                                                بدون برنامه
                                            </div>
                                        ) : (
                                            <>
                                                {items.map((item, idx) => (
                                                    <div key={idx} className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                                                        <div className="font-semibold text-gray-900 dark:text-white">{item.subject}</div>
                                                        {item.topic && (
                                                            <div className="text-gray-600 dark:text-gray-400 text-xs">{item.topic}</div>
                                                        )}
                                                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                                            {item.hours} ساعت • {item.test_count} تست
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Day Totals */}
                                                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs">
                                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                        <span>جمع:</span>
                                                        <span>{totals.hours.toFixed(1)} ساعت</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                        <span></span>
                                                        <span>{totals.tests} تست</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
