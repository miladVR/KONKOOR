import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-blue-400 mb-4">کنکور پلاس</h3>
                        <p className="text-gray-400 leading-relaxed">
                            سامانه جامع برنامه‌ریزی و مشاوره تحصیلی کنکور. ما به شما کمک می‌کنیم تا با برنامه‌ریزی دقیق و تحلیل عملکرد، به اهداف تحصیلی خود برسید.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">دسترسی سریع</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/login" className="hover:text-white transition">ورود به پنل</Link></li>
                            <li><Link to="/register" className="hover:text-white transition">ثبت‌نام</Link></li>
                            <li><a href="#features" className="hover:text-white transition">امکانات</a></li>
                            <li><a href="#" className="hover:text-white transition">تماس با ما</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">تماس با ما</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>ایمیل: info@konkoorplus.ir</li>
                            <li>تلفن: 021-12345678</li>
                            <li>آدرس: تهران، میدان انقلاب</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} کنکور پلاس. تمامی حقوق محفوظ است.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
