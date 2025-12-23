import { GoogleGenAI, Type } from "@google/genai";
import { EmpireStats, AIResponse, Dynasty } from "../types";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    narrative: {
      type: Type.STRING,
      description: "对下达谕旨后两个月内帝国发生的具体情况进行文学化的中文描述。应根据世界观背景调整语气。",
    },
    newStats: {
      type: Type.OBJECT,
      properties: {
        economy: { type: Type.NUMBER, description: "经济实力 (0-100)" },
        politics: { type: Type.NUMBER, description: "政治掌控力 (0-100)" },
        stability: { type: Type.NUMBER, description: "社会稳定度 (0-100)" },
        military: { type: Type.NUMBER, description: "军事/武力储备 (0-100)" },
        diplomacy: { type: Type.NUMBER, description: "周边外交友好度 (0-100)" },
        treasury: { type: Type.NUMBER, description: "国库余额" },
        neighborStates: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "列举3个左右具体周边势力及其当前状态（如：'势力名: 态度'）" 
        },
        territory: { type: Type.NUMBER, description: "领土面积（平方公里）" },
        population: { type: Type.NUMBER, description: "人口（百万）" },
      },
      required: ["economy", "politics", "stability", "military", "diplomacy", "treasury", "neighborStates", "territory", "population"],
    },
    events: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "期间发生的2-3个随机小事件，包含外交突发事件。",
    },
  },
  required: ["narrative", "newStats", "events"],
};

const dynastySchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    period: { type: Type.STRING },
    rulerTitle: { type: Type.STRING },
    description: { type: Type.STRING },
    initialStats: {
      type: Type.OBJECT,
      properties: {
        economy: { type: Type.NUMBER },
        politics: { type: Type.NUMBER },
        stability: { type: Type.NUMBER },
        military: { type: Type.NUMBER },
        diplomacy: { type: Type.NUMBER },
        treasury: { type: Type.NUMBER },
        neighborStates: { type: Type.ARRAY, items: { type: Type.STRING } },
        territory: { type: Type.NUMBER },
        population: { type: Type.NUMBER },
      },
      required: ["economy", "politics", "stability", "military", "diplomacy", "treasury", "neighborStates", "territory", "population"],
    },
    color: { type: Type.STRING },
  },
  required: ["name", "period", "rulerTitle", "description", "initialStats", "color"],
};

export const generateDynasty = async (description: string): Promise<Dynasty> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const prompt = `根据以下描述，构思一个独特的帝国或文明设定：
  "${description || '一个未知的神秘国度'}"
  
  请设定约3个符合该世界观背景的具体邻国政权及其初始关系状态。
  返回的结果必须是中文。不要包含任何 Markdown 格式代码块。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dynastySchema,
      },
    });

    if (!response.text) throw new Error("AI returned empty content");
    const result = JSON.parse(response.text.trim());
    return { ...result, id: Date.now().toString() };
  } catch (error) {
    console.error("Dynasty Generation detailed logs:", error);
    throw error;
  }
};

export const simulateTurn = async (
  dynastyName: string,
  rulerTitle: string,
  currentStats: EmpireStats,
  command: string,
  historySummary: string
): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const prompt = `
    你是一个极其真实的宏观历史/文明模拟器。
    
    【当前场景】
    玩家是 "${dynastyName}" 的最高统治者 "${rulerTitle}"。
    
    【当前状态】
    - 外交/邻国: ${currentStats.neighborStates.join(', ')}
    - 综合外交分: ${currentStats.diplomacy}/100
    - 国库: ${currentStats.treasury}
    
    【统治者谕旨】
    "${command}"
    
    【推演指南】
    1. 动态更新邻国状态：根据玩家的行为，决定某个邻国是变得更敌对还是更顺从。若发生战争或吞并，邻国名单可能变化。
    2. 叙述要体现具体邻国对该谕旨的反应（例如：某国使节来访、某国边境增兵等）。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) throw new Error("AI returned empty content");
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Simulate Turn detailed logs:", error);
    throw error;
  }
};