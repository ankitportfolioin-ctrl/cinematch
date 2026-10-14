/**
 * Ranker - Scores and ranks candidates based on weighted signals
 * Implements a multi-factor scoring system with configurable weights
 */

// TMDB Genre IDs (for reverse lookup)
const GENRE_IDS = {
  Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
  Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, Horror: 27,
  Mystery: 9648, Romance: 10749, 'Sci-Fi': 878, Thriller: 53,
};

const GENRE_NAMES = Object.fromEntries(
  Object.entries(GENRE_IDS).map(([name, id]) => [id, name])
);

// Default weights (sum to 100)
const DEFAULT_WEIGHTS = {
  genreMatch: 30,        // Explicit genre and preference match
  similarity: 25,        // Similarity to liked titles
  moodMatch: 20,         // Mood / intensity / watch-effort match
  practicalMatch: 10,    // Runtime and practical constraint match
  qualitySignal: 10,     // Quality/popularity signal
  diversity: 5,          // Discovery/diversity adjustment
};

// Mood-to-genre affinity (which genres tend to match which moods)
const MOOD_GENRE_AFFINITY = {
  comforting: { Comedy: 0.8, Family: 0.7, Animation: 0.7, Romance: 0.5 },
  uplifting: { Comedy: 0.9, Adventure: 0.6, Animation: 0.6, Family: 0.5 },
  romantic: { Romance: 0.9, Drama: 0.5, Comedy: 0.4 },
  'thought-provoking': { Mystery: 0.8, 'Sci-Fi': 0.7, Documentary: 0.7, Drama: 0.5, Thriller: 0.4 },
  emotional: { Drama: 0.9, Romance: 0.5, Family: 0.3 },
};

// Intensity indicators by genre
const INTENSITY_MAP = {
  high: ['Action', 'Thriller', 'Horror', 'Crime'],
  medium: ['Adventure', 'Sci-Fi', 'Mystery', 'Drama'],
  low: ['Comedy', 'Animation', 'Family', 'Documentary', 'Romance'],
};

/**
 * Rank candidates based on preferences
 * @param {object[]} candidates - Array of candidates
 * @param {object} preferences - Parsed preferences
 * @param {object} resolvedTitles - Resolved liked titles
 * @param {object} options - Ranking options
 * @returns {object[]} Ranked candidates with scores and reasons
 */
export function rankCandidates(candidates, preferences, resolvedTitles, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights };
  
  // Calculate which signals are available
  const availableSignals = {
    genreMatch: preferences.genres.length > 0 || preferences.mood.length > 0,
    similarity: resolvedTitles.length > 0,
    moodMatch: preferences.mood.length > 0 || preferences.intensity || preferences.watchEffort,
    practicalMatch: preferences.maxRuntimeMinutes !== null,
    qualitySignal: true, // Always available
    diversity: true, // Always available
  };

  // Redistribute weights for missing signals
  const adjustedWeights = redistributeWeights(weights, availableSignals);

  // Score each candidate
  const scored = candidates.map(candidate => {
    const scores = {};
    const reasons = [];

    // 1. Genre match score (0-100)
    if (availableSignals.genreMatch) {
      const genreScore = calculateGenreMatch(candidate, preferences);
      scores.genreMatch = genreScore.score;
      if (genreScore.reasons.length > 0) {
        reasons.push(...genreScore.reasons);
      }
    }

    // 2. Similarity score (0-100)
    if (availableSignals.similarity) {
      const simScore = calculateSimilarity(candidate, resolvedTitles);
      scores.similarity = simScore.score;
      if (simScore.reasons.length > 0) {
        reasons.push(...simScore.reasons);
      }
    }

    // 3. Mood match score (0-100)
    if (availableSignals.moodMatch) {
      const moodScore = calculateMoodMatch(candidate, preferences);
      scores.moodMatch = moodScore.score;
      if (moodScore.reasons.length > 0) {
        reasons.push(...moodScore.reasons);
      }
    }

    // 4. Practical match score (0-100)
    if (availableSignals.practicalMatch) {
      const practicalScore = calculatePracticalMatch(candidate, preferences);
      scores.practicalMatch = practicalScore.score;
      if (practicalScore.reasons.length > 0) {
        reasons.push(...practicalScore.reasons);
      }
    }

    // 5. Quality signal (0-100)
    const qualityScore = calculateQualitySignal(candidate);
    scores.qualitySignal = qualityScore.score;

    // 6. Diversity adjustment (0-100) - will be applied after initial ranking
    scores.diversity = 50; // Neutral by default

    // Calculate weighted total
    let totalScore = 0;
    for (const [signal, weight] of Object.entries(adjustedWeights)) {
      totalScore += (scores[signal] || 0) * (weight / 100);
    }

    return {
      ...candidate,
      scores,
      totalScore: Math.round(totalScore),
      reasons: deduplicateReasons(reasons),
    };
  });

  // Sort by total score
  scored.sort((a, b) => b.totalScore - a.totalScore);

  // Apply diversity adjustment to avoid near-duplicates
  const diversified = applyDiversity(scored, preferences);

  return diversified;
}

