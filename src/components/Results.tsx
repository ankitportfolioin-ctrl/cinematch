import { Movie } from '../types';
import { makeFallbackPoster } from '../mockData';

const DEFAULT_FALLBACK = makeFallbackPoster('Movie', '#1a1a1a', '#232323');

interface ResultsProps {
  movies: Movie[];
  onShowMore: () => void;
  onStartOver: () => void;
  clarification?: string | null;
}

export default function Results({ movies, onShowMore, onStartOver, clarification }: ResultsProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center fade-in">
        <div className="text-5xl mb-4">🎬</div>
        <p className="text-xl text-[#8C8C8C] mb-6">No perfect match. Try fewer filters.</p>
        <button
          onClick={onStartOver}
          className="gradient-btn px-8 py-3 rounded-full text-white font-medium"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl fade-in">
      {/* Clarification message */}
      {clarification && (
        <div className="mb-6 p-4 rounded-2xl bg-[#141414] border border-[#FF7A2F] text-center">
          <p className="text-[#FF7A2F] text-sm font-medium mb-2">💡 Quick question</p>
          <p className="text-[#F5F5F5] text-sm">{clarification}</p>
          <p className="text-[#8C8C8C] text-xs mt-2">You can skip this and use the results below.</p>
        </div>
      )}

      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-8"
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        Your picks for tonight ✨
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} delay={index * 150} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onShowMore}
          className="gradient-btn px-8 py-3 rounded-full text-white font-medium"
        >
          Show me 3 more
        </button>
        <button
          onClick={onStartOver}
          className="px-8 py-3 rounded-full text-[#8C8C8C] border border-[#232323] hover:border-[#FF7A2F] hover:text-[#F5F5F5] transition-all duration-200"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

function MovieCard({ movie, delay }: { movie: Movie; delay: number }) {
  return (
    <div
      className="card overflow-hidden flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-[#1a1a1a] overflow-hidden">
        <img
          src={movie.posterUrl || DEFAULT_FALLBACK}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK;
          }}
        />
        {movie.isHiddenGem && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #E63946, #FF7A2F)' }}>
            ✨ Hidden gem
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold leading-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {movie.title}
          </h3>
          <span className="text-[#8C8C8C] text-sm whitespace-nowrap mt-0.5">{movie.year}</span>
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {movie.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 rounded-full text-xs bg-[#1a1a1a] text-[#8C8C8C] border border-[#232323]"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Runtime and rating */}
        <div className="flex items-center gap-3 mb-3 text-sm text-[#8C8C8C]">
          <span>{movie.runtime} min</span>
          <span className="flex items-center gap-1">
            <span className="text-[#FF7A2F]">★</span>
            <span>{movie.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Overview */}
        <p className="text-sm text-[#8C8C8C] leading-relaxed mb-3 line-clamp-2">
          {movie.overview}
        </p>

        {/* Why this fits */}
        <p className="text-sm italic mb-2" style={{ color: '#FF7A2F' }}>
          "{movie.reason}"
        </p>

        {/* Match score */}
        {movie.matchScore !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, movie.matchScore)}%`,
                  background: 'linear-gradient(90deg, #E63946, #FF7A2F)',
                }}
              />
            </div>
            <span className="text-xs text-[#8C8C8C]">{movie.matchScore}% match</span>
          </div>
        )}

        {/* Feedback buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => {
              try {
                const feedback = JSON.parse(localStorage.getItem('movieNightPicker_feedback') || '[]');
                feedback.push({ tmdbId: movie.id, mediaType: movie.mediaType || 'movie', feedbackType: 'more_like_this', timestamp: Date.now() });
                localStorage.setItem('movieNightPicker_feedback', JSON.stringify(feedback));
              } catch {}
            }}
            className="text-xs text-[#8C8C8C] hover:text-[#FF7A2F] transition-colors px-2 py-1 rounded border border-[#232323] hover:border-[#FF7A2F]"
            title="More like this"
          >
            👍
          </button>
          <button
            onClick={() => {
              try {
                const feedback = JSON.parse(localStorage.getItem('movieNightPicker_feedback') || '[]');
                feedback.push({ tmdbId: movie.id, mediaType: movie.mediaType || 'movie', feedbackType: 'not_interested', timestamp: Date.now() });
                localStorage.setItem('movieNightPicker_feedback', JSON.stringify(feedback));
              } catch {}
            }}
            className="text-xs text-[#8C8C8C] hover:text-[#E63946] transition-colors px-2 py-1 rounded border border-[#232323] hover:border-[#E63946]"
            title="Not interested"
          >
            👎
          </button>
          <button
            onClick={() => {
              try {
                const feedback = JSON.parse(localStorage.getItem('movieNightPicker_feedback') || '[]');
                feedback.push({ tmdbId: movie.id, mediaType: movie.mediaType || 'movie', feedbackType: 'already_watched', timestamp: Date.now() });
                localStorage.setItem('movieNightPicker_feedback', JSON.stringify(feedback));
              } catch {}
            }}
            className="text-xs text-[#8C8C8C] hover:text-[#F5F5F5] transition-colors px-2 py-1 rounded border border-[#232323] hover:border-[#F5F5F5]"
            title="Already watched"
          >
            ✓
          </button>
        </div>

        {/* Where to watch */}
        <div className="mt-auto pt-3 border-t border-[#232323]">
          {movie.providers.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#8C8C8C] mr-1">Watch on:</span>
              {movie.providers.map((provider) => (
                <div key={provider.name} className="group relative">
                  <img
                    src={provider.logoUrl}
                    alt={provider.name}
                    className="w-8 h-8 rounded-md object-cover bg-[#1a1a1a] border border-[#232323]"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const parent = el.parentElement;
                      if (parent) {
                        const span = document.createElement('span');
                        span.className = 'text-xs text-[#8C8C8C] px-2 py-1 bg-[#1a1a1a] rounded';
                        span.textContent = provider.name;
                        parent.appendChild(span);
                      }
                    }}
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#232323] text-xs text-[#F5F5F5] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {provider.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8C8C8C]">
              Not available to stream in your country right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
