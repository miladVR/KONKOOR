import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await adminService.getRoles();
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت نقش‌ها</h1>
                    <Link to="/admin" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition">
                        بازگشت به داشبورد
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">نام نقش</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">دسترسی‌ها (Permissions)</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-300">شناسه</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500">در حال بارگذاری...</td>
                                </tr>
                            ) : (
                                roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                                        <td className="p-4 font-bold text-gray-900 dark:text-white">{role.name}</td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {role.permissions.map(perm => (
                                                    <span key={perm.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        {perm.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-sm">{role.id}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RoleManagement;
