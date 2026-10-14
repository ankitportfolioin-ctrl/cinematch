/**
 * Title Resolver - Resolves movie/TV titles to TMDB IDs
 * Uses TMDB search and handles ambiguity
 */

// In-memory cache for title lookups (1 hour TTL)
const titleCache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

/**
 * Resolve a title string to a TMDB ID
 * @param {string} title - Movie or TV title
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {Function} tmdbFetch - TMDB fetch function
 * @returns {Promise<object|null>} Resolved title info or null
 */
export async function resolveTitle(title, mediaType = 'movie', tmdbFetch) {
  if (!title || !title.trim()) return null;

  const cacheKey = `${mediaType}:${title.trim().toLowerCase()}`;
  
  // Check cache
  const cached = titleCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Search TMDB
    const endpoint = mediaType === 'tv' ? '/search/tv' : '/search/movie';
    const data = await tmdbFetch(endpoint, {
      query: title.trim(),
      include_adult: 'false',
      language: 'en-US',
      page: '1',
    });

    if (!data.results || data.results.length === 0) {
      return null;
    }

    // Get top results
    const results = data.results.slice(0, 5);

    // If only one clear result, return it
    if (results.length === 1) {
      const result = results[0];
      const resolved = {
        id: result.id,
        mediaType,
        title: mediaType === 'tv' ? result.name : result.title,
        year: mediaType === 'tv' 
          ? (result.first_air_date ? new Date(result.first_air_date).getFullYear() : null)
          : (result.release_date ? new Date(result.release_date).getFullYear() : null),
        overview: result.overview || '',
        genres: result.genre_ids || [],
        popularity: result.popularity || 0,
        voteAverage: result.vote_average || 0,
        voteCount: result.vote_count || 0,
      };
      titleCache.set(cacheKey, { data: resolved, timestamp: Date.now() });
      return resolved;
    }

    // Multiple results - return the best match (highest popularity + vote count)
    const bestMatch = results.sort((a, b) => {
      const scoreA = (a.popularity || 0) * 0.7 + (a.vote_count || 0) * 0.3;
      const scoreB = (b.popularity || 0) * 0.7 + (b.vote_count || 0) * 0.3;
      return scoreB - scoreA;
    })[0];

    const resolved = {
      id: bestMatch.id,
      mediaType,
      title: mediaType === 'tv' ? bestMatch.name : bestMatch.title,
      year: mediaType === 'tv'
        ? (bestMatch.first_air_date ? new Date(bestMatch.first_air_date).getFullYear() : null)
        : (bestMatch.release_date ? new Date(bestMatch.release_date).getFullYear() : null),
      overview: bestMatch.overview || '',
      genres: bestMatch.genre_ids || [],
      popularity: bestMatch.popularity || 0,
      voteAverage: bestMatch.vote_average || 0,
      voteCount: bestMatch.vote_count || 0,
      ambiguous: results.length > 1,
      alternatives: results.slice(1, 4).map(r => ({
        id: r.id,
        title: mediaType === 'tv' ? r.name : r.title,
        year: mediaType === 'tv'
          ? (r.first_air_date ? new Date(r.first_air_date).getFullYear() : null)
          : (r.release_date ? new Date(r.release_date).getFullYear() : null),
      })),
    };

    titleCache.set(cacheKey, { data: resolved, timestamp: Date.now() });
    return resolved;
  } catch (error) {
    console.error('Title resolution error:', error.message);
    return null;
  }
}

/**
 * Resolve multiple titles
 * @param {string[]} titles - Array of title strings
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {Function} tmdbFetch - TMDB fetch function
 * @returns {Promise<object[]>} Array of resolved titles
 */
export async function resolveTitles(titles, mediaType = 'movie', tmdbFetch) {
  const results = await Promise.all(
    titles.map(title => resolveTitle(title, mediaType, tmdbFetch))
  );
  return results.filter(r => r !== null);
}

/**
 * Get similar/recommended titles from TMDB
 * @param {number} tmdbId - TMDB ID
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {Function} tmdbFetch - TMDB fetch function
 * @returns {Promise<object[]>} Similar titles
 */
export async function getSimilarTitles(tmdbId, mediaType = 'movie', tmdbFetch) {
  try {
    const endpoint = mediaType === 'tv' 
      ? `/tv/${tmdbId}/similar`
      : `/movie/${tmdbId}/similar`;
    
    const data = await tmdbFetch(endpoint, { language: 'en-US', page: '1' });
    
    if (!data.results) return [];

    return data.results.slice(0, 20).map(r => ({
      id: r.id,
      mediaType,
      title: mediaType === 'tv' ? r.name : r.title,
      year: mediaType === 'tv'
        ? (r.first_air_date ? new Date(r.first_air_date).getFullYear() : null)
        : (r.release_date ? new Date(r.release_date).getFullYear() : null),
      overview: r.overview || '',
      genres: r.genre_ids || [],
      popularity: r.popularity || 0,
      voteAverage: r.vote_average || 0,
      voteCount: r.vote_count || 0,
      posterPath: r.poster_path || null,
    }));
  } catch (error) {
    console.error('Similar titles error:', error.message);
    return [];
  }
}

/**
 * Get recommendations from TMDB
 * @param {number} tmdbId - TMDB ID
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {Function} tmdbFetch - TMDB fetch function
 * @returns {Promise<object[]>} Recommended titles
 */
export async function getRecommendations(tmdbId, mediaType = 'movie', tmdbFetch) {
  try {
    const endpoint = mediaType === 'tv'
      ? `/tv/${tmdbId}/recommendations`
      : `/movie/${tmdbId}/recommendations`;
    
    const data = await tmdbFetch(endpoint, { language: 'en-US', page: '1' });
    
    if (!data.results) return [];

    return data.results.slice(0, 20).map(r => ({
      id: r.id,
      mediaType,
      title: mediaType === 'tv' ? r.name : r.title,
      year: mediaType === 'tv'
        ? (r.first_air_date ? new Date(r.first_air_date).getFullYear() : null)
        : (r.release_date ? new Date(r.release_date).getFullYear() : null),
      overview: r.overview || '',
      genres: r.genre_ids || [],
      popularity: r.popularity || 0,
      voteAverage: r.vote_average || 0,
      voteCount: r.vote_count || 0,
      posterPath: r.poster_path || null,
    }));
  } catch (error) {
    console.error('Recommendations error:', error.message);
    return [];
  }
}
