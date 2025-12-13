import React from 'react';
import { motion } from 'framer-motion';
import { FaClipboardList, FaCalendarAlt, FaChartLine, FaUserGraduate } from 'react-icons/fa';

const features = [
    {
        icon: <FaClipboardList className="w-8 h-8 text-blue-500" />,
        title: "گزارش روزانه دقیق",
        description: "ساعات مطالعه و تعداد تست‌های خود را برای هر درس به صورت جداگانه ثبت کنید و کیفیت مطالعه خود را ارزیابی کنید.",
        color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
        icon: <FaCalendarAlt className="w-8 h-8 text-green-500" />,
        title: "برنامه‌ریزی هفتگی",
        description: "برنامه مطالعاتی خود را برای هفته آینده تنظیم کنید و پیشرفت خود را نسبت به برنامه بسنجید.",
        color: "bg-green-50 dark:bg-green-900/20"
    },
    {
        icon: <FaChartLine className="w-8 h-8 text-purple-500" />,
        title: "تحلیل و نمودار",
        description: "با نمودارهای پیشرفته، روند پیشرفت خود را در طول زمان مشاهده کنید و نقاط ضعف و قوت خود را بشناسید.",
        color: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
        icon: <FaUserGraduate className="w-8 h-8 text-orange-500" />,
        title: "مشاوره هوشمند",
        description: "دسترسی به پنل مشاوران و دریافت بازخورد بر اساس عملکرد ثبت شده شما در سیستم.",
        color: "bg-orange-50 dark:bg-orange-900/20"
    }
];

const Features = () => {
    return (
        <section id="features" className="py-12 relative" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        امکانات سامانه
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        هر آنچه برای موفقیت در کنکور نیاز دارید، در یک پلتفرم یکپارچه.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className={`${feature.color} p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300`}
                        >
                            <div className="mb-6 bg-white dark:bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
