
import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only enable on desktop
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);

            // Check if hovering over clickable element
            const target = e.target as HTMLElement;
            const isClickable = target.closest('button') || target.closest('a') || target.closest('.cursor-pointer') || target.tagName === 'BUTTON' || target.tagName === 'A';
            setIsHovering(!!isClickable);
        };

        const onMouseLeave = () => setIsVisible(false);
        const onMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('mouseenter', onMouseEnter);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
            {/* Main Dot */}
            <div
                className="absolute w-3 h-3 bg-orange-600 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out mix-blend-difference"
                style={{ left: position.x, top: position.y, transform: `translate(-50%, -50%) scale(${isHovering ? 0.5 : 1})` }}
            />

            {/* Trailing Ring */}
            <div
                className={`absolute border border-orange-600 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHovering ? 'w-12 h-12 bg-orange-600/20 border-transparent' : 'w-8 h-8 opacity-50'}`}
                style={{ left: position.x, top: position.y }}
            />
        </div>
    );
};
