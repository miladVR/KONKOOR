import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaPlay } from 'react-icons/fa';
import examService from '../../services/examService';

const AvailableExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const data = await examService.getAvailableExams();
            setExams(data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = async (examId) => {
        if (!window.confirm('آیا می‌خواهید آزمون را شروع کنید؟')) return;

        try {
            const result = await examService.startExam(examId);
            localStorage.setItem('exam_session_id', result.session_id);
            navigate(`/student/exams/take/${result.student_exam_id}`);
        } catch (error) {
            console.error('Error starting exam:', error);
            alert('خطا در شروع آزمون');
        }
    };

    if (loading) {
        return <div className="p-6 text-center" dir="rtl">در حال بارگذاری...</div>;
    }

    return (
        <div className="p-6" dir="rtl">
            <h2 className="text-2xl font-bold mb-6">آزمون‌های قابل شرکت</h2>

            {exams.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
                    <p className="text-gray-600 dark:text-gray-400">در حال حاضر آزمونی برای شرکت موجود نیست.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => (
                        <div key={exam.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
                            <h3 className="text-xl font-bold mb-3">{exam.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{exam.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <FaClock className="text-blue-600" />
                                    <span>مدت زمان: {exam.duration} دقیقه</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FaQuestionCircle className="text-blue-600" />
                                    <span>تعداد سوالات: {exam.questions_count}</span>
                                </div>
                            </div>

                            {exam.is_practice_mode && (
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm inline-block mb-4">
                                    حالت تمرین
                                </div>
                            )}

                            <button
                                onClick={() => handleStartExam(exam.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium"
                            >
                                <FaPlay /> شروع آزمون
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableExams;
