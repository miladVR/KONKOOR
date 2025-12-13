import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import questionService from '../../services/questionService';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ subject: '', difficulty: '', search: '' });

    useEffect(() => {
        fetchQuestions();
    }, [filters]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await questionService.getQuestions(filters);
            setQuestions(data.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('آیا از حذف این سوال اطمینان دارید؟')) {
            try {
                await questionService.deleteQuestion(id);
                fetchQuestions();
            } catch (error) {
                console.error('Error deleting question:', error);
            }
        }
    };

    return (
        <div className="p-6" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">بانک سوالات</h2>
                <Link
                    to="/admin/questions/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FaPlus /> سوال جدید
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filters.subject}
                        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                        className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">همه موضوعات</option>
                        <option value="ریاضی">ریاضی</option>
                        <option value="فیزیک">فیزیک</option>
                        <option value="شیمی">شیمی</option>
                        <option value="زیست">زیست</option>
                        <option value="ادبیات">ادبیات</option>
                        <option value="عربی">عربی</option>
                        <option value="زبان">زبان</option>
                        <option value="دینی">دینی</option>
                    </select>

                    <select
                        value={filters.difficulty}
                        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                        className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">همه سطوح</option>
                        <option value="آسان">آسان</option>
                        <option value="متوسط">متوسط</option>
                        <option value="سخت">سخت</option>
                    </select>

                    <input
                        type="text"
                        placeholder="جستجو در متن سوال..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Questions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">متن سوال</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">موضوع</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">سختی</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">امتیاز</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">در حال بارگذاری...</td>
                            </tr>
                        ) : questions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">سوالی یافت نشد</td>
                            </tr>
                        ) : (
                            questions.map((question) => (
                                <tr key={question.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{question.id}</td>
                                    <td className="px-6 py-4 text-sm max-w-md truncate">
                                        {question.question_image && <FaImage className="inline ml-2 text-blue-500" />}
                                        {question.question_text}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{question.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded ${question.difficulty === 'آسان' ? 'bg-green-100 text-green-800' :
                                                question.difficulty === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {question.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{question.points}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/questions/${question.id}/edit`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(question.id)}
                                                className="text-red-600 hover:text-red-800"
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

export default QuestionBank;
