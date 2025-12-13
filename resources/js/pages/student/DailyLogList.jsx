import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dailyLogService } from '../../services/dailyLogService';

export default function DailyLogList() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [logsData, statsData] = await Promise.all([
                dailyLogService.fetchLogs(),
                dailyLogService.getStats()
            ]);
            setLogs(logsData.data || []);
            setStats(statsData);
        } catch (err) {
            setError('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('آیا مطمئن هستید؟')) return;

        try {
            await dailyLogService.deleteLog(id);
            fetchData();
        } catch (err) {
            alert('خطا در حذف گزارش');
        }
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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">گزارش‌های روزانه</h1>
                        <div className="flex gap-3">
                            <Link
                                to="/daily-logs/create"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                + ثبت گزارش جدید
                            </Link>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                بازگشت
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    {stats && (
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded">
                                <div className="text-blue-600 dark:text-blue-300 text-sm">تعداد گزارش‌ها</div>
                                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.overall.total_logs}</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900 p-4 rounded">
                                <div className="text-green-600 dark:text-green-300 text-sm">مجموع ساعات</div>
                                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.overall.total_hours}</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded">
                                <div className="text-purple-600 dark:text-purple-300 text-sm">مجموع تست‌ها</div>
                                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.overall.total_tests}</div>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded">
                                <div className="text-yellow-600 dark:text-yellow-300 text-sm">میانگین کیفیت</div>
                                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.overall.avg_quality || '-'}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {logs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            هنوز گزارشی ثبت نشده است
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">تاریخ</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">درس</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">مبحث</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ساعت</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">تست</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">کیفیت</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.log_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.subject}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.topic || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.hours_studied}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.test_count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.quality_score || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    حذف
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
