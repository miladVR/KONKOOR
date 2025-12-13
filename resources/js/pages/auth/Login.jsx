import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        console.log('[Login] Form submitted with data:', data);
        try {
            console.log('[Login] Calling login function...');
            await login(data);
            console.log('[Login] Login successful, navigating to dashboard...');
            navigate('/dashboard');
        } catch (error) {
            console.error('[Login] Login failed with error:', error);
            if (error.response?.data?.errors?.mobile) {
                setServerError(error.response.data.errors.mobile[0]);
            } else {
                setServerError('خطایی در ورود رخ داد. لطفاً دوباره تلاش کنید.');
            }
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">ورود به حساب کاربری</h2>

            {serverError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{serverError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="mobile">
                        شماره موبایل
                    </label>
                    <input
                        id="mobile"
                        type="text"
                        dir="ltr"
                        placeholder="09123456789"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.mobile ? 'border-red-500' : ''}`}
                        {...register("mobile", {
                            required: "شماره موبایل الزامی است",
                            pattern: {
                                value: /^09[0-9]{9}$/,
                                message: "فرمت شماره موبایل صحیح نیست"
                            }
                        })}
                    />
                    {errors.mobile && <p className="text-red-500 text-xs italic mt-1">{errors.mobile.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                        رمز عبور
                    </label>
                    <input
                        id="password"
                        type="password"
                        dir="ltr"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                        {...register("password", { required: "رمز عبور الزامی است" })}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
                    >
                        ورود
                    </button>
                </div>

                <div className="text-center mt-4">
                    <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        حساب کاربری ندارید؟ ثبت‌نام کنید
                    </Link>
                </div>
            </form>
        </div>
    );
}
