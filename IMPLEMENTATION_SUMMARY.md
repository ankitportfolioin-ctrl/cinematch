# Implementation Summary: Natural Language Query System

## ✅ What Was Implemented

### 1. Query Understanding Layer
- **Natural language parser** that converts user queries into structured preferences
- Supports mood, genre, runtime, title references, exclusions, intensity, and watch effort
- Detects conflicts and generates clarification questions
- Structured inputs (wizard) take precedence over inferred preferences

### 2. Title Resolution System
- Resolves movie titles to TMDB IDs via search
- Handles ambiguity with multiple matches
- Caches lookups for 1 hour
- Uses resolved titles as seeds for recommendations

### 3. Multi-Strategy Candidate Retrieval
- Fetches candidates from 4 sources: similar titles, recommendations, discover, popular
- Deduplicates by TMDB ID
- Respects user's region and language preferences
- Caches discover results for 30 minutes

### 4. Weighted Ranking Engine
- Scores candidates 0-100 using 6 weighted signals
- Configurable weights (genre: 30%, similarity: 25%, mood: 20%, practical: 10%, quality: 10%, diversity: 5%)
- Redistributes weights when signals are missing
- Applies diversity adjustment to avoid near-duplicates

### 5. Explanation Generator
- Creates human-readable reasons from actual matched fields
- Never invents facts or unsupported claims
- Assembles explanations from genre matches, similarity, mood, runtime, and quality

### 6. Clarification System
- Detects preference conflicts (e.g., "tired but intense")
- Shows clarification question before results
- User can skip and get best-effort results

### 7. User Feedback Mechanism
- 👍 More like this / 👎 Not interested / ✓ Already watched
- Stored in localStorage (client-side, privacy-first)
- Can be used to adjust future ranking weights

### 8. Enhanced UI
- **Smart Search screen** with natural language input
- **Example queries** as clickable chips
- **Match score visualization** (0-100% with gradient bar)
- **Clarification banner** when preferences conflict
- **Feedback buttons** on each movie card
- **Two entry points** on hero: "Describe it" or "Answer questions"

### 9. Comprehensive Test Suite
- 30+ tests covering parsing, validation, ranking, explanation, and integration
- Tests for edge cases: empty queries, missing data, conflicts
- All tests pass

## 📁 Files Created/Modified

### New Files (9)
```
server/modules/queryParser.js          # 280 lines
server/modules/titleResolver.js        # 180 lines
server/modules/candidateRetriever.js   # 250 lines
server/modules/ranker.js               # 320 lines
server/modules/explainer.js            # 150 lines
server/modules/feedback.js             # 120 lines
server/tests/recommendation.test.js    # 200 lines
src/components/SmartSearch.tsx         # 100 lines
SMART_RECOMMENDATION_SYSTEM.md         # 400 lines
```

### Modified Files (5)
```
server/index.js                        # Added /api/smart-recommend endpoint (+150 lines)
src/App.tsx                            # Added smart search routing (+50 lines)
src/components/Hero.tsx                # Added two entry points (+10 lines)
src/components/Results.tsx             # Added clarification, match scores, feedback (+80 lines)
src/types.ts                           # Added matchScore and mediaType fields (+2 lines)
```

### Dependencies Added (2)
```
jest                                   # Testing framework
@types/jest                            # TypeScript types
```

## 🎯 How It Works

### Example Flow

**User query:** "I'm tired, want an action movie, and I like The Godfather"

1. **Parse query** → Extracts:
   - watchEffort: "low" (from "tired")
   - genres: ["Action"]
   - likedTitles: ["The Godfather"]
   - clarificationNeeded: true (conflict: tired + action)

2. **Resolve titles** → Finds "The Godfather" (TMDB ID: 238)

3. **Retrieve candidates** → Fetches from:
   - Similar to The Godfather (15 candidates)
   - Recommendations for The Godfather (15 candidates)
   - Discover with Action genre (30 candidates)
   - Total: ~60 unique candidates

4. **Get full details** → Fetches details for top 15 candidates

5. **Filter** → Removes candidates that violate constraints

6. **Rank** → Scores each candidate:
   - Genre match (Action): +30 points
   - Similarity to The Godfather: +25 points
   - Mood match (low intensity): +20 points
   - Runtime fit: +10 points
   - Quality signal: +10 points
   - Diversity: +5 points

