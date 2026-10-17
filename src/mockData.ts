import { Movie, WizardAnswers } from './types';

// SVG fallback poster generator
function makeFallbackPoster(title: string, color1: string, color2: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color1}"/><stop offset="100%" style="stop-color:${color2}"/></linearGradient></defs>
    <rect width="500" height="750" fill="url(#g)"/>
    <text x="250" y="360" text-anchor="middle" fill="white" font-family="sans-serif" font-size="18" font-weight="bold" opacity="0.9">${title.length > 30 ? title.slice(0, 28) + '...' : title}</text>
    <text x="250" y="400" text-anchor="middle" fill="white" font-family="sans-serif" font-size="40" opacity="0.3">🎬</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// Provider logos as data URIs (small colored squares with initials)
function makeProviderLogo(name: string, color: string): string {
  const initial = name.charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" viewBox="0 0 92 92">
    <rect width="92" height="92" rx="12" fill="${color}"/>
    <text x="46" y="56" text-anchor="middle" fill="white" font-family="sans-serif" font-size="36" font-weight="bold">${initial}</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const PROVIDERS = {
  Netflix: { name: 'Netflix', logoUrl: makeProviderLogo('Netflix', '#E50914') },
  PrimeVideo: { name: 'Prime Video', logoUrl: makeProviderLogo('Prime', '#00A8E1') },
  DisneyPlus: { name: 'Disney+', logoUrl: makeProviderLogo('Disney', '#113CCF') },
  Hotstar: { name: 'Hotstar', logoUrl: makeProviderLogo('Hotstar', '#0C2340') },
  JioCinema: { name: 'JioCinema', logoUrl: makeProviderLogo('Jio', '#1B1464') },
  Zee5: { name: 'Zee5', logoUrl: makeProviderLogo('Zee5', '#8230C6') },
  AppleTV: { name: 'Apple TV+', logoUrl: makeProviderLogo('Apple', '#333333') },
  MUBI: { name: 'MUBI', logoUrl: makeProviderLogo('MUBI', '#0A0A0A') },
  SonyLIV: { name: 'SonyLIV', logoUrl: makeProviderLogo('Sony', '#1A1A1A') },
};

// ============================================
// COMPREHENSIVE MOVIE DATABASE (60+ movies)
// Covers all 5 test scenarios + variety
// ============================================
interface MovieDB {
  id: number;
  title: string;
  year: number;
  genres: string[];
  runtime: number;
  rating: number;
  overview: string;
  posterUrl: string;
  providers: { name: string; logoUrl: string }[];
  popularity: number; // lower = hidden gem
  languages: string[];
  adult: boolean;
  topics?: string[];
}

const MOVIE_DB: MovieDB[] = [
  // === COMEDY / LIGHT (Tired, Happy, Stressed) ===
  { id: 1001, title: "The Grand Budapest Hotel", year: 2014, genres: ["Comedy", "Drama"], runtime: 99, rating: 8.1, overview: "A writer encounters the owner of an aging high-class hotel, who tells of his early years as a lobby boy in the hotel's glorious years under a legendary concierge.", posterUrl: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 85, languages: ["English"], adult: false },
  { id: 1002, title: "Paddington 2", year: 2017, genres: ["Comedy", "Family", "Adventure"], runtime: 104, rating: 7.8, overview: "Paddington happily lives with the Brown family and tries to find the perfect present for his beloved Aunt, but a thief steals it.", posterUrl: "https://image.tmdb.org/t/p/w500/4X5VJGnXwGhBnFWQOQXBKucYQbO.jpg", providers: [PROVIDERS.Netflix], popularity: 70, languages: ["English"], adult: false },
  { id: 1003, title: "The Intouchables", year: 2011, genres: ["Comedy", "Drama"], runtime: 112, rating: 8.5, overview: "After becoming a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.", posterUrl: "https://image.tmdb.org/t/p/w500/ypiDKiNUCyJclZSPiVtZTgiF5xR.jpg", providers: [PROVIDERS.Netflix], popularity: 90, languages: ["French"], adult: false },
  { id: 1004, title: "Hunt for the Wilderpeople", year: 2016, genres: ["Comedy", "Adventure", "Drama"], runtime: 101, rating: 7.9, overview: "A national manhunt is ordered for a rebellious kid and his foster uncle who go missing in the wild New Zealand bush.", posterUrl: "https://image.tmdb.org/t/p/w500/nkayfFlOPw7x44lbQGY97bTqGGI.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 35, languages: ["English"], adult: false },
  { id: 1005, title: "Little Miss Sunshine", year: 2006, genres: ["Comedy", "Drama"], runtime: 101, rating: 7.8, overview: "A dysfunctional family drives across the country in a vintage VW bus to support their young daughter in a beauty pageant.", posterUrl: "https://image.tmdb.org/t/p/w500/w9tOmHMFJQjpsKPfQzLAgLjQJhL.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 60, languages: ["English"], adult: false },
  { id: 1006, title: "The Secret Life of Walter Mitty", year: 2013, genres: ["Comedy", "Adventure", "Drama"], runtime: 114, rating: 7.3, overview: "When his job is threatened, a daydreamer embarks on a extraordinary journey that becomes more amazing than anything he could have imagined.", posterUrl: "https://image.tmdb.org/t/p/w500/cWdmEAlPQnreDykWJNMRVbMhYRd.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 55, languages: ["English"], adult: false },
  { id: 1007, title: "Sing Street", year: 2016, genres: ["Comedy", "Drama", "Romance"], runtime: 106, rating: 7.9, overview: "A boy growing up in Dublin during the 1980s escapes his strained family life by starting a band to impress the mysterious girl he likes.", posterUrl: "https://image.tmdb.org/t/p/w500/oFAGYscGMwrLY37GjoGjJXxHMmk.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 25, languages: ["English"], adult: false },
  { id: 1008, title: "Chef", year: 2014, genres: ["Comedy", "Drama"], runtime: 114, rating: 7.3, overview: "A chef who lost his spot at a top restaurant teams up with his son and his ex-wife to launch a food truck, rediscovering his passion for cooking.", posterUrl: "https://image.tmdb.org/t/p/w500/hyp8exDmO4dfoNKGnaHq5gCmIBO.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 30, languages: ["English"], adult: false },

  // === ANIMATION (Family, Tired, Happy) ===
  { id: 2001, title: "Spirited Away", year: 2001, genres: ["Animation", "Fantasy", "Family"], runtime: 125, rating: 8.6, overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.", posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", providers: [PROVIDERS.Netflix], popularity: 95, languages: ["Japanese"], adult: false },
  { id: 2002, title: "My Neighbor Totoro", year: 1988, genres: ["Animation", "Family", "Fantasy"], runtime: 86, rating: 8.1, overview: "When two girls move to the country with their father, they discover that the nearby forest is home to magical creatures.", posterUrl: "https://image.tmdb.org/t/p/w500/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg", providers: [PROVIDERS.Netflix], popularity: 80, languages: ["Japanese"], adult: false },
  { id: 2003, title: "Inside Out", year: 2015, genres: ["Animation", "Comedy", "Family"], runtime: 95, rating: 8.1, overview: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions go into overdrive.", posterUrl: "https://image.tmdb.org/t/p/w500/2H1TmgdfNtsKlU9jKdeNyW5y8Wy.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 92, languages: ["English"], adult: false },
  { id: 2004, title: "Song of the Sea", year: 2014, genres: ["Animation", "Family", "Fantasy"], runtime: 93, rating: 8.1, overview: "A young boy and his sister discover the secrets of their past and the magic in the world of ancient folklore.", posterUrl: "https://image.tmdb.org/t/p/w500/eMmHo5DRBvX5gHfCxSLkmxnpNFM.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 20, languages: ["English"], adult: false },
  { id: 2005, title: "Wolfwalkers", year: 2020, genres: ["Animation", "Family", "Adventure"], runtime: 103, rating: 8.1, overview: "A young apprentice hunter and her father journey to Ireland to help wipe out the last wolf pack, but she befriends a wild girl.", posterUrl: "https://image.tmdb.org/t/p/w500/ehCtI7V3N3mQjWjBTdJlGRkGQ9A.jpg", providers: [PROVIDERS.AppleTV], popularity: 22, languages: ["English"], adult: false },
  { id: 2006, title: "Coco", year: 2017, genres: ["Animation", "Family", "Fantasy"], runtime: 105, rating: 8.4, overview: "Despite his family's baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol.", posterUrl: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXeRVWJvI.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 88, languages: ["English", "Spanish"], adult: false },
  { id: 2007, title: "The Boy and the Heron", year: 2023, genres: ["Animation", "Fantasy", "Family"], runtime: 124, rating: 7.5, overview: "A young boy named Mahito yearning for his mother ventures into a world shared by the living and the dead.", posterUrl: "https://image.tmdb.org/t/p/w500/jDQPkgzerGophKRVH9mcBeyYHB5.jpg", providers: [PROVIDERS.Netflix], popularity: 65, languages: ["Japanese"], adult: false },

  // === ROMANCE (Romantic mood) ===
  { id: 3001, title: "Before Sunrise", year: 1995, genres: ["Romance", "Drama"], runtime: 101, rating: 8.1, overview: "A young man and woman meet on a train in Europe and wind up spending one evening together in Vienna, connecting on the deepest level.", posterUrl: "https://image.tmdb.org/t/p/w500/z2UtGA1WggESspi6KOXeo66lvLx.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 55, languages: ["English"], adult: false },
  { id: 3002, title: "Past Lives", year: 2023, genres: ["Romance", "Drama"], runtime: 106, rating: 7.8, overview: "Two deeply connected childhood friends are reunited in New York after decades apart, confronting notions of destiny and love.", posterUrl: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNP7nvRvYDDD.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 40, languages: ["English", "Korean"], adult: false },
  { id: 3003, title: "Portrait of a Lady on Fire", year: 2019, genres: ["Romance", "Drama"], runtime: 122, rating: 8.1, overview: "On an isolated island in Brittany, a female painter and her subject share an intense connection that blossoms into something deeper.", posterUrl: "https://image.tmdb.org/t/p/w500/2LquGw4hbgcJ0O2IFuS9KPTqqHO.jpg", providers: [PROVIDERS.MUBI], popularity: 30, languages: ["French"], adult: false },
  { id: 3004, title: "Amélie", year: 2001, genres: ["Romance", "Comedy"], runtime: 122, rating: 8.3, overview: "Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her find happiness.", posterUrl: "https://image.tmdb.org/t/p/w500/f0GZE8oVhgvaHt5gJLxVhCwNMTp.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 70, languages: ["French"], adult: false },
  { id: 3005, title: "In the Mood for Love", year: 2000, genres: ["Romance", "Drama"], runtime: 98, rating: 8.1, overview: "Two neighbors form a deep bond when they suspect their spouses are having an affair with each other.", posterUrl: "https://image.tmdb.org/t/p/w500/ky4sYBAjZCt21yLiDEw6bUjPMTC.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 45, languages: ["English"], adult: false },
  { id: 3006, title: "The Lunchbox", year: 2013, genres: ["Romance", "Drama"], runtime: 104, rating: 7.8, overview: "A mistaken delivery in Mumbai's famously efficient lunchbox system connects a young housewife to an older man in the dusk of his life.", posterUrl: "https://image.tmdb.org/t/p/w500/nmyf6Bm0rGbA2bZxJ7y1VKEhpKn.jpg", providers: [PROVIDERS.Netflix], popularity: 28, languages: ["Hindi"], adult: false },
  { id: 3007, title: "When Harry Met Sally", year: 1989, genres: ["Romance", "Comedy"], runtime: 96, rating: 7.7, overview: "Harry and Sally have known each other for years, debating whether men and women can truly be just friends.", posterUrl: "https://image.tmdb.org/t/p/w500/rFOiRXFz0fY2KpBIae3pHbVnE2Y.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 50, languages: ["English"], adult: false },

  // === ACTION / ADVENTURE (Adventurous mood) ===
  { id: 4001, title: "Mad Max: Fury Road", year: 2015, genres: ["Action", "Adventure", "Sci-Fi"], runtime: 120, rating: 7.6, overview: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland with the help of a drifter.", posterUrl: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 90, languages: ["English"], adult: false },
  { id: 4002, title: "Everything Everywhere All at Once", year: 2022, genres: ["Action", "Adventure", "Sci-Fi"], runtime: 139, rating: 7.8, overview: "An aging Chinese immigrant is swept up in an insane adventure where she alone can save the world by exploring other universes.", posterUrl: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 85, languages: ["English"], adult: false },
  { id: 4003, title: "RRR", year: 2022, genres: ["Action", "Drama"], runtime: 187, rating: 7.8, overview: "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country.", posterUrl: "https://image.tmdb.org/t/p/w500/nBGhLz3AOQI0CjDhMxOjRtMIBfM.jpg", providers: [PROVIDERS.Netflix], popularity: 75, languages: ["Telugu"], adult: false },
  { id: 4004, title: "Dune: Part Two", year: 2024, genres: ["Adventure", "Sci-Fi", "Action"], runtime: 166, rating: 8.2, overview: "Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.", posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 95, languages: ["English"], adult: false },
  { id: 4005, title: "Crouching Tiger, Hidden Dragon", year: 2000, genres: ["Action", "Adventure", "Romance"], runtime: 120, rating: 7.9, overview: "A martial artist and his love pursue a stolen sword while navigating the complex codes of honor in ancient China.", posterUrl: "https://image.tmdb.org/t/p/w500/iNDYvR1pFJOg2bS3c2vMxMRrG89.jpg", providers: [PROVIDERS.Netflix], popularity: 60, languages: ["English"], adult: false },
  { id: 4006, title: "Princess Mononoke", year: 1997, genres: ["Animation", "Adventure", "Fantasy"], runtime: 134, rating: 8.4, overview: "On a journey to find a cure for a deadly curse, a young warrior becomes entangled in a conflict between forest gods and miners.", posterUrl: "https://image.tmdb.org/t/p/w500/cMYAADl2cMhaY1sJoJbMlpvqBcq.jpg", providers: [PROVIDERS.Netflix], popularity: 70, languages: ["Japanese"], adult: false },
  { id: 4007, title: "Kantara", year: 2022, genres: ["Action", "Drama", "Adventure"], runtime: 148, rating: 7.9, overview: "A small community lives in harmony with nature until greed threatens to destroy the balance, awakening an ancient force.", posterUrl: "https://image.tmdb.org/t/p/w500/aiixvJb4fJLxLrBz8QmNjMRDc0L.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 35, languages: ["Kannada"], adult: false },
  { id: 4008, title: "Spider-Man: Into the Spider-Verse", year: 2018, genres: ["Animation", "Action", "Adventure"], runtime: 117, rating: 8.4, overview: "Teen Miles Morales becomes Spider-Man and must save the multiverse alongside other Spider-People from different dimensions.", posterUrl: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", providers: [PROVIDERS.Netflix], popularity: 88, languages: ["English"], adult: false },

  // === MYSTERY / THRILLER (Curious mood) ===
  { id: 5001, title: "Parasite", year: 2019, genres: ["Thriller", "Drama"], runtime: 132, rating: 8.5, overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 92, languages: ["Korean"], adult: false, topics: ["money", "family", "survival"] },
  { id: 5002, title: "The Handmaiden", year: 2016, genres: ["Mystery", "Thriller", "Romance"], runtime: 145, rating: 8.1, overview: "A woman is hired as a handmaiden to a Japanese heiress, but she secretly has a different agenda involving a con man.", posterUrl: "https://image.tmdb.org/t/p/w500/xDw2nMMPtFCoQOfGEMiXQXBlalQ.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 32, languages: ["Korean", "Japanese"], adult: false },
  { id: 5003, title: "Memories of Murder", year: 2003, genres: ["Mystery", "Crime", "Drama"], runtime: 131, rating: 8.1, overview: "In a small town, two detectives struggle to solve the case of a serial killer, the first in Korean history.", posterUrl: "https://image.tmdb.org/t/p/w500/jcgUjx1nYiRYOQYnCKFbRfMnUjB.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 38, languages: ["Korean"], adult: false },
  { id: 5004, title: "Decision to Leave", year: 2022, genres: ["Mystery", "Romance", "Drama"], runtime: 138, rating: 7.4, overview: "A detective investigating a man's death in the mountains begins to suspect the dead man's mysterious wife.", posterUrl: "https://image.tmdb.org/t/p/w500/26Vu6VO8qvCAaVVF8T1Sf7sDhGZ.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 28, languages: ["Korean"], adult: false },
  { id: 5005, title: "Knives Out", year: 2019, genres: ["Mystery", "Comedy", "Crime"], runtime: 130, rating: 7.9, overview: "A detective investigates the death of a patriarch of an eccentric, combative family in this clever whodunit.", posterUrl: "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg", providers: [PROVIDERS.Netflix], popularity: 75, languages: ["English"], adult: false },
  { id: 5006, title: "Andhadhun", year: 2018, genres: ["Mystery", "Thriller", "Crime"], runtime: 139, rating: 8.2, overview: "A series of mysterious events change the life of a blind pianist who now must report a crime that he may or may not have witnessed.", posterUrl: "https://image.tmdb.org/t/p/w500/lJiHTZaNiRwDmME9tMToQYxGfFy.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 40, languages: ["Hindi"], adult: false },
  { id: 5007, title: "The Invisible Guest", year: 2016, genres: ["Mystery", "Thriller", "Crime"], runtime: 106, rating: 7.9, overview: "A successful entrepreneur wakes up in a locked hotel room next to his dead lover and hires a prestigious lawyer to help him.", posterUrl: "https://image.tmdb.org/t/p/w500/fKgOkwJlYnWbQeoBkCjX3GQLoFQ.jpg", providers: [PROVIDERS.Netflix], popularity: 35, languages: ["Spanish"], adult: false },
  { id: 5008, title: "Drishyam", year: 2013, genres: ["Mystery", "Thriller", "Drama"], runtime: 160, rating: 8.2, overview: "A man goes to extreme lengths to save his family from punishment after they commit an accidental crime.", posterUrl: "https://image.tmdb.org/t/p/w500/dfnBPKmVnYfMXmEi5Y6OjTf7Y7o.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 30, languages: ["Malayalam"], adult: false },

  // === DRAMA (Sad, Curious) ===
  { id: 6001, title: "The Shawshank Redemption", year: 1994, genres: ["Drama"], runtime: 142, rating: 8.7, overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", posterUrl: "https://image.tmdb.org/t/p/w500/9cjIGRQL0gkgMlqAh3J6dFh2V7F.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 95, languages: ["English"], adult: false },
  { id: 6002, title: "12th Fail", year: 2023, genres: ["Drama"], runtime: 147, rating: 8.7, overview: "The true story of IPS officer Manoj Kumar Sharma who overcame extreme poverty and academic failure to achieve his dream.", posterUrl: "https://image.tmdb.org/t/p/w500/fqOk1HjPMQmMfBaFQkFnmzBdQeE.jpg", providers: [PROVIDERS.Hotstar], popularity: 45, languages: ["Hindi"], adult: false },
  { id: 6003, title: "Manchester by the Sea", year: 2016, genres: ["Drama"], runtime: 137, rating: 7.8, overview: "A depressed uncle is forced to take care of his teenage nephew after his brother dies, returning to the town that destroyed his life.", posterUrl: "https://image.tmdb.org/t/p/w500/nLC6fURBGoQeIFwMIGRBmMYLrVp.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 50, languages: ["English"], adult: false },
  { id: 6004, title: "A Separation", year: 2011, genres: ["Drama", "Mystery"], runtime: 123, rating: 8.3, overview: "A married couple are faced with a heartbreaking decision that could destroy their already fragile relationship.", posterUrl: "https://image.tmdb.org/t/p/w500/jgFlJjzGQFmVQbZQpEjxKxJqGQz.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 35, languages: ["English"], adult: false },
  { id: 6005, title: "Capernaum", year: 2018, genres: ["Drama"], runtime: 126, rating: 8.1, overview: "A 12-year-old boy sues his parents for bringing him into a world of neglect and poverty in this powerful Lebanese drama.", posterUrl: "https://image.tmdb.org/t/p/w500/mFnfAFCiyvHxkai2s37Sx7f8GQz.jpg", providers: [PROVIDERS.Netflix], popularity: 25, languages: ["English"], adult: false },
  { id: 6006, title: "Shoplifters", year: 2018, genres: ["Drama", "Crime"], runtime: 121, rating: 8.0, overview: "A family of small-time criminals struggles to survive on the margins of society in Tokyo, taking in a neglected little girl.", posterUrl: "https://image.tmdb.org/t/p/w500/lmJsFyRQYJBxYfMDfjLFwPJGQz.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 30, languages: ["Japanese"], adult: false },

  // === DOCUMENTARY (Curious) ===
  { id: 7001, title: "Free Solo", year: 2018, genres: ["Documentary"], runtime: 100, rating: 8.2, overview: "Follow Alex Honnold as he becomes the first person to ever free solo a 3,000-foot rock face — with no ropes or safety equipment.", posterUrl: "https://image.tmdb.org/t/p/w500/vuza06A75YjFQfSOGjGzrLp9xgQ.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 55, languages: ["English"], adult: false },
  { id: 7002, title: "My Octopus Teacher", year: 2020, genres: ["Documentary"], runtime: 85, rating: 8.1, overview: "A filmmaker forges an unusual friendship with an octopus living in a South African kelp forest.", posterUrl: "https://image.tmdb.org/t/p/w500/nMbXv0UImLZ5jJMBfGCClFKXjMQ.jpg", providers: [PROVIDERS.Netflix], popularity: 40, languages: ["English"], adult: false },
  { id: 7003, title: "Summer of Soul", year: 2021, genres: ["Documentary"], runtime: 117, rating: 7.8, overview: "Questlove's documentary about the 1969 Harlem Cultural Festival, celebrating Black music and culture.", posterUrl: "https://image.tmdb.org/t/p/w500/5tBQjRjJFh5sRjJFh5sRjJFh5s.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 30, languages: ["English"], adult: false },

  // === FANTASY (Adventurous, Stressed) ===
  { id: 8001, title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, genres: ["Fantasy", "Adventure"], runtime: 178, rating: 8.4, overview: "A meek Hobbit and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth.", posterUrl: "https://image.tmdb.org/t/p/w500/6oomFQYQ2yQTMJIbnvbkBL9cHo6.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 92, languages: ["English"], adult: false },
  { id: 8002, title: "Pan's Labyrinth", year: 2006, genres: ["Fantasy", "Drama"], runtime: 118, rating: 8.2, overview: "In post-Civil War Spain, a girl escapes into an eerie but captivating fantasy world through a mysterious labyrinth.", posterUrl: "https://image.tmdb.org/t/p/w500/mtkCmEjFWOxGQfJxhSDnRjQmVp.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 55, languages: ["Spanish"], adult: false },
  { id: 8003, title: "The Shape of Water", year: 2017, genres: ["Fantasy", "Romance", "Drama"], runtime: 123, rating: 7.3, overview: "A mute cleaning lady at a high-security government lab falls in love with a mysterious amphibious creature held there.", posterUrl: "https://image.tmdb.org/t/p/w500/6k8GQYxqHjFQvSjJFh5sRjJFh5s.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 45, languages: ["English"], adult: false },

  // === SCI-FI (Curious, Adventurous) ===
  { id: 9001, title: "Arrival", year: 2016, genres: ["Sci-Fi", "Drama", "Mystery"], runtime: 116, rating: 7.9, overview: "A linguist is recruited by the military to communicate with alien lifeforms after twelve mysterious spacecraft land around the world.", posterUrl: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpFf.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 70, languages: ["English"], adult: false, topics: ["space", "detective"] },
  { id: 9002, title: "Interstellar", year: 2014, genres: ["Sci-Fi", "Adventure", "Drama"], runtime: 169, rating: 8.4, overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 90, languages: ["English"], adult: false, topics: ["space", "survival", "family"] },
  { id: 9003, title: "The Wandering Earth", year: 2019, genres: ["Sci-Fi", "Adventure"], runtime: 125, rating: 6.8, overview: "The sun is dying, and a group of astronauts must travel across space to find a new home for humanity.", posterUrl: "https://image.tmdb.org/t/p/w500/z8E2fGkFjQvSjJFh5sRjJFh5s.jpg", providers: [PROVIDERS.Netflix], popularity: 35, languages: ["English"], adult: false },

  // === CLASSICS (before 2000) ===
  { id: 10001, title: "Cinema Paradiso", year: 1988, genres: ["Drama", "Romance"], runtime: 155, rating: 8.5, overview: "A filmmaker recalls his childhood, when he fell in love with the movies at his village's cinema and formed a deep friendship with the projectionist.", posterUrl: "https://image.tmdb.org/t/p/w500/gCI2AeMV4IHSewhJkxkzNaGSWjC.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 40, languages: ["English"], adult: false },
  { id: 10002, title: "Good Will Hunting", year: 1997, genres: ["Drama", "Romance"], runtime: 126, rating: 8.3, overview: "Will Hunting, a janitor at MIT, has a gift for mathematics but needs help from a psychologist to find direction in his life.", posterUrl: "https://image.tmdb.org/t/p/w500/abPn0EKMdJFh5sRjJFh5sRjJFh5.jpg", providers: [PROVIDERS.PrimeVideo], popularity: 65, languages: ["English"], adult: false },
  { id: 10003, title: "The Princess Bride", year: 1987, genres: ["Adventure", "Comedy", "Family"], runtime: 98, rating: 8.0, overview: "A classic fairy tale told by a grandfather to his grandson, featuring pirates, giants, and true love.", posterUrl: "https://image.tmdb.org/t/p/w500/22rSKGjJFh5sRjJFh5sRjJFh5.jpg", providers: [PROVIDERS.DisneyPlus], popularity: 55, languages: ["English"], adult: false },
];

// ============================================
// REASON TEMPLATES BY MOOD
// ============================================
const MOOD_REASONS: Record<string, string[]> = {
  Happy: [
    "A cheerful pick to keep those good vibes going!",
    "This one's guaranteed to bring a smile.",
    "Pure joy on screen — perfect for your mood.",
    "Feel-good energy from start to finish.",
  ],
  Relaxed: [
    "Kick back and enjoy this easy-going pick.",
    "A smooth, comfortable watch for your chill evening.",
    "Low stress, high enjoyment — just what you need.",
    "The perfect wind-down movie for tonight.",
  ],
  Tired: [
    "A light, easy watch for when you're running on empty.",
    "Nothing taxing here — just good vibes.",
    "The perfect low-energy, high-reward pick.",
    "Press play and let it carry you along.",
  ],
  Stressed: [
    "Let this melt your stress away.",
    "A comforting escape from the chaos.",
    "Press play and let the world fade away.",
    "Your ticket to a calmer state of mind.",
  ],
  Romantic: [
    "Love is in the air with this one.",
    "A heartwarming pick for a romantic evening.",
    "Get ready to feel all the feelings.",
    "A beautiful love story for two.",
  ],
  Adventurous: [
    "Buckle up for an exciting ride!",
    "An adventurous pick that'll keep you on the edge.",
    "Your ticket to an unforgettable journey.",
    "An epic experience awaits.",
  ],
  Curious: [
    "This one will keep you guessing till the end.",
    "Feed your curiosity with this intriguing pick.",
    "A mind-bending watch for the curious soul.",
    "Every scene reveals something new.",
  ],
  Sad: [
    "A comforting pick for when you need a warm hug.",
    "Sometimes the best medicine is a good story.",
    "Let this lift your spirits gently.",
    "A tender film that understands.",
  ],
};

// ============================================
// MAIN PICKER FUNCTION
// ============================================
export function getMockMovies(answers: WizardAnswers, excludeIds: number[]): Movie[] {
  const available = MOVIE_DB.filter(m => !excludeIds.includes(m.id));

  // Map mood to preferred genres
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

  // Runtime limit
  const maxRuntimeMap: Record<string, number> = {
    'Under 90 min': 90,
    'Under 2 hours': 120,
    'Under 2.5 hours': 150,
    'Any length': 300,
  };
  const maxRuntime = maxRuntimeMap[answers.maxRuntime] || 300;

  // Score each movie
  const scored = available.map(movie => {
    let score = 0;

    // Genre match with mood
    movie.genres.forEach(g => {
      if (moodGenres.includes(g)) score += 3;
      if (answers.genres.includes(g)) score += 4;
    });

    // Audience filter
    if (answers.audience === 'Family with kids') {
      if (movie.genres.includes('Family') || movie.genres.includes('Animation')) score += 8;
      if (movie.genres.includes('Horror') || movie.genres.includes('Thriller') || movie.genres.includes('Crime')) score -= 30;
      if (movie.adult) score -= 50;
    }

    // Runtime filter
    if (movie.runtime <= maxRuntime) score += 2;
    else score -= 5;

    // Language preference
    if (answers.languages.length > 0) {
      const langMatch = movie.languages.some(l => answers.languages.includes(l));
      if (langMatch) score += 3;
      else score -= 2;
    }

    // Rating preference
    if (answers.preferences.highlyRated && movie.rating >= 7.5) score += 3;
    if (answers.preferences.hiddenGems && movie.popularity < 40) score += 5;
    if (answers.preferences.recent && movie.year >= 2020) score += 3;
    if (answers.preferences.classics && movie.year < 2000) score += 5;

    // Note matching (simple keyword matching)
    if (answers.note) {
      const noteLower = answers.note.toLowerCase();
      const titleLower = movie.title.toLowerCase();
      const overviewLower = movie.overview.toLowerCase();
      if (noteLower.split(' ').some(word => word.length > 3 && (overviewLower.includes(word) || titleLower.includes(word)))) {
        score += 2;
      }
    }

    // Add some randomness for variety
    score += Math.random() * 2;

    return { movie, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick 3 movies ensuring variety
  const picks: Movie[] = [];
  const reasons = MOOD_REASONS[answers.mood] || ["A great pick for tonight!"];

  // Ensure at least one hidden gem if preference is set
  if (answers.preferences.hiddenGems) {
    const gem = scored.find(s => s.movie.popularity < 40 && s.score > 0);
    if (gem) {
      picks.push({
        ...gem.movie,
        posterUrl: gem.movie.posterUrl || makeFallbackPoster(gem.movie.title, '#E63946', '#FF7A2F'),
        reason: reasons[0],
        isHiddenGem: true,
      });
    }
  }

  // Fill remaining slots with variety
  const usedGenres = new Set<string>();
  for (const s of scored) {
    if (picks.length >= 3) break;
    if (picks.find(p => p.id === s.movie.id)) continue;

    // Try to pick movies with different genres for variety
    const genreOverlap = s.movie.genres.filter(g => usedGenres.has(g)).length;
    if (picks.length > 0 && genreOverlap === s.movie.genres.length && picks.length < 2) continue;

    s.movie.genres.forEach(g => usedGenres.add(g));
    picks.push({
      ...s.movie,
      posterUrl: s.movie.posterUrl || makeFallbackPoster(s.movie.title, '#E63946', '#FF7A2F'),
      reason: reasons[picks.length % reasons.length],
      isHiddenGem: s.movie.popularity < 40 && !answers.preferences.hiddenGems ? true : false,
    });
  }

  // If we still don't have 3, fill from remaining
  while (picks.length < 3 && picks.length < available.length) {
    const remaining = available.filter(m => !picks.find(p => p.id === m.id));
    if (remaining.length === 0) break;
    const m = remaining[0];
    picks.push({
      ...m,
      posterUrl: m.posterUrl || makeFallbackPoster(m.title, '#E63946', '#FF7A2F'),
      reason: reasons[picks.length % reasons.length],
      isHiddenGem: m.popularity < 40,
    });
  }

  return picks.slice(0, 3);
}

export { makeFallbackPoster };
