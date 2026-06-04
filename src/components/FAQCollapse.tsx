/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCollapseProps {
  items: FAQItem[];
  lang: 'FR' | 'EN';
}

export function FAQCollapse({ items, lang }: FAQCollapseProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto" id="faq-section">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 font-sans tracking-tight">
          {lang === 'FR' ? 'Foire Aux Questions (FAQ)' : 'Frequently Asked Questions (FAQ)'}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          {lang === 'FR' ? 'Tout ce que vous devez savoir pour démarrer prudemment' : 'Everything you need to know to invest wisely'}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              id={`faq-item-${idx}`}
              className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden transition-all duration-300 hover:border-amber-500/30"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex justify-between items-center p-4 text-left transition-colors duration-200 hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="font-medium text-amber-50/90 text-sm sm:text-base leading-snug">
                    {item.q}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-amber-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 pt-1 border-t border-slate-900 bg-slate-950/40 text-gray-300 text-xs sm:text-sm leading-relaxed transition-all duration-300">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
