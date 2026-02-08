
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ShieldCheck, Zap, Wind, Wrench, ChevronLeft, ChevronRight, ZoomIn, Truck, Info } from 'lucide-react';
import { Product } from '../types';
import { SEO } from './SEO';

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
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    setCurrentImgIdx(0);
    setFullscreenImage(null);

    // Lock Body Scroll
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Prevent scroll chaining
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    // Keyboard Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') nextImage();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') prevImage();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') prevImage();
      if (e.key === 'Escape') {
        if (isInfoOpen) setIsInfoOpen(false);
        else onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

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

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, isOpen]);

  if (!product) return null;

  const images = product.images || [product.img];

  const nextImage = () => setCurrentImgIdx(prev => (prev < images.length - 1 ? prev + 1 : prev));
  const prevImage = () => setCurrentImgIdx(prev => (prev > 0 ? prev - 1 : prev));

  // Unified Swipe Handler (Touch & Mouse)
  const handleSwipeEnd = (endX: number, startX: number | null) => {
    if (startX === null) return;
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff < 0) nextImage();
      else prevImage();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging && dragStartX !== null) {
      handleSwipeEnd(e.clientX, dragStartX);
    }
    setIsDragging(false);
    setDragStartX(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragStartX(null);
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
        {isOpen && product && (
          <SEO
            title={product.name}
            description={product.description?.substring(0, 160)}
            image={product.img}
          />
        )}
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md touch-none" onClick={onClose} />

        {/* Content Card - Bento Grid Style */}
        <div className={`relative w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-7xl z-[260] overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'} 
          ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5f7] text-black'} md:rounded-[3rem] shadow-2xl flex flex-col md:grid md:grid-cols-12 md:grid-rows-12 gap-4 p-0 md:p-6 overflow-hidden`}>

          <button onClick={onClose} className="absolute top-6 right-6 z-[280] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-current transition-all shadow-lg active:scale-95">
            <X className="w-6 h-6" />
          </button>

          {/* 1. HERO IMAGE (70% Height on Mobile) */}
          <div className="h-[70%] md:h-full md:col-span-7 md:row-span-12 relative rounded-b-[2.5rem] md:rounded-[2.5rem] overflow-hidden group bg-black shadow-lg order-1 md:order-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] touch-pan-y ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ transform: `translateX(${currentImgIdx * 100}%)` }} // Fixed for RTL: Shift Right to view Left items
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleSwipeEnd(e.changedTouches[0].clientX, touchStart)}
            >
              {images.map((imgUrl, i) => (
                <div
                  key={i}
                  className="w-full h-full shrink-0 flex-none relative"
                  onClick={(e) => {
                    // Only trigger zoom if it wasn't a drag
                    if (!isDragging) setFullscreenImage(imgUrl);
                  }}
                >
                  <img src={imgUrl} alt={`${product.name} ${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" /> {/* pointer-events-none prevents ghost image drag */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Desktop Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className={`hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center bg-white/10 hover:bg-orange-600 backdrop-blur-md transition-all z-[280] ${currentImgIdx === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className={`hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center bg-white/10 hover:bg-orange-600 backdrop-blur-md transition-all z-[280] ${currentImgIdx === images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

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

            <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-white/80 pointer-events-none">
              High_Performance_Gear_v3.0
            </div>

            {/* Desktop Thumbnails (Hidden on Mobile) */}
            <div className="hidden md:flex flex-row-reverse absolute bottom-8 right-8 gap-4 z-[275]">
              {images.map((img, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(i); }} className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${currentImgIdx === i ? 'border-orange-600 scale-110' : 'border-white/20 hover:border-white/60'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* MOBILE & DESKTOP CONTENT WRAPPER */}
          {/* Mobile: Spans 30% height using Flex-1. Desktop: Grid items as before */}
          <div className="flex-1 md:hidden flex flex-col justify-between p-6 pt-0 bg-transparent order-2 relative">

            {/* Mobile Details Overlay */}
            <div className={`absolute inset-0 z-50 p-8 overflow-y-auto transition-all duration-500 ease-out ${isInfoOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0 pointer-events-none'} md:hidden rounded-t-[2.5rem] border-t shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${darkMode ? 'bg-[#0f0f0f] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>
              <div className={`flex justify-between items-center mb-8 border-b pb-4 ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
                <h3 className="text-2xl font-black italic uppercase text-orange-600 tracking-widest">מפרט טכני_</h3>
                <button onClick={() => setIsInfoOpen(false)} className={`p-2 rounded-full transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}><X size={20} /></button>
              </div>
              <div className="space-y-8">
                <p className={`text-lg leading-relaxed font-bold italic ${darkMode ? 'opacity-80' : 'opacity-100'}`} dir="rtl">{product.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "עמידות", val: "MIL-STD", icon: <ShieldCheck className="w-5 h-5" /> },
                    { label: "אספקה", val: "מיידית", icon: <Zap className="w-5 h-5" /> },
                    { label: "אחריות", val: "שנה מלאה", icon: <Wrench className="w-5 h-5" /> },
                    { label: "משלוח", val: "חינם מעל ₪200", icon: <Truck className="w-5 h-5" /> },
                  ].map((spec, i) => (
                    <div key={i} className={`p-4 rounded-2xl border text-center ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                      <div className="text-orange-600 opacity-60 mb-1 flex justify-center">{spec.icon}</div>
                      <div className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'opacity-40' : 'opacity-60'}`}>{spec.label}</div>
                      <div className="text-sm font-black italic">{spec.val}</div>
                    </div>
                  ))}
                </div>

                {/* Mobile Extra Add to Cart Button (at bottom of info) */}
                <button
                  disabled={!product.available}
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); onClose(); }}
                  className={`w-full py-5 rounded-2xl font-black italic text-xl uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 mt-8 mb-4 ${product.available ? 'bg-orange-600 text-black shadow-orange-600/20' : 'bg-white/10 text-white/20'}`}
                >
                  <ShoppingBag size={24} />
                  <span>הוסף לעגלה_</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-[0.9]">{product.name}</h2>
                <div className="text-3xl font-black italic text-orange-600">₪{product.price}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${product.available ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {product.available ? 'IN STOCK' : 'SOLD OUT'}
                </span>
                <button onClick={() => setIsInfoOpen(true)} className="p-2 bg-white/10 rounded-full text-orange-600 hover:bg-white/20 hover:scale-110 transition-all">
                  <Info size={24} />
                </button>
              </div>
            </div>

            <button
              disabled={!product.available}
              onClick={() => { onAddToCart(product); onClose(); }}
              className={`w-full py-5 rounded-[1.5rem] font-black italic text-xl uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${product.available ? 'bg-orange-600 text-black shadow-orange-600/20' : 'bg-white/10 text-white/20'}`}
            >
              {product.available ? 'הוסף לעגלה_' : 'אזל מהמלאי'}
            </button>
          </div>

          {/* DESKTOP ONLY: Info Panels (Hidden on Mobile to enforce 70/30) */}
          {/* 2. HEADER: Title & Price (Top Right) */}
          <div className={`hidden md:flex md:col-span-5 md:row-span-3 rounded-[2.5rem] p-8 flex-col justify-center items-end text-right relative overflow-hidden order-2 md:order-none ${darkMode ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-black/5 shadow-sm'}`}>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-4">{product.name}</h2>
            <div className="flex items-center gap-4">
              <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${product.available ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {product.available ? 'IN STOCK' : 'SOLD OUT'}
              </span>
              <div className="text-4xl md:text-5xl font-black italic text-orange-600 tracking-tighter">₪{product.price}</div>
            </div>
          </div>

          {/* 3. DESCRIPTION (Middle Right) */}
          <div className={`hidden md:block md:col-span-5 md:row-span-4 rounded-[2.5rem] p-8 relative overflow-y-auto pr-2 order-3 md:order-none ${darkMode ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-black/5 shadow-sm'}`}>
            <h3 className="text-[11px] font-black uppercase text-orange-600 tracking-widest mb-4 text-right">סקירה טכנית_</h3>
            <p className={`text-base md:text-lg leading-relaxed font-bold italic text-right ${darkMode ? 'opacity-70' : 'opacity-80'}`} dir="rtl">
              {product.description}
            </p>
            <div className="absolute bottom-6 left-6 opacity-20">
              <ShieldCheck className="w-16 h-16" />
            </div>
          </div>

          {/* 4. SPECS GRID (Bottom Right) */}
          <div className="hidden md:grid md:col-span-5 md:row-span-3 grid-cols-2 gap-3 order-4 md:order-none">
            {[
              { label: "עמידות", val: "MIL-STD", icon: <ShieldCheck className="w-5 h-5" /> },
              { label: "אספקה", val: "מיידית", icon: <Zap className="w-5 h-5" /> },
              { label: "אחריות", val: "שנה מלאה", icon: <Wrench className="w-5 h-5" /> },
              { label: "משלוח", val: "חינם מעל ₪200", icon: <Truck className="w-5 h-5" /> },
            ].map((spec, i) => (
              <div key={i} className={`p-5 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02] ${darkMode ? 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]' : 'bg-white border border-black/5 shadow-sm hover:shadow-md'}`}>
                <div className="text-orange-600 opacity-60 mb-1">{spec.icon}</div>
                <div className="text-[10px] font-black uppercase opacity-40 tracking-wider">{spec.label}</div>
                <div className="text-sm font-black italic">{spec.val}</div>
              </div>
            ))}
          </div>

          {/* 5. ACTION BAR (Bottom Right) */}
          <div className="hidden md:flex md:col-span-5 md:row-span-2 gap-4 order-5 md:order-none">
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
