import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('خطایی در ثبت‌نام رخ داد.');
            }
        }
    };

    const password = watch("password");

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">ثبت‌نام دانش‌آموز جدید</h2>

            {serverError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{serverError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                        نام و نام خانوادگی
                    </label>
                    <input
                        id="name"
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                        {...register("name", { required: "نام و نام خانوادگی الزامی است" })}
                    />
                    {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
                </div>

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
                        {...register("password", { required: "رمز عبور الزامی است", minLength: { value: 8, message: "رمز عبور باید حداقل ۸ کاراکتر باشد" } })}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password_confirmation">
                        تکرار رمز عبور
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        dir="ltr"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password_confirmation ? 'border-red-500' : ''}`}
                        {...register("password_confirmation", {
                            required: "تکرار رمز عبور الزامی است",
                            validate: value => value === password || "رمز عبور و تکرار آن مطابقت ندارند"
                        })}
                    />
                    {errors.password_confirmation && <p className="text-red-500 text-xs italic mt-1">{errors.password_confirmation.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
                    >
                        ثبت‌نام
                    </button>
                </div>

                <div className="text-center mt-4">
                    <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        قبلاً ثبت‌نام کرده‌اید؟ وارد شوید
                    </Link>
                </div>
            </form>
        </div>
    );
}
