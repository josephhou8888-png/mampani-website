import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '../IconComponents';

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-24 right-6 z-50">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="back-to-top-button w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/50"
                    aria-label="Go to top"
                >
                    <ArrowUpIcon className="w-8 h-8" />
                </button>
            )}
        </div>
    );
};

export default BackToTopButton;