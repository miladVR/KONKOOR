import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import examService from '../../services/examService';

const ExamResults = () => {
    const { studentExamId } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const data = await examService.getResults(studentExamId);
            setResults(data);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center" dir="rtl">در حال بارگذاری...</div>;
    }

    if (!results) {
        return <div className="p-6 text-center" dir="rtl">خطا در بارگذاری نتایج</div>;
    }

    const { exam, student_exam, stats, subject_breakdown, answers } = results;

    // Chart data
    const chartData = {
        labels: ['صحیح', 'غلط', 'بی‌پاسخ'],
        datasets: [{
            data: [stats.correct, stats.wrong, stats.unanswered],
            backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
        }]
    };

    return (
        <div className="p-6 max-w-6xl mx-auto" dir="rtl">
            <h2 className="text-2xl font-bold mb-6">کارنامه آزمون: {exam.title}</h2>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">نمره کل</h3>
                    <div className="text-3xl font-bold text-blue-600">{student_exam.total_score}</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">درصد</h3>
                    <div className="text-3xl font-bold text-green-600">{student_exam.percentage}%</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">وضعیت</h3>
                    <div className={`text-xl font-bold ${student_exam.percentage >= exam.passing_score ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {student_exam.percentage >= exam.passing_score ? 'قبول' : 'مردود'}
                    </div>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-bold mb-4">نمودار عملکرد</h3>
                <div className="max-w-md mx-auto">
                    <Pie data={chartData} />
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-600" />
                        <span>صحیح: {stats.correct}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaTimesCircle className="text-red-600" />
                        <span>غلط: {stats.wrong}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMinusCircle className="text-gray-600" />
                        <span>بی‌پاسخ: {stats.unanswered}</span>
                    </div>
                </div>
            </div>

            {/* Subject Breakdown */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-bold mb-4">عملکرد در موضوعات</h3>
                <div className="space-y-3">
                    {Object.entries(subject_breakdown).map(([subject, data]) => (
                        <div key={subject} className="border-b pb-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{subject}</span>
                                <span className="text-sm text-gray-600">
                                    {data.correct} / {data.total}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${(data.correct / data.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Anti-Cheating Stats */}
            {student_exam.tab_switches_count > 0 || student_exam.fullscreen_exits_count > 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg shadow mb-6">
                    <h3 className="text-lg font-bold mb-4 text-yellow-800 dark:text-yellow-200">هشدارها</h3>
                    <div className="space-y-2 text-sm">
                        {student_exam.tab_switches_count > 0 && (
                            <p>تعداد دفعات تعویض تب: {student_exam.tab_switches_count}</p>
                        )}
                        {student_exam.fullscreen_exits_count > 0 && (
                            <p>تعداد دفعات خروج از حالت تمام صفحه: {student_exam.fullscreen_exits_count}</p>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Detailed Answers */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full text-left text-lg font-bold flex justify-between items-center"
                >
                    <span>پاسخنامه تشریحی</span>
                    <span>{showDetails ? '▲' : '▼'}</span>
                </button>

                {showDetails && (
                    <div className="mt-4 space-y-4">
                        {answers.map((answer, index) => (
                            <div key={answer.id} className="border p-4 rounded">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold">سوال {index + 1}</h4>
                                    {answer.is_correct ? (
                                        <FaCheckCircle className="text-green-600 text-xl" />
                                    ) : (
                                        <FaTimesCircle className="text-red-600 text-xl" />
                                    )}
                                </div>

                                <p className="mb-2">{answer.question.question_text}</p>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">پاسخ شما: </span>
                                        <span className={answer.is_correct ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                            {answer.selected_answer?.toUpperCase() || 'بی‌پاسخ'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">پاسخ صحیح: </span>
                                        <span className="text-green-600 font-bold">
                                            {answer.question.correct_answer.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {answer.question.explanation && (
                                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                                        <p className="text-sm"><strong>توضیح:</strong> {answer.question.explanation}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamResults;
