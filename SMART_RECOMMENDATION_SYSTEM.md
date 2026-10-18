# Movie Night Picker - Natural Language Query System

## 🎯 Overview

The Movie Night Picker now supports **natural language queries** with intelligent query understanding, title resolution, candidate retrieval, weighted ranking, and personalized explanations.

## 🏗️ Architecture

### New Server Modules

```
server/
├── modules/
│   ├── queryParser.js       # Parses natural language → structured preferences
│   ├── titleResolver.js     # Resolves movie titles → TMDB IDs
│   ├── candidateRetriever.js # Fetches candidates from TMDB
│   ├── ranker.js            # Scores and ranks candidates
│   ├── explainer.js         # Generates human-readable explanations
│   └── feedback.js          # Handles user feedback (client-side)
├── tests/
│   └── recommendation.test.js # Comprehensive test suite
└── index.js                 # Updated with /api/smart-recommend endpoint
```

### New Frontend Components

```
src/
├── components/
│   ├── SmartSearch.tsx      # Natural language input interface
│   ├── Hero.tsx             # Updated with two entry points
│   └── Results.tsx          # Enhanced with match scores & feedback
└── App.tsx                  # Updated routing and state management
```

## 🚀 New Features

### 1. Natural Language Query Input

Users can now describe their preferences in plain English:

**Example queries:**
- "I'm tired, want an action movie, and I like The Godfather"
- "Light comedy under 100 minutes"
- "Something romantic like Before Sunrise"
- "Intense thriller but nothing too violent"
- "Feel-good animation for the family"

### 2. Query Understanding

The system parses natural language into structured preferences:

```javascript
{
  mediaType: "movie",
  mood: ["comforting"],
  genres: ["Action"],
  likedTitles: ["The Godfather"],
  dislikedTitles: [],
  excludeContent: ["violent"],
  maxRuntimeMinutes: 120,
  intensity: "high",
  watchEffort: "low",
  clarificationNeeded: true,
  clarificationQuestion: "..."
}
```

**Supported patterns:**
- **Mood keywords**: tired, relaxed, intense, comforting, romantic, curious, sad
- **Genre keywords**: action, comedy, drama, sci-fi, horror, etc.
- **Runtime patterns**: "under 90 minutes", "less than 2 hours"
- **Title references**: "I like The Godfather", "similar to Inception"
- **Exclusions**: "nothing violent", "avoid horror"
- **Intensity**: "intense", "edge of my seat", "easy watch"

### 3. Title Resolution

When users mention specific movies:
1. Searches TMDB for the title
2. Returns best match with ID, year, and metadata
3. Handles ambiguity (multiple matches)
4. Uses resolved titles as seeds for recommendations

### 4. Multi-Strategy Candidate Retrieval

Candidates are fetched from multiple sources:
1. **Similar titles** - Movies similar to liked titles
2. **Recommendations** - TMDB recommendations based on liked titles
3. **Discover** - Genre/mood-based discovery
4. **Popular** - Popular titles in preferred genres (fallback)

All candidates are deduplicated by TMDB ID.

### 5. Weighted Ranking System

Candidates are scored (0-100) using configurable weights:

| Signal | Weight | Description |
|--------|--------|-------------|
| Genre Match | 30% | Explicit genre and mood-genre affinity |
| Similarity | 25% | Similarity to liked titles |
| Mood Match | 20% | Intensity and watch-effort alignment |
| Practical Match | 10% | Runtime and constraint fit |
| Quality Signal | 10% | Rating with vote confidence adjustment |
| Diversity | 5% | Avoids near-duplicates |

**Missing signals are redistributed proportionally** - no penalty for missing data.

### 6. Personalized Explanations

Each recommendation includes a human-readable explanation:
- "Similar to The Dark Knight; matches your Action preference."
- "A comforting choice; fits your time preference (95 min)."
- "Recommended based on Inception; highly rated by audiences."

Explanations are assembled from **actual matched fields**, never invented.

### 7. Clarification System

When preferences conflict (e.g., "tired but intense"), the system:
- Detects the conflict during parsing
- Generates a clarification question
- Shows it to the user before results
- User can skip and get best-effort results

### 8. User Feedback

Users can provide feedback on recommendations:
- 👍 **More like this** - Increases weight for similar movies
- 👎 **Not interested** - Decreases weight for similar movies
- ✓ **Already watched** - Excludes from future recommendations

Feedback is stored in **localStorage** (client-side, privacy-first).

### 9. Match Score Visualization

Each movie card shows a match score (0-100%) with a gradient progress bar, giving users transparency into why each movie was selected.

## 🔧 API Endpoints

### POST /api/smart-recommend

**Request:**
```javascript
{
  query: "I'm tired, want action, and I like The Godfather",
  structuredInputs: {
    mood: "Tired",
    genres: ["Action"],
    maxRuntime: "Under 2 hours"
  },
  excludeIds: [123, 456],
  region: "US"
}
```

**Response:**
```javascript
{
  movies: [
    {
      id: 78,
      mediaType: "movie",
      title: "Blade Runner 2049",
      year: 2017,
      genres: ["Sci-Fi", "Drama"],
      runtime: 164,
      rating: 7.5,
      voteCount: 12000,
      overview: "...",
      posterUrl: "https://...",
      providers: [...],
      reason: "Similar to The Godfather; an intense, thought-provoking watch.",
      matchScore: 87,
      isHiddenGem: false
    },
    // ... 2 more movies
  ],
  clarification: "You mentioned wanting something easy but also intense. Would you prefer easy-to-follow action or something more intense?",
  preferences: {
    mood: ["tired"],
    genres: ["Action"],
    maxRuntime: 120,
    likedTitles: ["The Godfather"]
  }
}
```

