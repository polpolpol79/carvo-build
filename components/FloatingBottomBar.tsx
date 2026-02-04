
import React from 'react';
import { Shield, FileText, Accessibility, Truck, Mail, MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../store.config';

interface FloatingBottomBarProps {
  darkMode: boolean;
  onOpenInfo: (type: string) => void;
}

export const FloatingBottomBar: React.FC<FloatingBottomBarProps> = ({ darkMode, onOpenInfo }) => {
  const navItems = [
    { id: 'terms', label: 'תקנון', icon: <FileText className="w-5 h-5" /> },
    { id: 'privacy', label: 'פרטיות', icon: <Shield className="w-5 h-5" /> },
    { id: 'shipping', label: 'משלוחים', icon: <Truck className="w-5 h-5" /> },
    { id: 'accessibility', label: 'נגישות', icon: <Accessibility className="w-5 h-5" /> },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5 text-green-500" />,
      isExternal: true,
      link: 'https://wa.me/972553087708'
    },
  ];

  return (
    <div className="relative z-[150] px-2 md:px-12 py-12 flex justify-center w-full overflow-hidden">
      <div className={`flex items-center justify-center gap-0.5 md:gap-4 p-1.5 md:p-4 rounded-[2rem] md:rounded-full hyper-glass border-white/10 shadow-2xl transition-all duration-500 w-full max-w-[96%] md:max-w-fit`}>

        <a
          href={`mailto:${STORE_CONFIG.email.support}`}
          className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 bg-orange-600 text-black rounded-2xl hover:scale-105 active:scale-95 transition-all group shadow-lg shadow-orange-600/20 shrink-0"
        >
          <div className="flex flex-col items-end">
            <div className="text-[11px] md:text-xl font-black italic tracking-tighter leading-none">{STORE_CONFIG.name}●</div>
            <div className="text-[8px] md:text-[10px] font-black uppercase opacity-70 md:opacity-50 tracking-tighter">SUPPORT</div>
          </div>
          <Mail className="w-4 h-4 md:w-6 md:h-6" />
        </a>

        <div className="w-px h-8 md:h-16 bg-white/10 mx-1.5 md:mx-8 shrink-0" />

        <div className="flex items-center justify-around flex-1 md:flex-none md:gap-8">
          {navItems.map((item) => {
            const content = (
              <>
                <div className={`${item.id === 'whatsapp' ? 'opacity-100' : 'text-orange-600 opacity-80 md:opacity-50 group-hover:opacity-100'} group-hover:scale-110 transition-all duration-300`}>
                  {/* Clone element to override size prop if needed, or just wrap in div with size class */}
                  <div className="w-5 h-5 md:w-8 md:h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                    {item.icon}
                  </div>
                </div>
                <span className="text-[10px] md:text-lg font-black uppercase tracking-tight md:tracking-widest opacity-80 md:opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </>
            );

            const commonClasses = "flex flex-col items-center gap-1.5 px-1.5 md:px-6 py-2 md:py-4 rounded-xl hover:bg-white/5 transition-all group min-w-[52px] md:min-w-[100px]";

            if (item.isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={commonClasses}
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onOpenInfo(item.id)}
                className={commonClasses}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
