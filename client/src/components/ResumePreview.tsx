import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, ExternalLink, Palette, FileText, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TEMPLATES } from '@/lib/types';
import type { ResumeData } from '@shared/schema';

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  onTemplateChange?: (templateId: string) => void;
}

export default function ResumePreview({ data, template = 'modern', onTemplateChange }: ResumePreviewProps) {
  const { toast } = useToast();

  const handleDownload = async (format: 'pdf' | 'word') => {
    try {
      const endpoint = format === 'pdf' ? '/api/export-pdf' : '/api/export-word';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, template }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const extension = format === 'pdf' ? 'pdf' : 'docx';
        a.download = `${data.personalInfo.fullName}_Resume.${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Download Started',
          description: `Your resume ${format.toUpperCase()} is being downloaded.`,
        });
      } else {
        throw new Error(`Failed to generate ${format.toUpperCase()}`);
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: `There was an error generating your resume ${format.toUpperCase()}.`,
        variant: 'destructive',
      });
    }
  };

  const handleDownloadWord = () => handleDownload('word');
  const handleDownloadPDF = () => handleDownload('pdf');

  const formatDate = (dateStr: string, current: boolean = false) => {
    if (current) return 'Present';
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr + '-01');
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  const renderTemplateContent = () => {
    console.log('Rendering template:', template);
    switch (template) {
      case 'modern':
        return renderModernTemplate();
      case 'classic':
        return renderClassicTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'minimalist':
        return renderMinimalistTemplate();
      case 'executive':
        return renderExecutiveTemplate();
      default:
        console.log('Unknown template, falling back to modern:', template);
        return renderModernTemplate();
    }
  };

  const renderModernTemplate = () => (
    <div className="bg-white text-gray-900 p-8 min-h-full">
      {/* Modern Template Header with Blue Accent */}
      <div className="border-l-4 border-blue-600 pl-6 mb-8 bg-blue-50/50 p-4 rounded-r-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.fullName}</h1>
        <div className="text-blue-600 space-y-1">
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
        </div>
      </div>
      {renderCommonSections()}
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="bg-white text-gray-900 p-8 min-h-full">
      {/* Classic Template Header with Formal Styling */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8 bg-gray-50 p-6 rounded-lg">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">{data.personalInfo.fullName}</h1>
        <div className="text-gray-700 space-x-4 text-lg">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          {data.personalInfo.location && (
            <>
              <span>•</span>
              <span>{data.personalInfo.location}</span>
            </>
          )}
        </div>
      </div>
      {renderCommonSections()}
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900 p-8 min-h-full">
      {/* Creative Template Header with Gradient Design */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-8 rounded-2xl mb-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-4 tracking-wide">{data.personalInfo.fullName}</h1>
        <div className="space-y-2 text-purple-100 text-lg">
          <p className="flex items-center gap-2">📧 {data.personalInfo.email}</p>
          <p className="flex items-center gap-2">📱 {data.personalInfo.phone}</p>
          {data.personalInfo.location && <p className="flex items-center gap-2">📍 {data.personalInfo.location}</p>}
        </div>
      </div>
      {renderCommonSections()}
    </div>
  );

  const renderMinimalistTemplate = () => (
    <div className="bg-gray-50 text-gray-900 p-12 min-h-full font-light">
      {/* Minimalist Template Header with Clean Typography */}
      <div className="mb-16 border-b border-gray-200 pb-8">
        <h1 className="text-5xl font-thin text-gray-900 mb-6 tracking-widest uppercase">{data.personalInfo.fullName}</h1>
        <div className="text-gray-400 text-xs space-x-8 uppercase tracking-wide">
          <span>{data.personalInfo.email}</span>
          <span>|</span>
          <span>{data.personalInfo.phone}</span>
          {data.personalInfo.location && (
            <>
              <span>|</span>
              <span>{data.personalInfo.location}</span>
            </>
          )}
        </div>
      </div>
      {renderCommonSections()}
    </div>
  );

  const renderExecutiveTemplate = () => (
    <div className="bg-white text-gray-900 p-8 min-h-full">
      {/* Executive Template Header with Professional Dark Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-10 -m-8 mb-8 relative">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">{data.personalInfo.fullName}</h1>
        <div className="text-slate-200 space-y-2 text-lg">
          <p className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            {data.personalInfo.email}
          </p>
          <p className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            {data.personalInfo.phone}
          </p>
          {data.personalInfo.location && (
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              {data.personalInfo.location}
            </p>
          )}
        </div>
      </div>
      {renderCommonSections()}
    </div>
  );

  const renderCommonSections = () => (
    <>
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.workExperience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.position}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    <p>{formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate || '')}</p>
                    {job.location && <p>{job.location}</p>}
                  </div>
                </div>
                {job.description.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    {job.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <p>{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <div className="text-sm text-gray-500">
                    {project.startDate && (
                      <span>{formatDate(project.startDate)} - {formatDate(project.endDate || '', !project.endDate)}</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {(project.url || project.github) && (
                  <div className="flex gap-4 text-sm">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Source Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <div className="flex items-center space-x-3">
          {onTemplateChange && (
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Select value={template} onValueChange={onTemplateChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((templateOption) => (
                    <SelectItem key={templateOption.id} value={templateOption.id}>
                      {templateOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleDownloadWord}>
            <FileText className="h-4 w-4 mr-2" />
            Word
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <FileImage className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resume Preview */}
      <Card className="resume-preview shadow-lg min-h-[800px] overflow-hidden">
        <CardContent className="p-0">{renderTemplateContent()}</CardContent>
      </Card>
    </div>
  );
}