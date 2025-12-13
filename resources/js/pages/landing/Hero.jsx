import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative pt-24 pb-12 lg:pt-40 lg:pb-28 overflow-hidden" dir="rtl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-900" />

            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Column 1: Text Content (Right side in RTL) */}
                    <div className="text-center lg:text-right order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-loose mb-6">
                                <span className="block mb-2 text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    مسیر موفقیت خود را بسازید
                                </span>
                                کنکور با <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">برنامه‌ریزی هوشمند</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                با سامانه جامع کنکور پلاس، زیر نظر <span className="font-bold text-gray-900 dark:text-gray-100">استاد مجید قنبری</span>، مسیر مطالعه خود را مدیریت کنید و با تحلیل‌های دقیق، هر روز بهتر از دیروز باشید.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300">
                                    شروع رایگان
                                </Link>
                                <Link to="/login" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg px-8 py-4 rounded-xl font-bold shadow-sm hover:shadow-md transition-all duration-300">
                                    ورود به پنل
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center justify-center lg:justify-start gap-8 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span>۱۰۰۰+ دانش‌آموز فعال</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    <span>مشاوره تخصصی</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 2: Profile Image (Left side in RTL) */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Decorative background behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-[2rem] rotate-6 transform scale-105 blur-2xl opacity-40"></div>

                            <div className="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2.5rem] p-6 shadow-2xl">
                                <div className="relative rounded-[2rem] overflow-hidden group">
                                    <img
                                        src="/images/majid_ghanbari.jpg"
                                        alt="مجید قنبری"
                                        className="w-full max-w-sm md:max-w-md object-cover transform transition-transform duration-700 group-hover:scale-105"
                                        style={{ maxHeight: '500px' }}
                                    />

                                    {/* Overlay Content on Image */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent p-8 pt-20 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h2 className="text-3xl font-bold mb-1">مجید قنبری</h2>
                                        <p className="text-blue-300 font-medium text-lg mb-2">مشاور رتبه‌های برتر</p>
                                        <p className="text-sm text-gray-300 opacity-90 italic">"کیفیت گفتنی نیست، شنیدنی است"</p>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-blue-600">۱۰+</span>
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">سال تجربه</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
