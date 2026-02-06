import React from 'react';

export const CarvoLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'massive' | 'hero' }> = ({ size = 'md' }) => {
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
