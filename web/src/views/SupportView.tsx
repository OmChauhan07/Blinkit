import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

const COMMON_ISSUES = [
  'Where is my delivery partner right now?',
  'I received damaged or spoiled items',
  'How do instant refunds work?',
  'I want to change my delivery address',
  'Download invoice for my previous order'
];

export const SupportView: React.FC = () => {
  const { navigate, orders } = useStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello! I am your Blinkit 24x7 Support Assistant. How can I help you with your groceries or recent orders today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Thank you for contacting Blinkit Support. Our customer care specialist is reviewing your request.';

      const lower = text.toLowerCase();
      if (lower.includes('partner') || lower.includes('where') || lower.includes('status')) {
        const activeOrder = orders.find((o) => o.status === 'on_the_way' || o.status === 'packing');
        if (activeOrder) {
          reply = `Your active order #${activeOrder.orderNumber} is currently on the way with delivery partner ${activeOrder.driverName || 'Ramesh Kumar'} and is scheduled to arrive at your door in under 9 minutes!`;
        } else {
          reply = 'All your previous orders have been completed and delivered safely. You can track any new order in real-time from the "Orders" page.';
        }
      } else if (lower.includes('damaged') || lower.includes('spoiled') || lower.includes('missing')) {
        reply = 'We sincerely apologize for the quality issue. We have initiated a direct full refund of the affected item to your original payment mode (credit within 2-4 hours).';
      } else if (lower.includes('refund')) {
        reply = 'All refunds for cancellations or returns are processed automatically. UPI refunds reflect within 15-30 minutes, and credit card refunds reflect in 2-3 business days.';
      } else if (lower.includes('invoice')) {
        reply = 'You can download the digital tax invoice for any order directly from your "Orders History" page with one click!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: reply,
          time: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0C831F] text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[26px]">support_agent</span>
          </div>
          <div>
            <h1 className="text-[20px] font-black text-[#1C1C1C]">24x7 Customer Support</h1>
            <p className="text-[12px] text-slate-500">Average response time: &lt; 1 minute</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-[#0C831F] text-[13px] font-bold hover:underline cursor-pointer"
        >
          Return to Store
        </button>
      </div>

      {/* Interactive Chat Window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F4F6FB]/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-[13px] leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0C831F] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] block mt-1 ${
                    msg.sender === 'user' ? 'text-white/70 text-right' : 'text-slate-400 text-left'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-2xs flex items-center gap-1.5 text-slate-400 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200" />
                <span className="ml-1 text-slate-500">Blinkit Support is typing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Issue Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-2">
          {COMMON_ISSUES.map((issue) => (
            <button
              key={issue}
              onClick={() => sendMessage(issue)}
              className="text-[11px] font-semibold text-slate-700 bg-[#F4F6FB] hover:bg-[#0C831F]/10 hover:text-[#0C831F] px-3 py-1.5 rounded-full border border-slate-200 shrink-0 transition-colors cursor-pointer"
            >
              {issue}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
            placeholder="Type your message or query..."
            className="flex-1 bg-[#F4F6FB] rounded-xl px-4 py-2.5 text-[13px] border border-slate-200 focus:border-[#0C831F] focus:bg-white focus:outline-none"
          />
          <button
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-[#0C831F] hover:bg-[#0a6d1a] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
