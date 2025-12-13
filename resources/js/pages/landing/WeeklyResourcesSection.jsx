import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarWeek, FaCheck, FaBook, FaUserTie } from 'react-icons/fa';

const WeeklyResourcesSection = () => {
    return (
        <section className="relative py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden" dir="rtl">
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/20 dark:bg-purple-900/20 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        برنامه‌ریزی <span className="text-blue-600 dark:text-blue-400">هفتگی تخصصی</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        هر هفته منابع مطالعاتی و آزمون‌های استاندارد سال‌های قبل، پس از تایید مشاور، در پنل شما قرار می‌گیرد
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left: Feature List */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <FaUserTie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">تایید مشاور حرفه‌ای</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    تمامی منابع توسط مشاور با تجربه شما بررسی و تایید می‌شود
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <FaBook className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">منابع استانداردسال‌های قبل</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    دسترسی به کتاب‌ها، جزوات، ویدیوها و آزمون‌های سال‌های گذشته
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <FaCalendarWeek className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">برنامه‌ریزی هفتگی منظم</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    هر هفته برنامه جدید بر اساس پیشرفت شما در پنل قرار می‌گیرد
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                <FaCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">پیگیری پیشرفت</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    علامت‌گذاری تکمیل منابع و افزودن یادداشت‌های شخصی
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">برنامه این هفته</h4>
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold px-3 py-1 rounded-full">
                                    هفته ۱
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Resource Item 1 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-medium text-sm">فصل ۱ - ریاضی (جزوه کنکور ۱۴۰۲)</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF • تایید شده</p>
                                    </div>
                                </div>

                                {/* Resource Item 2 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full mt-0.5"></div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-medium text-sm">تست جامع فیزیک - کنکور ۱۴۰۱</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">آزمون آنلاین • 40 سوال</p>
                                    </div>
                                </div>

                                {/* Resource Item 3 */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full mt-0.5"></div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-medium text-sm">ویدیو آموزشی شیمی - الکان‌ها</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ویدیو • 45 دقیقه</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">پیشرفت این هفته:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">1 از 3</span>
                                </div>
                                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '33%' }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WeeklyResourcesSection;
