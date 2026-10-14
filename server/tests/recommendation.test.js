/**
 * Tests for Query Parser
 */

import { parseUserQuery, validatePreferences } from '../modules/queryParser.js';

describe('Query Parser', () => {
  describe('parseUserQuery', () => {
    test('parses simple mood query', () => {
      const result = parseUserQuery('I want something comforting');
      expect(result.mood).toContain('comforting');
    });

    test('parses genre preferences', () => {
      const result = parseUserQuery('I want a comedy');
      expect(result.genres).toContain('Comedy');
    });

    test('parses multiple genres', () => {
      const result = parseUserQuery('I like action and sci-fi movies');
      expect(result.genres).toContain('Action');
      expect(result.genres).toContain('Sci-Fi');
    });

    test('parses runtime constraints', () => {
      const result = parseUserQuery('under 90 minutes');
      expect(result.maxRuntimeMinutes).toBe(90);
    });

    test('parses runtime in hours', () => {
      const result = parseUserQuery('less than 2 hours');
      expect(result.maxRuntimeMinutes).toBe(120);
    });

    test('parses liked titles', () => {
      const result = parseUserQuery('I like The Godfather');
      expect(result.likedTitles).toContain('The Godfather');
    });

    test('parses multiple liked titles', () => {
      const result = parseUserQuery('I love Inception and The Matrix');
      expect(result.likedTitles).toContain('Inception');
      expect(result.likedTitles).toContain('The Matrix');
    });

    test('parses disliked titles', () => {
      const result = parseUserQuery('I hate horror movies');
      expect(result.dislikedTitles).toContain('horror movies');
    });

    test('parses intensity preference', () => {
      const result = parseUserQuery('I want something intense');
      expect(result.intensity).toBe('high');
    });

    test('parses low watch effort', () => {
      const result = parseUserQuery('I am tired, want an easy watch');
      expect(result.watchEffort).toBe('low');
    });

    test('detects conflicts for clarification', () => {
      const result = parseUserQuery('I am tired but want intense action');
      expect(result.clarificationNeeded).toBe(true);
      expect(result.clarificationQuestion).toBeTruthy();
    });

    test('parses content exclusions', () => {
      const result = parseUserQuery('nothing violent please');
      expect(result.excludeContent).toContain('violent');
    });

    test('handles empty query', () => {
      const result = parseUserQuery('');
      expect(result.mood).toEqual([]);
      expect(result.genres).toEqual([]);
    });

    test('structured inputs take precedence', () => {
      const result = parseUserQuery('I want comedy', { mood: 'Romantic', genres: ['Drama'] });
      expect(result.mood).toContain('romantic');
      expect(result.genres).toContain('Drama');
    });

    test('parses complex query', () => {
      const result = parseUserQuery(
        "I'm tired, want an action movie, and I like The Godfather"
      );
      expect(result.watchEffort).toBe('low');
      expect(result.genres).toContain('Action');
      expect(result.likedTitles).toContain('The Godfather');
    });
  });

  describe('validatePreferences', () => {
    test('validates mood enum', () => {
      const prefs = { mood: ['comforting', 'invalid', 'uplifting'] };
      const result = validatePreferences(prefs);
      expect(result.mood).toEqual(['comforting', 'uplifting']);
    });

    test('validates genre enum', () => {
      const prefs = { genres: ['Action', 'InvalidGenre', 'Comedy'] };
      const result = validatePreferences(prefs);
      expect(result.genres).toEqual(['Action', 'Comedy']);
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
});

/**
 * Tests for Ranker
 */

import { rankCandidates } from '../modules/ranker.js';

describe('Ranker', () => {
  const mockPreferences = {
    genres: ['Action'],
    mood: ['uplifting'],
    maxRuntimeMinutes: 120,
    intensity: 'high',
    watchEffort: null,
  };

  const mockResolvedTitles = [
    { id: 1, title: 'The Dark Knight', genres: ['Action', 'Crime', 'Drama'] },
  ];

  const mockCandidates = [
    {
      id: 100,
      title: 'Action Movie 1',
      genreIds: [28], // Action
      genres: ['Action'],
      voteAverage: 7.5,
      voteCount: 1000,
      runtime: 110,
      source: 'similar',
      seedTitle: 'The Dark Knight',
    },
    {
      id: 101,
      title: 'Comedy Movie',
      genreIds: [35], // Comedy
      genres: ['Comedy'],
      voteAverage: 8.0,
      voteCount: 500,
      runtime: 95,
      source: 'discover',
    },
    {
      id: 102,
      title: 'Action Movie 2',
      genreIds: [28, 12], // Action, Adventure
      genres: ['Action', 'Adventure'],
      voteAverage: 7.0,
      voteCount: 800,
      runtime: 130,
      source: 'recommendation',
      seedTitle: 'The Dark Knight',
    },
  ];

  test('ranks candidates by score', () => {
    const ranked = rankCandidates(mockCandidates, mockPreferences, mockResolvedTitles);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].totalScore).toBeGreaterThanOrEqual(ranked[1]?.totalScore || 0);
  });

  test('boosts similar titles', () => {
    const ranked = rankCandidates(mockCandidates, mockPreferences, mockResolvedTitles);
    const similarMovie = ranked.find(m => m.source === 'similar');
    expect(similarMovie).toBeTruthy();
    expect(similarMovie.reasons.some(r => r.includes('Similar to'))).toBe(true);
  });

  test('penalizes runtime violations', () => {
    const ranked = rankCandidates(mockCandidates, mockPreferences, mockResolvedTitles);
    const longMovie = ranked.find(m => m.runtime === 130);
    const shortMovie = ranked.find(m => m.runtime === 110);
    if (longMovie && shortMovie) {
      expect(shortMovie.scores.practicalMatch).toBeGreaterThan(longMovie.scores.practicalMatch);
    }
  });

  test('handles missing signals gracefully', () => {
    const prefsNoGenres = { ...mockPreferences, genres: [] };
    const ranked = rankCandidates(mockCandidates, prefsNoGenres, []);
    expect(ranked.length).toBeGreaterThan(0);
  });

  test('applies diversity adjustment', () => {
    const ranked = rankCandidates(mockCandidates, mockPreferences, mockResolvedTitles);
    const titles = ranked.map(m => m.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  test('generates reasons', () => {
    const ranked = rankCandidates(mockCandidates, mockPreferences, mockResolvedTitles);
    expect(ranked[0].reasons.length).toBeGreaterThan(0);
  });
});

/**
 * Tests for Explainer
 */

import { generateExplanation, generateClarification } from '../modules/explainer.js';

describe('Explainer', () => {
  test('generates explanation from reasons', () => {
    const candidate = {
      reasons: ['Similar to The Dark Knight', 'Matches your Action preference'],
      genres: ['Action'],
      voteAverage: 7.5,
      voteCount: 1000,
    };
    const preferences = { genres: ['Action'], mood: [] };
    const explanation = generateExplanation(candidate, preferences, []);
    expect(explanation).toBeTruthy();
    expect(explanation.length).toBeGreaterThan(0);
  });

  test('generates clarification for conflicts', () => {
    const preferences = {
      clarificationNeeded: true,
      clarificationQuestion: 'You want easy but intense?',
    };
    const clarification = generateClarification(preferences);
    expect(clarification).toBe('You want easy but intense?');
  });

  test('returns null when no clarification needed', () => {
    const preferences = { clarificationNeeded: false };
    const clarification = generateClarification(preferences);
    expect(clarification).toBeNull();
  });
});

/**
 * Integration test: Full query flow
 */

describe('Integration: Full Query Flow', () => {
  test('handles "I am tired, want action, and I like The Godfather"', () => {
    const query = "I'm tired, want an action movie, and I like The Godfather";
    const preferences = parseUserQuery(query);
    
    expect(preferences.watchEffort).toBe('low');
    expect(preferences.genres).toContain('Action');
    expect(preferences.likedTitles).toContain('The Godfather');
    
    // Should detect potential conflict
    expect(preferences.clarificationNeeded).toBe(true);
  });

  test('handles "light comedy under 100 minutes"', () => {
    const query = 'I want a light comedy under 100 minutes';
    const preferences = parseUserQuery(query);
    
    expect(preferences.genres).toContain('Comedy');
    expect(preferences.maxRuntimeMinutes).toBe(100);
  });

  test('handles "intense action but nothing violent"', () => {
    const query = 'I want intense action but nothing violent';
    const preferences = parseUserQuery(query);
    
    expect(preferences.intensity).toBe('high');
    expect(preferences.genres).toContain('Action');
    expect(preferences.excludeContent).toContain('violent');
  });
});
