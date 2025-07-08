# Vercel Deployment Guide for RapidCV

## Pre-deployment Checklist

### ✅ Environment Variables Required
- `ANTHROPIC_API_KEY` - Claude AI API key for resume analysis
- `NODE_ENV` - Set to "production"

### ✅ Build Configuration
- Frontend builds to `dist/public/`
- Backend builds to `dist/index.js`
- Vercel serverless function in `api/index.ts`

### ✅ Key Files for Deployment
- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless function entry point
- `.vercelignore` - Files to exclude from deployment

### ✅ Dependencies Optimized
- Puppeteer configured for serverless environment
- File upload limited to 50MB for Vercel functions
- Memory-based storage (no database required)

## Deployment Process

1. **Build the project locally to verify:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add `ANTHROPIC_API_KEY` 

## Known Issues & Solutions

### 🔧 Puppeteer on Vercel
- Uses optimized Chrome flags for serverless
- Single-process mode to reduce memory usage
- No sandbox mode for security compliance

### 🔧 File Uploads
- Uses memory storage (not filesystem)
- 50MB limit for serverless functions
- Supports PDF and DOCX files

### 🔧 API Routes
- All API routes prefixed with `/api/`
- Static files served from root for SPA
- Error handling with proper status codes

## Testing Deployment

After deployment, test these endpoints:
- `GET /` - Landing page
- `GET /builder` - Resume builder
- `POST /api/resumes` - Create resume
- `POST /api/analyze-job` - Job analysis
- `POST /api/export-pdf` - PDF generation

## Performance Optimizations

- Frontend assets minified and compressed
- Serverless functions with 30s timeout
- Static file caching enabled
- Memory-efficient file processing