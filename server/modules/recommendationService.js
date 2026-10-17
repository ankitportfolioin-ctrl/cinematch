/**
 * Shared Recommendation Service
 * Used by both live TMDB mode and demo mode
 * Provides deterministic, trustworthy recommendations
 */

import { parseUserQuery, validatePreferences } from './queryParser.js';
import { rankCandidates } from './ranker.js';
import { generateExplanation } from './explainer.js';

// Deterministic seed generation
function generateStableSeed(preferences, feedback, catalogVersion, cursor) {
  const components = [
    JSON.stringify(preferences),
    JSON.stringify(feedback || {}),
    catalogVersion || '1.0',
    cursor || '0',
  ];
  
  // Simple hash function for deterministic seeding
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
}

// Seeded random number generator (deterministic)
function seededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/**
 * Main recommendation service
 * @param {object} params - Recommendation parameters
 * @returns {Promise<object>} Recommendation results
 */
export async function getRecommendations({
  query = '',
  structuredInputs = {},
  feedback = {},
  mode = 'demo',
  catalog = [],
  catalogVersion = '1.0',
  cursor = '0',
  region = 'US',
  tmdbFetch = null,
  resolveTitles = null,
  retrieveCandidates = null,
  getFullDetails = null,
}) {
  // Step 1: Parse and validate preferences
  let preferences = parseUserQuery(query, structuredInputs);
  preferences = validatePreferences(preferences);
  
  // Step 2: Generate stable seed for deterministic behavior
  const seed = generateStableSeed(preferences, feedback, catalogVersion, cursor);
  const random = seededRandom(seed);
  
  // Step 3: Get candidates based on mode
  let candidates = [];
  let appState = 'live';
  
  if (mode === 'live' && tmdbFetch && resolveTitles && retrieveCandidates) {
    // Live TMDB mode
    try {
      // Resolve liked titles
      let resolvedTitles = [];
      if (preferences.likedTitles.length > 0 && resolveTitles) {
        resolvedTitles = await resolveTitles(
          preferences.likedTitles, 
          preferences.mediaType, 
          tmdbFetch
        );
      }
      
      // Retrieve candidates
      candidates = await retrieveCandidates(
        preferences,
        resolvedTitles,
        tmdbFetch,
        { region, excludeIds: feedback.watchedIds || [] }
      );
      
      // Get full details
      if (getFullDetails && candidates.length > 0) {
        const detailed = await Promise.all(
          candidates.slice(0, 15).map(async (c) => {
            const details = await getFullDetails(c.id, c.mediaType, tmdbFetch);
            return details ? { ...c, ...details } : c;
          })
        );
        candidates = detailed;
      }
      
      appState = candidates.length > 0 ? 'live' : 'no_results';
    } catch (error) {
      console.error('Live mode error:', error.message);
      appState = 'error';
      // Fall back to demo mode
      mode = 'demo';
    }
  }
  
  // Step 4: Demo mode fallback
  if (mode === 'demo' || appState === 'error') {
    candidates = getDemoCandidates(preferences, catalog, feedback, random);
    appState = candidates.length > 0 ? 'demo' : 'no_results';
  }
  
  // Step 5: Apply hard filters
  const filtered = applyHardFilters(candidates, preferences);
  
  if (filtered.length === 0) {
    return {
      movies: [],
      appState: 'no_results',
      clarification: null,
      preferences,
      message: 'No movies match your criteria. Try relaxing some filters.',
    };
  }
  
  // Step 6: Rank candidates
  const ranked = rankCandidates(filtered, preferences, [], { random });
  
  // Step 7: Apply pagination
  const pageSize = 3;
  const startIndex = parseInt(cursor) || 0;
  const paginated = ranked.slice(startIndex, startIndex + pageSize);
  
  // Step 8: Generate explanations
  const movies = paginated.map(candidate => {
    const reason = generateExplanation(candidate, preferences, []);
    
    return {
      id: candidate.id,
      mediaType: candidate.mediaType || 'movie',
      title: candidate.title,
      year: candidate.year,
      genres: candidate.genres || [],
      runtime: candidate.runtime || 0,
      rating: candidate.voteAverage || candidate.rating || 0,
      voteCount: candidate.voteCount || 0,
      overview: candidate.overview || '',
      posterUrl: candidate.posterUrl || candidate.posterPath 
        ? `https://image.tmdb.org/t/p/w500${candidate.posterPath}`
        : '',
      providers: candidate.providers || [],
      reason,
      matchScore: candidate.totalScore || 0,
      isHiddenGem: candidate.isHiddenGem || false,
      scoreBreakdown: candidate.scores || {},
    };
  });
  
  // Step 9: Determine next cursor
  const nextCursor = startIndex + pageSize < ranked.length 
    ? String(startIndex + pageSize)
    : null;
  
  return {
    movies,
    appState,
    clarification: null,
    preferences,
    nextCursor,
    totalCount: ranked.length,
  };
}

