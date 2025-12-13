import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import questionService from '../../services/questionService';

const QuestionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        subject: 'ریاضی',
        difficulty: 'متوسط',
        question_text: '',
        question_image: null,
        has_formula: false,
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'a',
        explanation: '',
        points: 1,
        negative_points: 0,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchQuestion();
        }
    }, [id]);

    const fetchQuestion = async () => {
        try {
            const data = await questionService.getQuestion(id);
            setFormData(data);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await questionService.updateQuestion(id, formData);
            } else {
                await questionService.createQuestion(formData);
            }
            navigate('/admin/questions');
        } catch (error) {
            console.error('Error saving question:', error);
            alert('خطا در ذخیره سوال');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {isEdit ? 'ویرایش سوال' : 'سوال جدید'}
            </h2>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
                {/* Subject & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">موضوع</label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                            required
                        >
                            <option value="ریاضی">ریاضی</option>
                            <option value="فیزیک">فیزیک</option>
                            <option value="شیمی">شیمی</option>
                            <option value="زیست">زیست</option>
                            <option value="ادبیات">ادبیات</option>
                            <option value="عربی">عربی</option>
                            <option value="زبان">زبان</option>
                            <option value="دینی">دینی</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">سطح سختی</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                            required
                        >
                            <option value="آسان">آسان</option>
                            <option value="متوسط">متوسط</option>
                            <option value="سخت">سخت</option>
                        </select>
                    </div>
                </div>

                {/* Question Text */}
                <div>
                    <label className="block text-sm font-medium mb-2">متن سوال</label>
                    <textarea
                        name="question_text"
                        value={formData.question_text}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                        required
                    />
                </div>

                {/* Question Image */}
                <div>
                    <label className="block text-sm font-medium mb-2">تصویر سوال (اختیاری)</label>
                    <input
                        type="file"
                        name="question_image"
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                    />
                </div>

                {/* Has Formula */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="has_formula"
                        checked={formData.has_formula}
                        onChange={handleChange}
                        className="ml-2"
                    />
                    <label className="text-sm font-medium">این سوال شامل فرمول ریاضی است</label>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">گزینه‌ها</h3>
                    {['a', 'b', 'c', 'd'].map((option) => (
                        <div key={option} className="border p-4 rounded-lg">
                            <label className="block text-sm font-medium mb-2">گزینه {option.toUpperCase()}</label>
                            <input
                                type="text"
                                name={`option_${option}`}
                                value={formData[`option_${option}`]}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 mb-2"
                                required
                            />
                            <input
                                type="file"
                                name={`option_${option}_image`}
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full text-sm"
                            />
                        </div>
                    ))}
                </div>

                {/* Correct Answer */}
                <div>
                    <label className="block text-sm font-medium mb-2">پاسخ صحیح</label>
                    <select
                        name="correct_answer"
                        value={formData.correct_answer}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                        required
                    >
                        <option value="a">گزینه A</option>
                        <option value="b">گزینه B</option>
                        <option value="c">گزینه C</option>
                        <option value="d">گزینه D</option>
                    </select>
                </div>

                {/* Explanation */}
                <div>
                    <label className="block text-sm font-medium mb-2">توضیحات (اختیاری)</label>
                    <textarea
                        name="explanation"
                        value={formData.explanation}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                    />
                </div>

                {/* Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">امتیاز</label>
                        <input
                            type="number"
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                            step="0.25"
                            min="0"
                            className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">امتیاز منفی (اختیاری)</label>
                        <input
                            type="number"
                            name="negative_points"
                            value={formData.negative_points}
                            onChange={handleChange}
                            step="0.25"
                            max="0"
                            className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'در حال ذخیره...' : isEdit ? 'ویرایش' : 'ایجاد'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/questions')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionForm;
