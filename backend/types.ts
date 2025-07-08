// Backend-only types and database schema
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

// Database record types
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

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().default(''),
  workExperience: z.array(z.any()).default([]),
  education: z.array(z.any()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.any()).default([]),
  template: z.string().default('modern')
});

export const insertResumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  personalInfo: personalInfoSchema,
  summary: z.string().optional(),
  workExperience: z.array(z.any()).default([]),
  education: z.array(z.any()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.any()).default([]),
  template: z.string().default('modern')
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type InsertJobAnalysis = {
  resumeId: string;
  jobDescription: string;
  analysis: JobAnalysis;
  tailoredResume?: ResumeData;
};