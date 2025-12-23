
import React from 'react';
import { EmpireStats } from '../types';
import { TrendingUp, Users, Shield, Map, Landmark, ScrollText, Coins, Globe2, Swords } from 'lucide-react';

interface StatsCardProps {
  stats: EmpireStats;
  color: string;
}

const StatRow: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex justify-between items-center mb-2.5">
      <div className="flex items-center gap-2.5 text-xs text-stone-400 font-serif tracking-widest uppercase font-bold">
        <div className="opacity-70">{icon}</div>
        <span>{label}</span>
      </div>
      <span className="text-xl font-black cinzel" style={{ color }}>{Math.round(value)}</span>
    </div>
    <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800/50 p-[1px]">
      <div 
        className="h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.6)]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const StatsCard: React.FC<StatsCardProps> = ({ stats, color }) => {
  return (
    <div className="bg-stone-900/60 p-7 rounded-xl border border-stone-800 backdrop-blur-md shadow-2xl space-y-8">
      <h3 className="text-sm font-bold cinzel flex items-center gap-2.5 text-amber-600 tracking-[0.3em] uppercase border-b border-amber-900/20 pb-5">
        <Landmark className="w-6 h-6" />
        帝国枢密院奏报
      </h3>

      {/* 国库指示牌 - 字体加大 */}
      <div className="bg-stone-950/80 p-6 rounded-lg border border-stone-800 shadow-inner group transition-all hover:border-amber-900/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 text-xs text-stone-500 tracking-widest uppercase font-bold font-serif">
            <Coins className="w-5 h-5 text-amber-600" />
            <span>国库储备</span>
          </div>
          <div className={`w-3 h-3 rounded-full animate-pulse ${stats.treasury > 100000 ? 'bg-emerald-500' : 'bg-red-500'}`} />
        </div>
        <div className="text-4xl font-black cinzel text-stone-100 tracking-tighter group-hover:text-amber-500 transition-colors flex items-baseline">
          <span className="text-amber-900 mr-1 text-2xl font-normal">$</span>
          {stats.treasury.toLocaleString()}
        </div>
      </div>

      {/* 核心指标 - 间距和字体加大 */}
      <div className="pt-2 space-y-2">
        <StatRow label="经济实力" value={stats.economy} icon={<TrendingUp className="w-5 h-5" />} color="#fbbf24" />
        <StatRow label="政治掌控" value={stats.politics} icon={<ScrollText className="w-5 h-5" />} color="#f87171" />
        <StatRow label="军事储备" value={stats.military} icon={<Shield className="w-5 h-5" />} color="#3b82f6" />
        <StatRow label="社会稳定" value={stats.stability} icon={<Users className="w-5 h-5" />} color="#10b981" />
      </div>

      {/* 外交与邻国详细局势 - 全面强化展示 */}
      <div className="space-y-5 pt-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-stone-500 tracking-widest uppercase font-bold font-serif">
                  <Globe2 className="w-5 h-5 text-blue-500" />
                  <span>周边外交环境</span>
              </div>
              <span className="text-sm font-bold cinzel text-stone-300">
                  {stats.diplomacy > 70 ? '万邦亲善' : stats.diplomacy > 40 ? '维持现状' : '四面楚歌'}
              </span>
          </div>
          <div className="h-2.5 w-full bg-stone-950 rounded-full border border-stone-800 overflow-hidden relative">
              <div 
                  className="absolute inset-y-0 left-0 transition-all duration-1000"
                  style={{ 
                      width: `${stats.diplomacy}%`, 
                      background: `linear-gradient(to right, #ef4444, #f59e0b, #10b981)` 
                  }}
              />
          </div>
        </div>

        {/* 邻国情报栏 - 字体加大且排版更清晰 */}
        <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-lg space-y-3 shadow-inner">
          <div className="flex items-center gap-2.5 text-[11px] text-amber-900/70 font-black uppercase tracking-[0.25em] mb-2 border-b border-amber-900/10 pb-2">
            <Swords className="w-4 h-4" />
            <span>边境详细情报 (Neighbors)</span>
          </div>
          <div className="space-y-2.5">
            {stats.neighborStates.map((state, i) => {
              const [name, status] = state.split(':').map(s => s.trim());
              return (
                <div key={i} className="flex justify-between items-center text-sm border-b border-stone-800/20 pb-2 last:border-0 last:pb-0">
                  <span className="text-stone-300 font-serif font-bold">{name || '未知国度'}</span>
                  <span className={`font-serif italic text-right font-medium ${
                    status?.includes('敌') || status?.includes('战') || status?.includes('侵') || status?.includes('攻') ? 'text-red-500' : 
                    status?.includes('臣') || status?.includes('和') || status?.includes('亲') || status?.includes('盟') ? 'text-emerald-500' : 
                    'text-amber-500/70'
                  }`}>
                    {status || '局势不明'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 底部疆域/人口 - 字体加大 */}
      <div className="pt-6 border-t border-stone-800 grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-xs text-stone-500 tracking-widest uppercase font-bold">
            <Map className="w-4 h-4 opacity-40" />
            <span>疆域</span>
          </div>
          <span className="font-mono text-sm text-stone-200 font-black">
            {stats.territory.toLocaleString()} 
            <span className="text-[10px] opacity-40 ml-1">KM²</span>
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-xs text-stone-500 tracking-widest uppercase font-bold">
            <Users className="w-4 h-4 opacity-40" />
            <span>臣民</span>
          </div>
          <span className="font-mono text-sm text-stone-200 font-black">
            {stats.population.toLocaleString()} 
            <span className="text-[10px] opacity-40 ml-1">M</span>
          </span>
        </div>
      </div>
    </div>
  );
};