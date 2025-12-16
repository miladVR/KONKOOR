import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getUsers(page, search, role);
            setUsers(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search, role]);

    const handleDelete = async (id) => {
        if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
            try {
                await adminService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('خطا در حذف کاربر');
            }
        }
    };

    const getRoleBadge = (roles) => {
        if (!roles || roles.length === 0) return <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">بدون نقش</span>;

        const roleName = roles[0].name;
        let colorClass = 'bg-gray-200 text-gray-800';
        let label = roleName;

        switch (roleName) {
            case 'admin':
                colorClass = 'bg-red-100 text-red-800';
                label = 'مدیر کل';
                break;
            case 'assistant':
                colorClass = 'bg-purple-100 text-purple-800';
                label = 'پشتیبان';
                break;
            case 'student':
                colorClass = 'bg-green-100 text-green-800';
                label = 'دانش‌آموز';
                break;
        }

        return <span className={`${colorClass} px-2 py-1 rounded text-xs font-bold`}>{label}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت کاربران</h1>
                    <Link to="/admin/users/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                        + ایجاد کاربر جدید
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">جستجو</label>
                        <input
                            type="text"
                            placeholder="نام، موبایل یا ایمیل..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نقش</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="all">همه نقش‌ها</option>
                            <option value="admin">مدیر کل</option>
                            <option value="assistant">پشتیبان</option>
                            <option value="student">دانش‌آموز</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">نام</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">موبایل</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">نقش</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">تاریخ ثبت‌نام</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">در حال بارگذاری...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">کاربری یافت نشد.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                                        <td className="p-4 text-gray-900 dark:text-white">{user.name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400" dir="ltr">{user.mobile}</td>
                                        <td className="p-4">{getRoleBadge(user.roles)}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString('fa-IR')}
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <Link to={`/admin/users/edit/${user.id}`} className="text-blue-600 hover:text-blue-800">
                                                ✏️ ویرایش
                                            </Link>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                                                🗑️ حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white dark:bg-gray-800 rounded shadow disabled:opacity-50"
                    >
                        قبلی
                    </button>
                    <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded shadow">
                        صفحه {page} از {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-white dark:bg-gray-800 rounded shadow disabled:opacity-50"
                    >
                        بعدی
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserList;
