import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../hooks/useAuth';
import { FaCheckCircle, FaCrown } from 'react-icons/fa';

const SubscriptionPlans = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const data = await paymentService.getPackages();
            setPackages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (pkg) => {
        try {
            const response = await paymentService.purchase(pkg.id);
            // Redirect to bank (the response usually contains the payment link)
            // Zarinpal returns { action: "https://..." }
            if (response.action) {
                window.location.href = response.action;
            }
        } catch (error) {
            alert('خطا در اتصال به درگاه پرداخت');
            console.error(error);
        }
    };

    if (loading) return <div className="text-center p-10">در حال بارگذاری...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    <span className="block">انتخاب طرح اشتراک</span>
                    <span className="block text-purple-600 mt-2">سرمایه‌گذاری روی آینده تحصیلی</span>
                </h2>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    با خرید اشتراک، به تمام امکانات پیشرفته کنکور پلتفرم دسترسی خواهید داشت.
                </p>
            </div>

            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 flex flex-col transition hover:shadow-lg transform hover:-translate-y-1">
                        <div className="p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center justify-center gap-2">
                                {pkg.name === 'طلایی' && <FaCrown className="text-yellow-500" />}
                                {pkg.name}
                            </h3>
                            <p className="mt-4 text-center">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                    {parseInt(pkg.price).toLocaleString()}
                                </span>
                                <span className="text-base font-medium text-gray-500 dark:text-gray-400 mr-1">تومان</span>
                            </p>
                            <p className="mt-1 text-sm text-gray-500 text-center">{pkg.duration_days} روز اعتبار</p>

                            <button
                                onClick={() => handlePurchase(pkg)}
                                className={`mt-8 block w-full bg-purple-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-purple-700 transition`}
                            >
                                خرید و فعال‌سازی
                            </button>
                        </div>
                        <div className="pt-6 pb-8 px-6 flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white tracking-wide uppercase">امکانات</h4>
                            <ul className="mt-6 space-y-4">
                                {pkg.description?.split('\n').map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <FaCheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="mr-3 text-base text-gray-500 dark:text-gray-400">{feature}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPlans;
