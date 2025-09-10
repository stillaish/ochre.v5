#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Hazard Reporting App Setup...\n');

// Check if required directories exist
const requiredDirs = ['client', 'server', 'client/src', 'server/routes', 'server/middleware', 'server/data'];
const missingDirs = [];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    missingDirs.push(dir);
  }
});

if (missingDirs.length > 0) {
  console.log('❌ Missing directories:', missingDirs.join(', '));
} else {
  console.log('✅ All required directories exist');
}

// Check if required files exist
const requiredFiles = [
  'client/package.json',
  'server/package.json',
  'server/index.js',
  'server/.env',
  'client/src/App.tsx',
  'client/src/pages/Home.tsx',
  'client/src/pages/Login.tsx',
  'client/src/pages/Register.tsx',
  'client/src/pages/Dashboard.tsx',
  'client/src/pages/Map.tsx',
  'client/src/pages/ReportHazard.tsx',
  'client/src/pages/Alerts.tsx',
  'client/src/pages/Profile.tsx',
  'client/src/pages/Emergency.tsx',
  'server/routes/auth.js',
  'server/routes/hazards.js',
  'server/routes/weather.js',
  'server/data/storage.js',
  'server/middleware/auth.js',
  'server/middleware/validation.js'
];

const missingFiles = [];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('❌ Missing files:', missingFiles.join(', '));
} else {
  console.log('✅ All required files exist');
}

// Check package.json dependencies
try {
  const clientPkg = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  const serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
  
  const requiredClientDeps = ['react', 'react-dom', 'react-router-dom', 'tailwindcss', 'framer-motion', 'react-hook-form', 'react-leaflet', 'axios'];
  const requiredServerDeps = ['express', 'cors', 'bcryptjs', 'jsonwebtoken', 'dotenv', 'axios', 'helmet', 'express-rate-limit', 'joi'];
  
  const missingClientDeps = requiredClientDeps.filter(dep => !clientPkg.dependencies[dep]);
  const missingServerDeps = requiredServerDeps.filter(dep => !serverPkg.dependencies[dep]);
  
  if (missingClientDeps.length > 0) {
    console.log('❌ Missing client dependencies:', missingClientDeps.join(', '));
  } else {
    console.log('✅ All client dependencies present');
  }
  
  if (missingServerDeps.length > 0) {
    console.log('❌ Missing server dependencies:', missingServerDeps.join(', '));
  } else {
    console.log('✅ All server dependencies present');
  }
} catch (error) {
  console.log('❌ Error reading package.json files:', error.message);
}

// Check .env file
try {
  const envContent = fs.readFileSync('server/.env', 'utf8');
  const requiredEnvVars = ['JWT_SECRET', 'OPENWEATHER_API_KEY', 'PORT'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !envContent.includes(envVar));
  
  if (missingEnvVars.length > 0) {
    console.log('❌ Missing environment variables:', missingEnvVars.join(', '));
  } else {
    console.log('✅ Environment variables configured');
  }
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
}

console.log('\n🚀 Setup Test Complete!');
console.log('\nNext steps:');
console.log('1. Run "npm run install-all" to install dependencies');
console.log('2. Update server/.env with your OpenWeatherMap API key');
console.log('3. Run "npm run dev" to start the application');
console.log('4. Visit http://localhost:3000 to see the app');
console.log('\nDemo credentials:');
console.log('Email: admin@hazardapp.com');
console.log('Password: admin123');
