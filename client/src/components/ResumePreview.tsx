import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, ExternalLink, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { TEMPLATES } from '@/lib/types';
import type { ResumeData } from '@shared/schema';

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  onTemplateChange?: (templateId: string) => void;
}

export default function ResumePreview({ data, template = 'modern', onTemplateChange }: ResumePreviewProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${data.personalInfo.fullName}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Download Started',
          description: 'Your resume PDF is being downloaded.',
        });
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'There was an error generating your resume PDF.',
        variant: 'destructive',
      });
    }
  };

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
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resume Preview */}
      <Card className="resume-preview shadow-lg min-h-[800px]">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="contact-info text-gray-600 space-y-1">
              <div className="flex justify-center items-center space-x-4 text-sm">
                {data.personalInfo.email && (
                  <span>{data.personalInfo.email}</span>
                )}
                {data.personalInfo.phone && (
                  <span>{data.personalInfo.phone}</span>
                )}
                {data.personalInfo.location && (
                  <span>{data.personalInfo.location}</span>
                )}
              </div>
              <div className="flex justify-center items-center space-x-4 text-sm">
                {data.personalInfo.website && (
                  <a href={data.personalInfo.website} className="text-primary hover:underline">
                    Website
                  </a>
                )}
                {data.personalInfo.linkedin && (
                  <a href={data.personalInfo.linkedin} className="text-primary hover:underline">
                    LinkedIn
                  </a>
                )}
                {data.personalInfo.github && (
                  <a href={data.personalInfo.github} className="text-primary hover:underline">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {data.summary && (
            <div className="section">
              <h2>Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {data.workExperience && data.workExperience.length > 0 && (
            <div className="section">
              <h2>Work Experience</h2>
              {data.workExperience.map((exp) => (
                <div key={exp.id} className="experience-item">
                  <div className="item-header">
                    <div>
                      <h3 className="company">{exp.company}</h3>
                      <div className="position">{exp.position}</div>
                    </div>
                    <div className="date">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate || '', exp.current)}
                    </div>
                  </div>
                  {exp.location && (
                    <div className="text-sm text-gray-600 mb-2">{exp.location}</div>
                  )}
                  {exp.description && exp.description.length > 0 && (
                    <div className="description">
                      <ul>
                        {exp.description.filter(desc => desc.trim()).map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="section">
              <h2>Education</h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="education-item">
                  <div className="item-header">
                    <div>
                      <h3 className="institution">{edu.institution}</h3>
                      <div className="degree">{edu.degree} in {edu.field}</div>
                    </div>
                    <div className="date">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
                    </div>
                  </div>
                  {edu.gpa && (
                    <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="description">
                      <ul>
                        {edu.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="section">
              <h2>Skills</h2>
              <div className="skills-grid">
                {data.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="skill-tag">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="section">
              <h2>Projects</h2>
              {data.projects.map((project) => (
                <div key={project.id} className="project-item">
                  <div className="item-header">
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="flex space-x-2">
                      {project.url && (
                        <a 
                          href={project.url} 
                          className="text-primary text-sm hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Demo <ExternalLink className="inline h-3 w-3 ml-1" />
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github} 
                          className="text-primary text-sm hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Code <ExternalLink className="inline h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="skills-grid">
                      {project.technologies.map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!data.personalInfo.fullName && !data.summary && 
           (!data.workExperience || data.workExperience.length === 0) && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-medium mb-2">Resume Preview</p>
              <p>Start filling out the form to see your resume come to life!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
