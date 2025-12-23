
import { GoogleGenAI, Type } from "@google/genai";
import { EmpireStats, AIResponse, Dynasty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

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
        economy: { type: Type.NUMBER, description: "经济/资源实力 (0-100)" },
        politics: { type: Type.NUMBER, description: "政治掌控力 (0-100)" },
        stability: { type: Type.NUMBER, description: "社会稳定度 (0-100)" },
        military: { type: Type.NUMBER, description: "军事/武力储备 (0-100)" },
        territory: { type: Type.NUMBER, description: "领土面积（平方公里）" },
        population: { type: Type.NUMBER, description: "人口（百万）" },
      },
      required: ["economy", "politics", "stability", "military", "territory", "population"],
    },
    events: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "期间发生的2-3个随机小事件。",
    },
  },
  required: ["narrative", "newStats", "events"],
};

const dynastySchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "帝国的名称" },
    period: { type: Type.STRING, description: "所处的时代或纪元名称" },
    rulerTitle: { type: Type.STRING, description: "统治者的尊称" },
    description: { type: Type.STRING, description: "对该背景的简短描述" },
    initialStats: {
      type: Type.OBJECT,
      properties: {
        economy: { type: Type.NUMBER },
        politics: { type: Type.NUMBER },
        stability: { type: Type.NUMBER },
        military: { type: Type.NUMBER },
        territory: { type: Type.NUMBER },
        population: { type: Type.NUMBER },
      },
      required: ["economy", "politics", "stability", "military", "territory", "population"],
    },
    color: { type: Type.STRING, description: "代表色的十六进制值，应符合氛围" },
  },
  required: ["name", "period", "rulerTitle", "description", "initialStats", "color"],
};

export const generateDynasty = async (description: string): Promise<Dynasty> => {
  const prompt = `根据以下描述，构思一个独特的帝国或文明设定：
  "${description || '一个未知的神秘国度'}"
  
  请提供帝国的名称、时代、统治者称号、开局背景故事以及初始各项数值（0-100之间，领土与人口除外）。
  领土应在 10,000 到 10,000,000 之间。人口应在 1 到 1,000 之间。
  返回的结果必须是中文。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dynastySchema,
      },
    });

    const result = JSON.parse(response.text);
    return { ...result, id: Date.now().toString() };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("构思失败，天数有变。");
  }
};

export const simulateTurn = async (
  dynastyName: string,
  rulerTitle: string,
  currentStats: EmpireStats,
  command: string,
  historySummary: string
): Promise<AIResponse> => {
  const prompt = `
    你是一个极其真实的宏观历史/文明模拟器。
    
    【当前场景】
    玩家是 "${dynastyName}" 的最高统治者 "${rulerTitle}"。
    这是一个 "${dynastyName}" 背景的世界，请务必根据其特定的文化、科技或超自然设定来调整叙事逻辑。
    
    【时间步长】
    本次推演跨度为：2个月。
    
    【当前帝国状态】
    - 经济/资源: ${currentStats.economy}/100
    - 政治掌控: ${currentStats.politics}/100
    - 稳定程度: ${currentStats.stability}/100
    - 军事武力: ${currentStats.military}/100
    - 国土面积: ${currentStats.territory} 平方公里
    - 臣民人口: ${currentStats.population} 百万
    
    【历史背景】
    ${historySummary}
    
    【统治者谕旨】
    "${command}"
    
    【模拟要求】
    1. 基于现实主义考量进行推演。即使在虚构背景下，也要考虑逻辑、成本、后勤和社会契约。
    2. 描述需具有史诗感，使用中文正式用语（如“奏报”、“黎民”、“疆域”、“枢密院”等）。
    3. 如果命令过于荒谬，请描述其带来的灾难性后果。
    4. 两个月的时间很短，变化应合理且渐进。
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("占卜失败，天机不可泄露。");
  }
};
