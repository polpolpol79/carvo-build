import React from 'react';
import { AlertTriangle, Clock, Briefcase, Truck, Wrench, Zap, Sun, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';
import { ThinMotion } from './ThinMotion';

interface CrisisProtocolSectionProps {
    darkMode: boolean;
}

export const CrisisProtocolSection: React.FC<CrisisProtocolSectionProps> = ({ darkMode }) => {
    return (
        <section id="crisis-protocol" className="relative z-10 py-8 md:py-24 px-6 max-w-7xl mx-auto text-right">
            <ThinMotion>
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-2 md:gap-4 mb-8 leading-none">
                        <span className="text-xl md:text-5xl font-black italic uppercase text-red-600 tracking-tighter">מעבר לסיכון חיים עצום,</span>
                        <span className={`text-xl md:text-5xl font-black italic uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-black'}`}>זה גם עולה לך ביוקר.</span>
                    </div>
                    <h2 className="text-3xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4 flex flex-wrap items-center justify-start gap-x-2 md:gap-x-6"><span className="text-red-600">המשבר</span><span className="opacity-40">VS</span><span className="text-orange-600">CARVO</span></h2>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic">ANALYSIS_PROTOCOL_2026</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className={`p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${darkMode ? 'bg-red-950/20 border-red-900/40 hover:border-red-600/60 hover:shadow-[0_0_50px_rgba(220,38,38,0.1)]' : 'bg-red-50 border-red-200 shadow-xl hover:shadow-2xl'}`}>
                        <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-black"><AlertTriangle size={18} /></div><h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">כשנתקעים... (הסיוט)</h3></div>
                        <ul className="space-y-4 mb-8">
                            {[{ label: "3.5 שעות המתנה", detail: "סיכון MAX!", icon: <Clock size={16} /> }, { label: "₪500", detail: "אובדן יום עבודה", icon: <Briefcase size={16} /> }, { label: "₪500", detail: "עלות גרירה ממוצעת", icon: <Truck size={16} /> }, { label: "₪500 - ₪4,000", detail: "עלויות תיקון במוסך", icon: <Wrench size={16} /> }].map((item, i) => (
                                <li key={i} className="flex items-center justify-between border-b border-red-600/10 pb-6"><div className="flex items-center gap-4"><span className="text-red-600 opacity-60 scale-125">{item.icon}</span><span className="text-sm md:text-2xl font-black italic uppercase">{item.label}</span></div><span className="text-[11px] md:text-lg font-black uppercase opacity-40">{item.detail}</span></li>
                            ))}
                        </ul>
                        <div className="pt-6 border-t border-red-600/20 flex justify-between items-end"><div className="text-xl font-black uppercase italic text-red-600">עלות לאירוע_</div><div className="text-2xl md:text-4xl font-black italic text-red-600 tracking-tighter">₪1,500 - ₪5,000</div></div>
                    </div>
                    <div className={`p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${darkMode ? 'hyper-glass border-orange-600/30 hover:border-orange-600 hover:shadow-[0_0_50px_rgba(234,88,12,0.2)]' : 'bg-white border-orange-200 shadow-2xl hover:shadow-[0_0_40px_rgba(234,88,12,0.15)]'}`}>
                        <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-500"><Zap size={18} /></div><h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">פרוטוקול CARVO</h3></div>
                        <ul className="space-y-4 mb-8">
                            {[{ label: "4 דקות", detail: "וחזרת לכביש בבטחה", icon: <Zap size={16} /> }, { label: "אין זמן אבוד", detail: "המשך יום כרגיל", icon: <Sun size={16} /> }, { label: "עצמאות מלאה", detail: "הפתרון תמיד בבגאז'", icon: <ShieldCheck size={16} /> }, { label: "אפס הפתעות", detail: "מערכת מוכנה לכל תרחיש", icon: <CheckCircle2 size={16} /> }].map((item, i) => (
                                <li key={i} className="flex items-center justify-between border-b border-orange-600/10 pb-6"><div className="flex items-center gap-4"><span className="text-orange-600 opacity-60 scale-125">{item.icon}</span><span className="text-sm md:text-2xl font-black italic uppercase">{item.label}</span></div><span className="text-[11px] md:text-lg font-black uppercase opacity-40">{item.detail}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 flex justify-center"><button onClick={() => document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-4 px-12 py-5 bg-orange-600 text-black rounded-2xl font-black italic uppercase tracking-widest text-sm hover:scale-105 active:scale-95 shadow-2xl shadow-orange-600/20 transition-all"><span>גש לחבילה משתלמת</span><ChevronLeft size={20} /></button></div>
            </ThinMotion>
        </section>
    );
};
