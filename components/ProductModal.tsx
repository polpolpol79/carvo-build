
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ShieldCheck, Zap, Wind, Wrench, ChevronLeft, ChevronRight, ZoomIn, Truck } from 'lucide-react';
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
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/98 backdrop-blur-3xl transition-all duration-300 animate-in fade-in zoom-in"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-8 left-8 p-4 bg-white/10 rounded-full hover:bg-orange-600 transition-all z-[410] text-white"
          >
            <X size={32} />
          </button>
          <img
            src={fullscreenImage}
            alt="Product Zoom"
            className="max-w-[95%] max-h-[85vh] object-contain shadow-2xl rounded-3xl"
          />
        </div>
      )}

      {/* Main Modal Container - Full Screen Overlay */}
      <div
        className={`fixed inset-0 z-[250] transition-all duration-500 flex items-center justify-center ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

        {/* Content Card - Bento Grid Style */}
        <div className={`relative w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-7xl z-[260] overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'} 
          ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5f7] text-black'} md:rounded-[3rem] shadow-2xl flex flex-col md:grid md:grid-cols-12 md:grid-rows-12 gap-4 p-4 md:p-6 overflow-y-auto md:overflow-hidden`}>

          <button onClick={onClose} className="absolute top-6 right-6 z-[280] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-current transition-all shadow-lg active:scale-95">
            <X className="w-6 h-6" />
          </button>

          {/* 1. HERO IMAGE (Left Side on Desktop) - Spans 7 columns, full height */}
          <div className="md:col-span-7 md:row-span-12 relative rounded-[2.5rem] overflow-hidden group bg-black shadow-lg h-[50vh] md:h-full order-1 md:order-none">
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
                  <img src={imgUrl} alt={`${product.name} ${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[275]">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIdx ? 'w-8 bg-orange-600' : 'w-2 bg-white/30'} cursor-pointer`}
                    onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(i); }}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-white/80">
              High_Performance_Gear_v3.0
            </div>
          </div>

          {/* 2. HEADER: Title & Price (Top Right) - Spans 5 columns */}
          <div className={`md:col-span-5 md:row-span-3 rounded-[2.5rem] p-8 flex flex-col justify-center items-end text-right relative overflow-hidden order-2 md:order-none ${darkMode ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-black/5 shadow-sm'}`}>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-4">{product.name}</h2>
            <div className="flex items-center gap-4">
              <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${product.available ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {product.available ? 'IN STOCK' : 'SOLD OUT'}
              </span>
              <div className="text-4xl md:text-5xl font-black italic text-orange-600 tracking-tighter">₪{product.price}</div>
            </div>
          </div>

          {/* 3. DESCRIPTION (Middle Right) - Spans 5 columns */}
          <div className={`md:col-span-5 md:row-span-4 rounded-[2.5rem] p-8 relative overflow-hidden order-3 md:order-none ${darkMode ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-black/5 shadow-sm'}`}>
            <h3 className="text-[11px] font-black uppercase text-orange-600 tracking-widest mb-4 text-right">סקירה טכנית_</h3>
            <p className={`text-base md:text-lg leading-relaxed font-bold italic text-right ${darkMode ? 'opacity-70' : 'opacity-80'}`} dir="rtl">
              {product.description}
            </p>
            <div className="absolute bottom-6 left-6 opacity-20">
              <ShieldCheck className="w-16 h-16" />
            </div>
          </div>

          {/* 4. SPECS GRID (Bottom Right) - Spans 5 columns */}
          <div className="md:col-span-5 md:row-span-3 grid grid-cols-2 gap-3 order-4 md:order-none">
            {[
              { label: "עמידות", val: "MIL-STD", icon: <ShieldCheck className="w-5 h-5" /> },
              { label: "אספקה", val: "מיידית", icon: <Zap className="w-5 h-5" /> },
              { label: "אחריות", val: "שנה מלאה", icon: <Wrench className="w-5 h-5" /> },
              { label: "משלוח", val: "חינם", icon: <Truck className="w-5 h-5" /> },
            ].map((spec, i) => (
              <div key={i} className={`p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02] ${darkMode ? 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]' : 'bg-white border border-black/5 shadow-sm hover:shadow-md'}`}>
                <div className="text-orange-600 opacity-60 mb-1">{spec.icon}</div>
                <div className="text-[10px] font-black uppercase opacity-40 tracking-wider">{spec.label}</div>
                <div className="text-sm font-black italic">{spec.val}</div>
              </div>
            ))}
          </div>

          {/* 5. ACTION BAR (Bottom Right) - Spans 5 columns */}
          <div className="md:col-span-5 md:row-span-2 flex gap-4 order-5 md:order-none">
            <button
              disabled={!product.available}
              onClick={() => { onAddToCart(product); onClose(); }}
              className={`flex-1 h-full rounded-[2rem] font-black italic text-xl uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 ${product.available ? 'bg-orange-600 text-black shadow-orange-600/20 hover:bg-orange-500' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
            >
              {product.available ? (
                <>
                  <span>הוסף לעגלה</span>
                  <ShoppingBag className="w-6 h-6" />
                </>
              ) : (
                'אזל מהמלאי'
              )}
            </button>
            <div className={`w-24 h-full rounded-[2rem] flex items-center justify-center ${darkMode ? 'bg-white/[0.05] border border-white/5' : 'bg-white border border-black/5 shadow-sm'}`}>
              <div className="text-center">
                <div className="text-[9px] font-black uppercase opacity-40">RATINGS</div>
                <div className="text-lg font-black italic">4.9/5</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
