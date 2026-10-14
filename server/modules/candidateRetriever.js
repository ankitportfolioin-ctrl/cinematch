/**
 * Candidate Retriever - Fetches movie/TV candidates from TMDB
 * Uses multiple strategies: discover, similar, recommendations, search
 */

// In-memory cache for discover results (30 min TTL)
const discoverCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

// TMDB Genre IDs
const GENRE_IDS = {
  Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
  Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, Horror: 27,
  Mystery: 9648, Romance: 10749, 'Sci-Fi': 878, Thriller: 53,
};

/**
 * Retrieve candidates from TMDB based on preferences
 * @param {object} preferences - Parsed preferences
 * @param {object} resolvedTitles - Resolved liked titles
 * @param {Function} tmdbFetch - TMDB fetch function
 * @param {object} options - Additional options
 * @returns {Promise<object[]>} Array of candidates
 */
export async function retrieveCandidates(preferences, resolvedTitles, tmdbFetch, options = {}) {
  const candidates = new Map(); // Use Map to deduplicate by ID
  const { region = 'US', excludeIds = [] } = options;

  try {
    // Strategy 1: Similar titles from liked movies
    if (resolvedTitles.length > 0) {
      for (const title of resolvedTitles) {
        const similar = await getSimilarFromTMDB(title.id, title.mediaType, tmdbFetch);
        for (const item of similar) {
          if (!excludeIds.includes(item.id)) {
            candidates.set(`${item.mediaType}:${item.id}`, {
              ...item,
              source: 'similar',
              seedTitle: title.title,
            });
          }
        }
      }
    }

    // Strategy 2: Recommendations from liked movies
    if (resolvedTitles.length > 0) {
      for (const title of resolvedTitles) {
        const recommendations = await getRecommendationsFromTMDB(title.id, title.mediaType, tmdbFetch);
        for (const item of recommendations) {
          if (!excludeIds.includes(item.id)) {
            const key = `${item.mediaType}:${item.id}`;
            if (!candidates.has(key)) {
              candidates.set(key, {
                ...item,
                source: 'recommendation',
                seedTitle: title.title,
              });
            }
          }
        }
      }
    }

    // Strategy 3: Discover based on genres and preferences
    if (preferences.genres.length > 0 || preferences.mood.length > 0) {
      const discovered = await discoverFromTMDB(preferences, tmdbFetch, region);
      for (const item of discovered) {
        if (!excludeIds.includes(item.id)) {
          const key = `${item.mediaType}:${item.id}`;
          if (!candidates.has(key)) {
            candidates.set(key, {
              ...item,
              source: 'discover',
            });
          }
        }
      }
    }

    // Strategy 4: Popular titles in preferred genres (fallback)
    if (candidates.size < 10 && preferences.genres.length > 0) {
      const popular = await getPopularInGenres(preferences.genres, tmdbFetch, region);
      for (const item of popular) {
        if (!excludeIds.includes(item.id)) {
          const key = `${item.mediaType}:${item.id}`;
          if (!candidates.has(key)) {
            candidates.set(key, {
              ...item,
              source: 'popular',
            });
          }
        }
      }
    }

    return Array.from(candidates.values());
  } catch (error) {
    console.error('Candidate retrieval error:', error.message);
    return [];
  }
}

/**
 * Get similar titles from TMDB
 */
async function getSimilarFromTMDB(tmdbId, mediaType, tmdbFetch) {
  try {
    const endpoint = mediaType === 'tv' ? `/tv/${tmdbId}/similar` : `/movie/${tmdbId}/similar`;
    const data = await tmdbFetch(endpoint, { language: 'en-US', page: '1' });
    
    if (!data.results) return [];

    return data.results.slice(0, 15).map(r => ({
      id: r.id,
      mediaType,
      title: mediaType === 'tv' ? r.name : r.title,
      year: mediaType === 'tv'
        ? (r.first_air_date ? new Date(r.first_air_date).getFullYear() : null)
        : (r.release_date ? new Date(r.release_date).getFullYear() : null),
      overview: r.overview || '',
      genreIds: r.genre_ids || [],
      popularity: r.popularity || 0,
      voteAverage: r.vote_average || 0,
      voteCount: r.vote_count || 0,
      posterPath: r.poster_path || null,
    }));
  } catch (error) {
    console.error('Similar fetch error:', error.message);
    return [];
  }
}

/**
 * Get recommendations from TMDB
 */
async function getRecommendationsFromTMDB(tmdbId, mediaType, tmdbFetch) {
  try {
    const endpoint = mediaType === 'tv'
      ? `/tv/${tmdbId}/recommendations`
      : `/movie/${tmdbId}/recommendations`;
    
    const data = await tmdbFetch(endpoint, { language: 'en-US', page: '1' });
    
    if (!data.results) return [];

    return data.results.slice(0, 15).map(r => ({
      id: r.id,
      mediaType,
      title: mediaType === 'tv' ? r.name : r.title,
      year: mediaType === 'tv'
        ? (r.first_air_date ? new Date(r.first_air_date).getFullYear() : null)
        : (r.release_date ? new Date(r.release_date).getFullYear() : null),
      overview: r.overview || '',
      genreIds: r.genre_ids || [],
      popularity: r.popularity || 0,
      voteAverage: r.vote_average || 0,
      voteCount: r.vote_count || 0,
      posterPath: r.poster_path || null,
    }));
  } catch (error) {
    console.error('Recommendations fetch error:', error.message);
    return [];
  }
}

