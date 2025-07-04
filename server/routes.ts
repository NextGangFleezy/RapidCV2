import express from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { 
  resumeDataSchema, 
  jobDescriptionSchema,
  insertResumeSchema,
  type ResumeData 
} from '@shared/schema';
import { analyzeJobDescription, parseResumeContent } from './services/openai';
import { upload, extractTextFromFile, validateFileUpload } from './services/fileProcessor';
import { generatePDF } from './services/pdfGenerator';

const router = express.Router();

// Get all resumes
router.get('/api/resumes', async (req, res) => {
  try {
    const resumes = await storage.listResumes();
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Get single resume
router.get('/api/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await storage.getResume(id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Create new resume
router.post('/api/resumes', async (req, res) => {
  try {
    const validatedData = insertResumeSchema.parse(req.body);
    const resume = await storage.createResume(validatedData);
    res.status(201).json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating resume:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Update resume
router.put('/api/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertResumeSchema.partial().parse(req.body);
    
    const resume = await storage.updateResume(id, validatedData);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Delete resume
router.delete('/api/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteResume(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// Upload and parse resume file
router.post('/api/upload-resume', upload.single('file'), async (req, res) => {
  try {
    validateFileUpload(req.file);
    
    const uploadedFile = await extractTextFromFile(req.file!);
    const parsedData = await parseResumeContent(uploadedFile.content);
    
    res.json({
      fileInfo: {
        name: uploadedFile.originalName,
        size: uploadedFile.size,
        type: uploadedFile.mimeType
      },
      parsedData
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Analyze job description and tailor resume
router.post('/api/analyze-job', async (req, res) => {
  try {
    const { jobDescription, resumeId } = jobDescriptionSchema.parse(req.body);
    
    const resume = await storage.getResume(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    const resumeData: ResumeData = {
      personalInfo: resume.personalInfo,
      summary: resume.summary || '',
      workExperience: resume.workExperience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      projects: resume.projects || [],
      template: resume.template || 'modern'
    };
    
    const analysis = await analyzeJobDescription(jobDescription, resumeData);
    
    // Create tailored resume data
    const tailoredResume: ResumeData = {
      ...resumeData,
      summary: analysis.enhancedSummary || resumeData.summary,
      workExperience: analysis.optimizedExperience || resumeData.workExperience
    };
    
    // Save job analysis
    const jobAnalysis = await storage.createJobAnalysis({
      resumeId,
      jobDescription,
      analysis,
      tailoredResume
    });
    
    res.json({
      analysis,
      tailoredResume,
      analysisId: jobAnalysis.id
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Job analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job analyses for a resume
router.get('/api/resumes/:id/analyses', async (req, res) => {
  try {
    const { id } = req.params;
    const analyses = await storage.getJobAnalysesByResume(id);
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching job analyses:', error);
    res.status(500).json({ error: 'Failed to fetch job analyses' });
  }
});

// Export resume as PDF
router.post('/api/export-pdf', async (req, res) => {
  try {
    const resumeData = resumeDataSchema.parse(req.body);
    const pdfBuffer = await generatePDF(resumeData, resumeData.template);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo.fullName}_Resume.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Health check
router.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
