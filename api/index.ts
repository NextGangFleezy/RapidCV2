import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import Anthropic from '@anthropic-ai/sdk';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// Types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  location?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements?: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  template: string;
}

interface Resume {
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

interface JobAnalysis {
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

interface ATSAnalysis {
  overallScore: number;
  issues: string[];
  recommendations: string[];
  keywordDensity: number;
  formatCompliance: string[];
}

// In-memory storage
const resumes = new Map<string, Resume>();
const jobAnalyses = new Map<string, any>();

// Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Create Express app
const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://rapid-cv2.vercel.app', 'https://*.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resume routes
app.get('/api/resumes', (req, res) => {
  const allResumes = Array.from(resumes.values());
  res.json(allResumes);
});

app.get('/api/resumes/:id', (req, res) => {
  const resume = resumes.get(req.params.id);
  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }
  res.json(resume);
});

app.post('/api/resumes', (req, res) => {
  try {
    const resumeData = req.body;
    const resume: Resume = {
      id: nanoid(),
      title: resumeData.title || 'Untitled Resume',
      personalInfo: resumeData.personalInfo,
      summary: resumeData.summary || '',
      workExperience: resumeData.workExperience || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      template: resumeData.template || 'modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    resumes.set(resume.id, resume);
    res.json(resume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ message: 'Failed to create resume' });
  }
});

app.put('/api/resumes/:id', (req, res) => {
  try {
    const existingResume = resumes.get(req.params.id);
    if (!existingResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const updated: Resume = {
      ...existingResume,
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    resumes.set(req.params.id, updated);
    res.json(updated);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Failed to update resume' });
  }
});

// File upload endpoint
app.post('/api/upload-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let extractedText = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      extractedText = result.value.replace(/<[^>]*>/g, '');
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload PDF or DOCX files.' });
    }

    // Parse with AI
    const parsedData = await parseResumeContent(extractedText);
    
    // Create resume
    const resume: Resume = {
      id: nanoid(),
      title: parsedData.personalInfo?.fullName ? `${parsedData.personalInfo.fullName}'s Resume` : 'Uploaded Resume',
      personalInfo: parsedData.personalInfo || {
        fullName: '',
        email: '',
        phone: '',
        location: ''
      },
      summary: parsedData.summary || '',
      workExperience: parsedData.workExperience || [],
      education: parsedData.education || [],
      skills: parsedData.skills || [],
      projects: parsedData.projects || [],
      template: 'modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    resumes.set(resume.id, resume);

    res.json({
      fileInfo: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
      },
      parsedData,
      resumeId: resume.id
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Failed to process file' });
  }
});

// Job analysis endpoint
app.post('/api/analyze-job', async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    
    const resume = resumes.get(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const analysis = await analyzeJobDescription(jobDescription, resume);
    
    const analysisRecord = {
      id: nanoid(),
      resumeId,
      jobDescription,
      analysis,
      createdAt: new Date().toISOString()
    };

    jobAnalyses.set(analysisRecord.id, analysisRecord);

    res.json({
      analysis,
      analysisId: analysisRecord.id
    });
  } catch (error) {
    console.error('Job analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze job description' });
  }
});

// ATS analysis endpoint
app.post('/api/ats-analysis', async (req, res) => {
  try {
    const { resumeId } = req.body;
    
    const resume = resumes.get(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const analysis = await analyzeATSCompatibility(resume);
    res.json(analysis);
  } catch (error) {
    console.error('ATS analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze ATS compatibility' });
  }
});

// AI functions
async function parseResumeContent(content: string): Promise<Partial<ResumeData>> {
  try {
    const prompt = `Parse this resume content and extract structured information. Return a JSON object with the following structure:
    {
      "personalInfo": {
        "fullName": "string",
        "email": "string", 
        "phone": "string",
        "location": "string",
        "website": "string (optional)",
        "linkedin": "string (optional)",
        "github": "string (optional)"
      },
      "summary": "string",
      "workExperience": [
        {
          "id": "generated_id",
          "company": "string",
          "position": "string", 
          "startDate": "YYYY-MM format",
          "endDate": "YYYY-MM format or null if current",
          "current": boolean,
          "description": ["array of achievement bullets"],
          "location": "string (optional)"
        }
      ],
      "education": [
        {
          "id": "generated_id",
          "institution": "string",
          "degree": "string",
          "field": "string",
          "startDate": "YYYY-MM format",
          "endDate": "YYYY-MM format", 
          "gpa": "string (optional)",
          "achievements": ["array (optional)"]
        }
      ],
      "skills": ["array of skills"],
      "projects": [
        {
          "id": "generated_id",
          "name": "string",
          "description": "string",
          "technologies": ["array"],
          "url": "string (optional)",
          "github": "string (optional)"
        }
      ]
    }

    Resume content:
    ${content}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = response.content[0].text;
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Resume parsing error:', error);
    return {};
  }
}

async function analyzeJobDescription(jobDescription: string, resumeData: ResumeData): Promise<JobAnalysis> {
  try {
    const prompt = `Analyze how well this resume matches the job description and provide optimization suggestions.

    Job Description:
    ${jobDescription}

    Current Resume:
    Name: ${resumeData.personalInfo.fullName}
    Summary: ${resumeData.summary}
    Skills: ${resumeData.skills.join(', ')}
    Experience: ${resumeData.workExperience.map(exp => `${exp.position} at ${exp.company}`).join('; ')}

    Provide analysis in this JSON format:
    {
      "matchedSkills": ["skills that match"],
      "missingSkills": ["skills mentioned in job but missing from resume"],
      "keyRequirements": ["main requirements from job description"],
      "originalMatchScore": number_0_to_100,
      "optimizedMatchScore": number_0_to_100,
      "suggestions": ["specific improvement suggestions"],
      "improvementAreas": ["areas where resume can be enhanced"]
    }`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = response.content[0].text;
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Job analysis error:', error);
    return {
      matchedSkills: [],
      missingSkills: [],
      keyRequirements: [],
      originalMatchScore: 0,
      optimizedMatchScore: 0,
      suggestions: ['Error analyzing job description'],
      improvementAreas: []
    };
  }
}

async function analyzeATSCompatibility(resumeData: ResumeData): Promise<ATSAnalysis> {
  try {
    const resumeText = `
      ${resumeData.personalInfo.fullName}
      ${resumeData.summary}
      Skills: ${resumeData.skills.join(', ')}
      Experience: ${resumeData.workExperience.map(exp => 
        `${exp.position} at ${exp.company}: ${exp.description.join(' ')}`
      ).join(' ')}
    `;

    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a realistic assessment.

    Resume Content:
    ${resumeText}

    Provide analysis in this JSON format:
    {
      "overallScore": number_between_45_and_85,
      "issues": ["specific ATS issues found"],
      "recommendations": ["actionable recommendations"],
      "keywordDensity": number_0_to_1,
      "formatCompliance": ["formatting strengths and weaknesses"]
    }

    Make the score realistic (45-85 range) and provide specific, actionable feedback.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = response.content[0].text;
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('ATS analysis error:', error);
    return {
      overallScore: 65,
      issues: ['Error analyzing resume'],
      recommendations: ['Please try again'],
      keywordDensity: 0.5,
      formatCompliance: ['Analysis temporarily unavailable']
    };
  }
}

// Export for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}