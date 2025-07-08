// Frontend-only types - no database dependencies
import { z } from 'zod';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  template: string;
}

export interface JobAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  keyRequirements: string[];
  originalMatchScore: number;
  optimizedMatchScore: number;
  suggestions: string[];
  enhancedSummary?: string;
  optimizedExperience?: WorkExperience[];
  improvementAreas?: string[];
}

export interface UploadedFile {
  originalName: string;
  size: number;
  mimeType: string;
  content: string;
}

export interface ATSAnalysis {
  overallScore: number;
  issues: string[];
  recommendations: string[];
  keywordDensity: number;
  formatCompliance: string[];
}

// Validation schemas
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal(''))
});

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.array(z.string()).default([]),
  location: z.string().optional()
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  achievements: z.array(z.string()).optional()
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).default([]),
  url: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().default(''),
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(projectSchema).default([]),
  template: z.string().default('modern')
});

export const jobDescriptionSchema = z.object({
  description: z.string().min(10, 'Job description must be at least 10 characters')
});

export const fileUploadSchema = z.object({
  file: z.any()
});

// Database record types for API responses
export interface Resume {
  id: string;
  userId?: string;
  title: string;
  personalInfo: PersonalInfo;
  summary?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  template: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobAnalysisRecord {
  id: string;
  resumeId: string;
  jobDescription: string;
  analysis: JobAnalysis;
  tailoredResume?: ResumeData;
  createdAt?: string;
}