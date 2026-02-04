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

    const navLinks = [
        { label: 'השואורום', id: 'showroom' },
        { label: 'נתוני בטיחות', id: 'safety-data' },
        { label: 'חבילות עלית', id: 'bundles' },
        { label: 'שאלות נפוצות', id: 'faq' }
    ];

    const handleScrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            className={`hidden md:flex fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out px-10 py-6 items-center justify-between pointer-events-none
        ${scrolled ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}
        >
            {/* Left: Logo */}
            <div className="flex items-center pointer-events-auto cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <CarvoLogo size="md" />
            </div>

            {/* Center: Navigation Links */}
            <nav className={`pointer-events-auto flex items-center gap-10 px-8 py-3 rounded-full transition-all duration-500 ${scrolled ? '' : 'hyper-glass border border-white/10 shadow-2xl'}`}>
                {navLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => handleScrollTo(link.id)}
                        className="text-sm font-black italic uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-orange-600 transition-all relative group"
                    >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover:w-full" />
                    </button>
                ))}
            </nav>

            {/* Right: Actions */}
            <div className="pointer-events-auto flex items-center gap-6">
                <button onClick={toggleDarkMode} className="opacity-60 hover:opacity-100 transition-all hover:text-orange-600">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="h-6 w-px bg-current opacity-20" />
                <button onClick={openCart} className="relative opacity-60 hover:opacity-100 transition-all hover:text-orange-600 group">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-600 text-black text-[9px] font-bold flex items-center justify-center rounded-full border border-black">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};
