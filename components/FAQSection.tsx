import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
    darkMode: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ darkMode }) => {
    return (
        <section id="faq" className="relative z-10 py-8 md:py-12 px-6 max-w-5xl mx-auto text-right">
            <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">שאלות נפוצות <span className="text-orange-600">.FAQ</span></h2>
            <div className="space-y-4">
                {[
                    { q: "1. למה לבחור ב-CARVO?", a: "אנחנו כאן כדי לשדרג את תרבות הנהיגה בישראל ולמנוע אסונות בעזרת מוצרים חכמים. להנגיש לקהל הרחב את הידע הפשוט בתפעול הרכב ויציאה ממצבי מצוקה כי אי אפשר לדעת איפה נהיה מחר" },
                    { q: "2. האם השימוש במוצרים מצריך ידע טכני?", a: "בכלל לא. כל הכלים באתר נבחרו כדי לספק פתרון מקצועי במינימום מאמץ. ובמיוחד לשאלה כזאת בנינו את carvo ai הבוט החכם שאומן לכל שאלה ובעיה שנתקלם בה בדרך לנסיעה הוא אומן לתת פתרון מהיר ולמנוע ממכם הוצאות נוספות מיותרת" },
                    { q: "3. מהם זמני ועלויות המשלוח?", a: "משלוח חינם לכל ההזמנות. זמן אספקה: 5–12 ימי עסקים. ייתכנו עיכובים חריגים עקב מצב ביטחוני או תנאי מזג אוויר חריגים, אנו פועלים עם חברת משלוחים מהירה ועושים כל מאמץ לספק את ההזמנה בזמן הקצר ביותר." },
                    { q: "4. מה זה Carvo AI ואיך הוא עובד?", a: "Carvo AI הוא בוט חכם הזמין 24/7, שנועד לתת הכוונה מיידית במצבי חירום ברכב. הוא אומן במיוחד למקרים שכיחים של תקיעות או תקלות, מכיר את כל כלי החירום של Carvo, ומדריך את המשתמש בצורה ברורה ובטוחה כיצד להשתמש בהם בהתאם לסוג הרכב ולבעיה." },
                    { q: "5. האם הערכה באמת עוזרת במצבי חירום?", a: "ברור. אם מעולם לא השתמשתם בכלים כאלה, עכשיו זה הזמן להשקיע בביטחון שלכם ולשפר את איכות החוויה שלכם בכביש." }
                ].map((faq, i) => (
                    <div key={i} className={`rounded-[1.5rem] border-2 overflow-hidden transition-all duration-300 group hover:scale-[1.02] ${darkMode ? 'hyper-glass border-white/10 hover:border-orange-600/40 hover:shadow-[0_0_25px_rgba(234,88,12,0.15)]' : 'bg-white border-black/10 shadow-md hover:shadow-xl hover:border-orange-600/30'}`}>
                        <details className="group">
                            <summary className="w-full p-6 flex items-center justify-between text-right cursor-pointer list-none"><ChevronDown className="shrink-0 text-orange-600 transition-transform group-open:rotate-180 duration-300" size={24} /><span className="text-lg md:text-xl font-black italic tracking-tighter group-hover:text-orange-600 transition-colors">{faq.q}</span></summary>
                            <div className="p-6 pt-0"><p className={`font-bold italic leading-relaxed text-base opacity-70 ${darkMode ? 'text-white' : 'text-black'}`}>{faq.a}</p></div>
                        </details>
                    </div>
                ))}
            </div>
        </section>
    );
};
