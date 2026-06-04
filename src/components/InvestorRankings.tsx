/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Trophy, Users, Award, TrendingUp, Medal } from 'lucide-react';

interface InvestorRankingsProps {
  lang: 'FR' | 'EN';
}

interface RankedInvestor {
  rank: number;
  name: string;
  vipLevel: string;
  totalEarnings: number;
  country: string;
  avatar: string;
}

export function InvestorRankings({ lang }: InvestorRankingsProps) {
  const [onlineUsers, setOnlineUsers] = useState<number>(1427);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // Changes by -5 to +5
        const target = prev + change;
        return target > 1500 ? 1490 : target < 1300 ? 1310 : target;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const topInvestors: RankedInvestor[] = [
    { rank: 1, name: 'Jean-Marc Yao', vipLevel: 'VIP 6', totalEarnings: 2750000, country: 'Côte d’Ivoire', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' },
    { rank: 2, name: 'Mariam Diop', vipLevel: 'VIP 5', totalEarnings: 1845000, country: 'Sénégal', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80' },
    { rank: 3, name: 'Inoussa Ouedraogo', vipLevel: 'VIP 5', totalEarnings: 1290000, country: 'Burkina Faso', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80' },
    { rank: 4, name: 'Sylvanus G.', vipLevel: 'VIP 4', totalEarnings: 740000, country: 'Togo', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80' },
    { rank: 5, name: 'Affouet K.', vipLevel: 'VIP 3', totalEarnings: 415000, country: 'Côte d’Ivoire', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative" id="investor-rankings-panel">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full filter blur-3xl"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-400 font-mono tracking-wider uppercase">
            {lang === 'FR' ? '🚨 LIVE STATISTIQUES' : '🚨 LIVE STATISTICS'}
          </h4>
          <h3 className="text-xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
            {lang === 'FR' ? 'Classement des Investisseurs' : 'Investors Leaderboard'}
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-1.5 shrink-0 self-start sm:self-auto">
          <div className="relative">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="text-emerald-400 font-mono font-bold text-sm leading-none">
              {onlineUsers.toLocaleString()}
            </div>
            <div className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-wider mt-0.5">
              {lang === 'FR' ? 'En ligne' : 'Online'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {topInvestors.map((investor) => {
          // Get beautiful badges or ranking icons
          const renderRankIcon = (rank: number) => {
            if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400 font-bold" />;
            if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
            if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
            return <span className="text-xs font-mono text-gray-500 font-bold">#{rank}</span>;
          };

          return (
            <div
              key={investor.rank}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                investor.rank === 1
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 shrink-0 flex items-center justify-center">
                  {renderRankIcon(investor.rank)}
                </div>
                
                <img
                  src={investor.avatar}
                  alt={investor.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-slate-800 object-cover shrink-0"
                />

                <div className="min-w-0">
                  <div className="font-semibold text-xs sm:text-sm text-amber-50 truncate">
                    {investor.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                    <span className="px-1.5 py-0.5 bg-slate-800 text-amber-400 rounded-md font-mono font-bold">
                      {investor.vipLevel}
                    </span>
                    <span className="truncate">• {investor.country}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div className="text-xs sm:text-sm font-mono font-bold text-amber-400 flex items-center justify-end">
                  <TrendingUp className="w-3 h-3 text-emerald-400 mr-1 shrink-0" />
                  {investor.totalEarnings.toLocaleString()} FCFA
                </div>
                <div className="text-[9px] text-gray-500 font-mono">
                  {lang === 'FR' ? 'Gains Totaux' : 'Total Earnings'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
