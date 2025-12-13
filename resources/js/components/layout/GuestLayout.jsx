import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900" dir="rtl">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پلتفرم مدیریت کنکور</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">سیستم جامع مشاوره و برنامه‌ریزی</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
