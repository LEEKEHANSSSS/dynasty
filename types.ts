
export interface EmpireStats {
  economy: number;    // 0-100
  politics: number;   // 0-100
  stability: number;  // 0-100
  military: number;   // 0-100
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
  events?: string[]; // 显式存储本回合发生的随机事件
}

export interface AIResponse {
  narrative: string;
  newStats: EmpireStats;
  events: string[];
}
