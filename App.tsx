
import React, { useState, useCallback, useMemo } from 'react';
import { Crown, Send, History, Globe, Loader2, Sparkles, Map, Users, TrendingUp, Shield, ScrollText, MessageSquareQuote, LogOut, Wand2, Dices } from 'lucide-react';
import { Dynasty, EmpireStats, HistoryEntry } from './types';
import { HistoryLog } from './components/HistoryLog';
import { StatsCard } from './components/StatsCard';
import { simulateTurn, generateDynasty } from './services/geminiService';

const App: React.FC = () => {
  const [selectedDynasty, setSelectedDynasty] = useState<Dynasty | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentStats, setCurrentStats] = useState<EmpireStats | null>(null);
  const [inputCommand, setInputCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [customDesc, setCustomDesc] = useState('');
  const [gameYear, setGameYear] = useState(0);
  const [gameMonth, setGameMonth] = useState(0);

  const handleCreateGame = async (desc?: string) => {
    const finalDesc = desc || customDesc;
    if (!finalDesc.trim()) return;
    
    setIsInitializing(true);
    try {
      const dynasty = await generateDynasty(finalDesc);
      setSelectedDynasty(dynasty);
      setCurrentStats(dynasty.initialStats);
      setHistory([{
        time: "即位之始",
        command: "",
        narrative: `陛下，您已在 ${dynasty.period} 正式登基。作为 ${dynasty.name} 的最高统治者：${dynasty.rulerTitle}。

这是一个充满变幻的时代。${dynasty.description} 
四海之内，皆望陛下之决策。请下旨开启您的统治纪元。`,
        stats: dynasty.initialStats,
        events: []
      }]);
      setGameYear(1);
      setGameMonth(1);
    } catch (error: any) {
      console.error("Game Initialization Error:", error);
      alert(`创世推演失败：${error.message || '未知错误'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRandomize = () => {
    const randomDescs = [
      "一个建立在巨龟背上的蒸汽朋克帝国",
      "大明王朝在科技奇点之后延续到了2077年",
      "一个万法凋零、魔修横行的修仙末世",
      "银河边缘一个信奉古神、科技与诅咒并存的星际联邦",
      "一个所有公民都是机械发条驱动的精致小国",
      "在深海之渊，由古神信徒统治的拉莱耶之城"
    ];
    const desc = randomDescs[Math.floor(Math.random() * randomDescs.length)];
    setCustomDesc(desc);
    handleCreateGame(desc);
  };

  const handleSendCommand = async () => {
    if (!inputCommand.trim() || !selectedDynasty || !currentStats || isProcessing) return;

    setIsProcessing(true);
    const cmd = inputCommand;
    setInputCommand('');

    try {
      const historySummary = history.slice(-3).map(h => h.narrative).join('\n');
      const response = await simulateTurn(
        selectedDynasty.name,
        selectedDynasty.rulerTitle,
        currentStats,
        cmd,
        historySummary
      );

      let newMonth = gameMonth + 2;
      let newYear = gameYear;
      if (newMonth > 12) {
        newMonth -= 12;
        newYear += 1;
      }

      setGameYear(newYear);
      setGameMonth(newMonth);
      setCurrentStats(response.newStats);
      setHistory(prev => [...prev, {
        time: `${selectedDynasty.period} 第 ${newYear} 年 ${newMonth} 月`,
        command: cmd,
        narrative: response.narrative,
        stats: response.newStats,
        events: response.events
      }]);
    } catch (error: any) {
      console.error("Simulation failed:", error);
      // 特殊错误处理：如果AI返回格式错误，提示用户重新下达
      alert(`启奏陛下：天机骤变，史官未能记录此道谕旨，请重新下达。\n(错误详情: ${error.message})`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedDynasty) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-200 flex flex-col items-center justify-center p-6 font-serif">
        <div className="max-w-2xl w-full space-y-12 text-center">
          <div className="space-y-4">
            <Crown className="w-16 h-16 text-amber-600 mx-auto animate-pulse" />
            <h1 className="text-5xl font-bold tracking-tighter text-amber-500 cinzel">万古帝王纪</h1>
            <p className="text-stone-500 tracking-[0.2em] text-sm uppercase">Empirical Chronicles of Eternity</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-900/20 to-stone-900 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-stone-900 border border-stone-800 p-8 rounded-lg space-y-6">
              <textarea
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="在此描绘您的理想疆域... (例如：一个以炼金术为核心的沙漠帝国)"
                className="w-full bg-stone-950 border border-stone-800 rounded p-4 text-stone-300 focus:outline-none focus:border-amber-900/50 min-h-[120px] resize-none transition-colors text-lg"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleCreateGame()}
                  disabled={isInitializing || !customDesc.trim()}
                  className="flex-1 bg-amber-900/20 hover:bg-amber-900/30 text-amber-500 border border-amber-900/50 py-4 rounded font-bold tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xl cinzel"
                >
                  {isInitializing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                  开启征程
                </button>
                <button
                  onClick={handleRandomize}
                  disabled={isInitializing}
                  className="px-6 bg-stone-800 hover:bg-stone-700 text-stone-400 border border-stone-700 py-4 rounded transition-all"
                >
                  <Dices className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-stone-950 text-stone-200 flex overflow-hidden font-serif">
      {/* 侧边栏宽度从 96 增加到 104 以适应特大号字体 */}
      <aside className="w-[420px] border-r border-stone-900 flex flex-col bg-stone-950 relative z-40 shadow-2xl">
        <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <Crown className="w-8 h-8" />
              <span className="text-sm uppercase tracking-[0.3em] font-black">当前王朝 (Current Dynasty)</span>
            </div>
            <h2 className="text-4xl font-black cinzel text-stone-100 leading-tight">{selectedDynasty.name}</h2>
            <div className="text-sm text-stone-500 uppercase tracking-widest font-mono font-bold bg-stone-900/50 py-2 px-3 rounded inline-block">
              {selectedDynasty.period} · {selectedDynasty.rulerTitle}
            </div>
          </div>

          <StatsCard stats={currentStats!} color={selectedDynasty.color} />

          <button
            onClick={() => setSelectedDynasty(null)}
            className="w-full py-4 border border-stone-800 text-stone-500 text-sm font-bold uppercase tracking-[0.2em] hover:bg-stone-900 transition-colors flex items-center justify-center gap-2.5 rounded-lg group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-900 transition-colors" />
            退位 (Abdicate)
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
        </div>

        <HistoryLog history={history} isProcessing={isProcessing} />

        <div className="p-10 bg-gradient-to-t from-stone-950 via-stone-950/98 to-transparent relative z-40">
          <div className="max-w-3xl mx-auto relative group">
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
              placeholder="奏报陛下，请下达旨意..."
              className="w-full bg-stone-900/70 border-2 border-stone-800 rounded-full py-5 px-10 pr-20 text-stone-200 focus:outline-none focus:border-amber-900/50 placeholder:text-stone-700 backdrop-blur-xl transition-all text-xl shadow-2xl"
              disabled={isProcessing}
            />
            <button
              onClick={handleSendCommand}
              disabled={!inputCommand.trim() || isProcessing}
              className="absolute right-3 top-3 bottom-3 w-14 bg-amber-900/30 hover:bg-amber-900/50 text-amber-500 rounded-full flex items-center justify-center transition-all disabled:opacity-0 active:scale-95"
            >
              {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;