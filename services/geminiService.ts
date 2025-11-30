

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ReconciliationReport, ApplicationForm, DataErrorItem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Chat with Gemini Pro (gemini-3-pro-preview)
 * Used for the general AI assistant chatbot.
 */
export const chatWithGemini = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "你是一个物业专项维修资金审核中心的专家助手。请帮助审核员分析风险、理解工程预算和解读物业管理法规。请用专业、简洁的中文回答。",
      },
      history: history,
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
    return response.text || "抱歉，我无法生成回复。";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Search Grounding with Gemini Flash (gemini-2.5-flash)
 * Used for verifying regulations and getting up-to-date information.
 */
export const searchRegulations = async (query: string): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `用户查询: ${query}\n\n请根据最新的物业维修资金法规和新闻进行总结。请用中文回答。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "未找到相关结果。";
    
    // Extract grounding sources if available
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};

/**
 * AI Reconciliation Report Generation
 */
export const generateReconciliationReport = async (frequency: string, date: string, scope: string[]): Promise<ReconciliationReport | null> => {
    try {
        const prompt = `
        你是一个专业的财务对账AI助手。请针对物业维修资金系统生成一份详细的${frequency}对账报告数据。
        
        对账参数：
        - 周期：${frequency}
        - 日期/时间段：${date}
        - 对账范围：${scope.join('、')}

        请模拟一份对账结果，如果是“平账” (BALANCED)，则差额为0；如果是“不平账” (UNBALANCED)，请随机编造1-2个合理的差异原因（如：银行已入账系统未入账、金额录入尾差、跨行转账延迟等）。

        请严格按照 JSON 格式输出。
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "你是一个财务系统内核。只输出符合Schema定义的JSON数据，不要包含Markdown标记。",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.OBJECT,
                            properties: {
                                totalCount: { type: Type.NUMBER },
                                totalSystemAmount: { type: Type.NUMBER },
                                totalBankAmount: { type: Type.NUMBER },
                                status: { type: Type.STRING, enum: ["BALANCED", "UNBALANCED"] },
                                generatedAt: { type: Type.STRING }
                            },
                            required: ["totalCount", "totalSystemAmount", "totalBankAmount", "status", "generatedAt"]
                        },
                        details: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING },
                                    systemAmount: { type: Type.NUMBER },
                                    bankAmount: { type: Type.NUMBER },
                                    diff: { type: Type.NUMBER },
                                    status: { type: Type.STRING, enum: ["MATCH", "MISMATCH"] },
                                    note: { type: Type.STRING }
                                },
                                required: ["category", "systemAmount", "bankAmount", "diff", "status"]
                            }
                        },
                        analysis: {
                            type: Type.OBJECT,
                            properties: {
                                issueDescription: { type: Type.STRING },
                                suggestion: { type: Type.STRING }
                            },
                            required: ["issueDescription", "suggestion"]
                        }
                    },
                    required: ["summary", "details", "analysis"]
                }
            }
        });

        if (response.text) {
             return JSON.parse(response.text) as ReconciliationReport;
        }
        return null;
    } catch (error) {
        console.error("Gemini Reconciliation Error:", error);
        throw error;
    }
}

/**
 * Smart Form Filling Extraction
 */
export const extractApplicationData = async (text: string): Promise<ApplicationForm | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `请从以下文本中提取物业维修资金申请表单所需的信息。文本内容：\n\n${text}`,
            config: {
                systemInstruction: "你是一个智能表单填充助手。请从用户提供的文本（可能是合同、会议记录或申请说明）中提取关键字段。如果没有找到对应信息，请留空字符串或0。必须返回符合Schema的JSON。",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        communityName: { type: Type.STRING, description: "小区名称" },
                        projectName: { type: Type.STRING, description: "维修项目名称" },
                        applyAmount: { type: Type.NUMBER, description: "申请金额" },
                        constructionCompany: { type: Type.STRING, description: "施工单位名称" },
                        contactPerson: { type: Type.STRING, description: "联系人姓名" },
                        contactPhone: { type: Type.STRING, description: "联系电话" },
                        emergencyType: { type: Type.STRING, enum: ["Y", "N"], description: "是否紧急维修(Y/N)" },
                        description: { type: Type.STRING, description: "申请事项描述" }
                    },
                    required: ["communityName", "projectName", "applyAmount", "constructionCompany", "emergencyType", "description"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as ApplicationForm;
        }
        return null;
    } catch (error) {
        console.error("Gemini Form Extraction Error:", error);
        throw error;
    }
};

/**
 * AI Property Data Repair
 */
export const repairPropertyData = async (errors: DataErrorItem[]): Promise<DataErrorItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview", // Use Pro for complex reasoning
            contents: `请分析以下物业基础数据错误，并进行智能修复建议。
            错误列表: ${JSON.stringify(errors.map(e => ({
                id: e.id,
                context: `${e.communityName} ${e.location}`,
                issue: e.description,
                original: e.originalValue
            })))}
            
            修复规则：
            1. 房屋坐落：标准化为 "X号楼 X单元 X室" 或 "X号楼 X室" 格式。
            2. 楼层：将英文 (Ground Floor) 或描述性文字 (底商) 转换为数字楼层。
            3. 业主姓名：去除多余的符号、括号备注或数字。
            4. 门牌号：如果为空，尝试根据上下文推断，或者标记为 "需人工核实"。
            
            请返回包含建议值、置信度(0-1)和修复理由的列表。`,
            config: {
                systemInstruction: "你是一个数据治理专家。请处理输入的脏数据并返回清洗后的建议。必须返回符合Schema的JSON。",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                         type: Type.OBJECT,
                         properties: {
                            id: { type: Type.STRING },
                            suggestedValue: { type: Type.STRING },
                            confidence: { type: Type.NUMBER },
                            reasoning: { type: Type.STRING }
                         },
                         required: ["id", "suggestedValue", "confidence", "reasoning"]
                    }
                }
            }
        });

        if (response.text) {
            const results = JSON.parse(response.text) as any[];
            // Merge results back into original items
            return errors.map(err => {
                const res = results.find(r => r.id === err.id);
                if (res) {
                    return {
                        ...err,
                        suggestedValue: res.suggestedValue,
                        confidence: res.confidence,
                        reasoning: res.reasoning,
                        status: 'ANALYZED'
                    };
                }
                return err;
            });
        }
        return errors;
    } catch (error) {
        console.error("Gemini Repair Error:", error);
        throw error;
    }
}