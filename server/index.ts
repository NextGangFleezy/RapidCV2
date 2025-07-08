// Simple development server
import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

console.log(`\n🚀 RapidCV Development Server`);
console.log(`   Project ready for Vercel deployment!`);
console.log(`   Structure: /frontend (React) + /api (Serverless)`);

// Serve a simple info page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RapidCV - Development Server</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #1e40af 100%);
          color: white;
          margin: 0;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 600px;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .feature {
          padding: 1rem;
          margin: 1rem 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          border-left: 4px solid #60a5fa;
        }
        .status {
          color: #4ade80;
          font-weight: bold;
        }
        .deployment {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 RapidCV</h1>
        <p class="status">Development Server Running</p>
        
        <div class="feature">
          <h3>✅ AI-Powered Resume Builder</h3>
          <p>Claude Sonnet 4 integration for intelligent resume analysis and optimization</p>
        </div>
        
        <div class="feature">
          <h3>✅ File Processing</h3>
          <p>PDF and DOCX upload with smart text extraction</p>
        </div>
        
        <div class="feature">
          <h3>✅ ATS Compatibility</h3>
          <p>Comprehensive scanning with 45-85/100 scoring system</p>
        </div>
        
        <div class="feature">
          <h3>✅ Professional Templates</h3>
          <p>Multiple designs with live preview and export</p>
        </div>
        
        <div class="deployment">
          <h3>🎯 Deployment Ready</h3>
          <p>Project structure optimized for Vercel deployment</p>
          <p><strong>Frontend:</strong> /frontend (React + Vite)</p>
          <p><strong>Backend:</strong> /api (Serverless functions)</p>
          <p><strong>Status:</strong> All build conflicts resolved</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'RapidCV API ready for deployment',
    timestamp: new Date().toISOString(),
    structure: {
      frontend: '/frontend - React application',
      backend: '/api - Serverless functions'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Development server running on port ${PORT}`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/health`);
  console.log(`\n   Ready for Vercel deployment!`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down development server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});