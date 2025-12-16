import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FaEye, FaSearch } from 'react-icons/fa';
import moment from 'moment-jalaali';
moment.loadPersian({ usePersianDigits: true });

const AuditLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [filters, setFilters] = useState({
        user_id: '',
        action: '',
        model_type: ''
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAuditLogs(page, filters);
            setLogs(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, filters]); // Reload when page or filters change

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Reset to first page on filter change
    };

    const openDetail = (log) => {
        setSelectedLog(log);
    };

    const closeDetail = () => {
        setSelectedLog(null);
    };

    const formatDiff = (oldValues, newValues) => {
        if (!oldValues && !newValues) return <span className="text-gray-500">بدون تغییر</span>;

        return (
            <div className="grid grid-cols-2 gap-4 text-sm" dir="ltr">
                <div>
                    <h4 className="font-bold text-red-600 mb-2">مقدار قبلی</h4>
                    <pre className="bg-red-50 p-2 rounded overflow-auto h-60 text-xs">
                        {oldValues ? JSON.stringify(oldValues, null, 2) : 'null'}
                    </pre>
                </div>
                <div>
                    <h4 className="font-bold text-green-600 mb-2">مقدار جدید</h4>
                    <pre className="bg-green-50 p-2 rounded overflow-auto h-60 text-xs">
                        {newValues ? JSON.stringify(newValues, null, 2) : 'null'}
                    </pre>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">گزارش وقایع سیستم (Audit Logs)</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    name="model_type"
                    placeholder="فیلتر بر اساس نوع مدل (مثلا User)"
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={filters.model_type}
                    onChange={handleFilterChange}
                />
                <select
                    name="action"
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={filters.action}
                    onChange={handleFilterChange}
                >
                    <option value="">همه عملیات‌ها</option>
                    <option value="created">ایجاد (Created)</option>
                    <option value="updated">ویرایش (Updated)</option>
                    <option value="deleted">حذف (Deleted)</option>
                    <option value="login">ورود (Login)</option>
                    <option value="logout">خروج (Logout)</option>
                </select>
                <input
                    type="text"
                    name="user_id"
                    placeholder="شناسه کاربر (User ID)"
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={filters.user_id}
                    onChange={handleFilterChange}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">کاربر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">مدل</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاریخ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">در حال بارگذاری...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">هیچ رکوردی یافت نشد</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {log.user ? log.user.name : <span className="text-red-500">سیستم/ناشناس</span>}
                                        <span className="block text-xs text-gray-500">ID: {log.user_id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${log.action === 'created' ? 'bg-green-100 text-green-800' :
                                                log.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                                                    log.action === 'deleted' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {log.model_type.split('\\').pop()} #{log.model_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {log.ip_address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {moment(log.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => openDetail(log)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <FaEye className="inline ml-1" /> جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    قبلی
                </button>
                <span>صفحه {page} از {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    بعدی
                </button>
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                جزئیات تغییرات - {selectedLog.model_type.split('\\').pop()} #{selectedLog.model_id}
                            </h3>
                            <button onClick={closeDetail} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {formatDiff(selectedLog.old_values, selectedLog.new_values)}

                            <div className="mt-6 border-t pt-4 text-xs text-gray-500">
                                <p>User Agent: {selectedLog.user_agent}</p>
                            </div>
                        </div>

                        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-right">
                            <button
                                onClick={closeDetail}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                بستن
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogList;
