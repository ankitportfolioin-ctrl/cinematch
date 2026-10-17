/**
 * Comprehensive Test Suite for CineMatch
 * Tests parser, recommendation service, ranker, and deterministic behavior
 */

import { parseUserQuery, validatePreferences } from '../modules/queryParser.js';
import { getRecommendations, generateStableSeed, seededRandom } from '../modules/recommendationService.js';
import { rankCandidates } from '../modules/ranker.js';

// Mock catalog for testing
const MOCK_CATALOG = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    year: 1994,
    genres: ['Drama'],
    runtime: 142,
    rating: 9.3,
    overview: 'Two imprisoned men bond over years.',
    posterUrl: '',
    providers: [],
    languages: ['English'],
  },
  {
    id: 2,
    title: 'The Godfather',
    year: 1972,
    genres: ['Crime', 'Drama'],
    runtime: 175,
    rating: 9.2,
    overview: 'A crime family saga.',
    posterUrl: '',
    providers: [],
    languages: ['English'],
  },
  {
    id: 3,
    title: 'The Dark Knight',
    year: 2008,
    genres: ['Action', 'Crime', 'Drama'],
    runtime: 152,
    rating: 9.0,
    overview: 'Batman faces the Joker.',
    posterUrl: '',
    providers: [],
    languages: ['English'],
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    year: 1994,
    genres: ['Crime', 'Drama'],
    runtime: 154,
    rating: 8.9,
    overview: 'Interconnected crime stories.',
    posterUrl: '',
    providers: [],
    languages: ['English'],
  },
  {
    id: 5,
    title: 'Forrest Gump',
    year: 1994,
    genres: ['Drama', 'Romance'],
    runtime: 142,
    rating: 8.8,
    overview: 'A man witnesses historical events.',
    posterUrl: '',
    providers: [],
    languages: ['English'],
  },
];

describe('Query Parser', () => {
  describe('Basic parsing', () => {
    test('parses mood correctly', () => {
      const result = parseUserQuery('I want something comforting');
      expect(result.mood).toContain('comforting');
    });

    test('parses genres correctly', () => {
      const result = parseUserQuery('I want a comedy');
      expect(result.genres).toContain('Comedy');
    });

    test('parses runtime correctly', () => {
      const result = parseUserQuery('under 90 minutes');
      expect(result.maxRuntimeMinutes).toBe(90);
    });

    test('parses liked titles correctly', () => {
      const result = parseUserQuery('I like The Godfather');
      expect(result.likedTitles).toContain('The Godfather');
    });

    test('parses excluded content correctly', () => {
      const result = parseUserQuery('nothing violent');
      expect(result.excludeContent).toContain('violent');
    });
  });

  describe('Complex queries', () => {
    test('parses multiple preferences', () => {
      const result = parseUserQuery('I want a funny comedy under 100 minutes');
      expect(result.genres).toContain('Comedy');
      expect(result.maxRuntimeMinutes).toBe(100);
    });

    test('parses contradictions', () => {
      const result = parseUserQuery('I want something comforting but also horror');
      expect(result.clarificationNeeded).toBe(true);
    });

    test('handles empty query', () => {
      const result = parseUserQuery('');
      expect(result.mood).toEqual([]);
      expect(result.genres).toEqual([]);
    });
  });

  describe('Structured input precedence', () => {
    test('structured mood overrides parsed mood', () => {
      const result = parseUserQuery('I feel sad', { mood: 'Happy' });
      expect(result.mood).toContain('happy');
    });

    test('structured genres override parsed genres', () => {
      const result = parseUserQuery('I want comedy', { genres: ['Drama'] });
      expect(result.genres).toContain('Drama');
    });
  });
});

describe('Preference Validation', () => {
  test('validates mood enum', () => {
    const prefs = { mood: ['comforting', 'invalid'] };
    const result = validatePreferences(prefs);
    expect(result.mood).toContain('comforting');
    expect(result.mood).not.toContain('invalid');
  });

  test('validates genre enum', () => {
    const prefs = { genres: ['Action', 'InvalidGenre'] };
    const result = validatePreferences(prefs);
    expect(result.genres).toContain('Action');
    expect(result.genres).not.toContain('InvalidGenre');
  });

  test('clamps runtime to valid range', () => {
    const prefs = { maxRuntimeMinutes: 500 };
    const result = validatePreferences(prefs);
    expect(result.maxRuntimeMinutes).toBe(300);
  });

  test('ensures arrays', () => {
    const prefs = { mood: 'comforting', genres: 'Action' };
    const result = validatePreferences(prefs);
    expect(Array.isArray(result.mood)).toBe(true);
    expect(Array.isArray(result.genres)).toBe(true);
  });
});

