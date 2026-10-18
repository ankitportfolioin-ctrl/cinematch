/**
 * Feedback Module - Handles user feedback for recommendations
 * Stores feedback in localStorage (client-side) for privacy
 */

const FEEDBACK_STORAGE_KEY = 'movieNightPicker_feedback';
const MAX_FEEDBACK_ITEMS = 100;

/**
 * Feedback types
 */
export const FEEDBACK_TYPES = {
  MORE_LIKE_THIS: 'more_like_this',
  LESS_LIKE_THIS: 'less_like_this',
  NOT_INTERESTED: 'not_interested',
  ALREADY_WATCHED: 'already_watched',
  SAVE: 'save',
};

/**
 * Save feedback for a movie
 * @param {number} tmdbId - TMDB ID
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {string} feedbackType - Type of feedback
 * @param {object} metadata - Additional metadata
 */
export function saveFeedback(tmdbId, mediaType, feedbackType, metadata = {}) {
  if (typeof window === 'undefined') return; // Server-side guard

  try {
    const existing = getFeedback();
    
    const feedback = {
      tmdbId,
      mediaType,
      feedbackType,
      timestamp: Date.now(),
      ...metadata,
    };

    existing.push(feedback);

    // Keep only recent feedback
    if (existing.length > MAX_FEEDBACK_ITEMS) {
      existing.splice(0, existing.length - MAX_FEEDBACK_ITEMS);
    }

    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save feedback:', error);
  }
}

/**
 * Get all feedback
 * @returns {object[]} Array of feedback items
 */
export function getFeedback() {
  if (typeof window === 'undefined') return []; // Server-side guard

  try {
    const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get feedback:', error);
    return [];
  }
}

/**
 * Get feedback for a specific movie
 * @param {number} tmdbId - TMDB ID
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {object[]} Array of feedback items for this movie
 */
export function getFeedbackForMovie(tmdbId, mediaType) {
  const allFeedback = getFeedback();
  return allFeedback.filter(f => f.tmdbId === tmdbId && f.mediaType === mediaType);
}

/**
 * Get liked movie IDs (from "more_like_this" and "save" feedback)
 * @returns {number[]} Array of TMDB IDs
 */
export function getLikedMovieIds() {
  const feedback = getFeedback();
  return feedback
    .filter(f => f.feedbackType === FEEDBACK_TYPES.MORE_LIKE_THIS || f.feedbackType === FEEDBACK_TYPES.SAVE)
    .map(f => f.tmdbId);
}

/**
 * Get disliked movie IDs (from "less_like_this" and "not_interested" feedback)
 * @returns {number[]} Array of TMDB IDs
 */
export function getDislikedMovieIds() {
  const feedback = getFeedback();
  return feedback
    .filter(f => f.feedbackType === FEEDBACK_TYPES.LESS_LIKE_THIS || f.feedbackType === FEEDBACK_TYPES.NOT_INTERESTED)
    .map(f => f.tmdbId);
}

/**
 * Get watched movie IDs
 * @returns {number[]} Array of TMDB IDs
 */
export function getWatchedMovieIds() {
  const feedback = getFeedback();
  return feedback
    .filter(f => f.feedbackType === FEEDBACK_TYPES.ALREADY_WATCHED)
    .map(f => f.tmdbId);
}

/**
 * Clear all feedback
 */
export function clearFeedback() {
  if (typeof window === 'undefined') return; // Server-side guard

  try {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear feedback:', error);
  }
}

/**
 * Clear feedback for a specific movie
 * @param {number} tmdbId - TMDB ID
 * @param {string} mediaType - 'movie' or 'tv'
 */
export function clearFeedbackForMovie(tmdbId, mediaType) {
  if (typeof window === 'undefined') return; // Server-side guard

  try {
    const feedback = getFeedback();
    const filtered = feedback.filter(f => !(f.tmdbId === tmdbId && f.mediaType === mediaType));
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to clear feedback for movie:', error);
  }
}

/**
 * Export feedback as JSON (for backup/transfer)
 * @returns {string} JSON string
 */
export function exportFeedback() {
  const feedback = getFeedback();
  return JSON.stringify(feedback, null, 2);
}

/**
 * Import feedback from JSON
 * @param {string} json - JSON string
 */
export function importFeedback(json) {
  if (typeof window === 'undefined') return; // Server-side guard

  try {
    const feedback = JSON.parse(json);
    if (!Array.isArray(feedback)) {
      throw new Error('Invalid feedback format');
    }
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
  } catch (error) {
    console.error('Failed to import feedback:', error);
    throw new Error('Invalid feedback data');
  }
}
