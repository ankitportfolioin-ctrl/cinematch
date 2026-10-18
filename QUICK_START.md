# 🚀 Quick Start Guide

## What's New?

The Movie Night Picker now supports **natural language queries**! You can describe your perfect movie night in plain English, and the app will understand your preferences, find similar movies, and explain why each pick matches.

## Two Ways to Find Movies

### Option 1: Describe It (New ✨)
Click **"✨ Describe it"** on the home screen and type naturally:

**Examples:**
- "I'm tired, want an action movie, and I like The Godfather"
- "Light comedy under 100 minutes"
- "Something romantic like Before Sunrise"
- "Intense thriller but nothing too violent"
- "Feel-good animation for the family"

The app will:
1. Understand your mood, genres, and preferences
2. Find "The Godfather" (or other movies you mention) in TMDB
3. Get similar movies and recommendations
4. Rank them based on your preferences
5. Show you 3 perfect picks with explanations

### Option 2: Answer Questions (Existing)
Click **"Answer questions"** for the step-by-step wizard (unchanged from before).

## What You'll See

### Smart Search Screen
- Large text area to type your query
- Example queries you can click
- "Find my movies" button

### Results Screen
- **Clarification banner** (if needed): "You want easy but intense? Would you prefer..."
- **3 movie cards** with:
  - Poster, title, year, genres
  - Runtime and rating (★)
  - 2-line overview
  - **Match score bar** (0-100%)
  - **Explanation**: "Similar to The Godfather; shares crime-drama themes."
  - Streaming providers (Netflix, Prime, etc.)
  - **Feedback buttons**: 👍 👎 ✓

### Feedback Buttons
- 👍 **More like this** - Tells the app you want more similar movies
- 👎 **Not interested** - Tells the app to avoid similar movies
- ✓ **Already watched** - Excludes this movie from future recommendations

Feedback is stored in your browser (localStorage) and never sent to any server.

## How It Works (Simplified)

1. **You type**: "I'm tired, want action, like The Godfather"
2. **App parses**: 
   - Mood: tired (wants easy watch)
   - Genre: action
   - Liked: The Godfather
   - Conflict detected: tired + action
3. **App finds**: The Godfather in TMDB (ID: 238)
4. **App retrieves**: Similar movies + recommendations + action movies
5. **App ranks**: Scores each movie 0-100 based on:
   - Genre match (30%)
   - Similarity to The Godfather (25%)
   - Mood fit (20%)
   - Runtime (10%)
   - Quality (10%)
   - Diversity (5%)
6. **App explains**: "Similar to The Godfather; an intense action film."
7. **App shows**: Top 3 movies with match scores

## Example Queries to Try

### Simple
- "Comedy"
- "Action movies"
- "Romantic drama"

### With mood
- "I'm tired, something light"
- "I want something intense and thrilling"
- "Feeling romantic tonight"

### With references
- "Something like Inception"
- "Movies similar to The Dark Knight"
- "I love Studio Ghibli films"

### With constraints
- "Under 90 minutes"
- "Recent movies from the last 5 years"
- "Classic films before 2000"

### Complex
- "I'm tired, want an action movie, and I like The Godfather"
- "Light comedy under 100 minutes, nothing violent"
- "Intense sci-fi like Blade Runner but not too long"

## What the App Understands

### Moods
- tired, relaxed, chill, comfortable, easy → low watch effort
- intense, thrilling, exciting, adrenaline → high intensity
- comforting, feel-good, happy, uplifting → uplifting mood
- romantic, love → romantic mood
- curious, mysterious, mind-bending → thought-provoking
- sad, emotional, touching → emotional mood

### Genres
- action, adventure, animation, anime, comedy, crime, documentary, drama, family, fantasy, horror, mystery, romance, sci-fi, thriller

### Runtimes
- "under 90 minutes"
- "less than 2 hours"
- "around 100 min"
- "about 1.5 hours"

### Title References
- "I like The Godfather"
- "I love Inception"
- "similar to The Dark Knight"
- "movies like Before Sunrise"

### Exclusions
- "nothing violent"
- "avoid horror"
- "no scary movies"
- "not too long"

## Technical Details

### For Developers

**New API endpoint:**
```
POST /api/smart-recommend
{
  "query": "I'm tired, want action, like The Godfather",
  "structuredInputs": { "mood": "Tired", "genres": ["Action"] },
  "excludeIds": [123, 456],
  "region": "US"
}
```

**New modules:**
- `server/modules/queryParser.js` - Parses natural language
- `server/modules/titleResolver.js` - Resolves titles to TMDB IDs
- `server/modules/candidateRetriever.js` - Fetches candidates
- `server/modules/ranker.js` - Scores and ranks
- `server/modules/explainer.js` - Generates explanations
- `server/modules/feedback.js` - Handles user feedback

**Tests:**
```bash
npm test
```

30+ tests covering parsing, validation, ranking, and integration.

### For Users

**Privacy:**
- Feedback is stored in your browser only (localStorage)
- Never sent to any server
- Can be cleared anytime

**Performance:**
- Results in 2-5 seconds
- Caches lookups for faster repeat queries
- Respects TMDB rate limits

**Compatibility:**
- Works on mobile (375px+) and desktop
- Original wizard still works
- No breaking changes

## Troubleshooting

### "No movies found"
- Try broader terms: "action" instead of "spy action thriller"
- Remove runtime constraints
- Try different genres

### Clarification question appears
- The app detected a conflict (e.g., "tired" + "intense")
- Answer the question or skip it
- Results will still be shown

### Match score is low
- Movie doesn't match many of your preferences
- Try different query terms
- Check if runtime is too short/long

### Feedback buttons don't work
- Make sure JavaScript is enabled
- Check browser allows localStorage
- Try a different browser

## What's Next?

- ✅ Natural language queries
- ✅ Title resolution
- ✅ Weighted ranking
- ✅ Personalized explanations
- ✅ User feedback
- ✅ Match score visualization
- ✅ Clarification system

**Coming soon:**
- User accounts with persistent feedback
- TV show support
- Collaborative filtering
- More sophisticated mood detection

## Need Help?

- See [SMART_RECOMMENDATION_SYSTEM.md](SMART_RECOMMENDATION_SYSTEM.md) for full technical details
- See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for what was built
- Check the test suite: `server/tests/recommendation.test.js`

---

**Enjoy your movie night!** 🍿🎬