describe('Deterministic Behavior', () => {
  test('generates stable seed from same inputs', () => {
    const prefs = { mood: ['comforting'], genres: ['Comedy'] };
    const feedback = { watchedIds: [1, 2] };
    
    const seed1 = generateStableSeed(prefs, feedback, '1.0', '0');
    const seed2 = generateStableSeed(prefs, feedback, '1.0', '0');
    
    expect(seed1).toBe(seed2);
  });

  test('generates different seeds for different inputs', () => {
    const prefs1 = { mood: ['comforting'], genres: ['Comedy'] };
    const prefs2 = { mood: ['uplifting'], genres: ['Comedy'] };
    const feedback = {};
    
    const seed1 = generateStableSeed(prefs1, feedback, '1.0', '0');
    const seed2 = generateStableSeed(prefs2, feedback, '1.0', '0');
    
    expect(seed1).not.toBe(seed2);
  });

  test('seeded random produces deterministic sequence', () => {
    const random1 = seededRandom(12345);
    const random2 = seededRandom(12345);
    
    const seq1 = [random1(), random1(), random1()];
    const seq2 = [random2(), random2(), random2()];
    
    expect(seq1).toEqual(seq2);
  });

  test('different seeds produce different sequences', () => {
    const random1 = seededRandom(12345);
    const random2 = seededRandom(54321);
    
    const seq1 = [random1(), random1(), random1()];
    const seq2 = [random2(), random2(), random2()];
    
    expect(seq1).not.toEqual(seq2);
  });
});

