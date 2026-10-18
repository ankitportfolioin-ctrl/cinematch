/**
 * Explainer - Generates human-readable explanations for recommendations
 * Assembles reasons from actual matched fields, never invents facts
 */

/**
 * Generate explanation for a ranked candidate
 * @param {object} candidate - Ranked candidate with scores and reasons
 * @param {object} preferences - User preferences
 * @param {object} resolvedTitles - Resolved liked titles
 * @returns {string} Human-readable explanation
 */
export function generateExplanation(candidate, preferences, resolvedTitles) {
  const parts = [];

  // Start with the strongest reason
  if (candidate.reasons && candidate.reasons.length > 0) {
    parts.push(candidate.reasons[0]);
  }

  // Add genre match if significant
  if (preferences.genres.length > 0) {
    const candidateGenres = candidate.genres || [];
    const matchedGenres = candidateGenres.filter(g => preferences.genres.includes(g));
    if (matchedGenres.length > 0 && !parts.some(p => p.includes('Matches your'))) {
      parts.push(`Matches your ${matchedGenres.join(' and ')} preference`);
    }
  }

  // Add similarity context if from liked titles
  if (candidate.source === 'similar' && candidate.seedTitle) {
    if (!parts.some(p => p.includes('Similar to'))) {
      parts.push(`Similar to ${candidate.seedTitle}`);
    }
  } else if (candidate.source === 'recommendation' && candidate.seedTitle) {
    if (!parts.some(p => p.includes('Recommended based on'))) {
      parts.push(`Recommended based on ${candidate.seedTitle}`);
    }
  }

  // Add mood context
  if (preferences.mood.length > 0 && !parts.some(p => p.includes('mood'))) {
    const mood = preferences.mood[0];
    if (mood === 'comforting') {
      parts.push('A comforting choice');
    } else if (mood === 'uplifting') {
      parts.push('An uplifting watch');
    } else if (mood === 'romantic') {
      parts.push('Perfect for a romantic evening');
    } else if (mood === 'thought-provoking') {
      parts.push('Will make you think');
    } else if (mood === 'emotional') {
      parts.push('An emotionally resonant story');
    }
  }

  // Add practical context
  if (preferences.maxRuntimeMinutes && candidate.runtime) {
    const diff = candidate.runtime - preferences.maxRuntimeMinutes;
    if (diff <= 0 && !parts.some(p => p.includes('time'))) {
      parts.push(`Fits your time preference (${candidate.runtime} min)`);
    }
  }

  // Add quality signal if high
  if (candidate.voteAverage >= 7.5 && candidate.voteCount >= 500) {
    if (!parts.some(p => p.includes('highly rated') || p.includes('well-loved'))) {
      parts.push('Highly rated by audiences');
    }
  }

  // Combine into a coherent sentence
  if (parts.length === 0) {
    return 'A great match for your preferences.';
  }

  if (parts.length === 1) {
    return parts[0] + '.';
  }

  // Join first two parts naturally
  const [first, ...rest] = parts;
  if (rest.length === 1) {
    return `${first}; ${rest[0].toLowerCase()}.`;
  }

  return `${first}; ${rest[0].toLowerCase()}.`;
}

/**
 * Generate a brief match summary
 * @param {object} candidate - Ranked candidate
 * @param {object} preferences - User preferences
 * @returns {string} Brief summary
 */
export function generateBriefSummary(candidate, preferences) {
  const parts = [];

  // Genre match
  if (preferences.genres.length > 0) {
    const candidateGenres = candidate.genres || [];
    const matchedGenres = candidateGenres.filter(g => preferences.genres.includes(g));
    if (matchedGenres.length > 0) {
      parts.push(`${matchedGenres.join('/')}`);
    }
  }

  // Source context
  if (candidate.source === 'similar' && candidate.seedTitle) {
    parts.push(`like ${candidate.seedTitle}`);
  } else if (candidate.source === 'recommendation' && candidate.seedTitle) {
    parts.push(`based on ${candidate.seedTitle}`);
  }

  // Quality indicator
  if (candidate.voteAverage >= 7.5) {
    parts.push(`${candidate.voteAverage.toFixed(1)}★`);
  }

  return parts.join(' · ');
}

/**
 * Generate clarification message for ambiguous queries
 * @param {object} preferences - Parsed preferences
 * @returns {string|null} Clarification question or null
 */
export function generateClarification(preferences) {
  if (!preferences.clarificationNeeded) return null;

  // Use the pre-generated question if available
  if (preferences.clarificationQuestion) {
    return preferences.clarificationQuestion;
  }

  // Generate based on detected conflicts
  const conflicts = [];

  if (preferences.watchEffort === 'low' && preferences.intensity === 'high') {
    conflicts.push('You mentioned wanting something easy but also intense.');
  }

  if (preferences.genres.includes('Horror') && preferences.mood.includes('comforting')) {
    conflicts.push('You asked for horror but also mentioned wanting something comforting.');
  }

  if (preferences.maxRuntimeMinutes && preferences.maxRuntimeMinutes < 90 && preferences.genres.includes('Drama')) {
    conflicts.push('You want a short movie but also drama, which often runs longer.');
  }

  if (conflicts.length > 0) {
    return conflicts[0] + ' Would you like to adjust this?';
  }

  return null;
}

/**
 * Generate "why not" explanation for filtered-out candidates
 * @param {object} candidate - Filtered candidate
 * @param {object} preferences - User preferences
 * @returns {string} Reason for filtering
 */
export function generateFilterReason(candidate, preferences) {
  const reasons = [];

  // Check excluded genres
  if (preferences.excludeGenres.length > 0) {
    const candidateGenres = candidate.genres || [];
    const excluded = candidateGenres.filter(g => preferences.excludeGenres.includes(g));
    if (excluded.length > 0) {
      reasons.push(`Contains ${excluded.join(', ')} which you wanted to avoid`);
    }
  }

  // Check runtime
  if (preferences.maxRuntimeMinutes && candidate.runtime) {
    if (candidate.runtime > preferences.maxRuntimeMinutes + 15) {
      reasons.push(`Too long (${candidate.runtime} min vs your ${preferences.maxRuntimeMinutes} min preference)`);
    }
  }

  // Check disliked titles
  if (preferences.dislikedTitles.length > 0) {
    // This would require more complex logic to detect similar titles
  }

  return reasons.length > 0 ? reasons.join('; ') : 'Did not match your preferences';
}
