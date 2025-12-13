import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaClipboardList, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const features = [
    {
        title: "گزارش روزانه هوشمند",
        description: "عملکرد خود را با جزئیات کامل ثبت کنید. سیستم ما به صورت خودکار نقاط قوت و ضعف شما را شناسایی می‌کند.",
        icon: <FaClipboardList className="w-12 h-12 text-white" />,
        color: "bg-gradient-to-br from-blue-500 to-blue-700",
        image: "https://placehold.co/600x400/3b82f6/ffffff?text=Daily+Log" // Placeholder, ideally use real screenshots
    },
    {
        title: "برنامه‌ریزی تعاملی",
        description: "برنامه مطالعاتی خود را به سادگی Drag & Drop تنظیم کنید. انعطاف‌پذیری کامل برای تغییرات ناگهانی.",
        icon: <FaCalendarAlt className="w-12 h-12 text-white" />,
        color: "bg-gradient-to-br from-green-500 to-green-700",
        image: "https://placehold.co/600x400/22c55e/ffffff?text=Study+Plan"
    },
    {
        title: "تحلیل‌های پیشرفته",
        description: "با نمودارهای دقیق، روند پیشرفت خود را رصد کنید. ما به شما می‌گوییم کجای مسیر هستید.",
        icon: <FaChartLine className="w-12 h-12 text-white" />,
        color: "bg-gradient-to-br from-purple-500 to-purple-700",
        image: "https://placehold.co/600x400/a855f7/ffffff?text=Analytics"
    }
];

const Card = ({ title, description, icon, color, i, progress, range, targetScale }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className={`flex flex-col relative -top-[25%] h-[500px] w-[1000px] rounded-3xl p-10 origin-top ${color} shadow-2xl`}
            >
                <div className="flex h-full gap-10">
                    <div className="w-[40%] flex flex-col justify-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            {icon}
                        </div>
                        <h2 className="text-4xl font-bold text-white">{title}</h2>
                        <p className="text-lg text-white/90 leading-relaxed">{description}</p>
                    </div>

                    <div className="relative w-[60%] h-full rounded-2xl overflow-hidden border-4 border-white/10">
                        <motion.div className="w-full h-full" style={{ scale: imageScale }}>
                            <div className="w-full h-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/50 text-2xl font-bold">
                                تصویر ویژگی
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const StackingFeatures = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <section ref={container} className="relative mt-[5vh] mb-[5vh]" dir="rtl">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">تجربه کاربری متفاوت</h2>
            </div>

            {features.map((feature, i) => {
                const targetScale = 1 - ((features.length - i) * 0.05);
                return (
                    <Card
                        key={i}
                        i={i}
                        {...feature}
                        progress={scrollYProgress}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                    />
                );
            })}
        </section>
    );
};

export default StackingFeatures;