### POST /api/recommend (existing, unchanged)

The original wizard-based endpoint still works for backward compatibility.

## 🧪 Testing

### Test Coverage

The test suite (`server/tests/recommendation.test.js`) covers:

1. **Query Parsing**
   - Simple mood queries
   - Genre preferences
   - Runtime constraints
   - Liked/disliked titles
   - Intensity and watch effort
   - Content exclusions
   - Conflict detection
   - Complex multi-preference queries

2. **Validation**
   - Enum validation (mood, genres)
   - Runtime clamping
   - Array normalization

3. **Ranking**
   - Score calculation
   - Similar title boosting
   - Runtime penalty
   - Missing signal handling
   - Diversity adjustment
   - Reason generation

4. **Explainer**
   - Explanation generation
   - Clarification messages
   - Brief summaries

5. **Integration**
   - Full query flow tests
   - Edge cases (empty queries, missing data)

### Running Tests

```bash
npm test
```

## 🔒 Security & Privacy

- **No API keys in frontend** - All TMDB calls go through the server
- **No sensitive data logging** - Queries are not logged with PII
- **Client-side feedback** - Stored in localStorage, never sent to server
- **Input validation** - All user inputs are validated and sanitized
- **Rate limiting** - 30 requests per 10 minutes per IP
- **CORS** - Restricted to same origin in production

## 📊 Performance

### Caching

- **Title lookups**: 1 hour TTL
- **Discover results**: 30 minutes TTL
- **Watch providers**: 1 hour TTL

### API Call Optimization

- Fetches full details only for top 15 candidates (not all)
- Parallel API calls for similar/recommendation endpoints
- Deduplicates candidates before fetching details
- Limits to 3 final results

### Rate Limits

- TMDB: 40 requests per 10 seconds (free tier)
- Server: 30 requests per 10 minutes per IP

## 🎨 UI Changes

### Hero Screen

Now offers two entry points:
1. **✨ Describe it** - Natural language input (new)
2. **Answer questions** - Step-by-step wizard (existing)

### Smart Search Screen

- Large textarea for natural language input
- Example queries as clickable chips
- Character counter (500 max)
- Back button to return to hero

### Results Screen

- **Clarification banner** - Shows when preferences conflict
- **Match score bar** - Visual indicator of match quality
- **Feedback buttons** - 👍 👎 ✓ on each movie card
- All existing features preserved (posters, ratings, providers, etc.)

## 🔄 Backward Compatibility

- Original `/api/recommend` endpoint unchanged
- Wizard flow still works exactly as before
- Mock data fallback still active when API is unavailable
- All existing features preserved

## 📝 Configuration

### Environment Variables

```bash
# Required for live data
TMDB_API_KEY=your_key_here

# Optional (for AI-powered reasons)
GEMINI_API_KEY=your_key_here

# Optional
DEFAULT_REGION=US  # Change to your country code
PORT=3001
```

### Ranking Weights

Edit `server/modules/ranker.js` to adjust weights:

```javascript
const DEFAULT_WEIGHTS = {
  genreMatch: 30,
  similarity: 25,
  moodMatch: 20,
  practicalMatch: 10,
  qualitySignal: 10,
  diversity: 5,
};
```

## 🐛 Known Limitations

1. **Mood tags not in TMDB metadata** - Mood matching uses genre affinity heuristics, not actual mood labels
2. **No user accounts** - Feedback is client-side only (localStorage)
3. **Limited to movies** - TV show support is scaffolded but not fully tested
4. **No collaborative filtering** - Each user's feedback is isolated
5. **Rate limits** - Heavy use may hit TMDB rate limits

## 🚀 Future Enhancements

- [ ] User accounts with persistent feedback
- [ ] Collaborative filtering across users
- [ ] TV show support
- [ ] More sophisticated mood detection with curated tags
- [ ] A/B testing for ranking weights
- [ ] Export/import feedback for backup
- [ ] Social sharing of recommendations

## 📚 Files Changed

### New Files (9)
- `server/modules/queryParser.js`
- `server/modules/titleResolver.js`
- `server/modules/candidateRetriever.js`
- `server/modules/ranker.js`
- `server/modules/explainer.js`
- `server/modules/feedback.js`
- `server/tests/recommendation.test.js`
- `src/components/SmartSearch.tsx`
- `SMART_RECOMMENDATION_SYSTEM.md` (this file)

### Modified Files (5)
- `server/index.js` - Added /api/smart-recommend endpoint
- `src/App.tsx` - Added smart search routing
- `src/components/Hero.tsx` - Added two entry points
- `src/components/Results.tsx` - Added clarification, match scores, feedback
- `src/types.ts` - Added matchScore and mediaType fields

### Dependencies Added (2)
- `jest` - Testing framework
- `@types/jest` - TypeScript types for Jest

## ✅ Quality Checks

- [x] No API keys in frontend bundle
- [x] All user inputs validated
- [x] Generic error messages (no technical details)
- [x] Rate limiting enabled
- [x] CORS configured
- [x] Security headers (helmet)
- [x] Tests pass
- [x] Build succeeds
- [x] Backward compatible
- [x] Mobile responsive
- [x] Accessibility maintained

## 🎉 Summary

The Movie Night Picker now understands natural language, resolves movie references, retrieves candidates from multiple sources, ranks them with a transparent weighted system, explains why each movie was chosen, and learns from user feedback—all while maintaining backward compatibility and privacy.
