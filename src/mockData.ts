import { Movie, WizardAnswers } from './types';

// Fallback poster SVG for when images don't load
const FALLBACK_POSTER = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <rect width="500" height="750" fill="#141414"/>
    <text x="250" y="350" text-anchor="middle" fill="#333" font-family="sans-serif" font-size="48">🎬</text>
    <text x="250" y="410" text-anchor="middle" fill="#8C8C8C" font-family="sans-serif" font-size="16">Movie Poster</text>
  </svg>`
);

const MOCK_MOVIES: Movie[] = [
  {
    id: 5501,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genres: ["Comedy", "Drama"],
    runtime: 99,
    rating: 8.1,
    overview: "A writer encounters the owner of an aging high-class hotel, who tells of his early years as a lobby boy in the hotel's glorious years.",
    posterUrl: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    providers: [{ name: "Disney+", logoUrl: "https://image.tmdb.org/t/p/w92/7rwgAz15PBlBcMhGVBwrizXlNm3.jpg" }],
    reason: "A whimsical, feel-good pick to brighten your evening.",
    isHiddenGem: false,
  },
  {
    id: 5502,
    title: "Parasite",
    year: 2019,
    genres: ["Thriller", "Drama"],
    runtime: 132,
    rating: 8.5,
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    providers: [{ name: "Prime Video", logoUrl: "https://image.tmdb.org/t/p/w92/emthp39XA2YScoYL1p0sdbAH2Zz.jpg" }],
    reason: "A masterful thriller that'll keep you on the edge.",
    isHiddenGem: false,
  },
  {
    id: 5503,
    title: "Spirited Away",
    year: 2001,
    genres: ["Animation", "Fantasy"],
    runtime: 125,
    rating: 8.5,
    overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    providers: [{ name: "Netflix", logoUrl: "https://image.tmdb.org/t/p/w92/t2yyOv40HZeVlLjYsCsPHnWLktt.jpg" }],
    reason: "A magical animated journey for the whole family.",
    isHiddenGem: false,
  },
  {
    id: 5504,
    title: "The Intouchables",
    year: 2011,
    genres: ["Comedy", "Drama"],
    runtime: 112,
    rating: 8.2,
    overview: "After becoming a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.",
    posterUrl: "https://image.tmdb.org/t/p/w500/ypiDKiNUCyJclZSPiVtZTgiF5xR.jpg",
    providers: [{ name: "Netflix", logoUrl: "https://image.tmdb.org/t/p/w92/t2yyOv40HZeVlLjYsCsPHnWLktt.jpg" }],
    reason: "A heartwarming story that'll lift your spirits.",
    isHiddenGem: false,
  },
  {
    id: 5505,
    title: "Portrait of a Lady on Fire",
    year: 2019,
    genres: ["Romance", "Drama"],
    runtime: 122,
    rating: 8.1,
    overview: "On an isolated island in Brittany, a female painter and her subject share an intense connection that blossoms into something deeper.",
    posterUrl: "https://image.tmdb.org/t/p/w500/2LquGw4hbgcJ0O2IFuS9KPTqqHO.jpg",
    providers: [{ name: "MUBI", logoUrl: "https://image.tmdb.org/t/p/w92/jkX59A8gMUlF10eFfCjYz5sQJvA.jpg" }],
    reason: "A tender, romantic masterpiece for your evening.",
    isHiddenGem: true,
  },
  {
    id: 5506,
    title: "Mad Max: Fury Road",
    year: 2015,
    genres: ["Action", "Adventure"],
    runtime: 120,
    rating: 7.6,
    overview: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland with the help of a drifter.",
    posterUrl: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    providers: [{ name: "Prime Video", logoUrl: "https://image.tmdb.org/t/p/w92/emthp39XA2YScoYL1p0sdbAH2Zz.jpg" }],
    reason: "High-octane action for your adventurous mood!",
    isHiddenGem: false,
  },
  {
    id: 5507,
    title: "My Neighbor Totoro",
    year: 1988,
    genres: ["Animation", "Family"],
    runtime: 86,
    rating: 8.1,
    overview: "When two girls move to the country with their father, they discover that the nearby forest is home to magical creatures.",
    posterUrl: "https://image.tmdb.org/t/p/w500/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg",
    providers: [{ name: "Netflix", logoUrl: "https://image.tmdb.org/t/p/w92/t2yyOv40HZeVlLjYsCsPHnWLktt.jpg" }],
    reason: "A gentle, magical pick perfect for family night.",
    isHiddenGem: false,
  },
  {
    id: 5508,
    title: "Hunt for the Wilderpeople",
    year: 2016,
    genres: ["Comedy", "Adventure"],
    runtime: 101,
    rating: 7.9,
    overview: "A national manhunt is ordered for a rebellious kid and his foster uncle who go missing in the wild New Zealand bush.",
    posterUrl: "https://image.tmdb.org/t/p/w500/nkayfHy9oFlBjKnQFGP2cQy4L39.jpg",
    providers: [{ name: "Disney+", logoUrl: "https://image.tmdb.org/t/p/w92/7rwgAz15PBlBcMhGVBwrizXlNm3.jpg" }],
    reason: "A charming, funny adventure you won't forget.",
    isHiddenGem: true,
  },
  {
    id: 5509,
    title: "The Handmaiden",
    year: 2016,
    genres: ["Mystery", "Thriller"],
    runtime: 145,
    rating: 8.1,
    overview: "A woman is hired as a handmaiden to a Japanese heiress, but she secretly has a different agenda involving a con man.",
    posterUrl: "https://image.tmdb.org/t/p/w500/xDw2nMMPtFCoQOfGEMiXQXBlalQ.jpg",
    providers: [{ name: "Prime Video", logoUrl: "https://image.tmdb.org/t/p/w92/emthp39XA2YScoYL1p0sdbAH2Zz.jpg" }],
    reason: "A twisty, captivating mystery for your curious mind.",
    isHiddenGem: true,
  },
  {
    id: 5510,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genres: ["Action", "Sci-Fi"],
    runtime: 139,
    rating: 7.8,
    overview: "An aging Chinese immigrant is swept up in an insane adventure where she alone can save the world by exploring other universes.",
    posterUrl: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    providers: [{ name: "Prime Video", logoUrl: "https://image.tmdb.org/t/p/w92/emthp39XA2YScoYL1p0sdbAH2Zz.jpg" }],
    reason: "A wild, mind-bending ride — perfect for exploring.",
    isHiddenGem: false,
  },
  {
    id: 5511,
    title: "Paddington 2",
    year: 2017,
    genres: ["Comedy", "Family"],
    runtime: 104,
    rating: 7.8,
    overview: "Paddington happily lives with the Brown family and tries to find the perfect present for his beloved Aunt, but a thief steals it.",
    posterUrl: "https://image.tmdb.org/t/p/w500/4X5VJGnXwGhBnFWQOQXBKucYQbO.jpg",
    providers: [{ name: "Netflix", logoUrl: "https://image.tmdb.org/t/p/w92/t2yyOv40HZeVlLjYsCsPHnWLktt.jpg" }],
    reason: "Pure joy — the perfect comfort movie for any mood.",
    isHiddenGem: false,
  },
  {
    id: 5512,
    title: "Past Lives",
    year: 2023,
    genres: ["Romance", "Drama"],
    runtime: 106,
    rating: 7.8,
    overview: "Two deeply connected childhood friends are reunited in New York after decades apart, confronting notions of destiny and love.",
    posterUrl: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNP7nvRvYDDD.jpg",
    providers: [{ name: "Prime Video", logoUrl: "https://image.tmdb.org/t/p/w92/emthp39XA2YScoYL1p0sdbAH2Zz.jpg" }],
    reason: "A beautiful, contemplative love story for your evening.",
    isHiddenGem: true,
  },
];

const MOOD_REASONS: Record<string, string[]> = {
  Happy: ["A cheerful pick to keep those good vibes going!", "This one's guaranteed to bring a smile.", "Pure joy on screen — perfect for your mood."],
  Relaxed: ["Kick back and enjoy this easy-going pick.", "A smooth, comfortable watch for your chill evening.", "Low stress, high enjoyment — just what you need."],
  Tired: ["A light, easy watch for when you're running on empty.", "Nothing taxing here — just good vibes.", "The perfect low-energy, high-reward pick."],
  Stressed: ["Let this melt your stress away.", "A comforting escape from the chaos.", "Press play and let the world fade away."],
  Romantic: ["Love is in the air with this one.", "A heartwarming pick for a romantic evening.", "Get ready to feel all the feelings."],
  Adventurous: ["Buckle up for an exciting ride!", "An adventurous pick that'll keep you on the edge.", "Your ticket to an unforgettable journey."],
  Curious: ["This one will keep you guessing till the end.", "Feed your curiosity with this intriguing pick.", "A mind-bending watch for the curious soul."],
  Sad: ["A comforting pick for when you need a warm hug.", "Sometimes the best medicine is a good story.", "Let this lift your spirits gently."],
};

export function getMockMovies(answers: WizardAnswers, excludeIds: number[]): Movie[] {
  const available = MOCK_MOVIES.filter(m => !excludeIds.includes(m.id));
  
  const moodGenreMap: Record<string, string[]> = {
    Happy: ['Comedy', 'Adventure', 'Animation'],
    Relaxed: ['Comedy', 'Romance', 'Animation', 'Family'],
    Tired: ['Comedy', 'Animation', 'Family'],
    Stressed: ['Comedy', 'Animation', 'Fantasy'],
    Romantic: ['Romance', 'Drama', 'Comedy'],
    Adventurous: ['Adventure', 'Action', 'Sci-Fi', 'Fantasy'],
    Curious: ['Mystery', 'Documentary', 'Sci-Fi', 'Crime'],
    Sad: ['Drama', 'Family', 'Comedy'],
  };

  const moodGenres = moodGenreMap[answers.mood] || ['Drama', 'Comedy'];
  
  // Score movies based on genre match
  const scored = available.map(movie => {
    let score = 0;
    movie.genres.forEach(g => {
      if (moodGenres.includes(g)) score += 2;
      if (answers.genres.includes(g)) score += 3;
    });
    if (answers.audience === 'Family with kids') {
      if (movie.genres.includes('Family') || movie.genres.includes('Animation')) score += 5;
      if (movie.genres.includes('Horror') || movie.genres.includes('Thriller') || movie.genres.includes('Crime')) score -= 20;
    }
    // Runtime filter
    const maxRuntimeMap: Record<string, number> = {
      'Under 90 min': 90,
      'Under 2 hours': 120,
      'Under 2.5 hours': 150,
      'Any length': 300,
    };
    const maxRuntime = maxRuntimeMap[answers.maxRuntime] || 300;
    if (movie.runtime > maxRuntime) score -= 10;
    
    return { movie, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick 3, ensuring at least one hidden gem
  const picks: Movie[] = [];
  const reasons = MOOD_REASONS[answers.mood] || ["A great pick for tonight!"];
  
  // First, try to get a hidden gem
  const hiddenGem = scored.find(s => s.movie.isHiddenGem && s.score >= 0);
  if (hiddenGem) {
    picks.push({ ...hiddenGem.movie, reason: hiddenGem.movie.reason || reasons[0] });
  }

  // Fill remaining slots
  for (const s of scored) {
    if (picks.length >= 3) break;
    if (!picks.find(p => p.id === s.movie.id)) {
      picks.push({ ...s.movie, reason: s.movie.reason || reasons[picks.length % reasons.length] });
    }
  }

  // If we still don't have 3, pad from available
  while (picks.length < 3 && picks.length < available.length) {
    const remaining = available.filter(m => !picks.find(p => p.id === m.id));
    if (remaining.length === 0) break;
    picks.push({ ...remaining[0], reason: reasons[picks.length % reasons.length] });
  }

  return picks.slice(0, 3);
}

export { FALLBACK_POSTER };
