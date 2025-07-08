import { nanoid } from 'nanoid';
import type { Resume, JobAnalysisRecord, InsertResume, InsertJobAnalysis, ResumeData } from './types.js';

export interface IStorage {
  // Resume operations
  createResume(data: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | null>;
  updateResume(id: string, data: Partial<InsertResume>): Promise<Resume | null>;
  deleteResume(id: string): Promise<boolean>;
  listResumes(userId?: string): Promise<Resume[]>;

  // Job analysis operations
  createJobAnalysis(data: InsertJobAnalysis): Promise<JobAnalysisRecord>;
  getJobAnalysis(id: string): Promise<JobAnalysisRecord | null>;
  getJobAnalysesByResume(resumeId: string): Promise<JobAnalysisRecord[]>;
  deleteJobAnalysis(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private resumes = new Map<string, Resume>();
  private jobAnalyses = new Map<string, JobAnalysisRecord>();

  async createResume(data: InsertResume): Promise<Resume> {
    const id = nanoid();
    const now = new Date();
    const resume: Resume = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResume(id: string): Promise<Resume | null> {
    return this.resumes.get(id) || null;
  }

  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume | null> {
    const existing = this.resumes.get(id);
    if (!existing) return null;

    const updated: Resume = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: string): Promise<boolean> {
    return this.resumes.delete(id);
  }

  async listResumes(userId?: string): Promise<Resume[]> {
    const allResumes = Array.from(this.resumes.values());
    if (userId) {
      return allResumes.filter(resume => resume.userId === userId);
    }
    return allResumes;
  }

  async createJobAnalysis(data: InsertJobAnalysis): Promise<JobAnalysisRecord> {
    const id = nanoid();
    const analysis: JobAnalysisRecord = {
      id,
      ...data,
      createdAt: new Date(),
    };
    this.jobAnalyses.set(id, analysis);
    return analysis;
  }

  async getJobAnalysis(id: string): Promise<JobAnalysisRecord | null> {
    return this.jobAnalyses.get(id) || null;
  }

  async getJobAnalysesByResume(resumeId: string): Promise<JobAnalysisRecord[]> {
    return Array.from(this.jobAnalyses.values())
      .filter(analysis => analysis.resumeId === resumeId);
  }

  async deleteJobAnalysis(id: string): Promise<boolean> {
    return this.jobAnalyses.delete(id);
  }
}

export const storage = new MemStorage();
