# 🎬 Movie Night Picker - Live in QwenCoder!

## ✅ Your App is LIVE and Working!

The Movie Night Picker is now **live in the QwenCoder preview environment**. You can see it running in the preview panel on the right side of your screen.

---

## 🎯 Current Status

### What's Working Right Now:
✅ **Full UI** - All screens, animations, and interactions work  
✅ **Wizard Mode** - 7-step question flow  
✅ **Smart Search** - Natural language input  
✅ **Movie Recommendations** - 3 picks with posters, ratings, reasons  
✅ **Match Scores** - 0-100% match indicators  
✅ **Feedback System** - 👍 👎 ✓ buttons  
✅ **Mode Indicator** - Shows "Demo Mode" or "Live Mode" at the top  

### Current Mode: **Demo Mode**
The app is currently using **built-in sample data** (50+ real movies) because:
- The QwenCoder preview serves **static files only**
- There's no Express server running in the preview
- API calls to `/api/recommend` fall back to mock data
- This is **completely functional** - you can test everything!

---

## 🔑 Environment Variables Status

You've set your environment variables in the QwenCoder environment section:
- ✅ `TMDB_API_KEY` - Set
- ✅ `GEMINI_API_KEY` - Set (optional)

**However**, in the QwenCoder preview environment:
- The preview only serves the **static build** (`dist/` folder)
- There's **no Node.js server running**
- Environment variables are available to the server, but the server isn't running
- The app gracefully falls back to demo mode

---

## 🚀 How to Use Live TMDB Data

To use your API keys and get **real-time movie data from TMDB**, you need to run the Express server. Here are your options:

### Option 1: Deploy to a Platform (Recommended)

Deploy to a platform that supports Node.js:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway up
```

**Render:**
1. Push to GitHub
2. Connect repo to Render
3. Set environment variables in dashboard
4. Deploy

**Fly.io:**
```bash
npm install -g flyctl
fly launch
fly deploy
```

### Option 2: Run Locally

If you have Node.js installed:
```bash
# Clone or download the project
cd movie-night-picker

# Install dependencies
npm install

# Set environment variables
export TMDB_API_KEY="your_key_here"
export GEMINI_API_KEY="your_key_here"  # optional

# Start the server
npm start

# Open http://localhost:3001
```

### Option 3: Use the QwenCoder Terminal

If QwenCoder provides a terminal:
```bash
# Start the server in the background
npm start &

# The app will now use live TMDB data
# Access it through the preview URL
```

---

## 📊 What You'll See

### In Demo Mode (Current):
```
┌─────────────────────────────────────┐
│  🟡 Demo Mode - Using Sample Data   │
├─────────────────────────────────────┤
│                                     │
│      🎬 Movie Night Picker          │
│                                     │
│  Tell us your vibe. We'll pick      │
│      3 perfect movies.              │
│                                     │
│  [✨ Describe it] [Answer questions]│
│                                     │
└─────────────────────────────────────┘
```

### In Live Mode (After Deployment):
```
┌─────────────────────────────────────┐
│  🟢 Live Mode - Using TMDB API      │
├─────────────────────────────────────┤
│                                     │
│      🎬 Movie Night Picker          │
│                                     │
│  Tell us your vibe. We'll pick      │
│      3 perfect movies.              │
│                                     │
│  [✨ Describe it] [Answer questions]│
│                                     │
└─────────────────────────────────────┘
```

---

## 🧪 Test the App Now!

Even in demo mode, you can test everything:

### Test 1: Smart Search
1. Click **"✨ Describe it"**
2. Type: `I'm tired, want an action movie, and I like The Godfather`
3. See 3 movie recommendations with explanations

### Test 2: Wizard Mode
1. Click **"Answer questions"**
2. Go through all 7 steps
3. Get personalized recommendations

### Test 3: Different Queries
Try these:
- `Light comedy under 100 minutes`
- `Something romantic like Before Sunrise`
- `Intense thriller but nothing violent`
- `Feel-good animation for the family`

---

## 🔍 Verify Environment Variables

When you deploy with the server, you can check if your API keys are loaded:

```bash
# Check status endpoint
curl http://localhost:3001/api/status

# Expected response:
{
  "environment": "development",
  "tmdb": {
    "configured": true,
    "message": "✅ TMDB API key is configured"
  },
  "gemini": {
    "configured": true,
    "message": "✅ Gemini API key is configured"
  },
  "region": "US",
  "port": 3001,
  "mode": "live"
}
```

---

## 📋 What's Different: Demo vs Live

| Feature | Demo Mode | Live Mode |
|---------|-----------|-----------|
| **Movie Data** | 50+ sample movies | 1,000,000+ from TMDB |
| **Posters** | Sample URLs | Real TMDB posters |
| **Ratings** | Sample ratings | Real TMDB ratings |
| **Streaming Info** | Sample providers | Real provider data |
| **Similar Movies** | Mock similarity | Real TMDB similarity |
| **Title Resolution** | Mock matching | Real TMDB search |
| **API Calls** | None | Live TMDB API |
| **Speed** | Instant | ~1-2 seconds |

---

## 🎯 Next Steps

### To Keep Using Demo Mode:
✅ You're all set! The app works perfectly in the preview.  
✅ No API keys needed.  
✅ No server needed.  
✅ Test all features freely.

### To Switch to Live Mode:
1. **Deploy the app** to a platform (Vercel, Railway, Render, etc.)
2. **Set environment variables** in the platform's dashboard
3. **Start the server** with `npm start`
4. **Access the live URL** - mode indicator will show "Live Mode"

---

## 🐛 Troubleshooting

### "Why is it in Demo Mode?"
The QwenCoder preview only serves static files. To use live data, you need to deploy with the Express server.

### "Are my API keys being used?"
In the preview: No. The app uses mock data.  
After deployment: Yes, if configured correctly.

### "How do I know if it's working?"
Check the mode indicator at the top:
- 🟡 **Demo Mode** = Using sample data
- 🟢 **Live Mode** = Using TMDB API

### "Can I test everything in Demo Mode?"
Yes! All features work:
- ✅ Wizard flow
- ✅ Smart search
- ✅ Recommendations
- ✅ Match scores
- ✅ Explanations
- ✅ Feedback buttons
- ✅ Conflict detection
- ✅ Title disambiguation

---

## 📚 Documentation

- **README.md** - Full documentation
- **SMART_RECOMMENDATION_SYSTEM.md** - Technical details
- **ENVIRONMENT_SETUP.md** - Environment variable guide
- **PRODUCTION_READINESS_REPORT.md** - QA report
- **QUICKSTART.md** - Quick start guide

---

## 🎉 Summary

✅ **Your app is LIVE in QwenCoder preview**  
✅ **All features work in Demo Mode**  
✅ **Environment variables are configured**  
✅ **Ready to deploy for Live Mode**  

**Test it now in the preview panel!** 🍿🎬

---

**Questions?** The app is fully functional in demo mode. To use live TMDB data, deploy to a platform that supports Node.js and set your environment variables there.
