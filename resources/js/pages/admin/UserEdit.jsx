import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

const UserEdit = () => {
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(true);
    const [expiryDate, setExpiryDate] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await adminService.getUser(id);
                const user = response.data;
                setValue('name', user.name);
                setValue('mobile', user.mobile);
                setValue('email', user.email);
                if (user.roles && user.roles.length > 0) {
                    setValue('role', user.roles[0].name);
                }
                if (user.subscription_expires_at) {
                    setExpiryDate(new Date(user.subscription_expires_at));
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setServerError('خطا در دریافت اطلاعات کاربر');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                subscription_expires_at: expiryDate
                    ? (expiryDate instanceof DateObject ? expiryDate.toDate() : new Date(expiryDate)).toISOString().split('T')[0]
                    : null
            };
            await adminService.updateUser(id, formattedData);
            navigate('/admin/users');
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('خطا در ویرایش کاربر. لطفاً دوباره تلاش کنید.');
            }
        }
    };

    if (loading) return <div className="text-center p-8">در حال بارگذاری...</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8" dir="rtl">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">ویرایش کاربر</h1>

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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رمز عبور جدید (اختیاری)</label>
                        <input
                            {...register('password', { minLength: { value: 8, message: 'حداقل 8 کاراکتر' } })}
                            type="password"
                            placeholder="فقط در صورت تغییر وارد کنید"
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
                            بروزرسانی کاربر
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;
