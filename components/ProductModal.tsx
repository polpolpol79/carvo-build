
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ShieldCheck, Zap, Wind, Wrench, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  darkMode: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, darkMode }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentImgIdx(0);
    setFullscreenImage(null);

    // Dynamic Schema Injection
    if (isOpen && product) {
      const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images || [product.img],
        "description": product.description,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": "CARVO"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "ILS",
          "price": product.price,
          "availability": product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };

      const scriptId = 'product-schema-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const images = product.images || [product.img];

  const handleSwipe = (endX: number) => {
    if (touchStart === null) return;
    const diff = touchStart - endX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      // REVERTED to original: Swiping LEFT (diff > 0) moves FORWARD
      if (diff > 0 && currentImgIdx < images.length - 1) {
        setCurrentImgIdx(prev => prev + 1);
      } else if (diff < 0 && currentImgIdx > 0) {
        setCurrentImgIdx(prev => prev - 1);
      }
    }
    setTouchStart(null);
  };

  return (
    <>
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-all duration-300 animate-in fade-in zoom-in"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            onClick={() => setFullscreenImage(null)}
            className="absolute top-8 left-8 p-3 bg-white/10 rounded-full hover:bg-orange-600 transition-all z-[410] text-white"
          >
            <X size={32} />
          </button>
          <img 
            src={fullscreenImage} 
            alt="Product Zoom" 
            className="max-w-[95%] max-h-[85vh] object-contain shadow-2xl rounded-2xl"
          />
          <div className="absolute bottom-10 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">
            TACTICAL_VIEWER // HIGH_RES_MODE
          </div>
        </div>
      )}

      <div 
        className={`fixed inset-0 z-[250] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-black/85 backdrop-blur-md`}
        onClick={onClose}
      />
      
      <div className={`fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[850px] z-[260] transition-all duration-500 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'} 
        ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'} border border-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 z-[280] p-2.5 bg-black/50 backdrop-blur-md rounded-2xl text-white md:hidden shadow-xl">
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full md:w-1/2 h-64 md:h-full bg-black border-b md:border-b-0 md:border-l border-white/10 overflow-hidden group/gallery">
          <div 
            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] touch-pan-y"
            style={{ transform: `translateX(${currentImgIdx * 100}%)` }}
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleSwipe(e.changedTouches[0].clientX)}
          >
            {images.map((imgUrl, i) => (
              <div 
                key={i} 
                className="w-full h-full shrink-0 flex-none relative cursor-zoom-in"
                onClick={() => setFullscreenImage(imgUrl)}
              >
                <img src={imgUrl} alt={`${product.name} ${i}`} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/gallery:opacity-100 transition-opacity bg-black/40 p-4 rounded-full backdrop-blur-md pointer-events-none">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[275]">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIdx ? 'w-6 bg-orange-600' : 'w-1.5 bg-white/20'} cursor-pointer`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(i); }}
                />
              ))}
            </div>
          )}

          {images.length > 1 && (
            <>
              {/* Corrected Arrows for RTL: Right goes Back (p-1), Left goes Forward (p+1) */}
              <button 
                onClick={(e) => { e.stopPropagation(); currentImgIdx > 0 && setCurrentImgIdx(prev => prev - 1); }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all z-[275] ${currentImgIdx === 0 ? 'pointer-events-none opacity-0' : ''}`}
              >
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); currentImgIdx < images.length - 1 && setCurrentImgIdx(prev => prev + 1); }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all z-[275] ${currentImgIdx === images.length - 1 ? 'pointer-events-none opacity-0' : ''}`}
              >
                <ChevronLeft size={20} />
              </button>
            </>
          )}

          <div className="absolute bottom-10 right-10 text-right z-10 hidden md:block pointer-events-none">
             <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-1 italic">Product Model_V1</div>
             <h2 className="text-4xl font-black italic tracking-tighter text-white leading-none uppercase">{product.name}</h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden p-6 md:p-14 text-right">
          <div className="hidden md:flex justify-between items-start mb-6 md:mb-10">
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-2xl transition-all">
              <X className="w-7 h-7" />
            </button>
            <div className="text-[11px] font-black uppercase opacity-30 tracking-widest">Protocol Specs // 2050</div>
          </div>

          <div className="md:hidden mb-4">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">{product.name}</h2>
            <div className="text-[9px] font-black uppercase opacity-40 mt-1 tracking-widest">Product Catalog // ISR_2026</div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 md:space-y-10 no-scrollbar pr-1">
            <section>
              <h3 className="text-[12px] md:text-[11px] font-black uppercase text-orange-600 tracking-widest mb-2 md:mb-4">תיאור המערכת_</h3>
              <p className={`text-[14px] md:text-base leading-relaxed font-bold italic ${darkMode ? 'opacity-80 md:opacity-70' : 'opacity-90 md:opacity-80'}`}>
                {product.description || "מערכת חילוץ טקטית מתקדמת המבוססת על טכנולוגיית CARVO 2050."}
              </p>
            </section>

            <section className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { label: "עמידות בתקן", val: "IP68 MIL", icon: <ShieldCheck className="w-5 h-5"/> },
                { label: "מהירות תגובה", val: "<60s", icon: <Zap className="w-5 h-5"/> },
                { label: "תאימות רכב", val: "Universal", icon: <Wrench className="w-5 h-5"/> },
                { label: "מערכת קירור", val: "Active AI", icon: <Wind className="w-5 h-5"/> },
              ].map((spec, i) => (
                <div key={i} className={`p-4 md:p-5 rounded-2xl md:rounded-3xl hyper-glass border-white/10 ${!darkMode && 'bg-neutral-50 border-black/5 shadow-sm'}`}>
                   <div className="text-orange-600 opacity-60 md:opacity-40 mb-2 md:mb-3">{spec.icon}</div>
                   <div className="text-[10px] md:text-[9px] font-black uppercase opacity-60 md:opacity-40 mb-1">{spec.label}</div>
                   <div className="text-[13px] md:text-sm font-black italic text-orange-600">{spec.val}</div>
                </div>
              ))}
            </section>
          </div>

          <div className="pt-6 md:pt-10 border-t border-orange-600/10 flex items-center justify-between gap-6 md:gap-8">
            <div className="flex flex-col">
              <span className="text-[11px] md:text-[11px] font-black uppercase opacity-60 md:opacity-40 italic mb-1">מחיר השקעה</span>
              <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-orange-600">₪{product.price}</span>
            </div>
            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              className="flex-1 py-4 md:py-6 bg-orange-600 text-black font-black italic text-sm md:text-base uppercase rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 md:gap-4 z-[280]"
            >
              <span>הוסף לעגלה</span>
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
