import React from 'react';

const BackgroundPattern = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full opacity-[0.03] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-gray-600 dark:text-gray-400" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
        </div>
    );
};

export default BackgroundPattern;
