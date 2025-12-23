
import React, { useState, useCallback, useMemo } from 'react';
import { Crown, Send, History, Globe, Loader2, Sparkles, Map, Users, TrendingUp, Shield, ScrollText, MessageSquareQuote, LogOut, Wand2, Dices } from 'lucide-react';
import { Dynasty, EmpireStats, HistoryEntry } from './types';
import { HistoryLog } from './components/HistoryLog';
import { StatsCard } from './components/StatsCard';
import { simulateTurn, generateDynasty } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    } catch (error) {
      alert("创世失败，虚空动荡，请重试。");
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
      "在非欧几里得空间中缓慢扩张的古神眷族帝国",
      "一个只有阳光与露水，建立在浮空鲸背上的童话国度",
      "所有人的寿命都记录在手臂沙漏里的沙之国度",
      "地心深处，依靠岩浆热能维持文明的矮人矿业共和国",
      "建立在无数巨型荷叶上的水生精灵文明"
    ];
    let newDesc = randomDescs[Math.floor(Math.random() * randomDescs.length)];
    // 确保随机到的不跟当前一样（除非数组只有一个元素）
    if (newDesc === customDesc && randomDescs.length > 1) {
      newDesc = randomDescs[(randomDescs.indexOf(newDesc) + 1) % randomDescs.length];
    }
    setCustomDesc(newDesc);
  };

  const handleEndReign = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("确定要退位吗？此举将终结当前的统治纪元，历史将在此定格。")) {
      setSelectedDynasty(null);
      setHistory([]);
      setCurrentStats(null);
      setGameYear(0);
      setGameMonth(0);
      setInputCommand('');
      setCustomDesc('');
    }
  };

  const suggestCommand = () => {
    const suggestions = [
      "微服私访，察看民情。",
      "兴修水利，奖励农耕。",
      "精简机构，裁撤冗员。",
      "广纳良才，开科取士。",
      "秣马厉兵，收复边疆。",
      "轻徭薄赋，与民休息。",
      "严惩贪腐，整顿吏治。",
      "远交近攻，纵横捭阖。"
    ];
    setInputCommand(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  const handleSubmitCommand = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputCommand.trim() || isProcessing || !selectedDynasty || !currentStats) return;

    const userCommand = inputCommand;
    setInputCommand('');
    setIsProcessing(true);

    try {
      const historySummary = history.slice(-3).map(h => h.narrative).join('\n');
      const response = await simulateTurn(
        selectedDynasty.name,
        selectedDynasty.rulerTitle,
        currentStats,
        userCommand,
        historySummary
      );

      let newMonth = gameMonth + 2;
      let newYear = gameYear;
      if (newMonth > 12) {
        newMonth = newMonth - 12;
        newYear += 1;
      }
      
      const timeStr = `第 ${newYear} 载, 第 ${newMonth} 月`;
      
      setHistory(prev => [...prev, {
        time: timeStr,
        command: userCommand,
        narrative: response.narrative,
        stats: response.newStats,
        events: response.events
      }]);
      setCurrentStats(response.newStats);
      setGameYear(newYear);
      setGameMonth(newMonth);

    } catch (error) {
      alert("启奏陛下：天机骤变，史官未能记录此道谕旨，请重新下达。");
    } finally {
      setIsProcessing(false);
    }
  };

  const chartData = useMemo(() => {
    return history.map((h) => ({
      name: h.time,
      eco: h.stats.economy,
      mil: h.stats.military,
      stab: h.stats.stability
    }));
  }, [history]);

  if (!selectedDynasty) {
    return (
      <div className="min-h-screen bg-[#1c1917] flex items-center justify-center p-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#292524_0%,_#1c1917_100%)] opacity-50" />
        <div className="max-w-[800px] w-full relative z-20 text-center">
          <div className="mb-16 animate-in fade-in duration-1000">
            <h1 className="text-7xl font-black cinzel text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-600 to-amber-900 mb-4 tracking-tighter drop-shadow-2xl">
              DYNASTY RULER
            </h1>
            <p className="text-amber-800 font-serif text-xl tracking-[0.5em] font-medium uppercase mb-12">万古纪元 · 创世推演</p>
            
            <div className="bg-stone-900/40 border border-amber-900/10 p-10 rounded-2xl shadow-2xl backdrop-blur-md">
              <h2 className="text-amber-600 font-serif text-lg mb-6 tracking-widest">描绘您所统治的纪元</h2>
              
              <textarea
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="例如：一个建立在浮空岛屿上、蒸汽动力驱动的赛博大明王朝..."
                className="w-full h-32 bg-stone-950/50 border border-amber-900/20 rounded-xl p-6 text-stone-200 placeholder-stone-700 focus:outline-none focus:border-amber-600/30 transition-all font-serif text-lg mb-8 resize-none"
                disabled={isInitializing}
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleCreateGame()}
                  disabled={isInitializing || !customDesc.trim()}
                  className="flex-1 bg-amber-700 text-stone-950 py-5 rounded-xl hover:bg-amber-600 transition-all font-bold text-sm tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-30 group"
                >
                  {isInitializing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> <span>开启推演</span></>}
                </button>
                <button
                  onClick={handleRandomize}
                  disabled={isInitializing}
                  className="px-8 border border-amber-900/30 text-amber-700 rounded-xl hover:bg-amber-950/20 transition-all flex items-center gap-2 group"
                  title="获取灵感，您可以在此基础上继续修改"
                >
                  <Dices className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>随机灵感</span>
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-stone-500 text-xs font-serif italic opacity-50">
            “所有的历史都曾是未来的无限可能，您的笔触将赋予虚空血肉。”
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#1c1917] text-stone-200 overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-amber-900/10 flex items-center justify-between px-10 bg-stone-950/80 backdrop-blur-xl shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-lg border border-amber-400/20">
            <Crown className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold cinzel leading-none tracking-widest text-amber-600">{selectedDynasty.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">统治者: {selectedDynasty.rulerTitle}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-amber-900 font-bold uppercase tracking-[0.2em] mb-1">统治历程</span>
            <div className="flex items-center gap-2 text-amber-600 font-mono text-lg px-4 py-1 rounded bg-amber-950/20 border border-amber-900/20">
              <History className="w-4 h-4 opacity-50" />
              <span>{gameYear} 载 {gameMonth} 月</span>
            </div>
          </div>
          
          <button 
            onClick={handleEndReign}
            className="group flex items-center gap-2 px-5 py-2.5 border border-stone-800 text-stone-500 hover:text-red-500 hover:border-red-900/40 transition-all rounded-lg text-[10px] uppercase tracking-widest bg-stone-900/50 font-bold cursor-pointer relative pointer-events-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>结束统治</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Section: Narrative */}
        <div className="flex-1 flex flex-col relative bg-[#1c1917]">
          <HistoryLog history={history} isProcessing={isProcessing} />
          
          <div className="px-12 pb-10 pt-6 bg-gradient-to-t from-stone-900 via-stone-900/90 to-transparent z-40">
            <div className="max-w-[800px] mx-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-[10px] text-stone-500 tracking-widest font-bold uppercase opacity-80">
                  <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                  <span>内阁史官秉笔待命</span>
                </div>
                <button 
                  onClick={suggestCommand}
                  className="flex items-center gap-2 text-[10px] text-amber-800 hover:text-amber-600 transition-colors uppercase tracking-widest font-bold bg-amber-950/10 px-3 py-1.5 rounded-full border border-amber-900/10"
                >
                  <MessageSquareQuote className="w-3 h-3" />
                  <span>顾问献策</span>
                </button>
              </div>
              
              <form onSubmit={handleSubmitCommand} className="relative">
                <input
                  type="text"
                  value={inputCommand}
                  onChange={(e) => setInputCommand(e.target.value)}
                  placeholder="在此挥毫颁布谕令..."
                  className="w-full bg-stone-950/50 border border-amber-900/10 rounded-xl py-6 pl-12 pr-28 text-stone-200 placeholder-stone-700 focus:outline-none focus:border-amber-600/30 transition-all font-serif text-lg backdrop-blur-md"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  disabled={isProcessing || !inputCommand.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-amber-700 text-stone-950 rounded-lg hover:bg-amber-600 disabled:opacity-20 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> <span>下达</span></>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section: Stats Dashboard */}
        <aside className="w-[380px] border-l border-amber-900/10 bg-[#141210] p-8 flex flex-col gap-8 overflow-y-auto shrink-0 z-50">
          <StatsCard stats={currentStats || selectedDynasty.initialStats} color={selectedDynasty.color} />
          
          <div className="bg-stone-900/20 p-6 rounded-xl border border-stone-800 shadow-inner">
            <h4 className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-6 flex items-center gap-2 font-serif">
              <Globe className="w-3.5 h-3.5" />
              国力走势监测
            </h4>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #444', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="eco" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="mil" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="stab" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4">
               {['经济', '军事', '稳定'].map((label, idx) => (
                 <div key={idx} className="flex items-center gap-1.5">
                   <div className={`w-2 h-0.5 ${idx===0?'bg-amber-500':idx===1?'bg-red-500':'bg-blue-500'}`} />
                   <span className="text-[9px] text-stone-500 font-bold">{label}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-amber-900/5 border border-amber-900/10 p-6 rounded-xl">
            <p className="text-[10px] text-amber-900 font-bold uppercase tracking-widest mb-3 font-serif">—— 祖训 ——</p>
            <p className="text-xs text-stone-500 leading-relaxed font-serif italic text-justify">
              “凡治天下者，必先治其心。民之所欲，天必从之。”
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
