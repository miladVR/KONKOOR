import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine, FaClock, FaTrophy } from 'react-icons/fa';

const stats = [
    { icon: <FaUsers className="w-8 h-8" />, value: "۱۰۰۰+", label: "دانش‌آموز فعال" },
    { icon: <FaChartLine className="w-8 h-8" />, value: "۸۵%", label: "نرخ موفقیت" },
    { icon: <FaClock className="w-8 h-8" />, value: "۵۰۰۰+", label: "ساعت مطالعه" },
    { icon: <FaTrophy className="w-8 h-8" />, value: "۲۰۰+", label: "قبولی‌های برتر" }
];

const Stats = () => {
    return (
        <section className="py-12 relative" dir="rtl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/20 to-transparent dark:via-gray-800/20" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                    >
                        اعتماد هزاران دانش‌آموز
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        آمار واقعی کاربران ما
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="text-blue-600 dark:text-blue-400 flex justify-center mb-3">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
