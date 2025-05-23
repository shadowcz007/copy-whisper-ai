
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, FileText, TrendingUp, Lightbulb } from "lucide-react";
import { ApiConfig } from "@/components/ApiConfig";
import { ContentInput } from "@/components/ContentInput";
import { FeatureAnalysis } from "@/components/FeatureAnalysis";
import { OptimizationSuggestions } from "@/components/OptimizationSuggestions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("input");
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                转化率优化工具
              </h1>
              <p className="text-gray-600 mt-1">基于AI分析提升文案转化效果</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border shadow-sm">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              API配置
            </TabsTrigger>
            <TabsTrigger value="input" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              数据录入
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              特征分析
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              优化建议
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API配置</CardTitle>
                <CardDescription>
                  配置LLM API服务用于文案分析和优化建议
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="input" className="space-y-6">
            <ContentInput onAnalysisComplete={setAnalysisData} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <FeatureAnalysis analysisData={analysisData} />
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <OptimizationSuggestions analysisData={analysisData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
