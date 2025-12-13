import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import resourceService from '../../services/resourceService';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBook, FaVideo, FaLink, FaFileAlt } from 'react-icons/fa';

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        subject: '',
        week_number: '',
        resource_type: '',
        is_approved: ''
    });

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await resourceService.getResources(filters);
            setResources(response.data.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await resourceService.approveResource(id);
            fetchResources();
        } catch (error) {
            console.error('Error approving resource:', error);
        }
    };

    const handleDisapprove = async (id) => {
        try {
            await resourceService.disapproveResource(id);
            fetchResources();
        } catch (error) {
            console.error('Error disapproving resource:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('آیا از حذف این منبع اطمینان دارید؟')) {
            try {
                await resourceService.deleteResource(id);
                fetchResources();
            } catch (error) {
                console.error('Error deleting resource:', error);
            }
        }
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'book': return <FaBook className="text-blue-600" />;
            case 'video': return <FaVideo className="text-red-600" />;
            case 'link': return <FaLink className="text-green-600" />;
            case 'pdf':
            case 'worksheet': return <FaFileAlt className="text-purple-600" />;
            default: return <FaFileAlt className="text-gray-600" />;
        }
    };

    return (
        <div className="p-6" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت منابع مطالعاتی</h1>
                <Link to="/admin/resources/create" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
                    <FaPlus />
                    <span>منبع جدید</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">درس</label>
                        <input
                            type="text"
                            placeholder="مثال: ریاضی"
                            value={filters.subject}
                            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">هفته</label>
                        <input
                            type="number"
                            placeholder="1-52"
                            value={filters.week_number}
                            onChange={(e) => setFilters({ ...filters, week_number: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع</label>
                        <select
                            value={filters.resource_type}
                            onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">همه</option>
                            <option value="book">کتاب</option>
                            <option value="pdf">PDF</option>
                            <option value="video">ویدیو</option>
                            <option value="test">آزمون</option>
                            <option value="link">لینک</option>
                            <option value="worksheet">کاربرگ</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت تایید</label>
                        <select
                            value={filters.is_approved}
                            onChange={(e) => setFilters({ ...filters, is_approved: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">همه</option>
                            <option value="true">تایید شده</option>
                            <option value="false">در انتظار تایید</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Resources List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عنوان</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نوع</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">درس</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">هفته</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {resources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{getResourceIcon(resource.resource_type)}</div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{resource.title}</div>
                                                {resource.description && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{resource.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{resource.resource_type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{resource.subject}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">هفته {resource.week_number}</td>
                                    <td className="px-6 py-4">
                                        {resource.is_approved ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <FaCheck className="w-3 h-3" />
                                                تایید شده
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <FaTimes className="w-3 h-3" />
                                                در انتظار
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {!resource.is_approved && (
                                                <button
                                                    onClick={() => handleApprove(resource.id)}
                                                    className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                                                    title="تایید"
                                                >
                                                    <FaCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                            {resource.is_approved && (
                                                <button
                                                    onClick={() => handleDisapprove(resource.id)}
                                                    className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                                                    title="لغو تایید"
                                                >
                                                    <FaTimes className="w-4 h-4" />
                                                </button>
                                            )}
                                            <Link
                                                to={`/admin/resources/${resource.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                title="ویرایش"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(resource.id)}
                                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                title="حذف"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {resources.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            منبعی یافت نشد
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResourceList;
