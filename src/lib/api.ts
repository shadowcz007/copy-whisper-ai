
import { storageService } from "./storage";

interface ContentSample {
  id: string;
  content: string;
  type: "high" | "low";
  timestamp: number;
}

interface AnalysisData {
  highFeatures: string[];
  lowFeatures: string[];
  keyDifferences: string[];
  recommendations: string[];
}

interface OptimizationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  optimizedVersion: string;
}

export const apiService = {
  async callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
    const config = storageService.getApiConfig();
    
    if (!config.apiKey) {
      throw new Error("请先配置API Key");
    }

    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        stream: false,
        max_tokens: 1024,
        enable_thinking: false
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  async analyzeFeatures(highSamples: ContentSample[], lowSamples: ContentSample[]): Promise<AnalysisData> {
    const systemPrompt = `你是一个专业的文案转化率分析专家。请分析提供的高转化和低转化文案样本，提取关键特征和差异。

请按照以下JSON格式返回分析结果：
{
  "highFeatures": ["高转化文案的特征1", "特征2", "特征3"],
  "lowFeatures": ["低转化文案的特征1", "特征2", "特征3"],
  "keyDifferences": ["关键差异1", "差异2", "差异3"],
  "recommendations": ["优化建议1", "建议2", "建议3"]
}

分析维度包括但不限于：
- 情感色彩和语调
- 关键词和短语使用
- 句式结构和长度
- 行动召唤的强度
- 紧迫感和稀缺性表达
- 价值主张的呈现方式`;

    const userPrompt = `请分析以下文案样本：

高转化率文案样本：
${highSamples.map((s, i) => `${i + 1}. ${s.content}`).join('\n')}

低转化率文案样本：
${lowSamples.map((s, i) => `${i + 1}. ${s.content}`).join('\n')}

请提供详细的特征分析和优化建议。`;

    const result = await this.callLLM(systemPrompt, userPrompt);
    
    try {
      return JSON.parse(result);
    } catch (error) {
      // 如果返回的不是有效JSON，尝试解析文本内容
      console.error("API返回的不是有效JSON，尝试解析文本内容");
      throw new Error("分析结果格式错误，请重试");
    }
  },

  async optimizeContent(content: string, analysisData: AnalysisData): Promise<OptimizationResult> {
    const systemPrompt = `你是一个专业的文案优化专家。基于已有的转化率特征分析，为新文案提供优化建议。

请按照以下JSON格式返回分析结果：
{
  "score": 75,
  "strengths": ["当前文案的优势1", "优势2"],
  "weaknesses": ["需要改进的问题1", "问题2"],
  "suggestions": ["具体优化建议1", "建议2", "建议3"],
  "optimizedVersion": "优化后的文案版本"
}

评分标准（0-100分）：
- 80-100分：优秀，转化潜力很高
- 60-79分：良好，有一定转化潜力
- 40-59分：一般，需要一些优化
- 0-39分：较差，需要大幅改进`;

    const userPrompt = `基于以下特征分析结果，请评估并优化这段文案：

待优化文案：
"${content}"

高转化特征参考：
${analysisData.highFeatures.join('\n')}

低转化特征（需避免）：
${analysisData.lowFeatures.join('\n')}

关键差异：
${analysisData.keyDifferences.join('\n')}

请提供详细的评分、优势、问题分析、具体优化建议和改进版本。`;

    const result = await this.callLLM(systemPrompt, userPrompt);
    
    try {
      return JSON.parse(result);
    } catch (error) {
      console.error("API返回的不是有效JSON，尝试解析文本内容");
      throw new Error("优化结果格式错误，请重试");
    }
  }
};