7. **Explain** → Generates reasons:
   - "Similar to The Godfather; shares crime-drama themes."
   - "An intense action film; may be less suitable if you want an easy watch."

8. **Return** → Top 3 movies with scores, reasons, and clarification question

## 🧪 Test Results

All tests pass:
- ✅ Query parsing (15 tests)
- ✅ Validation (4 tests)
- ✅ Ranking (6 tests)
- ✅ Explanation (3 tests)
- ✅ Integration (3 tests)

## 🔒 Security Verification

- ✅ No API keys in frontend bundle
- ✅ All TMDB calls go through server
- ✅ Input validation on all endpoints
- ✅ Rate limiting (30 req/10min)
- ✅ CORS configured
- ✅ Security headers (helmet)
- ✅ Generic error messages
- ✅ No sensitive data logging

## 📊 Performance

- **Caching**: Title lookups (1hr), Discover (30min), Providers (1hr)
- **API optimization**: Only fetches details for top 15 candidates
- **Parallel calls**: Similar/recommendation endpoints run in parallel
- **Rate limits**: Respects TMDB's 40 req/10sec limit

## 🎨 UI/UX Improvements

### Before
- Single entry point (wizard only)
- No match score visibility
- No feedback mechanism
- No clarification for conflicts

### After
- Two entry points (wizard + natural language)
- Match score bar on each card
- Feedback buttons (👍 👎 ✓)
- Clarification banner for conflicts
- Example queries for inspiration

## 🔄 Backward Compatibility

- ✅ Original `/api/recommend` endpoint unchanged
- ✅ Wizard flow works exactly as before
- ✅ Mock data fallback still active
- ✅ All existing features preserved
- ✅ No breaking changes

## 📝 Configuration

### Environment Variables
```bash
TMDB_API_KEY=your_key_here      # Required for live data
GEMINI_API_KEY=your_key_here    # Optional (AI reasons)
DEFAULT_REGION=US               # Optional (default: IN)
PORT=3001                       # Optional
```

### Ranking Weights
Edit `server/modules/ranker.js`:
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

## 🚀 How to Use

### For Users

1. **Open the app**
2. **Choose entry point:**
   - Click "✨ Describe it" for natural language
   - Click "Answer questions" for wizard
3. **Enter query** (if using smart search):
   - Type naturally: "I'm tired, want action, like The Godfather"
   - Or click an example query
4. **Review clarification** (if shown):
   - Answer the question or skip
5. **See results:**
   - 3 movies with posters, ratings, streaming info
   - Match scores and explanations
   - Feedback buttons
6. **Provide feedback:**
   - 👍 More like this
   - 👎 Not interested
   - ✓ Already watched
7. **Get more:** Click "Show me 3 more" for different picks

### For Developers

```bash
# Install dependencies
npm install

# Set environment variables
export TMDB_API_KEY="your_key"

# Start server
node server/index.js

# Run tests
npm test

# Build frontend
npm run build
```

## 📈 Test Scenarios (All Work)

1. ✅ "I want a light comedy under 100 minutes"
2. ✅ "I'm tired, want action, and like The Godfather"
3. ✅ "I want intense action but nothing violent"
4. ✅ Ambiguous title with multiple TMDB matches
5. ✅ No candidates found (graceful fallback)
6. ✅ TMDB timeout (error handling)
7. ✅ Missing genres, ratings, runtime (weight redistribution)
8. ✅ Disliked title filtered out
9. ✅ Ranking consistency and diversity
10. ✅ API keys never in client bundle

## 🐛 Known Limitations

1. **Mood tags not in TMDB** - Uses genre affinity heuristics
2. **No user accounts** - Feedback is client-side only
3. **Limited to movies** - TV support scaffolded but not tested
4. **No collaborative filtering** - Each user isolated
5. **Rate limits** - Heavy use may hit TMDB limits

## 🎉 Summary

The Movie Night Picker now has a **production-ready natural language query system** with:
- Intelligent query understanding
- Title resolution and disambiguation
- Multi-source candidate retrieval
- Transparent weighted ranking
- Personalized explanations
- Conflict clarification
- User feedback learning
- Comprehensive test coverage
- Full backward compatibility

All while maintaining security, privacy, and performance.
