import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پنل مدیریت</h1>
                        <p className="text-gray-600 dark:text-gray-400">خوش آمدید، {user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/dashboard" className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded transition">
                            پنل کاربری
                        </Link>
                        <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition">
                            خروج
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                        <div className="text-lg opacity-80 mb-2">کل کاربران</div>
                        <div className="text-4xl font-bold">{stats?.total_users}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                        <div className="text-lg opacity-80 mb-2">دانش‌آموزان</div>
                        <div className="text-4xl font-bold">{stats?.students}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                        <div className="text-lg opacity-80 mb-2">پشتیبان‌ها</div>
                        <div className="text-4xl font-bold">{stats?.assistants}</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                        <div className="text-lg opacity-80 mb-2">گزارش‌های ثبت شده</div>
                        <div className="text-4xl font-bold">{stats?.daily_logs}</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">مدیریت کاربران</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            مشاهده لیست کاربران، ایجاد کاربر جدید، ویرایش اطلاعات و تخصیص نقش‌ها.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/admin/users" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition w-full text-center">
                                لیست کاربران
                            </Link>
                            <Link to="/admin/users/create" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition w-full text-center">
                                ایجاد کاربر جدید
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">مدیریت نقش‌ها و دسترسی‌ها</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            مشاهده نقش‌های تعریف شده در سیستم و دسترسی‌های هر نقش.
                        </p>
                        <Link to="/admin/roles" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition block text-center">
                            مدیریت نقش‌ها
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">گزارشات سیستم</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            مشاهده لاگ‌های امنیتی و تغییرات داده‌ها در سیستم.
                        </p>
                        <Link to="/admin/audit-logs" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition block text-center">
                            گزارشات حسابرسی
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
