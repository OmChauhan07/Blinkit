import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FAQ_ITEMS } from '../data/mockData';

export const FAQView: React.FC = () => {
  const { navigate } = useStore();
  const [openId, setOpenId] = useState<string>('f1');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Orders & Delivery', 'Payments & Refunds', 'Cancellations & Returns'];

  const filteredFaqs = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1C1C1C]">Frequently Asked Questions</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Quick answers to how 10-minute delivery, orders, and refunds work</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-[#0C831F] text-[13px] font-bold hover:underline cursor-pointer"
        >
          Back to Store
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#0C831F] text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ Items */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="transition-colors">
              <button
                onClick={() => setOpenId(isOpen ? '' : faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0C831F] text-[20px]">
                    help_outline
                  </span>
                  <span className="font-bold text-[14px] text-[#1C1C1C]">
                    {faq.question}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-slate-700' : ''
                }`}>
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-[13px] text-slate-600 leading-relaxed pl-12 border-t border-slate-50 bg-[#F4F6FB]/30">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="bg-[#F8CB46]/20 rounded-2xl p-6 border border-[#F8CB46]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-[16px] text-slate-900">Still have a question?</h3>
          <p className="text-[13px] text-slate-700 mt-0.5">Our 24x7 customer support team is always active to assist you.</p>
        </div>
        <button
          onClick={() => navigate('/support')}
          className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
        >
          Chat with Support
        </button>
      </div>
    </div>
  );
};