/**
 * Discover titles from TMDB based on preferences
 */
async function discoverFromTMDB(preferences, tmdbFetch, region) {
  const cacheKey = JSON.stringify({
    genres: preferences.genres,
    mood: preferences.mood,
    runtime: preferences.maxRuntimeMinutes,
    language: preferences.language,
    period: preferences.releasePeriod,
  });

  // Check cache
  const cached = discoverCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Build genre IDs
    const genreIds = preferences.genres
      .map(g => GENRE_IDS[g])
      .filter(Boolean);

    // Build discover params
    const params = {
      include_adult: 'false',
      include_video: 'false',
      language: 'en-US',
      sort_by: 'popularity.desc',
      page: '1',
    };

    if (genreIds.length > 0) {
      params.with_genres = genreIds.join('|');
    }

    if (preferences.maxRuntimeMinutes) {
      params['with_runtime.lte'] = preferences.maxRuntimeMinutes;
    }

    if (preferences.language) {
      const langMap = {
        English: 'en', Hindi: 'hi', Tamil: 'ta', Telugu: 'te',
        Korean: 'ko', Japanese: 'ja', Spanish: 'es', French: 'fr',
      };
      if (langMap[preferences.language]) {
        params.with_original_language = langMap[preferences.language];
      }
    }

    if (preferences.releasePeriod === 'recent') {
      const currentYear = new Date().getFullYear();
      params['primary_release_date.gte'] = `${currentYear - 5}-01-01`;
    }

    // Minimum vote count for quality
    params['vote_count.gte'] = '100';
    params['vote_average.gte'] = '6.0';

    const data = await tmdbFetch('/discover/movie', params);
    
    if (!data.results) return [];

    const results = data.results.slice(0, 30).map(r => ({
      id: r.id,
      mediaType: 'movie',
      title: r.title,
      year: r.release_date ? new Date(r.release_date).getFullYear() : null,
      overview: r.overview || '',
      genreIds: r.genre_ids || [],
      popularity: r.popularity || 0,
      voteAverage: r.vote_average || 0,
      voteCount: r.vote_count || 0,
      posterPath: r.poster_path || null,
      runtime: null, // Will be fetched later
    }));

    discoverCache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error('Discover error:', error.message);
    return [];
  }
}

/**
 * Get popular titles in specific genres
 */
async function getPopularInGenres(genres, tmdbFetch, region) {
  try {
    const genreIds = genres
      .map(g => GENRE_IDS[g])
      .filter(Boolean);

    if (genreIds.length === 0) return [];

    const data = await tmdbFetch('/discover/movie', {
      with_genres: genreIds.join('|'),
      include_adult: 'false',
      include_video: 'false',
      language: 'en-US',
      sort_by: 'popularity.desc',
      page: '1',
      'vote_count.gte': '200',
      'vote_average.gte': '6.5',
    });

    if (!data.results) return [];

    return data.results.slice(0, 20).map(r => ({
      id: r.id,
      mediaType: 'movie',
      title: r.title,
      year: r.release_date ? new Date(r.release_date).getFullYear() : null,
      overview: r.overview || '',
      genreIds: r.genre_ids || [],
      popularity: r.popularity || 0,
      voteAverage: r.vote_average || 0,
      voteCount: r.vote_count || 0,
      posterPath: r.poster_path || null,
      runtime: null,
    }));
  } catch (error) {
    console.error('Popular genres error:', error.message);
    return [];
  }
}

/**
 * Get full details for a movie/TV show
 */
export async function getFullDetails(tmdbId, mediaType, tmdbFetch) {
  try {
    const endpoint = mediaType === 'tv' ? `/tv/${tmdbId}` : `/movie/${tmdbId}`;
    const data = await tmdbFetch(endpoint, { language: 'en-US' });

    return {
      id: data.id,
      mediaType,
      title: mediaType === 'tv' ? data.name : data.title,
      year: mediaType === 'tv'
        ? (data.first_air_date ? new Date(data.first_air_date).getFullYear() : null)
        : (data.release_date ? new Date(data.release_date).getFullYear() : null),
      overview: data.overview || '',
      genres: data.genres?.map(g => g.name) || [],
      genreIds: data.genres?.map(g => g.id) || [],
      runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || null,
      popularity: data.popularity || 0,
      voteAverage: data.vote_average || 0,
      voteCount: data.vote_count || 0,
      posterPath: data.poster_path || null,
      backdropPath: data.backdrop_path || null,
      tagline: data.tagline || '',
      status: data.status || '',
      originalLanguage: data.original_language || '',
      productionCountries: data.production_countries?.map(c => c.name) || [],
    };
  } catch (error) {
    console.error('Full details error:', error.message);
    return null;
  }
}
