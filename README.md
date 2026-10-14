# 🎬 Movie Night Picker

A beautiful, cinematic movie recommendation app with **natural language query support**. Describe your perfect movie night in plain English, or use the step-by-step wizard.

## ✨ New: Natural Language Queries

**Just describe what you want:**
- "I'm tired, want an action movie, and I like The Godfather"
- "Light comedy under 100 minutes"
- "Something romantic like Before Sunrise"
- "Intense thriller but nothing too violent"

The app understands your mood, genres, runtime preferences, and even resolves movie references to find similar titles!

👉 See [SMART_RECOMMENDATION_SYSTEM.md](SMART_RECOMMENDATION_SYSTEM.md) for full details.

## ✨ Features

### User Experience
- **7-step wizard** with smooth animations and progress bar
- **Mood-based recommendations**: Happy, Relaxed, Tired, Stressed, Romantic, Adventurous, Curious, Sad
- **Multi-select genres** (up to 3) with "Surprise me" option
- **Audience filtering**: Solo, Partner, Friends, Family with kids
- **Runtime preferences**: Under 90 min, 2 hours, 2.5 hours, or any length
- **Language selection**: English, Hindi, Tamil, Telugu, Korean, Japanese, Spanish, French
- **Smart preferences**: Highly rated, Hidden gems, Recent releases, Classics, Mature content
- **Free text input**: Mention a movie you loved or want to avoid

### Results Screen
- **3 movie cards** with posters, ratings, runtime, genres
- **Streaming providers** with logos (Netflix, Prime Video, Disney+, etc.)
- **"Hidden gem" badges** for lesser-known great films
- **Personalized reasons** explaining why each movie fits your mood
- **"Show me 3 more"** button (never repeats movies in the same session)
- **Responsive design**: Perfect on mobile (375px) and desktop

### Design
- **Dark cinematic theme**: #0A0A0A background with red/orange accents
- **Typography**: Space Grotesk for headings, Inter for body text
- **Smooth animations**: Fade-ins, hover effects, gradient buttons
- **Minimal & modern**: Lots of whitespace, rounded corners, soft glows

---

## 🚀 How It Works

### Demo Mode (Current)
The app currently runs in **demo mode** with a comprehensive database of 50+ real movies covering all scenarios. This works immediately without any API keys.

**Movies include:**
- Hollywood hits: The Grand Budapest Hotel, Mad Max: Fury Road, Everything Everywhere All at Once
- International gems: Parasite, RRR, The Lunchbox, Past Lives
- Animated classics: Spirited Away, Coco, Paddington 2, Inside Out
- Indie treasures: Sing Street, Hunt for the Wilderpeople, Song of the Sea
- And many more!

### Production Mode (With Real API)
To use real TMDB data with live streaming availability:

1. **Get API keys:**
   - TMDB API Key (required): https://www.themoviedb.org/settings/api
   - Gemini API Key (optional, for AI reasons): https://aistudio.google.com/apikey

2. **Set environment variables:**
   ```bash
   export TMDB_API_KEY="your_tmdb_key_here"
   export GEMINI_API_KEY="your_gemini_key_here"  # optional
   ```

3. **Start the server:**
   ```bash
   npm install
   npm run build
   node server/index.js
   ```

4. **Open http://localhost:3001**

---

## 🧪 Test Scenarios (All Work in Demo Mode)

The app handles all 5 test cases from the spec:

1. **Tired + Comedy + Just me + Under 90 min**
   → Returns: Paddington 2, Chef, Little Miss Sunshine

2. **Romantic + Romance + Partner + Under 2 hours**
   → Returns: Before Sunrise, Past Lives, Portrait of a Lady on Fire

3. **Adventurous + Surprise me + Friends + Any length + Hidden gems**
   → Returns: Mad Max: Fury Road, Hunt for the Wilderpeople, Princess Mononoke

4. **Happy + Animation + Family with kids + Under 2 hours**
   → Returns: Inside Out, My Neighbor Totoro, Coco

5. **Curious + Mystery + Just me + Korean language**
   → Returns: Parasite, The Handmaiden, Memories of Murder

---

## 🏗️ Architecture

### Frontend (React + Tailwind)
- `src/App.tsx` - Main app with wizard state management
- `src/components/Hero.tsx` - Landing screen
- `src/components/WizardStep.tsx` - Reusable question component
- `src/components/Results.tsx` - Movie cards display
- `src/mockData.ts` - 50+ movie database with smart filtering
- `src/types.ts` - TypeScript interfaces

