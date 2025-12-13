import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';
import questionService from '../../services/questionService';

const ExamForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 60,
        start_time: '',
        end_time: '',
        is_practice_mode: false,
        randomize_questions: false,
        randomize_options: false,
        enable_anti_cheating: true,
        require_fullscreen: false,
        passing_score: 50,
        questions: [],
    });

    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
        if (isEdit) {
            fetchExam();
        }
    }, [id]);

    const fetchQuestions = async () => {
        try {
            const data = await questionService.getQuestions();
            setAvailableQuestions(data.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const fetchExam = async () => {
        try {
            const response = await adminService.get(`/admin/exams/${id}`);
            const exam = response.data;
            setFormData({
                ...exam,
                questions: exam.questions.map(q => q.id),
            });
        } catch (error) {
            console.error('Error fetching exam:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleQuestionToggle = (questionId) => {
        if (formData.questions.includes(questionId)) {
            setFormData({
                ...formData,
                questions: formData.questions.filter(id => id !== questionId),
            });
        } else {
            setFormData({
                ...formData,
                questions: [...formData.questions, questionId],
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await adminService.put(`/admin/exams/${id}`, formData);
            } else {
                await adminService.post('/admin/exams', formData);
            }
            navigate('/admin/exams');
        } catch (error) {
            console.error('Error saving exam:', error);
            alert('خطا در ذخیره آزمون');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
            <h2 className="text-2xl font-bold mb-6">
                {isEdit ? 'ویرایش آزمون' : 'آزمون جدید'}
            </h2>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
                {/* Basic Info */}
                <div>
                    <label className="block text-sm font-medium mb-2">عنوان</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">توضیحات</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">مدت زمان (دقیقه)</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            min="1"
                            className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">زمان شروع</label>
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">زمان پایان</label>
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                            required
                        />
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="border-t pt-4">
                    <h3 className="font-bold mb-4">تنظیمات پیشرفته</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="is_practice_mode"
                                checked={formData.is_practice_mode}
                                onChange={handleChange}
                            />
                            <span>حالت تمرین</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="randomize_questions"
                                checked={formData.randomize_questions}
                                onChange={handleChange}
                            />
                            <span>ترتیب تصادفی سوالات</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="randomize_options"
                                checked={formData.randomize_options}
                                onChange={handleChange}
                            />
                            <span>ترتیب تصادفی گزینه‌ها</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="enable_anti_cheating"
                                checked={formData.enable_anti_cheating}
                                onChange={handleChange}
                            />
                            <span>فعال‌سازی تشخیص تقلب</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="require_fullscreen"
                                checked={formData.require_fullscreen}
                                onChange={handleChange}
                            />
                            <span>الزامی بودن حالت تمام صفحه</span>
                        </label>
                    </div>
                </div>

                {/* Questions Selection */}
                <div className="border-t pt-4">
                    <h3 className="font-bold mb-4">انتخاب سوالات ({formData.questions.length} سوال انتخاب شده)</h3>
                    <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                        {availableQuestions.map((question) => (
                            <label key={question.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.questions.includes(question.id)}
                                    onChange={() => handleQuestionToggle(question.id)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">{question.question_text}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {question.subject} - {question.difficulty} - {question.points} نمره
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || formData.questions.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'در حال ذخیره...' : isEdit ? 'ویرایش' : 'ایجاد'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/exams')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExamForm;
