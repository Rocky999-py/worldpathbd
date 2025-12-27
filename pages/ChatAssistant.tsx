
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I am WorldPath AI. I am updated with the latest 2025 visa rules, VFS booking procedures, and embassy standards for Bangladeshi citizens. Ask me anything in English or Bengali.\n\nনমস্কার! আমি ওয়ার্ল্ডপাথ এআই। আমি ২০২৫ সালের সর্বশেষ ভিসা নিয়ম, ভিএফএস বুকিং পদ্ধতি এবং দূতাবাস মান অনুযায়ী আপডেট করা হয়েছি।", 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await chatWithAI(input, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the visa servers. Please try again in a moment.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl h-[calc(100vh-160px)] flex flex-col">
      <div className="flex-grow flex flex-col bg-white rounded-[40px] shadow-2xl shadow-blue-50 border border-slate-100 overflow-hidden overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-8 py-6 bg-slate-900 text-white flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
                <i className="fa-solid fa-sparkles"></i>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">WorldPath Assistant</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Advanced 2025 Visa Engine v3.0</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-slate-400 mb-1">Response Mode</div>
            <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Bilingual (EN/BN)</div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 md:p-10 space-y-8 bg-[#fafbff] custom-scrollbar"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[70%]`}>
                <div className={`relative px-6 py-5 rounded-[32px] text-sm font-medium leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100' 
                    : 'bg-white text-slate-800 border border-slate-200/50 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
                <div className={`text-[10px] font-bold text-slate-400 ${m.role === 'user' ? 'text-right pr-2' : 'text-left pl-2'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-6 py-5 rounded-[32px] rounded-tl-none border border-slate-200/50 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Area */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto flex gap-3 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg hidden sm:block">
              <i className="fa-solid fa-keyboard"></i>
            </div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about 2025 requirements, slot booking, or bank standards..."
              className="flex-grow p-5 sm:pl-12 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-medium text-slate-800"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white transition-all duration-300 shadow-xl ${
                !input.trim() || loading 
                  ? 'bg-slate-200 text-slate-400 scale-95' 
                  : 'bg-blue-600 hover:bg-slate-900 shadow-blue-200 scale-100'
              }`}
            >
              <i className={`fa-solid ${loading ? 'fa-spinner animate-spin' : 'fa-paper-plane'} text-xl`}></i>
            </button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
             {["2025 Schengen Rules", "VFS Appointment Dhaka", "Bank QR Requirements"].map(tag => (
               <button 
                 key={tag}
                 onClick={() => setInput(tag)}
                 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition"
               >
                 {tag}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
