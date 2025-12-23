
import React, { useEffect, useRef } from 'react';
import { HistoryEntry } from '../types';
import { AlertCircle, Flame } from 'lucide-react';

interface HistoryLogProps {
  history: HistoryEntry[];
  isProcessing: boolean;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history, isProcessing }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, isProcessing]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-8 py-12 space-y-16 bg-transparent custom-scrollbar relative z-30"
    >
      <div className="max-w-[760px] mx-auto">
        {history.map((entry, idx) => (
          <div key={idx} className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* 时间分隔线 */}
            <div className="flex items-center gap-6 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
              <span className="text-[9px] uppercase tracking-[0.4em] text-amber-800 font-bold font-mono px-3 py-1 border border-amber-900/10 rounded-full">
                {entry.time}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
            </div>

            {/* 统治者谕旨 - 优化样式防止拥挤 */}
            {entry.command && (
              <div className="mb-10 max-w-xl mx-auto">
                <div className="bg-stone-900/40 p-5 rounded-lg border border-amber-900/10 italic text-stone-400 relative backdrop-blur-sm shadow-md">
                  <span className="text-[10px] text-amber-900 font-bold block mb-2 font-serif opacity-70">【 陛下谕旨 】</span>
                  <p className="text-lg leading-relaxed font-serif tracking-wide italic">“{entry.command}”</p>
                </div>
              </div>
            )}

            {/* 随机事件 - 增加间距 */}
            {entry.events && entry.events.length > 0 && (
              <div className="max-w-xl mx-auto mb-10 space-y-3">
                {entry.events.map((evt, i) => (
                  <div key={i} className="flex items-start gap-3 bg-red-950/5 border border-red-900/10 p-4 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-900 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200/50 font-serif leading-relaxed italic">{evt}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 叙事主体 - 彻底修正文字重叠问题 */}
            <div className="max-w-2xl mx-auto relative pl-4">
              <div className="absolute left-0 top-0 text-amber-900/5 pointer-events-none">
                <Flame className="w-12 h-12" />
              </div>
              <div className="text-lg leading-[2.2] text-stone-300 font-serif tracking-widest text-justify overflow-visible">
                {/* 放弃超大首字，改为适中的加粗强调 */}
                <span className="text-3xl font-bold text-amber-700 float-left mr-2 mt-1 leading-none">{entry.narrative.charAt(0)}</span>
                {entry.narrative.slice(1)}
              </div>
              <div className="clear-both" />
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-20 text-amber-900/20">
            <div className="w-12 h-12 border-b-2 border-amber-900 rounded-full animate-spin" />
            <p className="cinzel text-[9px] tracking-[0.4em] font-bold mt-6 uppercase">史官录入中...</p>
          </div>
        )}
        <div className="h-40" />
      </div>
    </div>
  );
};
