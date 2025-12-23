
import React from 'react';
import { EmpireStats } from '../types';
import { TrendingUp, Users, Shield, Map, Landmark, ScrollText } from 'lucide-react';

interface StatsCardProps {
  stats: EmpireStats;
  color: string;
}

const StatRow: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="mb-5 last:mb-0">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2 text-[10px] text-stone-500 font-serif tracking-widest uppercase">
        <div className="opacity-40">{icon}</div>
        <span>{label}</span>
      </div>
      <span className="text-base font-bold cinzel" style={{ color }}>{Math.round(value)}<span className="text-[9px] ml-0.5 opacity-40">%</span></span>
    </div>
    <div className="w-full bg-stone-950 h-1 rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-1000 ease-out"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const StatsCard: React.FC<StatsCardProps> = ({ stats, color }) => {
  return (
    <div className="bg-stone-900/40 p-6 rounded-xl border border-stone-800 backdrop-blur-sm shadow-lg">
      <h3 className="text-xs font-bold cinzel mb-8 flex items-center gap-2 text-amber-700 tracking-widest uppercase">
        <Landmark className="w-4 h-4" />
        帝国枢密呈报
      </h3>

      <div className="space-y-1">
        <StatRow label="经济实力" value={stats.economy} icon={<TrendingUp className="w-3.5 h-3.5" />} color={color} />
        <StatRow label="政治局势" value={stats.politics} icon={<ScrollText className="w-3.5 h-3.5" />} color={color} />
        <StatRow label="社会稳定" value={stats.stability} icon={<Shield className="w-3.5 h-3.5" />} color={color} />
        <StatRow label="军事储备" value={stats.military} icon={<Shield className="w-3.5 h-3.5" />} color={color} />
      </div>

      <div className="mt-8 pt-6 border-t border-stone-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-[9px] text-stone-500 tracking-widest">
            <Map className="w-3.5 h-3.5 opacity-30" />
            <span>国土</span>
          </div>
          <span className="font-mono text-xs text-stone-400">{stats.territory.toLocaleString()} <span className="text-[8px] opacity-30">KM²</span></span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-[9px] text-stone-500 tracking-widest">
            <Users className="w-3.5 h-3.5 opacity-30" />
            <span>人口</span>
          </div>
          <span className="font-mono text-xs text-stone-400">{stats.population.toLocaleString()} <span className="text-[8px] opacity-30">M</span></span>
        </div>
      </div>
    </div>
  );
};
