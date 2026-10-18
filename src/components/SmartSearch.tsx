import { useState } from 'react';

interface SmartSearchProps {
  onSearch: (query: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const EXAMPLE_QUERIES = [
  "I'm tired, want an action movie, and I like The Godfather",
  "Light comedy under 100 minutes",
  "Something romantic like Before Sunrise",
  "Intense thriller but nothing too violent",
  "Feel-good animation for the family",
];

export default function SmartSearch({ onSearch, onBack, isLoading = false }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setValidationError('Please enter a description of what you\'d like to watch.');
      return;
    }
    if (trimmed.length < 3) {
      setValidationError('Please provide a bit more detail about what you\'re looking for.');
      return;
    }
    setValidationError('');
    onSearch(trimmed);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="w-full max-w-2xl fade-in">
      <h2
        className="text-2xl md:text-3xl font-bold mb-2 text-center"
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        Describe your perfect movie night
      </h2>
      <p className="text-center text-[#8C8C8C] text-sm mb-8">
        Tell us what you're in the mood for in your own words
      </p>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.slice(0, 500));
            setValidationError('');
          }}
          placeholder="e.g., I'm tired, want an action movie, and I like The Godfather..."
          rows={4}
          className={`w-full bg-[#141414] border rounded-2xl px-5 py-4 text-[#F5F5F5] placeholder-[#8C8C8C] focus:outline-none transition-colors duration-200 resize-none text-base ${
            validationError ? 'border-[#E63946]' : 'border-[#232323] focus:border-[#FF7A2F]'
          }`}
        />
        {validationError && (
          <p className="text-[#E63946] text-sm mt-2">{validationError}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-[#8C8C8C]">{query.length}/500</span>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="gradient-btn px-8 py-3 rounded-full text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
          >
            {isLoading ? 'Searching...' : 'Find my movies'}
          </button>
        </div>
      </form>

      {/* Example queries */}
      <div className="mb-8">
        <p className="text-xs text-[#8C8C8C] mb-3 text-center">Try an example:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="chip px-3 py-1.5 rounded-full text-xs text-[#8C8C8C] hover:text-[#FF7A2F] hover:border-[#FF7A2F] transition-all duration-200"
            >
              {example.length > 40 ? example.slice(0, 38) + '...' : example}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="text-sm text-[#8C8C8C] hover:text-[#F5F5F5] transition-colors duration-200"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}
