import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import WeeklyResourcesSection from './WeeklyResourcesSection';
import Features from './Features';
import StackingFeatures from './StackingFeatures';
import Stats from './Stats';
import Footer from './Footer';
import MouseSpotlight from './MouseSpotlight';
import BackgroundPattern from './BackgroundPattern';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans relative">
            <BackgroundPattern />
            <MouseSpotlight />
            <div className="relative z-10">
                <Navbar />
                <Hero />
                <WeeklyResourcesSection />
                <StackingFeatures />
                <Stats />
                <Features />
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
