export interface EmpireStats {
  economy: number;    // 0-100
  politics: number;   // 0-100
  stability: number;  // 0-100
  military: number;   // 0-100
  diplomacy: number;  // 0-100 (0=四面楚歌, 100=万邦来朝)
  treasury: number;   // 绝对值，国库储银/资源
  neighborStates: string[]; // 具体周边政权及其状态，例如 ["匈奴: 劫掠不断", "大月氏: 互市互通"]
  territory: number;  // in square kilometers
  population: number; // in millions
}

export interface Dynasty {
  id: string;
  name: string;
  period: string;
  rulerTitle: string;
  description: string;
  initialStats: EmpireStats;
  color: string;
  secondaryColor?: string;
}

export interface HistoryEntry {
  time: string;
  command: string;
  narrative: string;
  stats: EmpireStats;
  events?: string[]; 
}

export interface AIResponse {
  narrative: string;
  newStats: EmpireStats;
  events: string[];
}