/**
 * Query Parser - Converts natural language to structured preferences
 * Deterministic implementation (no LLM required)
 */

// Mood keywords mapped to preference hints
const MOOD_KEYWORDS = {
  tired: { watchEffort: 'low', intensity: 'low' },
  exhausted: { watchEffort: 'low', intensity: 'low' },
  relaxed: { watchEffort: 'low', intensity: 'low' },
  chill: { watchEffort: 'low', intensity: 'low' },
  comfortable: { watchEffort: 'low', intensity: 'low' },
  easy: { watchEffort: 'low' },
  'low effort': { watchEffort: 'low' },
  'easy watch': { watchEffort: 'low' },
  
  intense: { intensity: 'high' },
  adrenaline: { intensity: 'high' },
  'edge of my seat': { intensity: 'high' },
  thrilling: { intensity: 'high' },
  exciting: { intensity: 'high' },
  
  comforting: { mood: 'comforting' },
  'feel-good': { mood: 'uplifting' },
  uplifting: { mood: 'uplifting' },
  happy: { mood: 'uplifting' },
  cheerful: { mood: 'uplifting' },
  
  romantic: { mood: 'romantic' },
  love: { mood: 'romantic' },
  
  curious: { mood: 'thought-provoking' },
  'mind-bending': { mood: 'thought-provoking' },
  mysterious: { mood: 'thought-provoking' },
  
  sad: { mood: 'emotional' },
  emotional: { mood: 'emotional' },
  touching: { mood: 'emotional' },
};

// Genre keywords
const GENRE_KEYWORDS = {
  action: 'Action',
  adventure: 'Adventure',
  animation: 'Animation',
  anime: 'Animation',
  comedy: 'Comedy',
  funny: 'Comedy',
  crime: 'Crime',
  documentary: 'Documentary',
  drama: 'Drama',
  family: 'Family',
  'kids': 'Family',
  fantasy: 'Fantasy',
  horror: 'Horror',
  scary: 'Horror',
  mystery: 'Mystery',
  romance: 'Romance',
  'romantic': 'Romance',
  'sci-fi': 'Sci-Fi',
  scifi: 'Sci-Fi',
  'science fiction': 'Sci-Fi',
  thriller: 'Thriller',
  suspense: 'Thriller',
};

// Content exclusion keywords
const EXCLUDE_KEYWORDS = {
  violent: ['violence', 'violent', 'bloody', 'gory'],
  scary: ['scary', 'horror', 'frightening', 'terrifying'],
  sad: ['sad', 'depressing', 'tragic', 'death'],
  complex: ['complex', 'complicated', 'confusing', 'hard to follow'],
  long: ['long', 'slow', 'boring'],
  old: ['old', 'classic', 'vintage', 'before 2000'],
  new: ['new', 'recent', 'latest', 'modern'],
};

// Runtime patterns
const RUNTIME_PATTERNS = [
  { regex: /under\s+(\d+)\s*(min|minute|hour|hr)/i, handler: (match) => {
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    return unit.startsWith('h') ? num * 60 : num;
  }},
  { regex: /less than\s+(\d+)\s*(min|minute|hour|hr)/i, handler: (match) => {
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    return unit.startsWith('h') ? num * 60 : num;
  }},
  { regex: /around\s+(\d+)\s*(min|minute|hour|hr)/i, handler: (match) => {
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    return unit.startsWith('h') ? num * 60 : num;
  }},
  { regex: /(\d+)\s*(min|minute|hour|hr)/i, handler: (match) => {
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    return unit.startsWith('h') ? num * 60 : num;
  }},
];

// Title extraction patterns
const TITLE_PATTERNS = [
  /(?:like|love|loved|enjoy|enjoyed|favorite|favourite)\s+["']?([^"',.]+)["']?/gi,
  /similar to\s+["']?([^"',.]+)["']?/gi,
  /reminds me of\s+["']?([^"',.]+)["']?/gi,
];

