import { pgTable, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Resume data schema
export const resumes = pgTable('resumes', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  title: text('title').notNull(),
  personalInfo: jsonb('personal_info').$type<PersonalInfo>().notNull(),
  summary: text('summary'),
  workExperience: jsonb('work_experience').$type<WorkExperience[]>().default([]),
  education: jsonb('education').$type<Education[]>().default([]),
  skills: jsonb('skills').$type<string[]>().default([]),
  projects: jsonb('projects').$type<Project[]>().default([]),
  template: text('template').default('modern'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Job analysis schema
export const jobAnalyses = pgTable('job_analyses', {
  id: text('id').primaryKey(),
  resumeId: text('resume_id').notNull(),
  jobDescription: text('job_description').notNull(),
  analysis: jsonb('analysis').$type<JobAnalysis>().notNull(),
  tailoredResume: jsonb('tailored_resume').$type<ResumeData>(),
  createdAt: timestamp('created_at').defaultNow(),
});

// TypeScript interfaces
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

// Zod schemas for validation
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.array(z.string()),
  location: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()),
  url: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string(),
  workExperience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  projects: z.array(projectSchema),
  template: z.string(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobAnalysisSchema = createInsertSchema(jobAnalyses).omit({
  id: true,
  createdAt: true,
});

export const jobDescriptionSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  resumeId: z.string().min(1, 'Resume ID is required'),
});

export const fileUploadSchema = z.object({
  file: z.any(),
});

// Types
export type Resume = typeof resumes.$inferSelect;
export type JobAnalysisRecord = typeof jobAnalyses.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type InsertJobAnalysis = z.infer<typeof insertJobAnalysisSchema>;
