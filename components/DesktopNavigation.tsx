import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sun, Moon, Search, Menu, X, ChevronDown, User } from 'lucide-react';
import { Category } from '../types';

interface DesktopNavigationProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    cartCount: number;
    openCart: () => void;
    categories: Category[];
    activeCategory: string;
    onCategorySelect: (handle: string) => void;
}

const CarvoLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'massive' | 'hero' }> = ({ size = 'md' }) => {
    const sizes = {
        sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl', massive: 'text-[10vw] md:text-[8vw]', hero: 'text-[12vw] md:text-[10rem]'
    };
    const oSizes = {
        sm: 'w-[0.75em] h-[0.75em] border-[3px]', md: 'w-[0.75em] h-[0.75em] border-[4px]', lg: 'w-[0.75em] h-[0.75em] border-[6px]', massive: 'w-[0.75em] h-[0.75em] border-[1.2vw]', hero: 'w-[0.75em] h-[0.75em] border-[1.2rem]'
    };
    return (
        <div dir="ltr" className={`massive-logo ${sizes[size]} flex items-center leading-none tracking-[-0.05em] select-none inline-flex hero-stabilizer`}>
            <span className="block">CARV</span>
            <div className={`relative ${oSizes[size]} rounded-full border-orange-600 flex items-center justify-center ml-[0.05em]`}>
                <div className="w-[0.2em] h-[0.2em] bg-orange-600 rounded-full" />
            </div>
        </div>
    );
};

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
    darkMode,
    toggleDarkMode,
    cartCount,
    openCart,
    categories,
    activeCategory,
    onCategorySelect
}) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Combine static links with dynamic categories
    const allLinks = [
        { label: 'השואורום |', id: 'showroom', type: 'scroll' },
        ...categories.map(c => ({ label: c.label, id: c.id, type: 'category' })),
        { label: '| נתונים', id: 'crisis-protocol', type: 'scroll' },
    ];

    const handleInteraction = (link: { label: string, id: string, type: string }) => {
        if (link.type === 'scroll') {
            const el = document.getElementById(link.id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            onCategorySelect(link.id);
            const el = document.getElementById('showroom');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header
            className={`hidden md:flex fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-out py-6 justify-center pointer-events-none
        ${scrolled ? 'py-4' : ''}`}
        >
            <div className="w-full max-w-[98%] px-8 flex items-center justify-between">
                {/* Left: Logo - Anchored & Scaled Up */}
                <div className="flex items-center pointer-events-auto cursor-pointer origin-left transition-transform hover:scale-105" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <CarvoLogo size="lg" />
                </div>

                {/* Center: Navigation Links - Floating Pill Style */}
                <nav className={`pointer-events-auto flex items-center gap-8 px-10 py-4 rounded-full transition-all duration-500 shadow-2xl
                    ${!darkMode ? 'hyper-glass border-white/10 bg-white/50 backdrop-blur-2xl saturate-150 text-black border border-white/40' : (scrolled ? 'bg-black/80 backdrop-blur-2xl saturate-150 text-white border border-white/5' : 'bg-transparent text-white')}
                `}>
                    {allLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleInteraction(link)}
                            className={`text-base font-black italic uppercase tracking-widest hover:text-orange-600 transition-all relative group ${activeCategory === link.id ? 'text-orange-600 opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        >
                            {link.label}
                            <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-600 transition-all duration-300 ${activeCategory === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </button>
                    ))}
                </nav>

                {/* Right: Actions - Anchored & Scaled Up */}
                <div className="pointer-events-auto flex items-center gap-6">
                    <button onClick={toggleDarkMode} className="p-3 bg-white/5 rounded-full hover:bg-orange-600/20 backdrop-blur-sm transition-all text-current hover:text-orange-600 hover:scale-110 shadow-lg">
                        {darkMode ? <Sun size={32} /> : <Moon size={32} />}
                    </button>

                    <a
                        href="https://shop.carvo.co.il/account/login?locale=he"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 rounded-full hover:bg-orange-600/20 backdrop-blur-sm transition-all text-current hover:text-orange-600 hover:scale-110 shadow-lg group relative"
                        title="התחברות / אזור אישי"
                    >
                        <User size={32} />
                    </a>

                    <button onClick={openCart} className="p-3 bg-white/5 rounded-full hover:bg-orange-600/20 backdrop-blur-sm transition-all text-current hover:text-orange-600 hover:scale-110 shadow-lg group relative">
                        <ShoppingBag size={32} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-7 h-7 bg-orange-600 text-black text-xs font-bold flex items-center justify-center rounded-full border-2 border-black">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
