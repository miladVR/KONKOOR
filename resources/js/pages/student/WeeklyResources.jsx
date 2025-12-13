import React, { useState, useEffect } from 'react';
import studentResourceService from '../../services/studentResourceService';
import { FaBook, FaVideo, FaLink, FaFileAlt, FaCheckCircle, FaStickyNote } from 'react-icons/fa';

const WeeklyResources = () => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState('');
    const [activeNoteId, setActiveNoteId] = useState(null);

    useEffect(() => {
        fetchWeeklySchedule();
    }, []);

    const fetchWeeklySchedule = async () => {
        try {
            setLoading(true);
            const response = await studentResourceService.getCurrentWeekSchedule();
            setSchedule(response.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComplete = async (resourceId, isCompleted) => {
        try {
            if (isCompleted) {
                await studentResourceService.markAsIncomplete(resourceId);
            } else {
                await studentResourceService.markAsCompleted(resourceId);
            }
            fetchWeeklySchedule();
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const handleSaveNote = async (resourceId) => {
        try {
            await studentResourceService.addNotes(resourceId, noteText);
            setNoteText('');
            setActiveNoteId(null);
            fetchWeeklySchedule();
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'book': return <FaBook className="text-blue-600" size={24} />;
            case 'video': return <FaVideo className="text-red-600" size={24} />;
            case 'link': return <FaLink className="text-green-600" size={24} />;
            case 'pdf':
            case 'worksheet': return <FaFileAlt className="text-purple-600" size={24} />;
            default: return <FaFileAlt className="text-gray-600" size={24} />;
        }
    };

    const calculateProgress = () => {
        if (!schedule || !schedule.resources) return 0;
        const completed = schedule.resources.filter(r => r.progress?.is_completed).length;
        return Math.round((completed / schedule.resources.length) * 100);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!schedule) {
        return (
            <div className="p-6 text-center" dir="rtl">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">برنامه‌ای برای این هفته یافت نشد</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        مشاور شما هنوز برنامه این هفته را منتشر نکرده است. لطفاً بعداً مراجعه کنید.
                    </p>
                </div>
            </div>
        );
    }

    const progress = calculateProgress();

    return (
        <div className="p-6 max-w-6xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">منابع هفته جاری</h1>
                <p className="text-gray-600 dark:text-gray-400">{schedule.title}</p>
                {schedule.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{schedule.description}</p>
                )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">پیشرفت این هفته</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {schedule.resources.filter(r => r.progress?.is_completed).length} از {schedule.resources.length} منبع تکمیل شده
                </div>
            </div>

            {/* Resources List */}
            <div className="space-y-4">
                {schedule.resources.map((resource) => {
                    const isCompleted = resource.progress?.is_completed || false;
                    const hasNotes = resource.progress?.student_notes;

                    return (
                        <div
                            key={resource.id}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all ${isCompleted ? 'border-r-4 border-green-500' : 'border-r-4 border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-1">
                                    {getResourceIcon(resource.resource_type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{resource.title}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span>{resource.subject}</span>
                                                <span>•</span>
                                                <span>هفته {resource.week_number}</span>
                                                <span>•</span>
                                                <span className="capitalize">{resource.resource_type}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleComplete(resource.id, isCompleted)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${isCompleted
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <FaCheckCircle />
                                            <span>{isCompleted ? 'تکمیل شده' : 'علامت به عنوان تکمیل'}</span>
                                        </button>
                                    </div>

                                    {resource.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-3">{resource.description}</p>
                                    )}

                                    {/* File/Link Access */}
                                    {(resource.file_path || resource.external_url) && (
                                        <div className="mb-3">
                                            {resource.external_url && (
                                                <a
                                                    href={resource.external_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                                                >
                                                    <FaLink />
                                                    <span>مشاهده منبع</span>
                                                </a>
                                            )}
                                            {resource.file_path && (
                                                <a
                                                    href={`/storage/${resource.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                                                >
                                                    <FaFileAlt />
                                                    <span>دانلود فایل</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Notes Section */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                        {hasNotes && activeNoteId !== resource.id && (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-2">
                                                <div className="flex items-start gap-2">
                                                    <FaStickyNote className="text-yellow-600 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{resource.progress.student_notes}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setActiveNoteId(resource.id);
                                                            setNoteText(resource.progress.student_notes);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        ویرایش
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {(activeNoteId === resource.id || (!hasNotes && activeNoteId !== resource.id)) && (
                                            <div>
                                                {activeNoteId === resource.id ? (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={noteText}
                                                            onChange={(e) => setNoteText(e.target.value)}
                                                            placeholder="یادداشت خود را وارد کنید..."
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleSaveNote(resource.id)}
                                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                                                            >
                                                                ذخیره
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setActiveNoteId(null);
                                                                    setNoteText('');
                                                                }}
                                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition"
                                                            >
                                                                لغو
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setActiveNoteId(resource.id)}
                                                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-2"
                                                    >
                                                        <FaStickyNote />
                                                        <span>افزودن یادداشت</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyResources;
