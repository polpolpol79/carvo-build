import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, ShieldCheck, Lock, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutPageProps {
    cart: CartItem[];
    total: number;
    onBack: () => void;
    onProceed: (formData: any) => void;
    darkMode: boolean;
    onOpenTerms: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, total, onBack, onProceed, darkMode, onOpenTerms }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        street: '',
        apt: '',
        notes: ''
    });
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName) newErrors.firstName = 'שדה חובה';
        if (!formData.lastName) newErrors.lastName = 'שדה חובה';
        if (!formData.email) newErrors.email = 'שדה חובה';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'כתובת לא תקינה';
        if (!formData.phone) newErrors.phone = 'שדה חובה';
        if (!formData.city) newErrors.city = 'שדה חובה';
        if (!formData.street) newErrors.street = 'שדה חובה';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm() && isTermsAccepted) {
            onProceed(formData);
        }
    };

    return (
        <div className={`min-h-screen pt-24 pb-12 px-4 md:px-8 ${darkMode ? 'text-white' : 'text-black'}`} dir="rtl">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <button
                        onClick={onBack}
                        className={`p-3 rounded-full transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">קופה מאובטחת_</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">

                    {/* Order Summary (Right Column on Desktop) */}
                    <div className="order-2 lg:order-1 space-y-6">
                        <div className={`p-6 md:p-8 rounded-[2rem] border ${darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/5'} sticky top-24`}>
                            <h2 className="text-xl font-black italic uppercase tracking-widest mb-6 flex items-center gap-3">
                                <ShoppingBag className="text-orange-600" />
                                סיכום הזמנה ({cart.length})
                            </h2>

                            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                {cart.map((item) => (
                                    <div key={item.productId} className="flex gap-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 transition-colors">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                                            <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold italic uppercase">{item.product.name}</h3>
                                                <span className="text-orange-600 font-black italic">₪{item.product.price * item.quantity}</span>
                                            </div>
                                            <div className="text-xs opacity-60 mt-1">כמות: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-dashed border-gray-500/30">
                                <div className="flex justify-between text-sm opacity-60">
                                    <span>סכום ביניים</span>
                                    <span>₪{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm opacity-60">
                                    <span>משלוח</span>
                                    <span className="text-green-500 font-bold">חינם</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black italic mt-4">
                                    <span>סה"כ לתשלום</span>
                                    <span className="text-orange-600">₪{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-2 justify-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                <Lock size={12} />
                                Secure SSL Encryption
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form (Left Column on Desktop) */}
                    <div className="order-1 lg:order-2">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Customer Details */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <CheckCircle className="text-orange-600" size={24} />
                                    <h2 className="text-2xl font-black italic uppercase tracking-tight">פרטים אישיים_</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold opacity-70">שם פרטי</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 outline-none transition-all ${errors.firstName ? 'border-red-500' : (darkMode ? 'border-white/10 focus:border-orange-600' : 'border-black/10 focus:border-orange-600')}`}
                                            placeholder="ישראל"
                                        />
                                        {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold opacity-70">שם משפחה</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 outline-none transition-all ${errors.lastName ? 'border-red-500' : (darkMode ? 'border-white/10 focus:border-orange-600' : 'border-black/10 focus:border-orange-600')}`}
                                            placeholder="ישראלי"
                                        />
                                        {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold opacity-70">טלפון נייד</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 outline-none transition-all ${errors.phone ? 'border-red-500' : (darkMode ? 'border-white/10 focus:border-orange-600' : 'border-black/10 focus:border-orange-600')}`}
                                            placeholder="050-0000000"
                                        />
                                        {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold opacity-70">אימייל לקבלה</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 outline-none transition-all ${errors.email ? 'border-red-500' : (darkMode ? 'border-white/10 focus:border-orange-600' : 'border-black/10 focus:border-orange-600')}`}
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Details */}
                            <section className="space-y-6 pt-8 border-t border-gray-500/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <CheckCircle className="text-orange-600" size={24} />
                                    <h2 className="text-2xl font-black italic uppercase tracking-tight">כתובת למשלוח_</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold opacity-70">עיר / ישוב</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 outline-none transition-all ${errors.city ? 'border-red-500' : (darkMode ? 'border-white/10 focus:border-orange-600' : 'border-black/10 focus:border-orange-600')}`}
                                        />
                                        {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold opacity-70">רחוב ומספר</label>
                                        <input
                                            type="text"
                                            value={formData.street}
                                            onChange={e => setFormData({ ...formData, street: e.target.value })}
                                            className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 outline-none transition-all ${errors.street ? 'border-red-500' : (darkMode ? 'border-white/10 focus:border-orange-600' : 'border-black/10 focus:border-orange-600')}`}
                                        />
                                        {errors.street && <span className="text-xs text-red-500">{errors.street}</span>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold opacity-70">הערות לשליח (אופציונלי)</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className={`w-full p-4 rounded-xl font-bold bg-transparent border-2 outline-none transition-all h-24 resize-none ${darkMode ? 'border-white/10 focus:border-orange-600' : 'border-black/10 focus:border-orange-600'}`}
                                        placeholder="קוד לבניין, להשאיר ליד הדלת..."
                                    />
                                </div>
                            </section>

                            {/* Terms & Payment */}
                            <section className="pt-8 border-t border-gray-500/20 space-y-6">
                                <div className="bg-orange-600/10 border border-orange-600/20 p-4 rounded-2xl flex items-start gap-4">
                                    <AlertCircle className="text-orange-600 shrink-0 mt-1" />
                                    <div className="text-sm">
                                        <p className="font-bold mb-1">שים לב:</p>
                                        <p className="opacity-80">לחיצה על "המשך לתשלום מאובטח" תעביר אותך למערכת הסליקה החיצונית להשלמת העסקה.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsTermsAccepted(!isTermsAccepted)}>
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isTermsAccepted ? 'bg-orange-600 border-orange-600' : 'border-gray-500 group-hover:border-orange-600'}`}>
                                        {isTermsAccepted && <CheckCircle size={16} className="text-black" />}
                                    </div>
                                    <span className="text-sm font-bold">
                                        אני מאשר את <span className="underline text-orange-600 hover:text-orange-500 z-10 relative" onClick={(e) => { e.stopPropagation(); onOpenTerms(); }}>תנאי השימוש</span> וקראתי את מדיניות הפרטיות.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isTermsAccepted}
                                    className={`w-full py-5 rounded-2xl font-black italic uppercase text-xl tracking-widest shadow-xl flex items-center justify-center gap-4 transition-all ${isTermsAccepted ? 'bg-orange-600 text-black hover:bg-orange-500 hover:scale-[1.01] active:scale-95' : 'bg-gray-500/20 text-gray-500 cursor-not-allowed opacity-50'}`}
                                >
                                    <CreditCard size={24} />
                                    המשך לתשלום מאובטח
                                </button>

                                <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6" />
                                </div>
                            </section>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
