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
    let extractedText = '';
    
    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(file.buffer);
      extractedText = pdfData.text;
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else {
      throw new Error('Unsupported file type');
    }

    // Clean up the extracted text
    const cleanText = extractedText
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
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
