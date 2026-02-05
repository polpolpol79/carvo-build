
import React from 'react';
import { X, ChevronLeft, LayoutGrid, AlertCircle, Package, MessageCircle, Info, Layers } from 'lucide-react';
import { Category } from '../types';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  categories: Category[];
  activeCategoryHandle: string;
  onCategorySelect: (handle: string) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  darkMode,
  categories,
  activeCategoryHandle,
  onCategorySelect
}) => {
  const staticMenuItems = [
    { id: 'crisis-protocol', label: 'פרוטוקול המשבר_', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'bundles', label: 'חבילות עלית_', icon: <Package className="w-5 h-5" /> },
    { id: 'faq', label: 'שאלות ותשובות_', icon: <Info className="w-5 h-5" /> },
  ];

  const handleNav = (id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleCategoryClick = (handle: string) => {
    onCategorySelect(handle);
    onClose();
    setTimeout(() => {
      const el = document.getElementById('showroom');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[250] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-black/60 backdrop-blur-sm`}
        onClick={onClose}
      />
      <div className={`fixed top-0 bottom-0 right-0 w-full max-w-[300px] z-[260] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
        hyper-glass border-l border-white/10 flex flex-col shadow-2xl backdrop-blur-2xl text-right`}>

        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <button onClick={onClose} className={`p-2 rounded-full hover:bg-white/10 transition-colors ${darkMode ? 'text-white' : 'text-black'}`}>
            <X className="w-6 h-6" />
          </button>
          <div className={`text-[10px] font-black uppercase tracking-widest italic ${darkMode ? 'opacity-70' : 'opacity-50'}`}>NAVIGATION_MENU</div>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8 no-scrollbar">
          {/* Categories Section */}
          <div className="space-y-3">
            <div className={`flex items-center justify-end gap-2 px-4 mb-4 ${darkMode ? 'opacity-60' : 'opacity-40'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest italic">קטלוג מוצרים_</span>
              <LayoutGrid size={12} />
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all border ${activeCategoryHandle === cat.id
                    ? 'bg-orange-600/15 border-orange-600/30'
                    : 'bg-white/5 border-transparent hover:border-white/10'
                  } text-right`}
              >
                <ChevronLeft className={`w-4 h-4 text-orange-600 ${activeCategoryHandle === cat.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'} transition-all`} />
                <span className={`text-base font-black italic tracking-tighter ${activeCategoryHandle === cat.id ? 'text-orange-600' : (darkMode ? 'text-white' : 'text-black')}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          {/* Static Links Section */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className={`flex items-center justify-end gap-2 px-4 mb-4 ${darkMode ? 'opacity-60' : 'opacity-40'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest italic">מידע ופרוטוקול_</span>
              <Layers size={12} />
            </div>
            {staticMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="w-full group flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10 text-right"
              >
                <ChevronLeft className="w-4 h-4 text-orange-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                <div className="flex items-center gap-4">
                  <span className={`text-base font-black italic tracking-tighter ${darkMode ? 'text-white' : 'text-black'}`}>{item.label}</span>
                  <div className="text-orange-600 opacity-60">{item.icon}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <a
              href="https://wa.me/972553087708"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-green-600/10 border border-green-600/20 text-green-500 hover:bg-green-600 hover:text-white transition-all"
            >
              <ChevronLeft size={16} />
              <div className="flex items-center gap-4">
                <span className="text-lg font-black italic tracking-tighter">דברו איתנו_</span>
                <MessageCircle size={20} />
              </div>
            </a>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/20 text-center shrink-0">
          <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${darkMode ? 'opacity-40' : 'opacity-20'}`}>
            CARVO_OS // NAV_PROTOCOL // 2026
          </p>
        </div>
      </div>
    </>
  );
};