/**
 * Get demo candidates from catalog
 */
function getDemoCandidates(preferences, catalog, feedback, random) {
  if (!catalog || catalog.length === 0) {
    return [];
  }
  
  // Filter out watched/not-interested
  const watchedIds = new Set(feedback.watchedIds || []);
  const notInterestedIds = new Set(feedback.notInterestedIds || []);
  
  let candidates = catalog.filter(m => 
    !watchedIds.has(m.id) && !notInterestedIds.has(m.id)
  );
  
  // Score candidates based on preferences
  const scored = candidates.map(movie => {
    let score = 0;
    
    // Genre match
    if (preferences.genres.length > 0) {
      const matchCount = movie.genres.filter(g => 
        preferences.genres.includes(g)
      ).length;
      score += matchCount * 10;
    }
    
    // Mood match (simplified)
    if (preferences.mood.length > 0) {
      score += 5; // Base mood match
    }
    
    // Runtime fit
    if (preferences.maxRuntimeMinutes && movie.runtime) {
      if (movie.runtime <= preferences.maxRuntimeMinutes) {
        score += 5;
      } else {
        score -= 10;
      }
    }
    
    // Rating boost
    if (movie.rating >= 7.5) {
      score += 3;
    }
    
    // Add deterministic randomness
    score += random() * 2;
    
    return { ...movie, score };
  });
  
  // Sort by score
  scored.sort((a, b) => b.score - a.score);
  
  return scored;
}

/**
 * Apply hard filters (constraints that must never be violated)
 */
function applyHardFilters(candidates, preferences) {
  return candidates.filter(candidate => {
    // Excluded genres
    if (preferences.excludeGenres.length > 0) {
      const hasExcluded = candidate.genres.some(g => 
        preferences.excludeGenres.includes(g)
      );
      if (hasExcluded) return false;
    }
    
    // Excluded content
    if (preferences.excludeContent.includes('violent')) {
      const violentGenres = ['Action', 'Thriller', 'Horror', 'War'];
      if (candidate.genres.some(g => violentGenres.includes(g))) {
        return false;
      }
    }
    
    if (preferences.excludeContent.includes('scary')) {
      const scaryGenres = ['Horror', 'Thriller'];
      if (candidate.genres.some(g => scaryGenres.includes(g))) {
        return false;
      }
    }
    
    // Runtime constraint (hard limit)
    if (preferences.maxRuntimeMinutes && candidate.runtime) {
      if (candidate.runtime > preferences.maxRuntimeMinutes + 15) {
        return false; // 15 min grace period
      }
    }
    
    // Language filter
    if (preferences.language && candidate.languages) {
      if (!candidate.languages.includes(preferences.language)) {
        return false;
      }
    }
    
    // Release period
    if (preferences.releasePeriod === 'recent' && candidate.year) {
      const currentYear = new Date().getFullYear();
      if (candidate.year < currentYear - 5) {
        return false;
      }
    }
    
    if (preferences.releasePeriod === 'classic' && candidate.year) {
      if (candidate.year >= 2000) {
        return false;
      }
    }
    
    // Highly rated filter
    if (preferences.highlyRated && candidate.rating < 7.0) {
      return false;
    }
    
    return true;
  });
}

export { generateStableSeed, seededRandom };
