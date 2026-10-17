#!/usr/bin/env node

/**
 * Environment Variable Verification Script
 * Checks if TMDB_API_KEY and other required variables are set
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('\n🔍 Checking Environment Variables...\n');

const checks = [
  {
    name: 'TMDB_API_KEY',
    value: process.env.TMDB_API_KEY,
    required: true,
    description: 'TMDB API key for movie data'
  },
  {
    name: 'GEMINI_API_KEY',
    value: process.env.GEMINI_API_KEY,
    required: false,
    description: 'Gemini API key for AI recommendations (optional)'
  },
  {
    name: 'PORT',
    value: process.env.PORT,
    required: false,
    description: 'Server port (default: 3001)'
  },
  {
    name: 'NODE_ENV',
    value: process.env.NODE_ENV,
    required: false,
    description: 'Environment mode (default: development)'
  },
  {
    name: 'DEFAULT_REGION',
    value: process.env.DEFAULT_REGION,
    required: false,
    description: 'Default region for streaming providers (default: US)'
  }
];

let allRequiredPresent = true;

checks.forEach(check => {
  const status = check.value ? '✅' : (check.required ? '❌' : '⚠️');
  const valueDisplay = check.value 
    ? (check.name.includes('KEY') ? check.value.substring(0, 8) + '...' : check.value)
    : '(not set)';
  
  console.log(`${status} ${check.name}: ${valueDisplay}`);
  console.log(`   ${check.description}`);
  
  if (check.required && !check.value) {
    allRequiredPresent = false;
  }
});

console.log('\n' + '='.repeat(60));

if (allRequiredPresent) {
  console.log('✅ All required environment variables are set!');
  console.log('\n🚀 You can now start the server:');
  console.log('   npm start');
  console.log('\n📱 Then open: http://localhost:' + (process.env.PORT || '3001'));
  process.exit(0);
} else {
  console.log('❌ Missing required environment variables!');
  console.log('\n📝 Please set the required variables in your environment:');
  console.log('   - TMDB_API_KEY (required)');
  console.log('\n💡 Get your TMDB API key from: https://www.themoviedb.org/settings/api');
  console.log('\n📚 See ENVIRONMENT_SETUP.md for detailed instructions');
  process.exit(1);
}
