# RapidCV - Clear Frontend/Backend Separation for Vercel

## New Project Structure

```
/
├── frontend/                    # React frontend application
│   ├── package.json            # Frontend-only dependencies
│   ├── vite.config.ts          # Frontend build configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── postcss.config.js       # PostCSS config
│   ├── index.html              # HTML entry point
│   └── src/                    # All React components and logic
│       ├── components/         # React components
│       ├── pages/              # Route pages
│       ├── lib/                # Frontend utilities
│       └── hooks/              # React hooks
│
├── backend/                     # Express.js API server
│   ├── package.json            # Backend-only dependencies
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API routes
│   ├── storage.ts              # Data storage layer
│   ├── types.ts                # Backend type definitions
│   └── services/               # Business logic services
│       ├── openai.ts           # AI integration
│       ├── pdfGenerator.ts     # PDF generation
│       ├── wordGenerator.ts    # Word document generation
│       └── fileProcessor.ts    # File upload handling
│
└── vercel.json                 # Vercel deployment configuration
```

## Key Improvements

### 1. Complete Separation
- **Frontend**: Pure React app with no backend dependencies
- **Backend**: Standalone Express API with no frontend code
- **No Shared Dependencies**: Each has its own package.json

### 2. Independent Building
- Frontend builds to `frontend/dist/`
- Backend builds to `backend/dist/`
- No cross-contamination of dependencies

### 3. Vercel Configuration
- Frontend served as static files
- Backend deployed as serverless function
- Proper routing between frontend and API

### 4. Clean Type Definitions
- `frontend/src/lib/types-frontend.ts` - Frontend types only
- `backend/types.ts` - Backend types with database schemas
- No shared type dependencies

## Deployment Process

1. **Frontend Build**: 
   ```bash
   cd frontend && npm install && npm run build
   ```

2. **Backend Build**:
   ```bash
   cd backend && npm install && npm run build
   ```

3. **Vercel Deploy**: 
   - Automatically handles both builds
   - Serves frontend as static site
   - Runs backend as serverless functions

## Benefits for Vercel

- ✅ No module resolution conflicts
- ✅ Clear dependency boundaries
- ✅ Optimized serverless function size
- ✅ Independent scaling of frontend/backend
- ✅ Better caching strategies
- ✅ Easier debugging and maintenance

## Environment Variables

Set in Vercel dashboard:
- `ANTHROPIC_API_KEY` - Claude AI API key
- `NODE_ENV` - "production"

## API Communication

- Frontend calls backend via `/api/*` routes
- CORS properly configured for cross-origin requests
- Backend runs on Vercel serverless functions
- Frontend served from Vercel CDN

This structure eliminates the build issues and provides a clean, maintainable architecture for Vercel deployment.