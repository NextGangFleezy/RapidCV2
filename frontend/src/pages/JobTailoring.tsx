import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ResumePreview from '@/components/ResumePreview';
import ATSScanner from '@/components/ATSScanner';
import { 
  ArrowLeft, Wand2, CheckCircle, AlertCircle, Target, 
  Brain, TrendingUp, FileText, Download, Lightbulb,
  Users, Award, Zap
} from 'lucide-react';
import type { Resume, ResumeData } from '@/lib/types-frontend';
import type { AnalysisResult } from '@/lib/types';

export default function JobTailoring() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  const [showATSScanner, setShowATSScanner] = useState(false);

  // Fetch resume data
  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: [`/api/resumes/${id}`],
    enabled: !!id,
  });

  // Job analysis mutation
  const analyzeJobMutation = useMutation({
    mutationFn: async ({ jobDescription, resumeId }: { jobDescription: string; resumeId: string }) => {
      setIsAnalyzing(true);
      
      const response = await apiRequest('POST', '/api/analyze-job', { jobDescription, resumeId });

      if (!response.ok) {
        throw new Error('Failed to analyze job description');
      }

      return response.json();
    },
    onSuccess: (result: AnalysisResult) => {
      setAnalysisResult(result);
      setShowOptimized(true);
      setShowATSScanner(true);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your resume has been optimized for this job description. Run an ATS scan to check compatibility.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze job description',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsAnalyzing(false);
    }
  });

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Job Description Required',
        description: 'Please paste a job description to analyze.',
        variant: 'destructive',
      });
      return;
    }

    if (jobDescription.length < 50) {
      toast({
        title: 'Job Description Too Short',
        description: 'Please provide a more detailed job description (at least 50 characters).',
        variant: 'destructive',
      });
      return;
    }

    if (!id) return;
    
    analyzeJobMutation.mutate({ jobDescription, resumeId: id });
  };

  const getCurrentResumeData = (): ResumeData => {
    if (!resume) {
      return {
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
        },
        summary: '',
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        template: 'modern',
      };
    }

    return {
      personalInfo: resume.personalInfo,
      summary: resume.summary || '',
      workExperience: resume.workExperience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      projects: resume.projects || [],
      template: resume.template || 'modern',
    };
  };

  const getPreviewData = (): ResumeData => {
    if (showOptimized && analysisResult) {
      return analysisResult.tailoredResume;
    }
    return getCurrentResumeData();
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!id) return;
    
    console.log('Template change requested:', templateId);
    
    try {
      // Update the resume template immediately
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templateId })
      });
      
      console.log('Template update response:', response.status);
      
      if (response.ok) {
        // Invalidate cache to refresh the data
        queryClient.invalidateQueries({ queryKey: [`/api/resumes/${id}`] });
        
        toast({
          title: 'Template Updated',
          description: `Resume template changed to ${templateId}.`,
        });
      } else {
        const errorData = await response.json();
        console.error('Template update failed:', errorData);
        toast({
          title: 'Update Failed',
          description: 'Failed to update template. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Template change error:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Resume Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The resume you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/builder">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Builder
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link href={`/builder/${id}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Builder
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Job Tailoring</h1>
              <p className="text-muted-foreground">
                Optimize your resume for specific job descriptions using AI
              </p>
            </div>
          </div>
          <Separator />
        </div>

        {/* Information Banner */}
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Zero Content Removal Policy:</strong> No information is ever omitted or deleted to improve match scores. Our AI only adds relevant keywords and expands your existing accomplishments with transferable skills emphasis. Every original bullet point, achievement, and job description is preserved and enhanced - never shortened or removed.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Job Analysis */}
          <div className="space-y-6">
            {/* Job Description Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Job Description
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paste the job description you want to tailor your resume for
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste the complete job description here. Include responsibilities, requirements, qualifications, and any specific skills mentioned..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {jobDescription.length} characters
                  </span>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="loading-spinner mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Analyze & Optimize
                      </>
                    )}
                  </Button>
                </div>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI is analyzing the job description...</span>
                      <span>Please wait</span>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <div className="space-y-4">
                {/* Match Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Match Score Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Original Score */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Before Optimization</span>
                          <span className="text-lg font-bold text-muted-foreground">
                            {analysisResult.analysis.originalMatchScore}%
                          </span>
                        </div>
                        <Progress value={analysisResult.analysis.originalMatchScore} className="h-2" />
                      </div>
                      
                      {/* Optimized Score */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">After Optimization</span>
                          <span className="text-lg font-bold text-green-600">
                            {analysisResult.analysis.optimizedMatchScore}%
                          </span>
                        </div>
                        <Progress value={analysisResult.analysis.optimizedMatchScore} className="h-2" />
                      </div>
                      
                      {/* Improvement Delta */}
                      {analysisResult.analysis.optimizedMatchScore > analysisResult.analysis.originalMatchScore && (
                        <div className="flex items-center justify-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              +{analysisResult.analysis.optimizedMatchScore - analysisResult.analysis.originalMatchScore}%
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              Improvement with optimization
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Skills Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Matched Skills */}
                    <div>
                      <div className="flex items-center mb-3">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="font-medium text-green-700 dark:text-green-400">
                          Matched Skills ({analysisResult.analysis.matchedSkills.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.matchedSkills.map((skill, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    {analysisResult.analysis.missingSkills.length > 0 && (
                      <div>
                        <div className="flex items-center mb-3">
                          <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="font-medium text-orange-700 dark:text-orange-400">
                            Missing Skills ({analysisResult.analysis.missingSkills.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.analysis.missingSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Key Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Key Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.analysis.keyRequirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* AI Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5" />
                      Transferable Skills Enhancement
                    </CardTitle>
                    <CardDescription>
                      These recommendations amplify your existing skills and experience to better match the job requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysisResult.analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <Zap className="h-4 w-4 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Improvement Areas */}
                {analysisResult.analysis.improvementAreas && analysisResult.analysis.improvementAreas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Skills to Amplify
                      </CardTitle>
                      <CardDescription>
                        Existing skills and experiences that should be emphasized more prominently
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.analysis.improvementAreas.map((area, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons with Score Context */}
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground text-center">
                    Compare your resume versions below
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant={showOptimized ? "secondary" : "default"}
                      onClick={() => setShowOptimized(false)}
                      className="flex-1"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Original ({analysisResult.analysis.originalMatchScore}%)
                    </Button>
                    <Button
                      variant={showOptimized ? "default" : "secondary"}
                      onClick={() => setShowOptimized(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      View Optimized ({analysisResult.analysis.optimizedMatchScore}%)
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ATS Scanner - Shows after job analysis */}
            {showATSScanner && analysisResult && (
              <ATSScanner resumeId={id!} />
            )}

            {/* Help Section */}
            {!analysisResult && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tips for better results:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Include the complete job description with responsibilities and requirements</li>
                    <li>Make sure to include required skills and qualifications</li>
                    <li>The more detailed the job posting, the better the AI optimization</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Panel - Resume Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-4">
              {analysisResult && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${showOptimized ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium">
                      {showOptimized ? 'AI-Optimized Resume' : 'Original Resume'}
                    </span>
                  </div>
                  {showOptimized && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Optimized
                    </Badge>
                  )}
                </div>
              )}
              
              <ResumePreview 
                data={getPreviewData()} 
                template={resume.template || 'modern'} 
                onTemplateChange={handleTemplateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