/**
 * Redistribute weights when signals are missing
 */
function redistributeWeights(weights, availableSignals) {
  const missingWeight = Object.entries(weights)
    .filter(([signal]) => !availableSignals[signal])
    .reduce((sum, [, weight]) => sum + weight, 0);

  if (missingWeight === 0) return weights;

  const availableWeight = Object.entries(weights)
    .filter(([signal]) => availableSignals[signal])
    .reduce((sum, [, weight]) => sum + weight, 0);

  const adjusted = {};
  for (const [signal, weight] of Object.entries(weights)) {
    if (availableSignals[signal]) {
      adjusted[signal] = weight + (weight / availableWeight) * missingWeight;
    } else {
      adjusted[signal] = 0;
    }
  }

  return adjusted;
}

/**
 * Calculate genre match score
 */
function calculateGenreMatch(candidate, preferences) {
  let score = 0;
  const reasons = [];

  const candidateGenres = candidate.genreIds
    ? candidate.genreIds.map(id => GENRE_NAMES[id]).filter(Boolean)
    : candidate.genres || [];

  // Explicit genre match
  if (preferences.genres.length > 0) {
    const matchedGenres = candidateGenres.filter(g => preferences.genres.includes(g));
    if (matchedGenres.length > 0) {
      score += (matchedGenres.length / preferences.genres.length) * 60;
      reasons.push(`Matches your ${matchedGenres.join(', ')} preference`);
    }
  }

  // Mood-based genre affinity
  if (preferences.mood.length > 0) {
    let moodScore = 0;
    for (const mood of preferences.mood) {
      const affinity = MOOD_GENRE_AFFINITY[mood];
      if (affinity) {
        for (const genre of candidateGenres) {
          if (affinity[genre]) {
            moodScore = Math.max(moodScore, affinity[genre]);
          }
        }
      }
    }
    score += moodScore * 40;
    if (moodScore > 0.5) {
      reasons.push(`Fits the ${preferences.mood[0]} mood`);
    }
  }

  return { score: Math.min(100, score), reasons };
}

/**
 * Calculate similarity to liked titles
 */
function calculateSimilarity(candidate, resolvedTitles) {
  let score = 0;
  const reasons = [];

  if (resolvedTitles.length === 0) return { score: 0, reasons };

  const candidateGenres = new Set(
    candidate.genreIds
      ? candidate.genreIds.map(id => GENRE_NAMES[id]).filter(Boolean)
      : candidate.genres || []
  );

  for (const liked of resolvedTitles) {
    const likedGenres = new Set(liked.genres || []);
    
    // Genre overlap
    let genreOverlap = 0;
    for (const g of candidateGenres) {
      if (likedGenres.has(g)) genreOverlap++;
    }
    
    const overlapRatio = likedGenres.size > 0 ? genreOverlap / Math.max(likedGenres.size, candidateGenres.size) : 0;
    score += overlapRatio * 50;

    // If from similar/recommendation endpoint, boost score
    if (candidate.source === 'similar' && candidate.seedTitle === liked.title) {
      score += 40;
      reasons.push(`Similar to ${liked.title}`);
    } else if (candidate.source === 'recommendation' && candidate.seedTitle === liked.title) {
      score += 35;
      reasons.push(`Recommended based on ${liked.title}`);
    } else if (genreOverlap >= 2) {
      reasons.push(`Shares themes with ${liked.title}`);
    }
  }

  return { score: Math.min(100, score / resolvedTitles.length), reasons };
}

