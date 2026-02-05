import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sun, Moon, Search, Menu, X, ChevronDown } from 'lucide-react';
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
            className={`hidden md:flex fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-out px-8 py-4 items-center justify-between pointer-events-none
        ${scrolled ? 'py-3 backdrop-blur-xl' : 'bg-transparent'}`}
        >
            {/* Left: Logo - Scaled Down */}
            <div className="flex items-center pointer-events-auto cursor-pointer scale-75 origin-left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <CarvoLogo size="lg" />
            </div>

            {/* Center: Navigation Links - Compact */}
            <nav className={`pointer-events-auto flex items-center gap-6 px-8 py-3 rounded-full transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md text-white' : ''}`}>
                {allLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => handleInteraction(link)}
                        className={`text-sm md:text-base font-black italic uppercase tracking-widest hover:text-orange-600 transition-all relative group ${activeCategory === link.id ? 'text-orange-600 opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    >
                        {link.label}
                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-600 transition-all duration-300 ${activeCategory === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </button>
                ))}
            </nav>

            {/* Right: Actions - Scaled Up */}
            <div className="pointer-events-auto flex items-center gap-8">
                <button onClick={toggleDarkMode} className="opacity-60 hover:opacity-100 transition-all hover:text-orange-600">
                    {darkMode ? <Sun size={28} /> : <Moon size={28} />}
                </button>
                <div className="h-8 w-px bg-current opacity-20" />
                <button onClick={openCart} className="relative opacity-60 hover:opacity-100 transition-all hover:text-orange-600 group">
                    <ShoppingBag size={28} />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-600 text-black text-xs font-bold flex items-center justify-center rounded-full border-2 border-black">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};
