export interface AnalysisResult {
  analysis: {
    matchedSkills: string[];
    missingSkills: string[];
    keyRequirements: string[];
    originalMatchScore: number;
    optimizedMatchScore: number;
    suggestions: string[];
    enhancedSummary?: string;
    optimizedExperience?: any[];
    improvementAreas?: string[];
  };
  tailoredResume: any;
  analysisId: string;
}

export interface FileUploadResult {
  fileInfo: {
    name: string;
    size: number;
    type: string;
  };
  parsedData: any;
}

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  popular?: boolean;
}

export const TEMPLATES: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with subtle color accents. Perfect for tech and creative roles.',
    preview: '/templates/modern-preview.jpg',
    popular: true
  },
  {
    id: 'executive',
    name: 'Executive Classic',
    description: 'Sophisticated, traditional layout ideal for senior positions and corporate roles.',
    preview: '/templates/executive-preview.jpg'
  },
  {
    id: 'creative',
    name: 'Creative Edge',
    description: 'Stand out with unique design elements while maintaining professional readability.',
    preview: '/templates/creative-preview.jpg'
  }
];
