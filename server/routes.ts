import express, { Request } from 'express';

// Extend Request type for multer
interface RequestWithFile extends Request {
  file?: any; // Multer file type
}
import { z } from 'zod';
import { storage } from './storage';
import { 
  resumeDataSchema, 
  jobDescriptionSchema,
  insertResumeSchema,
  type ResumeData 
} from '@shared/schema';
import { analyzeJobDescription, parseResumeContent, analyzeATSCompatibility, enhanceResumeForATS } from './services/openai';
import { upload, extractTextFromFile, validateFileUpload } from './services/fileProcessor';
import { generatePDF } from './services/pdfGenerator';
import { generateWordDocument } from './services/wordGenerator';

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
router.post('/api/upload-resume', upload.single('file'), async (req: RequestWithFile, res) => {
  try {
    console.log('File upload request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });

    // Validate file upload
    validateFileUpload(req.file);
    
    // Extract text from file
    const uploadedFile = await extractTextFromFile(req.file!);
    
    // Try to parse with AI, but don't fail if AI is unavailable
    let parsedData = null;
    try {
      parsedData = await parseResumeContent(uploadedFile.content);
    } catch (aiError) {
      console.warn('AI parsing failed, returning raw text:', aiError);
      // Return basic structure with raw content if AI fails
      parsedData = {
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: ''
        },
        summary: uploadedFile.content.substring(0, 200) + '...',
        skills: [],
        workExperience: [],
        education: [],
        projects: []
      };
    }
    
    // Create a resume record in storage
    const resumeData = {
      title: parsedData.personalInfo?.fullName || 'Imported Resume',
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
      userId: 'anonymous'
    };

    const createdResume = await storage.createResume(resumeData);

    res.json({
      fileInfo: {
        name: uploadedFile.originalName,
        size: uploadedFile.size,
        type: uploadedFile.mimeType
      },
      parsedData,
      resumeId: createdResume.id,
      rawContent: uploadedFile.content
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ error: message });
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
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
  }
});

// ATS Compatibility Scan
router.post('/api/ats-scan', async (req, res) => {
  try {
    console.log('ATS scan endpoint called with body:', req.body);
    const { resumeId } = z.object({ resumeId: z.string() }).parse(req.body);
    console.log('Resume ID:', resumeId);
    
    // Get resume data
    const resume = await storage.getResume(resumeId);
    if (!resume) {
      console.log('Resume not found for ID:', resumeId);
      return res.status(404).json({ error: 'Resume not found' });
    }
    console.log('Resume found, proceeding with ATS analysis...');
    
    const resumeData: ResumeData = {
      personalInfo: resume.personalInfo,
      summary: resume.summary || '',
      workExperience: resume.workExperience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      projects: resume.projects || [],
      template: resume.template || 'modern'
    };
    
    // Analyze ATS compatibility
    console.log('Calling analyzeATSCompatibility...');
    const atsAnalysis = await analyzeATSCompatibility(resumeData);
    console.log('ATS analysis completed, sending response...');
    
    res.json(atsAnalysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('ATS scan error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
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
    console.log('PDF export request body:', JSON.stringify(req.body, null, 2));
    
    // Skip validation and create safe defaults for any missing data
    const rawData: any = req.body || {};
    
    // Fill in default values for missing fields
    const completeResumeData: ResumeData = {
      personalInfo: {
        fullName: rawData.personalInfo?.fullName || 'Resume',
        email: rawData.personalInfo?.email || '',
        phone: rawData.personalInfo?.phone || '',
        location: rawData.personalInfo?.location || '',
        website: rawData.personalInfo?.website || undefined,
        linkedin: rawData.personalInfo?.linkedin || undefined,
        github: rawData.personalInfo?.github || undefined,
      },
      summary: rawData.summary || '',
      workExperience: Array.isArray(rawData.workExperience) ? rawData.workExperience : [],
      education: Array.isArray(rawData.education) ? rawData.education : [],
      skills: Array.isArray(rawData.skills) ? rawData.skills : [],
      projects: Array.isArray(rawData.projects) ? rawData.projects : [],
      template: rawData.template || 'modern',
    };
    
    const pdfBuffer = await generatePDF(completeResumeData, completeResumeData.template);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${completeResumeData.personalInfo.fullName}_Resume.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Export resume as Word document
router.post('/api/export-word', async (req, res) => {
  try {
    console.log('Word export request body:', JSON.stringify(req.body, null, 2));
    
    // Skip validation and create safe defaults for any missing data
    const rawData: any = req.body || {};
    
    // Fill in default values for missing fields
    const completeResumeData: ResumeData = {
      personalInfo: {
        fullName: rawData.personalInfo?.fullName || 'Resume',
        email: rawData.personalInfo?.email || '',
        phone: rawData.personalInfo?.phone || '',
        location: rawData.personalInfo?.location || '',
        website: rawData.personalInfo?.website || undefined,
        linkedin: rawData.personalInfo?.linkedin || undefined,
        github: rawData.personalInfo?.github || undefined,
      },
      summary: rawData.summary || '',
      workExperience: Array.isArray(rawData.workExperience) ? rawData.workExperience : [],
      education: Array.isArray(rawData.education) ? rawData.education : [],
      skills: Array.isArray(rawData.skills) ? rawData.skills : [],
      projects: Array.isArray(rawData.projects) ? rawData.projects : [],
      template: rawData.template || 'modern',
    };
    
    const wordBuffer = await generateWordDocument(completeResumeData);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${completeResumeData.personalInfo.fullName}_Resume.docx"`);
    res.send(wordBuffer);
  } catch (error) {
    console.error('Word export error:', error);
    res.status(500).json({ error: 'Failed to generate Word document' });
  }
});

// ATS Enhancement - Applies ATS improvements to resume
router.post('/api/enhance-ats', async (req, res) => {
  try {
    const { resumeId, atsAnalysis } = z.object({ 
      resumeId: z.string(),
      atsAnalysis: z.object({
        overallScore: z.number(),
        issues: z.array(z.string()),
        recommendations: z.array(z.string()),
        keywordDensity: z.number(),
        formatCompliance: z.array(z.string())
      })
    }).parse(req.body);
    
    // Get resume data
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
    
    // Apply ATS enhancements using AI
    const enhancedResumeData = await enhanceResumeForATS(resumeData, atsAnalysis);
    
    // Update resume in storage
    const updatedResume = await storage.updateResume(resumeId, {
      summary: enhancedResumeData.summary,
      workExperience: enhancedResumeData.workExperience,
      education: enhancedResumeData.education,
      skills: enhancedResumeData.skills,
      projects: enhancedResumeData.projects,
    });
    
    res.json({ 
      message: 'ATS enhancements applied successfully',
      resume: updatedResume 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('ATS enhancement error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
  }
});

// Health check
router.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
