import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';

interface CookieBannerProps {
  darkMode: boolean;
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ darkMode, onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('carvo_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: 'all' | 'essential') => {
    localStorage.setItem('carvo_cookie_consent', type);
    setIsVisible(false);
    if (type === 'all') {
      // Here you would typically initialize GA4/Pixels if they weren't already in index.html
      console.log('All cookies accepted');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-10 left-4 right-4 md:left-10 md:right-auto z-[220] max-w-full md:max-w-[380px] animate-in fade-in slide-in-from-bottom-full duration-1000 ease-out">
      <div className={`p-6 md:p-8 rounded-[2.5rem] border shadow-2xl backdrop-blur-2xl flex flex-col gap-6 text-right transition-all ${
        darkMode 
          ? 'bg-black/70 border-white/10 text-white' 
          : 'bg-white/75 border-black/5 text-black'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-orange-600/20' : 'bg-orange-600/10'}`}>
            <Shield className="w-5 h-5 text-orange-600" />
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="opacity-40 hover:opacity-100 transition-opacity p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black italic uppercase tracking-tight">פרטיות ונתונים_</h3>
          <p className={`text-[13px] font-bold italic leading-relaxed ${darkMode ? 'text-white/80' : 'text-black/80'}`}>
            אנחנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה והבטיחות שלך. המשך השימוש באתר מהווה הסכמה לתנאים שלנו. 
            <button 
              onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}
              className="text-orange-600 font-black hover:underline mr-1"
            >
              קרא עוד במדיניות הפרטיות.
            </button>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleConsent('all')}
            className="w-full py-4 bg-orange-600 text-white md:text-black font-black italic text-xs uppercase rounded-xl shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>אישור גלובלי</span>
          </button>
          <button 
            onClick={() => handleConsent('essential')}
            className={`w-full py-3 font-black italic text-[10px] uppercase rounded-xl transition-all opacity-60 hover:opacity-100 ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          >
            הכרחיות בלבד_
          </button>
        </div>

        <div className="text-center">
          <p className="text-[9px] font-black uppercase opacity-20 tracking-[0.3em]">
            DATA_PROTECTION_PROTOCOL // ISR_2026
          </p>
        </div>
      </div>
    </div>
  );
};