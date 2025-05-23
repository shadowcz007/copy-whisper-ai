
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, AlertCircle } from "lucide-react";

export const ApiConfig = () => {
  const [config, setConfig] = useState({
    apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
    apiKey: "",
    model: "Qwen/Qwen2.5-7B-Instruct"
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // 从localStorage加载配置
    const savedConfig = localStorage.getItem("apiConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem("apiConfig", JSON.stringify(config));
    toast.success("API配置已保存");
  };

  const testConnection = async () => {
    if (!config.apiKey) {
      toast.error("请先输入API Key");
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus("idle");

    try {
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
              role: "user",
              content: "测试连接"
            }
          ],
          stream: false,
          max_tokens: 10
        })
      });

      if (response.ok) {
        setConnectionStatus("success");
        toast.success("API连接测试成功！");
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setConnectionStatus("error");
      toast.error("API连接测试失败，请检查配置");
      console.error("API test error:", error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="apiUrl">API URL</Label>
          <Input
            id="apiUrl"
            value={config.apiUrl}
            onChange={(e) => setConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
            placeholder="https://api.siliconflow.cn/v1/chat/completions"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            placeholder="请输入您的API Key"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">模型名称</Label>
          <Input
            id="model"
            value={config.model}
            onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
            placeholder="Qwen/Qwen2.5-7B-Instruct"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={saveConfig} variant="default">
          保存配置
        </Button>
        <Button 
          onClick={testConnection} 
          variant="outline" 
          disabled={isTestingConnection}
        >
          {isTestingConnection ? "测试中..." : "测试连接"}
        </Button>
        
        {connectionStatus === "success" && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm">连接正常</span>
          </div>
        )}
        
        {connectionStatus === "error" && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">连接失败</span>
          </div>
        )}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm">配置说明</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <ul className="space-y-1 list-disc list-inside">
            <li>API URL: LLM服务的请求地址</li>
            <li>API Key: 您的服务认证密钥</li>
            <li>模型: 要使用的具体AI模型名称</li>
            <li>建议使用支持中文的模型以获得更好的分析效果</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