describe('Recommendation Service', () => {
  test('returns recommendations in demo mode', async () => {
    const result = await getRecommendations({
      query: 'I want a comedy',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    expect(result.movies).toBeDefined();
    expect(Array.isArray(result.movies)).toBe(true);
    expect(result.appState).toBe('demo');
  });

  test('applies hard filters correctly', async () => {
    const result = await getRecommendations({
      query: 'nothing violent',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    // Should exclude Action, Thriller, Horror, War genres
    const hasViolentGenre = result.movies.some(m => 
      m.genres.some(g => ['Action', 'Thriller', 'Horror', 'War'].includes(g))
    );
    expect(hasViolentGenre).toBe(false);
  });

  test('respects runtime constraints', async () => {
    const result = await getRecommendations({
      query: 'under 150 minutes',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    // All movies should be within runtime limit (with 15 min grace)
    result.movies.forEach(movie => {
      expect(movie.runtime).toBeLessThanOrEqual(165);
    });
  });

  test('excludes watched movies', async () => {
    const result = await getRecommendations({
      query: 'I want a drama',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
      feedback: { watchedIds: [1, 2] },
    });
    
    const hasWatched = result.movies.some(m => [1, 2].includes(m.id));
    expect(hasWatched).toBe(false);
  });

  test('excludes not-interested movies', async () => {
    const result = await getRecommendations({
      query: 'I want a drama',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
      feedback: { notInterestedIds: [3, 4] },
    });
    
    const hasNotInterested = result.movies.some(m => [3, 4].includes(m.id));
    expect(hasNotInterested).toBe(false);
  });

  test('returns deterministic results for same inputs', async () => {
    const params = {
      query: 'I want a comedy',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    };
    
    const result1 = await getRecommendations(params);
    const result2 = await getRecommendations(params);
    
    expect(result1.movies.map(m => m.id)).toEqual(result2.movies.map(m => m.id));
  });

  test('returns different results for different cursors', async () => {
    const params1 = {
      query: 'I want a drama',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    };
    
    const params2 = {
      ...params1,
      cursor: '3',
    };
    
    const result1 = await getRecommendations(params1);
    const result2 = await getRecommendations(params2);
    
    // Results should be different (different page)
    if (result1.movies.length > 0 && result2.movies.length > 0) {
      expect(result1.movies[0].id).not.toBe(result2.movies[0].id);
    }
  });

  test('handles empty catalog', async () => {
    const result = await getRecommendations({
      query: 'I want a comedy',
      mode: 'demo',
      catalog: [],
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    expect(result.movies).toEqual([]);
    expect(result.appState).toBe('no_results');
  });

  test('provides score breakdown', async () => {
    const result = await getRecommendations({
      query: 'I want a comedy',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    if (result.movies.length > 0) {
      expect(result.movies[0].scoreBreakdown).toBeDefined();
      expect(result.movies[0].matchScore).toBeDefined();
    }
  });

  test('generates explanations', async () => {
    const result = await getRecommendations({
      query: 'I want a comedy',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    if (result.movies.length > 0) {
      expect(result.movies[0].reason).toBeDefined();
      expect(typeof result.movies[0].reason).toBe('string');
      expect(result.movies[0].reason.length).toBeGreaterThan(0);
    }
  });
});

describe('Ranker', () => {
  test('ranks candidates by score', () => {
    const candidates = [
      { id: 1, genres: ['Comedy'], rating: 8.0 },
      { id: 2, genres: ['Drama'], rating: 9.0 },
      { id: 3, genres: ['Comedy', 'Drama'], rating: 8.5 },
    ];
    
    const preferences = {
      genres: ['Comedy'],
      mood: [],
      maxRuntimeMinutes: null,
    };
    
    const ranked = rankCandidates(candidates, preferences, []);
    
    expect(ranked.length).toBe(3);
    expect(ranked[0].totalScore).toBeGreaterThanOrEqual(ranked[1].totalScore);
  });

  test('uses seeded random for deterministic behavior', () => {
    const candidates = [
      { id: 1, genres: ['Comedy'], rating: 8.0 },
      { id: 2, genres: ['Comedy'], rating: 8.0 },
    ];
    
    const preferences = {
      genres: ['Comedy'],
      mood: [],
      maxRuntimeMinutes: null,
    };
    
    const random1 = seededRandom(12345);
    const random2 = seededRandom(12345);
    
    const ranked1 = rankCandidates(candidates, preferences, [], { random: random1 });
    const ranked2 = rankCandidates(candidates, preferences, [], { random: random2 });
    
    expect(ranked1.map(c => c.id)).toEqual(ranked2.map(c => c.id));
  });

  test('provides score breakdown', () => {
    const candidates = [
      { id: 1, genres: ['Comedy'], rating: 8.0 },
    ];
    
    const preferences = {
      genres: ['Comedy'],
      mood: [],
      maxRuntimeMinutes: null,
    };
    
    const ranked = rankCandidates(candidates, preferences, []);
    
    expect(ranked[0].scores).toBeDefined();
    expect(ranked[0].scores.genreMatch).toBeDefined();
  });
});

describe('Hard Filters', () => {
  test('excludes violent content', async () => {
    const result = await getRecommendations({
      query: 'nothing violent',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    const violentGenres = ['Action', 'Thriller', 'Horror', 'War'];
    result.movies.forEach(movie => {
      const hasViolentGenre = movie.genres.some(g => violentGenres.includes(g));
      expect(hasViolentGenre).toBe(false);
    });
  });

  test('excludes scary content', async () => {
    const result = await getRecommendations({
      query: 'nothing scary',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    const scaryGenres = ['Horror', 'Thriller'];
    result.movies.forEach(movie => {
      const hasScaryGenre = movie.genres.some(g => scaryGenres.includes(g));
      expect(hasScaryGenre).toBe(false);
    });
  });

  test('respects runtime hard limit', async () => {
    const result = await getRecommendations({
      query: 'under 150 minutes',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    result.movies.forEach(movie => {
      // Hard limit with 15 min grace
      expect(movie.runtime).toBeLessThanOrEqual(165);
    });
  });

  test('respects highly rated filter', async () => {
    const result = await getRecommendations({
      structuredInputs: { preferences: { highlyRated: true } },
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    result.movies.forEach(movie => {
      expect(movie.rating).toBeGreaterThanOrEqual(7.0);
    });
  });
});

describe('Edge Cases', () => {
  test('handles missing metadata gracefully', async () => {
    const catalogWithMissing = [
      {
        id: 1,
        title: 'Movie Without Runtime',
        year: 2020,
        genres: ['Drama'],
        runtime: null,
        rating: 7.5,
        overview: 'A movie.',
        posterUrl: '',
        providers: [],
      },
    ];
    
    const result = await getRecommendations({
      query: 'under 120 minutes',
      mode: 'demo',
      catalog: catalogWithMissing,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    // Should not crash, should handle missing runtime
    expect(result.movies).toBeDefined();
  });

  test('handles empty query', async () => {
    const result = await getRecommendations({
      query: '',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: '0',
    });
    
    expect(result.movies).toBeDefined();
    expect(result.appState).toBe('demo');
  });

  test('handles invalid cursor', async () => {
    const result = await getRecommendations({
      query: 'I want a comedy',
      mode: 'demo',
      catalog: MOCK_CATALOG,
      catalogVersion: '1.0',
      cursor: 'invalid',
    });
    
    expect(result.movies).toBeDefined();
  });
});
