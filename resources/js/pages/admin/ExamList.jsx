import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaChartBar } from 'react-icons/fa';
import adminService from '../../services/adminService';

const ExamList = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await adminService.get('/admin/exams');
            setExams(response.data.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (id) => {
        try {
            await adminService.post(`/admin/exams/${id}/publish`);
            fetchExams();
        } catch (error) {
            console.error('Error publishing exam:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('آیا از حذف این آزمون اطمینان دارید؟')) {
            try {
                await adminService.delete(`/admin/exams/${id}`);
                fetchExams();
            } catch (error) {
                console.error('Error deleting exam:', error);
            }
        }
    };

    return (
        <div className="p-6" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">مدیریت آزمون‌ها</h2>
                <Link
                    to="/admin/exams/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FaPlus /> آزمون جدید
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">عنوان</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">مدت زمان</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">تعداد سوالات</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">شرکت‌کنندگان</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">وضعیت</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">در حال بارگذاری...</td>
                            </tr>
                        ) : exams.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">آزمونی یافت نشد</td>
                            </tr>
                        ) : (
                            exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 font-medium">{exam.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{exam.duration} دقیقه</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{exam.questions_count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{exam.student_exams_count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-sm ${exam.is_published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {exam.is_published ? 'منتشر شده' : 'پیش‌نویس'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/exams/${exam.id}/analytics`}
                                                className="text-purple-600 hover:text-purple-800"
                                                title="آمار"
                                            >
                                                <FaChartBar />
                                            </Link>
                                            {!exam.is_published && (
                                                <button
                                                    onClick={() => handlePublish(exam.id)}
                                                    className="text-green-600 hover:text-green-800"
                                                    title="انتشار"
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                            )}
                                            <Link
                                                to={`/admin/exams/${exam.id}/edit`}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="ویرایش"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(exam.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="حذف"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExamList;