### Backend (Node.js + Express)
- `server/index.js` - Complete API server with:
  - TMDB integration (discover, details, watch providers)
  - Input validation & sanitization
  - Rate limiting (30 req/10min)
  - CORS & Helmet security
  - Provider caching (1 hour)
  - Optional Gemini AI integration
  - Family-safe filtering
  - Hidden gem detection

### Security
✅ **Zero API keys in frontend code**
✅ **All secrets server-side only**
✅ **No TMDB URLs with keys in bundle**
✅ **Generic error messages (no technical details)**

---

## 🎨 Design System

### Colors
```css
Background: #0A0A0A
Surface: #141414
Border: #232323
Primary Red: #E63946
Accent Orange: #FF7A2F
Text: #F5F5F5
Muted: #8C8C8C
```

### Typography
- **Headings**: Space Grotesk (400-700)
- **Body**: Inter (300-700)

### Components
- **Buttons**: Gradient (red→orange), rounded-full, hover glow
- **Cards**: 16px radius, subtle border, hover effect
- **Chips**: Rounded-full, border, selected state with orange glow
- **Progress bar**: Thin gradient bar at top during wizard

---

## 📱 Responsive Design

- **Mobile (375px)**: Single column, stacked cards, touch-friendly chips
- **Tablet (768px)**: 2-column card grid
- **Desktop (1024px+)**: 3-column card grid, wider content

---

## 🔧 Configuration

### Server Settings (server/index.js)
```javascript
const AI_ENABLED = process.env.GEMINI_API_KEY ? true : false;
const DEFAULT_REGION = 'IN'; // Change to your country code (US, GB, etc.)
const PORT = process.env.PORT || 3001;
```

### Changing Region
To get streaming providers for your country, change `DEFAULT_REGION`:
- India: `'IN'`
- United States: `'US'`
- United Kingdom: `'GB'`
- Canada: `'CA'`
- Australia: `'AU'`

---

## 🎯 Smart Features

### Mood-to-Genre Mapping
- **Happy** → Comedy, Adventure, Animation
- **Relaxed** → Comedy, Romance, Animation, Family
- **Tired** → Comedy, Animation, Family
- **Stressed** → Comedy, Animation, Fantasy
- **Romantic** → Romance, Drama, Comedy
- **Adventurous** → Adventure, Action, Sci-Fi, Fantasy
- **Curious** → Mystery, Documentary, Sci-Fi, Crime
- **Sad** → Drama, Family, Comedy

### Hidden Gem Detection
Movies with popularity < 40 and rating ≥ 7 are marked as hidden gems.

### Family-Safe Filtering
When audience is "Family with kids":
- Forces Family or Animation genres
- Excludes Horror, Thriller, Crime
- Filters out adult content
- Prioritizes kid-friendly movies

### Exclusion Tracking
"Show me 3 more" never repeats movies from the same session.

---

## 📦 Deployment

### Static Hosting (Vercel, Netlify, etc.)
1. Build the frontend: `npm run build`
2. Deploy the `dist/` folder
3. Set up a serverless function for `/api/recommend` (optional)

### Full Stack (VPS, Railway, Render)
1. Set environment variables (TMDB_API_KEY, GEMINI_API_KEY)
2. Run: `node server/index.js`
3. Server handles both API and static files

---

## 🎬 Credits

- **Movie data**: TMDB (The Movie Database)
- **Design inspiration**: Netflix, Letterboxd, cinematic minimalism
- **Built with**: React, TypeScript, Tailwind CSS, Express, Node.js

---

## 📄 License

MIT License - feel free to use and modify!

---

## 🐛 Troubleshooting

### "No perfect match" message
- Try fewer filters
- Remove language restrictions
- Increase runtime limit
- Uncheck "Hidden gems" or "Classics"

### Posters not loading
- TMDB images require internet connection
- Fallback SVG posters are generated automatically
- Check your ad blocker isn't blocking image.tmdb.org

### Streaming providers missing
- Change `DEFAULT_REGION` in server/index.js to your country
- Some movies aren't available for streaming in all regions

---

## 🎉 Enjoy Your Movie Night!

The app is designed to make movie selection fun, not stressful. Just answer a few questions, and let the algorithm do the work. Happy watching! 🍿
