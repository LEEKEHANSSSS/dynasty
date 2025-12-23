
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
    initialStats: { economy: 65, politics: 95, stability: 60, military: 100, territory: 3400000, population: 20 }
  },
  {
    id: 'tang',
    name: '大唐盛世',
    period: '公元 626年',
    rulerTitle: '唐太宗',
    description: '万国来朝，贞观之治。作为天可汗，你统治着世界上最繁荣开放的帝国。',
    color: '#fbbf24',
    secondaryColor: '#92400e',
    initialStats: { economy: 90, politics: 85, stability: 85, military: 80, territory: 12300000, population: 50 }
  },
  {
    id: 'xiuxian',
    name: '天元圣地',
    period: '仙历 9900年',
    rulerTitle: '圣地之主',
    description: '【玄幻】掌管天地灵脉。下方万千宗门需定时供奉。你需要平衡门派利益并提防域外邪魔。',
    color: '#a78bfa',
    secondaryColor: '#4c1d95',
    initialStats: { economy: 85, politics: 70, stability: 75, military: 95, territory: 50000000, population: 1000 }
  },
  {
    id: 'cyber_ming',
    name: '应天府 2077',
    period: '明历 710年',
    rulerTitle: '万历主脑',
    description: '【赛博】大明在科技奇点后延续。霓虹闪烁的紫禁城被巨型企业环绕，锦衣卫已是生化义体。',
    color: '#f472b6',
    secondaryColor: '#831843',
    initialStats: { economy: 95, politics: 60, stability: 50, military: 85, territory: 9600000, population: 1200 }
  },
  {
    id: 'star_fed',
    name: '银河联合政府',
    period: '星历 3200年',
    rulerTitle: '执政官',
    description: '【星际】统治着横跨三个旋臂的星际联邦。异族外交与超光速航道的维护是你每日的挑战。',
    color: '#22d3ee',
    secondaryColor: '#164e63',
    initialStats: { economy: 90, politics: 65, stability: 60, military: 70, territory: 1000000000, population: 80000 }
  },
  {
    id: 'lovecraft',
    name: '拉莱耶帝国',
    period: '永恒纪元',
    rulerTitle: '深渊祭司',
    description: '【克苏鲁】在非欧几里得的城市中，你管理着古老者与眷族。疯狂是这里的常态，理智是你的余烬。',
    color: '#34d399',
    secondaryColor: '#064e3b',
    initialStats: { economy: 40, politics: 80, stability: 20, military: 95, territory: 0, population: 0.1 }
  },
  {
    id: 'cloud_realm',
    name: '浮空云国',
    period: '创世后 300年',
    rulerTitle: '云端君主',
    description: '【童话】在巨大的浮空鲸背上建立的国度。你需要采集阳光与露水，同时躲避时而出现的雷暴巨兽。',
    color: '#60a5fa',
    secondaryColor: '#1e3a8a',
    initialStats: { economy: 70, politics: 90, stability: 90, military: 40, territory: 200000, population: 5 }
  },
  {
    id: 'clockwork',
    name: '发条主城',
    period: '齿轮纪元',
    rulerTitle: '机械之神',
    description: '【机械】整座帝国就是一个巨大的精密钟表。每一个公民都是一颗螺丝，任何误差都可能导致文明毁灭。',
    color: '#fb923c',
    secondaryColor: '#7c2d12',
    initialStats: { economy: 85, politics: 100, stability: 95, military: 60, territory: 10000, population: 50 }
  }
];
