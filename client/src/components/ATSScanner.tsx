import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, FileSearch, Target, TrendingUp, Wand2, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { ATSAnalysis } from '@shared/schema';

interface ATSScannerProps {
  resumeId: string;
}

export default function ATSScanner({ resumeId }: ATSScannerProps) {
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (): Promise<ATSAnalysis> => {
      const response = await apiRequest('POST', '/api/ats-scan', { resumeId });
      
      if (!response.ok) {
        throw new Error('Failed to analyze ATS compatibility');
      }
      
      return response.json();
    },
    onSuccess: (data: ATSAnalysis) => {
      setAnalysis(data);
      toast({
        title: 'ATS Scan Complete',
        description: `Your resume scored ${data.overallScore}/100 for ATS compatibility.`
      });
    },
    onError: (error) => {
      toast({
        title: 'ATS Scan Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze ATS compatibility',
        variant: 'destructive',
      });
    }
  });

  // ATS Enhancement mutation - applies ATS improvements to resume
  const enhanceMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      if (!analysis) throw new Error('No ATS analysis available');
      
      const response = await apiRequest('POST', '/api/enhance-ats', { 
        resumeId,
        atsAnalysis: analysis
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply ATS enhancements');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh resume data
      queryClient.invalidateQueries({ queryKey: [`/api/resumes/${resumeId}`] });
      
      toast({
        title: 'ATS Enhancements Applied',
        description: 'Your resume has been optimized for better ATS compatibility.',
      });
      
      // Trigger a new ATS scan to show improvements
      scanMutation.mutate();
    },
    onError: (error) => {
      toast({
        title: 'Enhancement Failed',
        description: error instanceof Error ? error.message : 'Failed to apply ATS enhancements',
        variant: 'destructive',
      });
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileSearch className="h-5 w-5 text-blue-600" />
            <CardTitle>ATS Compatibility Scanner</CardTitle>
          </div>
          <CardDescription>
            Analyze how well your resume performs with Applicant Tracking Systems (ATS)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending}
            className="w-full"
          >
            {scanMutation.isPending ? 'Scanning Resume...' : 'Run ATS Scan'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                ATS Compatibility Score
                <Badge variant={getScoreBadgeVariant(analysis.overallScore)}>
                  {analysis.overallScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={analysis.overallScore} className="w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Keyword Density</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.keywordDensity)}`}>
                      {analysis.keywordDensity}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Format Compliance</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.formatCompliance.length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format Compliance */}
          {analysis.formatCompliance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Format Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.formatCompliance.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span>Issues Found</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.issues.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Improvement Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhancement Actions */}
          {analysis.overallScore < 90 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  <span>ATS Enhancement</span>
                </CardTitle>
                <CardDescription>
                  Automatically apply ATS improvements to optimize your resume for better compatibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <Button
                    onClick={() => enhanceMutation.mutate()}
                    disabled={enhanceMutation.isPending}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {enhanceMutation.isPending ? (
                      <>
                        <div className="loading-spinner mr-2" />
                        Applying Enhancements...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Apply ATS Improvements
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => scanMutation.mutate()}
                    disabled={scanMutation.isPending}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-scan
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Enhancement will improve keyword density, format compliance, and address identified issues while preserving all original content.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}