
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

export const SafetyAssistant: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'שלום, אני יועץ הבטיחות של CARVO. זקוק לעזרה דחופה או ייעוץ טכני?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show entry bubble after 2 seconds
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: `
          You are the CARVO Tactical Safety Advisor. 
          
          CRITICAL RULES:
          1. CONCISE RESPONSES: Keep every answer strictly between 5 to 7 lines. No long paragraphs.
          2. HELP FIRST, SELL LATER: Focus 100% on solving the user's immediate technical or safety problem before mentioning any products.
          3. THE "SUCCESS" REWARD: If the user indicates they solved the problem with your help or managed to continue driving, say: "שמחתי לעזור. כהערכה על התושייה, CARVO מעניקה לך 10-20% הנחה על רכישת ערכת מיגון מלאה. השתמש בקוד: RESCUE20".
          4. SAFETY STEPS: Always prioritize safety steps (vest, triangle) first.
          5. LANGUAGE: Hebrew only. Technical, fast, and helpful tone.
          `,
          temperature: 0.5,
        }
      });

      const aiText = response.text || "חלה שגיאה קלה. נסה שוב.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "המערכת בעומס. במקרה חירום פנה למשטרה או לגרר." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Entry Notification Bubble */}
      {showBubble && !isOpen && (
        <div className="fixed bottom-44 md:bottom-48 right-6 z-[100] max-w-[260px] md:max-w-[300px] hyper-glass p-5 rounded-[2rem] border-orange-600/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -top-2 -left-2 bg-orange-600 text-black rounded-full p-1 shadow-xl hover:scale-110 active:scale-95 transition-all"
          >
            <X size={14} />
          </button>
          <div className="flex gap-3 text-right">
            <div className="flex-1">
              <p className={`text-[13px] md:text-[14px] font-black italic leading-tight ${darkMode ? 'text-white' : 'text-black'}`}>
                נתקעת בדרך? <span className="text-orange-600">Carvo AI</span> זמין 24/7 להכוונה מיידית לפני גרר
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          </div>
          <div className="absolute -bottom-2 right-8 w-4 h-4 hyper-glass border-b border-r border-white/10 rotate-45" />
        </div>
      )}

      <button
        onClick={() => { setIsOpen(true); setShowBubble(false); }}
        className="fixed bottom-24 md:bottom-28 right-6 z-[110] p-4 bg-orange-600 text-black rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        <Bot className="w-6 h-6 relative z-10" />
      </button>

      {isOpen && (
        <div className={`fixed inset-x-4 bottom-24 sm:inset-auto sm:bottom-28 sm:right-6 sm:w-[320px] h-[70vh] sm:h-[420px] z-[120] flex flex-col rounded-[2rem] border backdrop-blur-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] transition-all ${darkMode ? 'bg-black/90 border-white/10 text-white' : 'bg-white/95 border-black/15 text-black'
          }`}>
          <div className="p-4 border-b border-orange-600/20 flex justify-between items-center bg-orange-600/5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-pulse" />
              <div>
                <h3 className="font-black italic text-[13px] md:text-[10px] tracking-tight leading-none uppercase">CARVO_ADVISOR</h3>
                <p className={`text-[11px] md:text-[8px] font-bold uppercase tracking-widest mt-1 md:mt-0.5 ${darkMode ? 'opacity-80' : 'opacity-50'}`}>Tactical Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className={`opacity-60 hover:opacity-100 transition-opacity p-1 ${darkMode ? 'text-white' : 'text-black'}`}>
              <X className="w-6 h-6 md:w-5 md:h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-right">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[90%] md:max-w-[85%] p-4 md:p-3 rounded-2xl text-[14px] md:text-[13px] font-medium leading-relaxed ${msg.role === 'user'
                    ? (darkMode ? 'bg-white/10 border border-white/20 text-white' : 'bg-neutral-100 border border-black/10 text-black')
                    : `bg-orange-600/15 border border-orange-600/30 ${darkMode ? 'text-orange-50' : 'text-orange-950'}`
                  }`}>
                  {msg.role === 'model' && <Sparkles className="w-4 h-4 text-orange-600 mb-2 opacity-70 md:opacity-50" />}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-orange-600/5 p-3 rounded-2xl border border-orange-600/10 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                  <span className={`text-[12px] md:text-[9px] font-black italic uppercase tracking-widest ${darkMode ? 'opacity-80' : 'opacity-60'}`}>Processing...</span>
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 border-t flex gap-2 shrink-0 ${darkMode ? 'border-white/10 bg-white/[0.02]' : 'border-black/5 bg-white/[0.02]'}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="זקוק לעזרה? כתוב כאן..."
              className={`flex-1 bg-transparent border-b outline-none text-[15px] md:text-xs py-2 md:py-1.5 transition-all text-right ${darkMode ? 'border-white/30 focus:border-orange-600 text-white placeholder:text-white/60' : 'border-black/30 focus:border-orange-600 text-black placeholder:text-black/40'
                }`}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="p-3 bg-orange-600 text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4 md:w-3.5 md:h-3.5" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234, 88, 12, 0.4);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
};
