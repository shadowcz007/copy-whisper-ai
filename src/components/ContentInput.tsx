
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { storageService } from "@/lib/storage";
import { apiService } from "@/lib/api";

interface ContentSample {
  id: string;
  content: string;
  type: "high" | "low";
  timestamp: number;
}

export const ContentInput = ({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) => {
  const [newContent, setNewContent] = useState("");
  const [contentType, setContentType] = useState<"high" | "low">("high");
  const [samples, setSamples] = useState<ContentSample[]>(() => 
    storageService.getSamples()
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addSample = () => {
    if (!newContent.trim()) {
      toast.error("请输入文案内容");
      return;
    }

    const sample: ContentSample = {
      id: Date.now().toString(),
      content: newContent.trim(),
      type: contentType,
      timestamp: Date.now()
    };

    const updatedSamples = [...samples, sample];
    setSamples(updatedSamples);
    storageService.saveSamples(updatedSamples);
    setNewContent("");
    
    toast.success("文案样本添加成功");
  };

  const removeSample = (id: string) => {
    const updatedSamples = samples.filter(s => s.id !== id);
    setSamples(updatedSamples);
    storageService.saveSamples(updatedSamples);
    toast.success("样本已删除");
  };

  const analyzeFeatures = async () => {
    const highSamples = samples.filter(s => s.type === "high");
    const lowSamples = samples.filter(s => s.type === "low");

    if (highSamples.length === 0 || lowSamples.length === 0) {
      toast.error("请至少添加一个高转化和一个低转化的文案样本");
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysisResult = await apiService.analyzeFeatures(highSamples, lowSamples);
      onAnalysisComplete(analysisResult);
      toast.success("特征分析完成！");
    } catch (error) {
      toast.error("分析失败，请检查API配置");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const highCount = samples.filter(s => s.type === "high").length;
  const lowCount = samples.filter(s => s.type === "low").length;

  return (
    <div className="space-y-6">
      {/* 添加新样本 */}
      <Card>
        <CardHeader>
          <CardTitle>添加文案样本</CardTitle>
          <CardDescription>
            粘贴历史文案并标注转化率分类，建议每类至少添加3-5个样本以获得更准确的分析结果
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">文案内容</Label>
            <Textarea
              id="content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="粘贴您的历史文案内容..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>转化率分类</Label>
            <RadioGroup value={contentType} onValueChange={setContentType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  高转化率文案
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  低转化率文案
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={addSample} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            添加样本
          </Button>
        </CardContent>
      </Card>

      {/* 样本统计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>样本统计</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                高转化: {highCount}
              </Badge>
              <Badge variant="outline" className="text-red-600 border-red-200">
                <TrendingDown className="w-3 h-3 mr-1" />
                低转化: {lowCount}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {samples.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              还没有添加任何样本，请先添加一些文案样本进行分析
            </p>
          ) : (
            <div className="space-y-3">
              {samples.map((sample) => (
                <div 
                  key={sample.id} 
                  className="p-3 bg-gray-50 rounded-lg border flex justify-between items-start gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {sample.type === "high" ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          高转化
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          低转化
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{sample.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSample(sample.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {samples.length > 0 && (
            <Button 
              onClick={analyzeFeatures} 
              disabled={isAnalyzing || highCount === 0 || lowCount === 0}
              className="w-full mt-4"
            >
              {isAnalyzing ? "分析中..." : "开始特征分析"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
