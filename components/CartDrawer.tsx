
import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ExternalLink } from 'lucide-react';
import { CartItem } from '../types';
import { trackBeginCheckout } from '../lib/analytics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  darkMode: boolean;
  onOpenTerms: () => void;
  onCheckout: () => void;
}

const PaymentIcons = ({ darkMode }: { darkMode: boolean }) => (
  <div className="flex items-center justify-center gap-4 opacity-90 transition-all duration-500 py-2">
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 w-auto" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 w-auto" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className={`h-4 w-auto ${darkMode ? 'invert' : ''}`} />
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className={`h-4 w-auto ${darkMode ? 'invert' : ''}`} />
    <div className="flex items-center gap-1 bg-[#00D2D2] text-white px-1.5 py-0.5 rounded-md text-[7px] font-black italic tracking-tighter shadow-sm">bit</div>
  </div>
);

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, darkMode, onOpenTerms, onCheckout }) => {
  const [isTermsAccepted, setIsTermsAccepted] = React.useState(false);
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Track analytics
    trackBeginCheckout(items, total);

    const cartString = items.map(item => `${item.product.id.split('/').pop()}:${item.quantity}`).join(',');
    window.location.href = `https://shop.carvo.co.il/cart/${cartString}`;
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-black/60 backdrop-blur-sm`}
        onClick={onClose}
      />

      <div className={`fixed top-0 bottom-0 left-0 w-full max-w-[300px] md:max-w-md z-[210] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        hyper-glass border-r border-white/10 flex flex-col shadow-2xl backdrop-blur-2xl`}>

        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className={`text-lg md:text-xl font-black italic tracking-tighter uppercase ${darkMode ? 'text-white' : 'text-black'}`}>עגלת קניות_</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full hover:bg-white/10 transition-colors ${darkMode ? 'text-white' : 'text-black'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className={`w-12 h-12 stroke-[1px] ${darkMode ? 'text-white/40' : 'text-black/40'}`} />
              <p className={`text-[12px] font-black uppercase tracking-widest ${darkMode ? 'text-white/60' : 'text-black/60'}`}>העגלה שלך ריקה_</p>
              <button onClick={onClose} className="text-orange-600 text-[11px] font-black uppercase tracking-widest hover:underline">חזור לקטלוג</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 group transition-all hover:bg-white/10">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0">
                  <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 text-right overflow-hidden">
                  <h3 className={`text-[12px] md:text-[11px] font-black italic uppercase leading-tight mb-1 truncate ${darkMode ? 'text-white' : 'text-black'}`}>{item.product.name}</h3>
                  <div className="text-[14px] md:text-[15px] font-black text-orange-600 mb-2">₪{item.product.price}</div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 bg-black/20 rounded-lg p-1">
                      <button onClick={() => onUpdateQuantity(item.productId, 1)} className={`p-1 hover:text-orange-600 ${darkMode ? 'text-white' : 'text-black'}`}><Plus className="w-3.5 h-3.5" /></button>
                      <span className={`text-[11px] md:text-[12px] font-bold w-4 text-center ${darkMode ? 'text-white' : 'text-black'}`}>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.productId, -1)} className={`p-1 hover:text-orange-600 ${darkMode ? 'text-white' : 'text-black'}`}><Minus className="w-3.5 h-3.5" /></button>
                    </div>
                    <button onClick={() => onRemove(item.productId)} className="text-red-600/60 hover:text-red-600 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 md:p-8 border-t border-white/10 space-y-4 md:space-y-6 bg-black/20">
            <div className="flex justify-between items-end">
              <span className={`text-[10px] md:text-[11px] font-black uppercase italic ${darkMode ? 'text-white/60' : 'text-black/60'}`}>סיכום ביניים</span>
              <span className="text-xl md:text-3xl font-black italic tracking-tighter text-orange-600">₪{total.toLocaleString()}</span>
            </div>

            <div className="space-y-4">
              {/* Terms Checkbox */}
              <div className="flex items-center gap-3 pr-1">
                <div onClick={() => setIsTermsAccepted(!isTermsAccepted)} className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all ${isTermsAccepted ? 'bg-orange-600 border-orange-600' : (darkMode ? 'border-white/30 hover:border-white/60' : 'border-black/30 hover:border-black/60')}`}>
                  {isTermsAccepted && <div className="w-4 h-4 text-black"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                </div>
                <div className={`text-[11px] font-bold ${darkMode ? 'text-white/70' : 'text-black/70'}`}>
                  אני מאשר את <button onClick={(e) => { e.preventDefault(); onOpenTerms(); }} className="underline hover:text-orange-600 transition-colors">תנאי השימוש</button>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isTermsAccepted) onCheckout();
                }}
                disabled={!isTermsAccepted}
                className={`w-full py-3.5 md:py-4 font-black italic text-sm uppercase rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 ${isTermsAccepted ? 'bg-orange-600 text-black shadow-orange-600/20 hover:scale-[1.02] active:scale-95' : 'bg-gray-500/20 text-gray-500 cursor-not-allowed opacity-50'}`}
              >
                <span>מעבר לתשלום מאובטח</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <PaymentIcons darkMode={darkMode} />
            </div>

            <p className={`text-[9px] md:text-[10px] text-center font-bold italic ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
              SECURE_GATEWAY_PROTOCOL // SHOPIFY
            </p>
          </div>
        )}
      </div>
    </>
  );
};
