import React from 'react';
import { ChevronLeft, ArrowDown } from 'lucide-react';
import { ThinMotion } from './ThinMotion';
import { TacticalGridBackground } from './TacticalGridBackground';
import { CarvoLogo } from './CarvoLogo';

interface HeroSectionProps {
    darkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ darkMode }) => {
    return (
        <header className="relative min-h-[80vh] md:min-h-screen py-8 md:py-0 flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-20 z-10 text-center md:text-right overflow-hidden">
            <TacticalGridBackground darkMode={darkMode} />
            <div className="hidden md:block absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

            <ThinMotion className="relative z-20 flex flex-col items-center md:items-start hero-stabilizer w-full max-w-7xl mx-auto">
                <div className={`text-[10px] md:text-sm font-black uppercase tracking-[1.2em] md:tracking-[0.5em] mb-6 md:mb-4 opacity-30 select-none ${darkMode ? 'text-white' : 'text-black'}`}>[AUTHENTIC_BRAND_CORE]</div>
                <div className="mb-6 md:mb-10 opacity-90 hover:opacity-100 transition-opacity duration-700 md:hidden"><CarvoLogo size="hero" /></div>
                <div className="hidden md:block mb-8"><CarvoLogo size="lg" /></div>

                <h1 className="text-4xl md:text-[6rem] font-black italic uppercase leading-[0.9] tracking-[-0.04em] mb-10 md:mb-12 max-w-4xl">
                    מתקדמים<br /> <span className="text-orange-600">ל-CARVO</span> לעתיד <br />
                    <span className="opacity-80 text-3xl md:text-[3.5rem] tracking-tight font-bold">חסכוני ובטוח יותר_</span>
                </h1>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center w-full md:w-auto px-4 md:px-0">
                    <button onClick={() => document.getElementById('showroom')?.scrollIntoView({ behavior: 'smooth' })} className={`w-full md:w-auto justify-center flex items-center gap-4 md:gap-6 px-8 md:px-12 py-4 md:py-6 bg-orange-600 text-black font-black italic uppercase tracking-widest text-base md:text-xl rounded-full shadow-[0_0_40px_rgba(234,88,12,0.3)] active:scale-95 hover:scale-105 hover:shadow-[0_0_80px_rgba(234,88,12,0.5)] transition-all duration-300 group hover:-translate-y-1`}>
                        <span>לקטלוג המלא</span>
                        <ChevronLeft size={20} className="md:w-6 md:h-6 group-hover:-translate-x-2 transition-transform duration-300" />
                    </button>
                    <button onClick={() => document.getElementById('ralbad-stats')?.scrollIntoView({ behavior: 'smooth' })} className={`w-full md:w-auto justify-center flex items-center gap-4 md:gap-6 px-8 md:px-12 py-4 md:py-6 hyper-glass border border-red-600/30 text-red-600 font-black italic uppercase tracking-widest text-base md:text-xl rounded-full shadow-[0_0_40px_rgba(220,38,38,0.1)] active:scale-95 hover:scale-105 hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] hover:border-red-600 transition-all duration-300 group`}>
                        <span>גלה את הנתונים</span>
                        <ArrowDown size={20} className="md:w-6 md:h-6 group-hover:translate-y-2 transition-transform duration-500 ease-out" />
                    </button>
                </div>
            </ThinMotion>

            {/* Desktop Visual Decoration */}
            <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-600/5 to-transparent pointer-events-none items-center justify-center opacity-30">
                <div className="w-[500px] h-[500px] border border-orange-600/20 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center">
                    <div className="w-[300px] h-[300px] border border-orange-600/40 rounded-full animate-[spin_40s_linear_infinite_reverse] border-dashed"></div>
                </div>
            </div>
        </header>
    );
};
