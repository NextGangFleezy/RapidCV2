import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from "./routes";
import { setupVite, serveStatic } from "./vite";

// Setup for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (open during MVP)
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Request logging for API calls
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
    return originalJson.call(this, data);
  };
  next();
});

// API routes
app.use(routes);

// Serve frontend static files from Vite build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Fallback to index.html for React routing
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error' 
  });
});

// Start server
async function startServer() {
  const host = process.env.HOST || "0.0.0.0";
  
  const server = app.listen(PORT, host, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Setup frontend serving in development
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }
}

startServer().catch(console.error);

export default app;
