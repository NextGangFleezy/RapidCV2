#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🔧 Testing build process...');

try {
  // Test vite build only
  console.log('📦 Building frontend...');
  execSync('npx vite build', { stdio: 'inherit', timeout: 60000 });
  
  // Check if build succeeded
  if (existsSync('dist/public/index.html')) {
    console.log('✅ Frontend build successful');
  } else {
    console.log('❌ Frontend build failed');
    process.exit(1);
  }
  
  // Test basic server compilation
  console.log('🔧 Testing server compilation...');
  execSync('npx esbuild server/index.ts --platform=node --format=esm --outfile=dist/server-test.js --external:puppeteer --bundle', { stdio: 'inherit', timeout: 30000 });
  
  if (existsSync('dist/server-test.js')) {
    console.log('✅ Server compilation successful');
  } else {
    console.log('❌ Server compilation failed');
    process.exit(1);
  }
  
  console.log('🎉 Build test completed successfully!');
  
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}