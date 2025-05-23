
interface ContentSample {
  id: string;
  content: string;
  type: "high" | "low";
  timestamp: number;
}

export const storageService = {
  getSamples: (): ContentSample[] => {
    try {
      const stored = localStorage.getItem("contentSamples");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading samples from storage:", error);
      return [];
    }
  },

  saveSamples: (samples: ContentSample[]): void => {
    try {
      localStorage.setItem("contentSamples", JSON.stringify(samples));
    } catch (error) {
      console.error("Error saving samples to storage:", error);
    }
  },

  getApiConfig: () => {
    try {
      const stored = localStorage.getItem("apiConfig");
      return stored ? JSON.parse(stored) : {
        apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
        apiKey: "",
        model: "Qwen/Qwen2.5-7B-Instruct"
      };
    } catch (error) {
      console.error("Error loading API config:", error);
      return {
        apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
        apiKey: "",
        model: "Qwen/Qwen2.5-7B-Instruct"
      };
    }
  }
};
