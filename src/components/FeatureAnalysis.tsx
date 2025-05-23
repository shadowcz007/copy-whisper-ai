
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

interface AnalysisData {
  highFeatures: string[];
  lowFeatures: string[];
  keyDifferences: string[];
  recommendations: string[];
}

export const FeatureAnalysis = ({ analysisData }: { analysisData: AnalysisData | null }) => {
  if (!analysisData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>特征分析结果</CardTitle>
          <CardDescription>
            请先在"数据录入"页面添加文案样本并进行分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无分析数据</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 高转化特征 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="w-5 h-5" />
            高转化率文案特征
          </CardTitle>
          <CardDescription>
            这些特征在高转化率文案中更常见
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {analysisData.highFeatures.map((feature, index) => (
              <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 低转化特征 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <TrendingDown className="w-5 h-5" />
            低转化率文案特征
          </CardTitle>
          <CardDescription>
            这些特征在低转化率文案中更常见，应该避免
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {analysisData.lowFeatures.map((feature, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-800">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 关键差异 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            关键差异分析
          </CardTitle>
          <CardDescription>
            高转化与低转化文案的核心区别
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {analysisData.keyDifferences.map((difference, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{difference}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
