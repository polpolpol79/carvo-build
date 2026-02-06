import React from 'react';
import { Users, Star } from 'lucide-react';
import { ThinMotion } from './ThinMotion';

interface TestimonialsSectionProps {
    darkMode: boolean;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ darkMode }) => {
    return (
        <section id="testimonials" className="relative z-10 py-10 md:py-16 px-6 max-w-7xl mx-auto text-right">
            <ThinMotion>
                <div className="mb-8">
                    <div className="text-[11px] font-black uppercase text-orange-600 tracking-[0.4em] mb-1 italic flex items-center justify-start gap-2">
                        <Users size={18} /> COMMUNITY_VOICE
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">תגובות מהשטח</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[
                        { name: "יוסי מזרחי", rating: 5, text: "בתור אחד שעבד שנים בתחום הרכב וההובלות, חיכיתי לפתרון כזה נגיש לכולם." },
                        { name: "איתן כ.", rating: 3.5, text: "המשאבה עושה קצת רעש, אבל בסוף זה פתרון זול וחכם שעושה את העבודה." },
                        { name: "מירב דהן", rating: 5, text: "זה מסוג המוצרים שקונים פעם אחת ומתפללים לא להשתמש – אבל כשצריך, הוא מציל." },
                        { name: "דניאל לוי", rating: 4.5, text: "קניתי 3 ערכות ושמתי לכל הילדים ברכב. אין מצב שהם נוסעים בלי זה." },
                        { name: "קובי אברהם", rating: 4, text: "כלי ב-600 ש״ח שחסך לי כבר אלפי שקלים. לא מבין איך לא כולם מכירים את זה." },
                        { name: "רוני שפירא", rating: 4, text: "פתר לנו לא מעט בעיות בדרך וחסך לי בענק את הגרר ותיקון ." }
                    ].map((item, i) => (
                        <div key={i} className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 group hover:-translate-y-1 ${darkMode ? 'hyper-glass border-white/10 hover:border-orange-600/30 hover:shadow-[0_0_30px_rgba(234,88,12,0.1)]' : 'bg-white border-black/5 shadow-md hover:shadow-xl'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, starI) => {
                                        const starValue = starI + 1;
                                        if (item.rating >= starValue) {
                                            return <Star key={starI} size={14} className="fill-orange-600 text-orange-600" />;
                                        } else if (item.rating >= starValue - 0.5) {
                                            return (
                                                <div key={starI} className="relative">
                                                    <Star size={14} className="text-orange-600 opacity-20" />
                                                    <div className="absolute inset-0 overflow-hidden w-[50%] pointer-events-none">
                                                        <Star size={14} className="fill-orange-600 text-orange-600" />
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return <Star key={starI} size={14} className="text-orange-600 opacity-20" />;
                                        }
                                    })}
                                </div>
                                <div className="text-[10px] font-black uppercase opacity-40 tracking-widest italic">{item.name}</div>
                            </div>
                            <p className="font-bold italic text-sm md:text-base leading-relaxed opacity-80">{item.text}</p>
                        </div>
                    ))}
                </div>
            </ThinMotion>
        </section>
    );
};
