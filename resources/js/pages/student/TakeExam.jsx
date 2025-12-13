import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookmark, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import examService from '../../services/examService';

const TakeExam = () => {
    const { studentExamId } = useParams();
    const navigate = useNavigate();
    const sessionId = localStorage.getItem('exam_session_id');

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [bookmarks, setBookmarks] = useState({});
    const [remainingTime, setRemainingTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    const timerRef = useRef(null);
    const autoSaveRef = useRef(null);

    useEffect(() => {
        fetchExamData();
        setupAntiCheating();

        return () => {
            clearInterval(timerRef.current);
            clearInterval(autoSaveRef.current);
        };
    }, []);

    useEffect(() => {
        // Reset timer when question changes
        setQuestionStartTime(Date.now());
    }, [currentIndex]);

    const fetchExamData = async () => {
        try {
            const data = await examService.getExamQuestions(studentExamId, sessionId);
            setExam(data.exam);
            setQuestions(data.questions);
            setRemainingTime(data.remaining_time);

            // Initialize answers and bookmarks from API
            const initialAnswers = {};
            const initialBookmarks = {};
            data.questions.forEach(q => {
                const studentAnswer = q.student_answers?.[0];
                if (studentAnswer) {
                    initialAnswers[q.id] = studentAnswer.selected_answer;
                    initialBookmarks[q.id] = studentAnswer.is_bookmarked;
                }
            });
            setAnswers(initialAnswers);
            setBookmarks(initialBookmarks);

            // Start timer
            startTimer(data.remaining_time);

            // Start auto-save
            startAutoSave();

            setLoading(false);
        } catch (error) {
            console.error('Error fetching exam:', error);
            alert('خطا در بارگذاری آزمون');
        }
    };

    const startTimer = (initialTime) => {
        setRemainingTime(initialTime);

        timerRef.current = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startAutoSave = () => {
        autoSaveRef.current = setInterval(() => {
            saveCurrentAnswer();
        }, 10000); // هر 10 ثانیه
    };

    const setupAntiCheating = () => {
        if (!exam?.enable_anti_cheating) return;

        // Detect tab switching
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logActivity('tab_switch');
            }
        };

        // Detect fullscreen exit
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && exam?.require_fullscreen) {
                logActivity('fullscreen_exit');
                alert('لطفاً در حالت تمام صفحه بمانید!');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Request fullscreen if required
        if (exam?.require_fullscreen) {
            document.documentElement.requestFullscreen();
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    };

    const logActivity = async (activityType) => {
        try {
            await examService.logActivity(studentExamId, sessionId, activityType);
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    };

    const saveCurrentAnswer = async () => {
        const currentQuestion = questions[currentIndex];
        if (!currentQuestion) return;

        const selectedAnswer = answers[currentQuestion.id];
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

        try {
            await examService.submitAnswer(
                studentExamId,
                sessionId,
                currentQuestion.id,
                selectedAnswer,
                timeSpent
            );
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    const handleAnswerSelect = (answer) => {
        const currentQuestion = questions[currentIndex];
        setAnswers({ ...answers, [currentQuestion.id]: answer });
    };

    const handleBookmark = async () => {
        const currentQuestion = questions[currentIndex];
        try {
            const result = await examService.toggleBookmark(studentExamId, sessionId, currentQuestion.id);
            setBookmarks({ ...bookmarks, [currentQuestion.id]: result.is_bookmarked });
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const handleNext = async () => {
        await saveCurrentAnswer();
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = async () => {
        await saveCurrentAnswer();
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (!window.confirm('آیا از تحویل آزمون اطمینان دارید؟')) return;

        try {
            await saveCurrentAnswer();
            await examService.submitExam(studentExamId, sessionId);
            localStorage.removeItem('exam_session_id');
            navigate(`/student/exams/results/${studentExamId}`);
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('خطا در تحویل آزمون');
        }
    };

    const handleAutoSubmit = async () => {
        try {
            await examService.submitExam(studentExamId, sessionId);
            localStorage.removeItem('exam_session_id');
            alert('زمان آزمون به پایان رسید و خودکار تحویل داده شد.');
            navigate(`/student/exams/results/${studentExamId}`);
        } catch (error) {
            console.error('Error auto-submitting exam:', error);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <div className="p-6 text-center" dir="rtl">در حال بارگذاری...</div>;
    }

    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.values(answers).filter(a => a).length;
    const bookmarkedCount = Object.values(bookmarks).filter(b => b).length;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4" dir="rtl">
            {/* Timer & Header */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{exam.title}</h2>
                    <div className={`flex items-center gap-2 text-2xl font-bold ${remainingTime < 300 ? 'text-red-600' : 'text-blue-600'
                        }`}>
                        <FaClock />
                        {formatTime(remainingTime)}
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    سوال {currentIndex + 1} از {questions.length} |
                    پاسخ داده شده: {answeredCount} |
                    علامت‌گذاری شده: {bookmarkedCount}
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-4">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold">سوال {currentIndex + 1}</h3>
                    <button
                        onClick={handleBookmark}
                        className={`p-2 rounded ${bookmarks[currentQuestion.id]
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        <FaBookmark />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-lg">{currentQuestion.question_text}</p>
                    {currentQuestion.question_image && (
                        <img
                            src={`/storage/${currentQuestion.question_image}`}
                            alt="سوال"
                            className="mt-4 max-w-md rounded"
                        />
                    )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey, idx) => {
                        const optionValue = ['a', 'b', 'c', 'd'][idx];
                        const optionText = currentQuestion[optionKey];
                        const optionImage = currentQuestion[`${optionKey}_image`];
                        const isSelected = answers[currentQuestion.id] === optionValue;

                        return (
                            <button
                                key={optionValue}
                                onClick={() => handleAnswerSelect(optionValue)}
                                className={`w-full p-4 rounded-lg border-2 text-right transition ${isSelected
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                                        : 'border-gray-300 hover:border-blue-400'
                                    }`}
                            >
                                <span className="font-bold ml-2">{optionValue.toUpperCase()})</span>
                                {optionText}
                                {optionImage && (
                                    <img
                                        src={`/storage/${optionImage}`}
                                        alt={`گزینه ${optionValue}`}
                                        className="mt-2 max-w-xs rounded"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
                >
                    <FaChevronRight /> قبلی
                </button>

                <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold"
                >
                    تحویل آزمون
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
                >
                    بعدی <FaChevronLeft />
                </button>
            </div>
        </div>
    );
};

export default TakeExam;
