
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const MessengerChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I am WorldPath AI. How can I help you with your visa today? For immediate human assistance, you can also click the WhatsApp button.", 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const WHATSAPP_NUMBER = "8801300172795";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: textToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setLoading(true);

    try {
      const context = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await chatWithAI(textToSend, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Let me try again...", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end gap-4">
      
      {/* WhatsApp Floating Button */}
      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 pr-2 transition-all duration-500"
      >
        <span className="opacity-0 group-hover:opacity-100 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl shadow-xl transition-all translate-x-4 group-hover:translate-x-0">
          WhatsApp Support
        </span>
        <div className="w-16 h-16 rounded-[24px] bg-[#25D366] flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] border border-emerald-400/20 hover:scale-110 transition-transform">
          <i className="fa-brands fa-whatsapp text-white text-3xl"></i>
        </div>
      </a>

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[600px] mb-2 glass-panel rounded-[40px] overflow-hidden flex flex-col shadow-2xl border border-amber-500/10 animate-in fade-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="p-6 bg-amber-500/10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/20">
                <i className="fa-solid fa-comment-dots text-black text-lg"></i>
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight uppercase">Smart Helper</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-amber-500/60 font-black uppercase tracking-widest">Always Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition text-slate-500 hover:text-white">
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-900/60">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-xl border ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-400/20 rounded-tr-none' 
                    : 'bg-white/5 text-slate-200 border-white/10 rounded-tl-none'
                }`}>
                  <p className={lang === 'bn' ? 'bengali' : ''}>{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center border border-white/10">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            {!loading && (
              <div className="pt-4 flex flex-wrap gap-2">
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
                </a>
                <button 
                  onClick={() => navigate('/booking-software')}
                  className="px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-600/30 text-[9px] font-black text-blue-400 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                >
                  Book a Slot
                </button>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-950 border-t border-white/5">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-grow bg-white/5 border border-white/10 rounded-[20px] px-5 py-3.5 text-sm outline-none focus:border-amber-500 transition-all text-white font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-14 h-14 rounded-[20px] bg-amber-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xl shadow-amber-500/10 group"
              >
                <i className={`fa-solid ${loading ? 'fa-spinner animate-spin' : 'fa-paper-plane'} text-black group-hover:text-black`}></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all duration-500 shadow-2xl border ${
          isOpen 
            ? 'bg-rose-600 border-rose-400/20 rotate-[135deg]' 
            : 'bg-amber-500 border-amber-400/40 hover:scale-105 shadow-amber-500/20'
        }`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-plus' : 'fa-message-smile'} text-3xl ${isOpen ? 'text-white' : 'text-black'}`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 border-4 border-slate-950 rounded-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default MessengerChat;
