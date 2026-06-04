/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { LiveEarningFeed } from '../types';
import { MOCK_LIVE_FEEDS } from '../initialData';

interface LiveEarningFeedProps {
  lang: 'FR' | 'EN';
}

export function LiveEarningFeedComponent({ lang }: LiveEarningFeedProps) {
  const [feed, setFeed] = useState<LiveEarningFeed[]>(MOCK_LIVE_FEEDS);

  useEffect(() => {
    const handle = setInterval(() => {
      // Create a random new entry
      const names = [
        'Koffi D.', 'Mariam S.', 'Boubacar T.', 'Fousseyni C.', 'Aicha K.',
        'Wilfried A.', 'Marc-Antoine O.', 'Ismael T.', 'Rachid M.', 'Chantal N.',
        'Sylvanus G.', 'Derrick A.', 'Grace K.', 'Therese Y.', 'Abdoulaye D.'
      ];
      const products = [
        { name: 'VIP 1 — Starter Gold', amt: 600 },
        { name: 'VIP 2 — Builder Gold', amt: 2500 },
        { name: 'VIP 3 — Premium Gold', amt: 6800 },
        { name: 'VIP 4 — Elite Wealth', amt: 15000 },
        { name: 'VIP 5 — Master Investor', amt: 33000 },
        { name: 'VIP 6 — Sovereign Gold', amt: 90000 },
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      const newEntry: LiveEarningFeed = {
        id: Math.random().toString(),
        userName: randomName,
        productName: randomProduct.name,
        amount: randomProduct.amt,
        timeString: lang === 'FR' ? 'À l\'instant' : 'Just now'
      };

      setFeed(prev => [newEntry, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(handle);
  }, [lang]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden" id="live-earning-feed">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full filter blur-xl"></div>
      
      <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
        <h4 className="text-xs sm:text-sm font-bold text-amber-400 tracking-wide uppercase font-sans">
          {lang === 'FR' ? 'Gains en Direct' : 'Live Rewards'}
        </h4>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[10px] text-gray-400 font-mono">LIVE FEED</span>
        </div>
      </div>

      <div className="space-y-2 h-[220px] overflow-hidden relative">
        <AnimatePresence initial={false}>
          {feed.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
              className={`flex items-center justify-between p-2.5 rounded-xl border border-slate-800/40 ${
                index === 0 ? 'bg-amber-500/10 border-amber-500/40 shadow-inner' : 'bg-slate-950/30'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  index === 0 ? 'bg-amber-500/20 text-yellow-300' : 'bg-slate-800 text-gray-300'
                }`}>
                  {item.userName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {item.userName}
                    </span>
                    <span className="text-[10px] text-gray-500 shrink-0">
                      • {item.timeString}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 truncate block">
                    {lang === 'FR' ? 'A activé ' : 'Activated '}
                    <span className="text-amber-500 font-medium">{item.productName}</span>
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-mono font-bold text-amber-400 flex items-center justify-end gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-0.5 shrink-0" />
                  +{item.amount.toLocaleString()} FCFA
                </div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider font-bold">
                  {lang === 'FR' ? 'Crédité' : 'Credited'}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
