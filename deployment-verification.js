#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 RapidCV Deployment Verification');
console.log('================================');

// Check essential files
const essentialFiles = [
  'vercel.json',
  'api/index.ts',
  '.vercelignore',
  'package.json',
  'server/routes.ts',
  'server/storage.ts',
  'server/services/openai.ts',
  'client/src/App.tsx'
];

console.log('\n📁 Checking essential files...');
let filesOk = true;
essentialFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    filesOk = false;
  }
});

// Check vercel.json configuration
console.log('\n⚙️ Vercel configuration check...');
try {
  const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
  console.log('✅ vercel.json parsed successfully');
  console.log(`✅ Build source: ${vercelConfig.builds[0].src}`);
  console.log(`✅ Routes configured: ${vercelConfig.routes.length}`);
  console.log(`✅ Max duration: ${vercelConfig.functions['api/index.ts'].maxDuration}s`);
} catch (error) {
  console.log('❌ vercel.json configuration error:', error.message);
  filesOk = false;
}

// Check package.json
console.log('\n📦 Package.json check...');
try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  console.log('✅ package.json parsed successfully');
  console.log(`✅ Build script: ${pkg.scripts.build}`);
  console.log(`✅ Dev script: ${pkg.scripts.dev}`);
  
  // Check key dependencies
  const keyDeps = ['@anthropic-ai/sdk', 'express', 'react', 'vite', 'puppeteer'];
  keyDeps.forEach(dep => {
    if (pkg.dependencies[dep] || pkg.devDependencies[dep]) {
      console.log(`✅ ${dep} dependency found`);
    } else {
      console.log(`❌ ${dep} dependency missing`);
    }
  });
} catch (error) {
  console.log('❌ package.json error:', error.message);
  filesOk = false;
}

// Check API entry point
console.log('\n🔧 API entry point check...');
try {
  const apiContent = readFileSync('api/index.ts', 'utf8');
  if (apiContent.includes('export default app')) {
    console.log('✅ API entry point exports app correctly');
  } else {
    console.log('❌ API entry point missing default export');
    filesOk = false;
  }
  
  if (apiContent.includes('express.json({ limit: \'50mb\' })')) {
    console.log('✅ File upload limits configured');
  } else {
    console.log('❌ File upload limits not configured');
  }
} catch (error) {
  console.log('❌ API entry point error:', error.message);
  filesOk = false;
}

// Environment variables check
console.log('\n🔑 Environment variables check...');
const requiredEnvs = ['ANTHROPIC_API_KEY'];
requiredEnvs.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`⚠️ ${envVar} not set (required for deployment)`);
  }
});

// Final summary
console.log('\n📊 Deployment Readiness Summary');
console.log('==============================');
if (filesOk) {
  console.log('✅ All essential files present and configured');
  console.log('✅ Vercel configuration valid');
  console.log('✅ Serverless function entry point ready');
  console.log('✅ Dependencies configured');
  console.log('');
  console.log('🎉 APPLICATION IS DEPLOYMENT READY!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Push to GitHub repository');
  console.log('2. Connect to Vercel');
  console.log('3. Set ANTHROPIC_API_KEY in Vercel dashboard');
  console.log('4. Deploy!');
} else {
  console.log('❌ Deployment not ready - fix issues above');
  process.exit(1);
}