
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
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 ${
      darkMode 
        ? 'bg-[#404040] bg-gradient-to-br from-[#4a4a4a] via-[#404040] to-[#363636]' 
        : 'bg-[#cccccc]'
    }`}>
      
      {/* Scanline Effect - Very Subtle */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-[scan_15s_linear_infinite]" />
      </div>

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
