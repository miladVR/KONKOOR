import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import adminService from '../../services/adminService';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const UserCreate = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [expiryDate, setExpiryDate] = useState(null);

    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                subscription_expires_at: expiryDate ? expiryDate.toDate().toISOString().split('T')[0] : null
            };
            await adminService.createUser(formattedData);
            navigate('/admin/users');
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('خطا در ایجاد کاربر. لطفاً دوباره تلاش کنید.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8" dir="rtl">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">ایجاد کاربر جدید</h1>

                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام و نام خانوادگی</label>
                        <input
                            {...register('name', { required: 'نام الزامی است' })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شماره موبایل</label>
                        <input
                            {...register('mobile', { required: 'موبایل الزامی است' })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            dir="ltr"
                        />
                        {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ایمیل (اختیاری)</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رمز عبور</label>
                        <input
                            {...register('password', { required: 'رمز عبور الزامی است', minLength: { value: 8, message: 'حداقل 8 کاراکتر' } })}
                            type="password"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            dir="ltr"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نقش کاربر</label>
                        <select
                            {...register('role', { required: 'انتخاب نقش الزامی است' })}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">انتخاب کنید...</option>
                            <option value="student">دانش‌آموز</option>
                            <option value="assistant">پشتیبان</option>
                            <option value="admin">مدیر کل</option>
                        </select>
                        {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاریخ انقضای اشتراک (اختیاری)</label>
                        <DatePicker
                            value={expiryDate}
                            onChange={setExpiryDate}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            inputClass="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            containerStyle={{ width: '100%' }}
                            format="YYYY/MM/DD"
                            placeholder="برای انتخاب کلیک کنید"
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
                        >
                            ذخیره کاربر
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreate;
