
import React, { useState, useEffect } from 'react';

interface BlueprintBackgroundProps {
  darkMode: boolean;
}

const TacticalGear: React.FC<{ size: number, className?: string, blur?: string }> = ({ size, className = "", blur = "blur(12px)" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: blur }}
  >
    <path
      d="M50 35L54 20H46L50 35ZM65 38.5L75 26L68 21L60 35.5ZM77.5 50L92.5 50V42L77.5 45V55L92.5 50ZM65 61.5L80 72L85 65L70 56.5ZM50 65L46 80H54L50 65ZM35 61.5L20 72L15 65L30 56.5ZM22.5 50L7.5 50V58L22.5 55V45L7.5 50ZM35 38.5L25 26L32 21L40 35.5Z"
      stroke="currentColor"
      strokeWidth="0.8"
    />
    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="0.8" />
    <path d="M40 50H60M50 40V60" stroke="currentColor" strokeWidth="0.5" />
    <rect x="30" y="30" width="40" height="40" stroke="currentColor" strokeWidth="0.4" transform="rotate(45 50 50)" />
  </svg>
);

export const BlueprintBackground: React.FC<BlueprintBackgroundProps> = ({ darkMode }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Clean Gradient Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-[#f0f0f0]'}`} />

      {/* Subtle Premium Glows */}
      <div className={`absolute inset-0 opacity-30 transition-opacity duration-1000 ${darkMode ? 'opacity-30' : 'opacity-20'}`}>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-900/5 blur-[120px]" />
      </div>

      {/* Very Subtle Grid Pattern */}
      <div
        className={`absolute inset-0 opacity-[0.03] pointer-events-none ${darkMode ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]'}`}
        style={{ backgroundSize: '40px 40px' }}
      />

      {/* Large Tactical Gear - Bottom Left (Seamless & Blurred) */}
      <div className={`absolute left-[-15%] bottom-[-15%] opacity-[0.04] animate-[spin_80s_linear_infinite] ${darkMode ? 'text-white' : 'text-black'}`}>
        <TacticalGear size={900} blur="blur(16px)" />
      </div>

      {/* Small Tactical Gear - Top Right Center (Blurred & Discrete) */}
      <div className={`absolute right-[25%] top-[15%] opacity-[0.03] animate-[spin_40s_linear_infinite_reverse] ${darkMode ? 'text-orange-600' : 'text-black'}`}>
        <TacticalGear size={300} blur="blur(8px)" />
      </div>

      {/* Grid Overlay - Extra Faint */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '60px 60px', color: darkMode ? 'white' : 'black' }} />

      {/* Technical HUD Details */}
      <div className="absolute bottom-10 left-10 flex flex-col items-start gap-1 text-[11px] md:text-[7px] font-black opacity-[0.25] md:opacity-[0.15] hidden md:flex uppercase tracking-[0.4em]">
        <span>[VECTOR_TRACKING: {coords.x}x{coords.y}]</span>
        <span>[ENGINE_STATUS: NOMINAL]</span>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};
