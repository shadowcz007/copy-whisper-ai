
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Lightbulb, FileText, Zap, AlertTriangle } from "lucide-react";
import { apiService } from "@/lib/api";

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

export const OptimizationSuggestions = ({ analysisData }: { analysisData: AnalysisData | null }) => {
  const [newContent, setNewContent] = useState("");
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeContent = async () => {
    if (!newContent.trim()) {
      toast.error("请输入要优化的文案内容");
      return;
    }

    if (!analysisData) {
      toast.error("请先完成特征分析");
      return;
    }

    setIsOptimizing(true);

    try {
      const result = await apiService.optimizeContent(newContent, analysisData);
      setOptimizationResult(result);
      toast.success("文案优化完成！");
    } catch (error) {
      toast.error("优化失败，请检查API配置");
      console.error("Optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!analysisData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>文案优化建议</CardTitle>
          <CardDescription>
            请先完成特征分析后再使用此功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">请先进行特征分析</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 文案输入 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            输入待优化文案
          </CardTitle>
          <CardDescription>
            输入您想要优化的新文案，系统将基于特征分析结果给出具体建议
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newContent">文案内容</Label>
            <Textarea
              id="newContent"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="请输入您想要优化的文案内容..."
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={optimizeContent} 
            disabled={isOptimizing || !newContent.trim()}
            className="w-full"
          >
            {isOptimizing ? "分析优化中..." : "获取优化建议"}
          </Button>
        </CardContent>
      </Card>

      {/* 优化结果 */}
      {optimizationResult && (
        <div className="space-y-6">
          {/* 评分卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  转化潜力评分
                </span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {optimizationResult.score}
                  </div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${optimizationResult.score}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {optimizationResult.score >= 80 ? "优秀" : 
                 optimizationResult.score >= 60 ? "良好" : 
                 optimizationResult.score >= 40 ? "一般" : "需要改进"}
              </p>
            </CardContent>
          </Card>

          {/* 优势分析 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Zap className="w-5 h-5" />
                文案优势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {optimizationResult.strengths.map((strength, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 问题分析 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                需要改进的问题
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {optimizationResult.weaknesses.map((weakness, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{weakness}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 优化建议 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                具体优化建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {optimizationResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 优化版本 */}
          {optimizationResult.optimizedVersion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  AI优化版本
                </CardTitle>
                <CardDescription>
                  基于分析结果重写的优化版本，仅供参考
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {optimizationResult.optimizedVersion}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
