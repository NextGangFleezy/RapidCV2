import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import type { UploadedFile } from '@shared/schema';

// Configure multer for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

export async function extractTextFromFile(file: Express.Multer.File): Promise<UploadedFile> {
  try {
    console.log('Processing file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bufferLength: file.buffer?.length
    });

    // Validate buffer exists
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error('File buffer is empty or corrupted');
    }

    let extractedText = '';
    
    if (file.mimetype === 'application/pdf') {
      console.log('Processing PDF file...');
      const pdfData = await pdfParse(file.buffer);
      extractedText = pdfData.text;
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      console.log('Processing Word document...');
      // Use convertToHtml to preserve more structure, then clean it
      const result = await mammoth.convertToHtml({ buffer: file.buffer });
      // Strip HTML tags but preserve line breaks
      extractedText = result.value
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    // Clean up the extracted text while preserving structure
    const cleanText = extractedText
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n') // Handle old Mac line endings
      .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
      .replace(/\n[ \t]+/g, '\n') // Remove leading whitespace from lines
      .replace(/[ \t]+\n/g, '\n') // Remove trailing whitespace from lines
      .replace(/\n{3,}/g, '\n\n') // Replace excessive line breaks with double breaks
      .trim();

    if (cleanText.length < 50) {
      throw new Error('Insufficient text content extracted from file. Please ensure the file contains readable text.');
    }

    return {
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      content: cleanText
    };

  } catch (error) {
    console.error('File processing error:', error);
    throw new Error(`Failed to process file: ${error.message}`);
  }
}

export function validateFileUpload(file?: Express.Multer.File): void {
  if (!file) {
    throw new Error('No file provided');
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only PDF and DOCX files are allowed.');
  }
}
