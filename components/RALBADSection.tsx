import React, { useState, useEffect, useRef } from 'react';
import { Car, Bike, Footprints, Zap, Skull, Clock, ShieldAlert, Truck, Download } from 'lucide-react';
import { ThinMotion } from './ThinMotion';

interface RALBADSectionProps {
    darkMode: boolean;
}

export const RALBADSection: React.FC<RALBADSectionProps> = ({ darkMode }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsAnimating(true); }, { threshold: 0.2 });
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const vehicleData = [
        { type: "רכבים פרטיים", count: 12450, icon: <Car size={18} />, color: "bg-red-600" },
        { type: "אופנועים וקטנועים", count: 3820, icon: <Bike size={18} />, color: "bg-red-500" },
        { type: "הולכי רגל (נפגעים)", count: 2480, icon: <Footprints size={18} />, color: "bg-red-700" },
        { type: "אופניים וקורקינטים", count: 2120, icon: <Zap size={18} />, color: "bg-red-400" }
    ];

    const criticalStats = [
        { label: "מקרי מוות ביום", val: "1.3", icon: <Skull size={20} /> },
        { label: "השעות הקטלניות", val: "15:00-16:00", icon: <Clock size={20} /> },
        { label: "עמידה בשוליים", val: "25%", icon: <ShieldAlert size={20} /> },
        { label: "המתנה לגרר", val: '3.5 שעות', icon: <Truck size={20} /> }
    ];

    return (
        <section id="ralbad-stats" ref={sectionRef} className="relative z-10 py-8 md:py-20 px-6 max-w-7xl mx-auto text-right">
            <ThinMotion>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-r-4 border-red-600 pr-6">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                            <div className="text-[11px] font-black uppercase text-red-600 tracking-[0.2em] italic flex items-center gap-2">
                                <ShieldAlert size={16} /> RALBAD_2025
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-8xl font-black italic uppercase leading-none tracking-tighter">הסטטיסטיקה <span className="text-red-600">המדממת</span></h2>
                    </div>
                </div>
            </ThinMotion>
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold italic mb-6 pr-2">
                <span className="opacity-70">נתונים שנלקחו הישר מדוח הרשות הלאומית לבטיחות בדרכים</span>
                <a href="https://www.gov.il/BlobFolder/reports/2025_summary_ralbad/he/summry_ralbad_25.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-black italic uppercase tracking-tighter text-[10px] shadow-lg shadow-red-600/30 hover:bg-red-500 hover:scale-105 transition-all">
                    <Download size={14} /><span>להורדת הדוח המלא</span>
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-10">
                {vehicleData.map((veh, i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex justify-between items-center text-[12px] md:text-xl font-black italic uppercase tracking-widest opacity-60">
                            <div className="flex items-center gap-4"><span className="text-red-600">{veh.icon}</span><span>{veh.type}</span></div>
                            <div className="text-red-600 text-2xl">{isAnimating ? veh.count.toLocaleString() : 0}</div>
                        </div>
                        <div className={`h-2 md:h-6 w-full rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}><div className={`h-full rounded-full transition-all duration-[1500ms] ${veh.color}`} style={{ width: isAnimating ? `${(veh.count / 13500) * 100}%` : '0%' }} /></div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 mb-8">
                {criticalStats.map((stat, i) => (
                    <div key={i} className={`p-4 md:p-8 rounded-[2rem] border-2 transition-all duration-500 group cursor-default relative overflow-hidden ${darkMode ? 'hyper-glass border-white/10 hover:border-red-600/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'bg-white border-black/5 shadow-md hover:shadow-xl'}`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="text-red-600 mb-6 opacity-80 scale-150 origin-right transition-transform duration-500 group-hover:scale-[1.8] group-hover:rotate-12">{stat.icon}</div>
                        <div className="text-[9px] md:text-lg font-black uppercase tracking-widest opacity-40 mb-2 transition-opacity group-hover:opacity-100">{stat.label}</div>
                        <div className="text-xl md:text-5xl font-black italic text-red-600 leading-none">{stat.val}</div>
                    </div>
                ))}
            </div>
            <p className="text-[10px] md:text-xl font-bold italic opacity-40 text-right pr-2">* (נתונים מאומתים: כ-25% מהתאונות הקטלניות בדרכים בין-עירוניות מתרחשות בשולי הכביש עקב עצירה לא בטוחה)</p>
        </section>
    );
};
