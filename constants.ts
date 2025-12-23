import { Dynasty } from './types';

export const DYNASTIES: Dynasty[] = [
  {
    id: 'qin',
    name: '大秦帝国',
    period: '公元前 221年',
    rulerTitle: '始皇帝',
    description: '书同文，车同轨。你统一了六国，建立起第一个大一统中央集权国家。法家思想是你的利剑。',
    color: '#c5a059',
    secondaryColor: '#1a1a1a',
    initialStats: { 
      economy: 65, politics: 95, stability: 60, military: 100, territory: 3400000, population: 20, 
      diplomacy: 30, treasury: 1000000,
      neighborStates: ["匈奴: 虎视眈眈", "百越: 密谋反抗", "东胡: 试探边境"]
    }
  },
  {
    id: 'tang',
    name: '大唐盛世',
    period: '公元 626年',
    rulerTitle: '唐太宗',
    description: '万国来朝，贞观之治。作为天可汗，你统治着世界上最繁荣开放的帝国。',
    color: '#fbbf24',
    secondaryColor: '#92400e',
    initialStats: { 
      economy: 90, politics: 85, stability: 85, military: 80, territory: 12300000, population: 50, 
      diplomacy: 95, treasury: 5000000,
      neighborStates: ["突厥: 俯首称臣", "吐蕃: 礼聘求和", "新罗: 仰慕汉风"]
    }
  },
  {
    id: 'xiuxian',
    name: '天元圣地',
    period: '仙历 9900年',
    rulerTitle: '圣地之主',
    description: '【玄幻】掌管天地灵脉。下方万千宗门需定时供奉。你需要平衡门派利益并提防域外邪魔。',
    color: '#a78bfa',
    secondaryColor: '#4c1d95',
    initialStats: { 
      economy: 85, politics: 70, stability: 75, military: 95, territory: 50000000, population: 1000, 
      diplomacy: 50, treasury: 2000000,
      neighborStates: ["魔都: 蠢蠢欲动", "妖域: 割据一方", "隐世仙宫: 保持中立"]
    }
  },
  {
    id: 'cyber_ming',
    name: '应天府 2077',
    period: '明历 710年',
    rulerTitle: '万历主脑',
    description: '【赛博】大明在科技奇点后延续。霓虹闪烁的紫禁城被巨型企业环绕，锦衣卫已是生化义体。',
    color: '#f472b6',
    secondaryColor: '#831843',
    initialStats: { 
      economy: 95, politics: 60, stability: 50, military: 85, territory: 9600000, population: 1200, 
      diplomacy: 40, treasury: 8000000,
      neighborStates: ["东印度公司: 贸易摩擦", "极光合众国: 技术封锁", "荒坂集团: 渗透中"]
    }
  }
];