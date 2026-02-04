
import React, { useState, useEffect, useRef } from 'react';

interface ThinMotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ThinMotion: React.FC<ThinMotionProps> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px' // מפעיל את האנימציה בשלב מוקדם יותר כדי להבטיח נראות תקינה במחשב (דסקטופ)
      }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] cubic-bezier-custom transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 blur-0' 
          : 'opacity-0 translate-y-16 scale-[0.96] blur-[4px]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
