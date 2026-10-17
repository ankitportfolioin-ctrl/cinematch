# 🎬 Movie Night Picker - Quick Start Guide

## ✅ Environment Variables Configured!

You've added the environment variables in the QwenCoder environment section. Here's what to do next:

## 🚀 Quick Start (3 Steps)

### 1. Verify Environment Variables
```bash
npm run verify-env
```

This checks if your API keys are properly loaded.

### 2. Start the Server
```bash
npm start
```

### 3. Open Your Browser
Go to: **http://localhost:3001**

That's it! You're ready to pick movies! 🍿

---

## 📋 What You Can Do

### Option A: Smart Search (Natural Language)
Click **"✨ Describe it"** and try:
- "I'm tired, want an action movie, and I like The Godfather"
- "Light comedy under 100 minutes"
- "Something romantic like Before Sunrise"
- "Intense thriller but nothing too violent"

### Option B: Step-by-Step Wizard
Click **"Answer questions"** and:
1. Choose your mood
2. Pick genres (up to 3)
3. Select audience
4. Set runtime preference
5. Choose languages (optional)
6. Set preferences (optional)
7. Add notes (optional)

---

## 🎯 Features

✅ **Natural Language Queries** - Describe what you want in plain English  
✅ **Smart Recommendations** - AI-powered or template-based reasons  
✅ **Title Resolution** - Mentions "The Godfather"? It finds it!  
✅ **Streaming Providers** - See where to watch (Netflix, Prime, etc.)  
✅ **Match Scores** - See how well each movie matches (0-100%)  
✅ **Feedback System** - 👍 👎 ✓ to improve future recommendations  
✅ **Conflict Detection** - Asks clarification when preferences conflict  
✅ **Hidden Gems** - Finds lesser-known great movies  
✅ **Mobile Responsive** - Works on phone, tablet, desktop  

---

## 🔑 Your API Keys

### TMDB_API_KEY (Required) ✅
- Fetches real movie data, posters, ratings
- 40 requests/10 seconds (free tier)
- Get from: https://www.themoviedb.org/settings/api

### GEMINI_API_KEY (Optional)
- Enables AI-powered personalized reasons
- 60 requests/minute (free tier)
- Get from: https://makersuite.google.com/app/apikey

---

## 🐛 Troubleshooting

### "TMDB_API_KEY is NOT set"
→ Check QwenCoder environment section  
→ Restart the server after adding variables  
→ Run `npm run verify-env` to check

### Server won't start
→ Run `npm install` first  
→ Check if port 3001 is in use  
→ Try `PORT=3002 npm start`

### No movie results
→ Check your internet connection  
→ Verify TMDB API key is valid  
→ Check console for error messages

---

## 📚 Documentation

- **NEXT_STEPS.md** - Detailed next steps
- **ENVIRONMENT_SETUP.md** - Environment variable guide
- **README.md** - Full documentation
- **SMART_RECOMMENDATION_SYSTEM.md** - Technical details
- **PRODUCTION_READINESS_REPORT.md** - QA report

---

## 🎉 You're All Set!

Your Movie Night Picker is ready with:
- ✅ Environment variables configured
- ✅ TMDB API integration
- ✅ Natural language queries
- ✅ Smart recommendations
- ✅ Real movie data

**Enjoy finding your perfect movie!** 🎬✨

---

**Questions?** Check the documentation files or run `npm run verify-env` to troubleshoot.
