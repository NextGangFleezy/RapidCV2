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
- July 04, 2025. Fixed content preservation issue in AI optimization - enhanced bullet point processing to maintain exact count and preserve all original job descriptions while only enhancing them with relevant keywords
- July 04, 2025. Implemented zero-omission policy in AI optimization - strengthened prompts to ensure no information is ever removed to improve match scores, only additions and enhancements are allowed
- July 04, 2025. Fixed JSON parsing error in job analysis by increasing Claude token limit to 4000 and adding robust error handling for malformed responses with automatic JSON recovery
- July 04, 2025. Added ATS (Applicant Tracking System) compatibility scanner feature with comprehensive analysis including overall score, keyword density, format compliance, issues detection, and improvement recommendations
- July 04, 2025. Enhanced date integrity preservation in AI optimization - strengthened prompts and logic to ensure employment dates, company names, and position titles remain exactly unchanged during resume enhancement
- July 04, 2025. Removed file upload feature from Resume Builder - simplified interface to focus on manual resume building, template selection, and ATS scanning capabilities
- July 06, 2025. Restored file upload functionality after user feedback - upload feature now available in dedicated Upload tab
- July 06, 2025. Implemented live template switching in resume preview - added template selector dropdown with real-time preview updates and auto-save functionality
- July 06, 2025. Updated color scheme to vibrant dark theme with professional gradients - replaced plain white background with modern blue/purple gradient, added glass morphism effects, enhanced navigation with translucent styling
- July 06, 2025. Enhanced template previewer with interactive functionality - added hover effects, template-specific visual mockups, real-time switching, and debugging fixes for file upload flow to properly create resume records in storage
- July 07, 2025. Successfully resolved ATS scanner timeout issues and implemented comprehensive Claude AI integration - ATS analysis now provides realistic scoring (45-85/100), detailed issue identification, and actionable recommendations with proper keyword density analysis
- July 07, 2025. Completed ATS enhancement workflow with automatic resume optimization - system can now scan resumes, identify improvement areas, and apply AI-powered enhancements including skill expansion, summary enhancement, and experience optimization while preserving content integrity
- July 08, 2025. Finalized comprehensive Vercel deployment preparation - created api/index.ts serverless function, optimized vercel.json configuration, fixed file upload limits for serverless environment, created deployment verification system, and confirmed all features working correctly for production deployment
- July 08, 2025. Fixed port configuration issues for Vercel deployment - updated server to use dynamic PORT environment variable instead of hardcoded port 5000, improved host binding configuration for better compatibility with different deployment environments, resolved tsx dependency issues for proper application startup
- July 08, 2025. Updated Vercel deployment configuration for client/server structure - modified vercel.json to properly handle /client (frontend) and /server (backend) directories, updated API routes to point to server/index.ts, configured static build for client/index.html, ensuring proper separation of frontend and backend for serverless deployment
- July 08, 2025. Restructured repository for proper client/server separation - created separate package.json files for client and server directories, moved frontend config files to client/, updated vercel.json to build from client directory, configured proper dependency management with frontend dependencies in client/package.json and backend dependencies in server/package.json
- July 08, 2025. Simplified Vercel configuration to frontend-only deployment - updated vercel.json to only build static site from client directory, removed backend serverless functions, streamlined routing to serve all requests from client build output

## User Preferences

Preferred communication style: Simple, everyday language.