const DISLIKE_PATTERNS = [
  /(?:hate|dislike|don't like|dont like|no|avoid|not)\s+["']?([^"',.]+)["']?/gi,
  /(?:don't want|dont want|no more)\s+["']?([^"',.]+)["']?/gi,
];

/**
 * Parse natural language query into structured preferences
 * @param {string} text - Natural language query
 * @param {object} structuredInputs - Existing structured inputs (wizard selections)
 * @returns {object} ParsedPreferences
 */
export function parseUserQuery(text = '', structuredInputs = {}) {
  const preferences = {
    mediaType: 'movie',
    mood: [],
    genres: [],
    likedTitles: [],
    dislikedTitles: [],
    mustInclude: [],
    excludeGenres: [],
    excludeContent: [],
    language: null,
    region: null,
    maxRuntimeMinutes: null,
    releasePeriod: null,
    intensity: null,
    watchEffort: null,
    clarificationNeeded: false,
    clarificationQuestion: null,
    rawQuery: text,
  };

  // Structured inputs take precedence
  if (structuredInputs.mood) {
    preferences.mood = [structuredInputs.mood.toLowerCase()];
  }
  if (structuredInputs.genres && structuredInputs.genres.length > 0) {
    preferences.genres = structuredInputs.genres;
  }
  if (structuredInputs.maxRuntime) {
    const runtimeMap = {
      'Under 90 min': 90,
      'Under 2 hours': 120,
      'Under 2.5 hours': 150,
      'Any length': null,
    };
    preferences.maxRuntimeMinutes = runtimeMap[structuredInputs.maxRuntime];
  }
  if (structuredInputs.languages && structuredInputs.languages.length > 0) {
    preferences.language = structuredInputs.languages[0];
  }

  // Parse natural language if provided
  if (text && text.trim()) {
    const lowerText = text.toLowerCase();

    // Extract mood/intensity/watchEffort
    for (const [keyword, hints] of Object.entries(MOOD_KEYWORDS)) {
      if (lowerText.includes(keyword)) {
        if (hints.mood && !preferences.mood.includes(hints.mood)) {
          preferences.mood.push(hints.mood);
        }
        if (hints.intensity && !preferences.intensity) {
          preferences.intensity = hints.intensity;
        }
        if (hints.watchEffort && !preferences.watchEffort) {
          preferences.watchEffort = hints.watchEffort;
        }
      }
    }

    // Extract genres
    for (const [keyword, genre] of Object.entries(GENRE_KEYWORDS)) {
      if (lowerText.includes(keyword) && !preferences.genres.includes(genre)) {
        preferences.genres.push(genre);
      }
    }

    // Extract runtime
    for (const pattern of RUNTIME_PATTERNS) {
      const match = text.match(pattern.regex);
      if (match) {
        preferences.maxRuntimeMinutes = pattern.handler(match);
        break;
      }
    }

    // Extract liked titles
    for (const pattern of TITLE_PATTERNS) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        const title = match[1].trim();
        if (title && title.length > 1 && title.length < 100) {
          preferences.likedTitles.push(title);
        }
      }
    }

    // Extract disliked titles
    for (const pattern of DISLIKE_PATTERNS) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        const title = match[1].trim();
        if (title && title.length > 1 && title.length < 100) {
          preferences.dislikedTitles.push(title);
        }
      }
    }

    // Extract content exclusions
    for (const [category, keywords] of Object.entries(EXCLUDE_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          if (category === 'violent' || category === 'scary') {
            if (!preferences.excludeContent.includes(category)) {
              preferences.excludeContent.push(category);
            }
          }
          if (category === 'old') {
            preferences.releasePeriod = 'recent';
          }
          if (category === 'new') {
            preferences.releasePeriod = 'recent';
          }
        }
      }
    }

    // Detect conflicts for clarification
    if (preferences.watchEffort === 'low' && preferences.intensity === 'high') {
      preferences.clarificationNeeded = true;
      preferences.clarificationQuestion = 'You mentioned wanting something easy but also intense. Would you prefer easy-to-follow action or something more intense?';
    }
  }

  return preferences;
}

/**
 * Validate parsed preferences
 * @param {object} prefs - Parsed preferences
 * @returns {object} Validated preferences with corrections
 */
export function validatePreferences(prefs) {
  const validated = { ...prefs };

  // Ensure arrays
  validated.mood = Array.isArray(validated.mood) ? validated.mood : [];
  validated.genres = Array.isArray(validated.genres) ? validated.genres : [];
  validated.likedTitles = Array.isArray(validated.likedTitles) ? validated.likedTitles : [];
  validated.dislikedTitles = Array.isArray(validated.dislikedTitles) ? validated.dislikedTitles : [];
  validated.excludeGenres = Array.isArray(validated.excludeGenres) ? validated.excludeGenres : [];
  validated.excludeContent = Array.isArray(validated.excludeContent) ? validated.excludeContent : [];

  // Validate enums
  const validMoods = ['comforting', 'uplifting', 'romantic', 'thought-provoking', 'emotional'];
  validated.mood = validated.mood.filter(m => validMoods.includes(m));

  const validGenres = Object.values(GENRE_KEYWORDS);
  validated.genres = validated.genres.filter(g => validGenres.includes(g));

  // Validate runtime
  if (validated.maxRuntimeMinutes !== null) {
    validated.maxRuntimeMinutes = Math.max(30, Math.min(300, validated.maxRuntimeMinutes));
  }

  return validated;
}
