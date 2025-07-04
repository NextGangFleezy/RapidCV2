# Rapid CV - AI-Powered Resume Builder

## Overview

Replit 2.0 is a full-stack SaaS platform that helps users create and optimize resumes tailored for specific job applications using AI. The application combines a modern React frontend with an Express.js backend, leveraging Anthropic's Claude models for intelligent resume analysis and optimization.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage (MemStorage) for MVP
- **AI Integration**: Anthropic Claude API (claude-sonnet-4-20250514 model)
- **File Processing**: Support for PDF and DOCX file uploads with text extraction
- **PDF Generation**: Puppeteer for server-side PDF creation
- **Server**: Simplified Express setup with CORS and static file serving

## Key Components

### Database Schema
- **Resumes Table**: Stores resume data with JSONB fields for flexible content structure
- **Job Analyses Table**: Stores AI analysis results and tailored resume versions
- **Personal Info**: Contact details and social profiles
- **Work Experience**: Company, position, dates, and achievement bullets
- **Education**: Academic background and certifications
- **Skills & Projects**: Technical skills and portfolio projects

### API Endpoints
- `GET/POST /api/resumes` - Resume CRUD operations
- `POST /api/analyze-job` - AI-powered job description analysis
- `POST /api/export-pdf` - PDF generation service
- `POST /api/upload-resume` - File upload and parsing
- `POST /api/parse-resume` - Extract structured data from uploaded files

### Core Features
1. **Resume Builder**: Dynamic form-based resume creation with live preview
2. **AI Job Matching**: Analyze job descriptions and optimize resumes automatically
3. **Template System**: Multiple professional resume templates
4. **File Upload**: Import existing resumes from PDF/DOCX files
5. **PDF Export**: One-click professional PDF generation
6. **Real-time Preview**: Live preview of resume changes

## Data Flow

1. **Resume Creation**: Users input data through forms → stored in PostgreSQL → live preview updates
2. **Job Analysis**: Job description → OpenAI API → skills matching → optimized resume suggestions
3. **File Upload**: PDF/DOCX → text extraction → structured data parsing → form population
4. **PDF Export**: Resume data → HTML template → Puppeteer → PDF download

## External Dependencies

### Required Services
- **Anthropic API**: Claude Sonnet 4 model for resume analysis and optimization
- **Puppeteer**: Headless Chrome for PDF generation

### Key Libraries
- **Frontend**: React, TanStack Query, React Hook Form, Zod, Tailwind CSS, shadcn/ui
- **Backend**: Express, Anthropic SDK, Multer, pdf-parse, mammoth
- **Development**: Vite, TypeScript, ESLint, PostCSS

## Deployment Strategy

### Development Setup
- Vite dev server for frontend with HMR
- Express server with tsx for TypeScript execution
- Environment variables for API keys and database connection
- Drizzle Kit for database migrations

### Production Build
- `npm run build`: Vite builds frontend, esbuild bundles backend
- Frontend assets served from `/dist/public`
- Backend runs as single Node.js process
- Database migrations via `npm run db:push`

### Environment Configuration
```
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=production
```

## Changelog

Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Switched AI service from OpenAI to Anthropic Claude (claude-sonnet-4-20250514)
- July 04, 2025. Implemented simplified server architecture with in-memory storage
- July 04, 2025. Added PDF/DOCX file upload and processing capabilities
- July 04, 2025. Server successfully running with all core features
- July 04, 2025. Fixed wouter routing integration and Vite HMR functionality
- July 04, 2025. Frontend now properly served and React application loading correctly
- July 04, 2025. Fixed file upload crash issue with improved error handling and AI parsing fallbacks
- July 04, 2025. Added prominent "Choose File" button to file uploader and fixed QueryClient setup
- July 04, 2025. Improved text extraction accuracy for Word documents using HTML conversion
- July 04, 2025. Fixed Claude JSON parsing errors by cleaning markdown formatting
- July 04, 2025. Resolved React infinite update loop in ResumeForm component
- July 04, 2025. Fixed auto-save functionality after file upload to ensure resume data is properly stored before job tailoring
- July 04, 2025. Fixed query structure in JobTailoring component to properly fetch single resume data and resolve undefined access errors
- July 04, 2025. Enhanced job matching analysis with before/after optimization scoring system showing original match score, optimized match score, improvement delta, and key improvement areas for better user insights
- July 04, 2025. Implemented integrity-preserving resume optimization that amplifies existing transferable skills without fabricating new qualifications, maintaining authentic accomplishments while enhancing job relevance

## User Preferences

Preferred communication style: Simple, everyday language.