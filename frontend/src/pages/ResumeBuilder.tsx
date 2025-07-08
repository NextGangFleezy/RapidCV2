import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import FileUpload from '@/components/FileUpload';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import TemplateSelector from '@/components/TemplateSelector';
import ATSScanner from '@/components/ATSScanner';
import { Upload, Save, Wand2, ArrowRight, FileText, Brain, FileSearch } from 'lucide-react';
import type { ResumeData, Resume } from '@/lib/types-frontend';
import type { FileUploadResult } from '@/lib/types';

export default function ResumeBuilder() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [resumeData, setResumeData] = useState<ResumeData>({
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
  });

  // Fetch existing resume if ID is provided
  const { data: existingResume, isLoading } = useQuery({
    queryKey: [`/api/resumes/${id}`],
    enabled: !!id,
  });

  // Load existing resume data
  useEffect(() => {
    if (existingResume && !isLoading) {
      const resume = existingResume as Resume;
      // Only update if we have actual resume data (not empty object)
      if (resume.id) {
        setResumeData({
          personalInfo: resume.personalInfo || {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
          },
          summary: resume.summary || '',
          workExperience: resume.workExperience || [],
          education: resume.education || [],
          skills: resume.skills || [],
          projects: resume.projects || [],
          template: resume.template || 'modern',
        });
      }
    }
  }, [existingResume, isLoading]);

  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (data: ResumeData) => {
      const payload = {
        title: data.personalInfo.fullName || 'Untitled Resume',
        personalInfo: data.personalInfo,
        summary: data.summary,
        workExperience: data.workExperience,
        education: data.education,
        skills: data.skills,
        projects: data.projects,
        template: data.template,
        userId: 'anonymous', // For MVP, using anonymous user
      };

      if (id) {
        return apiRequest('PUT', `/api/resumes/${id}`, payload);
      } else {
        return apiRequest('POST', '/api/resumes', payload);
      }
    },
    onSuccess: async (response) => {
      try {
        const savedResume: Resume = await response.json();
        
        toast({
          title: 'Resume Saved',
          description: 'Your resume has been saved successfully.',
        });

        // Invalidate queries and redirect if new resume
        queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
        
        if (!id) {
          setLocation(`/builder/${savedResume.id}`);
        }
      } catch (error) {
        console.error('Error parsing save response:', error);
        toast({
          title: 'Save Completed',
          description: 'Your resume has been saved.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your resume.',
        variant: 'destructive',
      });
    },
  });

  const handleFileProcessed = (result: FileUploadResult) => {
    const { parsedData, resumeId } = result;
    
    // If we got a resume ID from the upload, redirect to that resume
    if (resumeId) {
      setLocation(`/builder/${resumeId}`);
      toast({
        title: 'Resume Imported',
        description: 'Your resume has been imported and is ready for editing.',
      });
      return;
    }

    // Fallback to merging data (for backward compatibility)
    const newResumeData = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        ...parsedData.personalInfo,
      },
      summary: parsedData.summary || resumeData.summary,
      workExperience: parsedData.workExperience || resumeData.workExperience,
      education: parsedData.education || resumeData.education,
      skills: [...(resumeData.skills || []), ...(parsedData.skills || [])].filter((skill, index, arr) => 
        arr.indexOf(skill) === index
      ),
      projects: parsedData.projects || resumeData.projects,
    };
    
    setResumeData(newResumeData);

    toast({
      title: 'Resume Imported',
      description: 'Your resume has been imported and is ready for editing.',
    });

    // Auto-save the resume after importing
    saveResumeMutation.mutate(newResumeData);
  };

  const handleSave = () => {
    saveResumeMutation.mutate(resumeData);
  };

  const handleTemplateChange = (templateId: string) => {
    console.log('ResumeBuilder template change:', templateId);
    const updatedData = { ...resumeData, template: templateId };
    setResumeData(updatedData);
    
    // Auto-save the template change
    if (id) {
      console.log('Auto-saving template change...');
      saveResumeMutation.mutate(updatedData);
    }
  };

  const navigateToTailoring = () => {
    if (id) {
      setLocation(`/tailor/${id}`);
    } else {
      // Save first, then navigate
      saveResumeMutation.mutate(resumeData);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Resume Builder</h1>
              <p className="text-muted-foreground">
                Create and customize your professional resume with AI-powered optimization
              </p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button
                onClick={handleSave}
                disabled={saveResumeMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {saveResumeMutation.isPending ? (
                  <div className="loading-spinner mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Resume
              </Button>
              <Button
                onClick={navigateToTailoring}
                variant="outline"
                disabled={!resumeData.personalInfo.fullName}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                AI Tailor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            <Tabs defaultValue="build" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload" className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="build" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Build
                </TabsTrigger>
                <TabsTrigger value="template" className="flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  Template
                </TabsTrigger>
                <TabsTrigger value="ats" className="flex items-center">
                  <FileSearch className="mr-2 h-4 w-4" />
                  ATS Scan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Existing Resume</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Upload your current resume and we'll extract the information automatically
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      onFileProcessed={handleFileProcessed}
                      onError={(error) => {
                        toast({
                          title: 'Upload Error',
                          description: error,
                          variant: 'destructive',
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="build" className="mt-6">
                <ResumeForm
                  data={resumeData}
                  onChange={setResumeData}
                  onSave={handleSave}
                />
              </TabsContent>

              <TabsContent value="template" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Template</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Select a professional template that matches your industry and style
                    </p>
                  </CardHeader>
                  <CardContent>
                    <TemplateSelector
                      selectedTemplate={resumeData.template}
                      onTemplateChange={handleTemplateChange}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ats" className="mt-6">
                {id ? (
                  <ATSScanner resumeId={id} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>ATS Scanner</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Save your resume first to analyze ATS compatibility
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleSave} disabled={saveResumeMutation.isPending}>
                        Save Resume First
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <ResumePreview 
              data={resumeData} 
              template={resumeData.template} 
              onTemplateChange={handleTemplateChange}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to optimize for specific jobs?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our AI-powered job tailoring feature to customize your resume for specific job descriptions. 
              Automatically match keywords, optimize content, and increase your chances of getting interviews.
            </p>
            <Button
              size="lg"
              onClick={navigateToTailoring}
              disabled={!resumeData.personalInfo.fullName}
              className="bg-primary hover:bg-primary/90"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Start AI Job Tailoring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