/**
 * Calculate mood/intensity/watch-effort match
 */
function calculateMoodMatch(candidate, preferences) {
  let score = 50; // Neutral baseline
  const reasons = [];

  const candidateGenres = candidate.genreIds
    ? candidate.genreIds.map(id => GENRE_NAMES[id]).filter(Boolean)
    : candidate.genres || [];

  // Intensity match
  if (preferences.intensity) {
    const intensityGenres = INTENSITY_MAP[preferences.intensity] || [];
    const hasIntensityGenre = candidateGenres.some(g => intensityGenres.includes(g));
    
    if (hasIntensityGenre) {
      score += 25;
      if (preferences.intensity === 'high') {
        reasons.push('An intense, gripping watch');
      } else if (preferences.intensity === 'low') {
        reasons.push('Easy to follow, not too intense');
      }
    } else {
      score -= 15;
    }
  }

  // Watch effort match
  if (preferences.watchEffort === 'low') {
    const easyGenres = ['Comedy', 'Animation', 'Family', 'Romance'];
    const hasEasyGenre = candidateGenres.some(g => easyGenres.includes(g));
    if (hasEasyGenre) {
      score += 20;
      reasons.push('A comfortable, easy watch');
    }
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

/**
 * Calculate practical constraint match
 */
function calculatePracticalMatch(candidate, preferences) {
  let score = 50; // Neutral baseline
  const reasons = [];

  if (preferences.maxRuntimeMinutes && candidate.runtime) {
    const diff = candidate.runtime - preferences.maxRuntimeMinutes;
    if (diff <= 0) {
      score = 100; // Within limit
      if (diff > -15) {
        reasons.push(`Fits your time preference (${candidate.runtime} min)`);
      }
    } else if (diff <= 15) {
      score = 70; // Slightly over
      reasons.push(`Slightly longer than your preference (${candidate.runtime} min)`);
    } else {
      score = 20; // Significantly over
    }
  }

  return { score, reasons };
}

/**
 * Calculate quality signal (rating + vote confidence)
 */
function calculateQualitySignal(candidate) {
  const voteCount = candidate.voteCount || 0;
  const rating = candidate.voteAverage || 0;

  // Confidence adjustment (minimum 100 votes for full weight)
  const confidence = Math.min(1, voteCount / 500);
  
  // Normalize rating to 0-100
  const normalizedRating = (rating / 10) * 100;
  
  // Apply confidence
  const score = normalizedRating * confidence;

  return { score: Math.min(100, score) };
}

/**
 * Apply diversity adjustment to avoid near-duplicates
 */
function applyDiversity(ranked, preferences) {
  const result = [];
  const seenFranchises = new Set();
  const seenGenreCombos = new Set();

  for (const candidate of ranked) {
    if (result.length >= 10) break; // Return top 10 for flexibility

    // Check for franchise/collection duplicates
    const titleKey = candidate.title.toLowerCase().replace(/[\d:]/g, '').trim();
    if (seenFranchises.has(titleKey)) continue;

    // Check for very similar genre combinations
    const genreKey = (candidate.genreIds || []).sort().join(',');
    if (seenGenreCombos.has(genreKey) && result.length >= 3) continue;

    result.push(candidate);
    seenFranchises.add(titleKey);
    seenGenreCombos.add(genreKey);
  }

  return result;
}

/**
 * Deduplicate reasons
 */
function deduplicateReasons(reasons) {
  const seen = new Set();
  return reasons.filter(r => {
    if (seen.has(r)) return false;
    seen.add(r);
    return true;
  }).slice(0, 3); // Max 3 reasons per candidate
}
