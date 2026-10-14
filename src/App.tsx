import { useState, useCallback } from 'react';
import Hero from './components/Hero';
import WizardStep from './components/WizardStep';
import Results from './components/Results';
import { Movie, WizardAnswers } from './types';
import { getMockMovies } from './mockData';

type Screen = 'hero' | 'wizard' | 'loading' | 'results';

const MOODS = ['Happy', 'Relaxed', 'Tired', 'Stressed', 'Romantic', 'Adventurous', 'Curious', 'Sad'];
const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
const AUDIENCES = ['Just me', 'Partner', 'Friends', 'Family with kids'];
const TIMES = ['Under 90 min', 'Under 2 hours', 'Under 2.5 hours', 'Any length'];
const LANGUAGES = ['Any', 'English', 'Hindi', 'Tamil', 'Telugu', 'Korean', 'Japanese', 'Spanish', 'French'];
const PREFERENCES = ['Highly rated only (7+)', 'Hidden gems', 'Recent (last 5 years)', 'Classics (before 2000)', 'Include mature content'];

const TOTAL_STEPS = 7;

export default function App() {
  const [screen, setScreen] = useState<Screen>('hero');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({
    mood: '',
    genres: [],
    audience: '',
    maxRuntime: '',
    languages: [],
    preferences: {
      highlyRated: false,
      hiddenGems: false,
      recent: false,
      classics: false,
      mature: false,
    },
    note: '',
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [excludeIds, setExcludeIds] = useState<number[]>([]);

  const progress = screen === 'wizard' ? ((step + 1) / TOTAL_STEPS) * 100 : 0;

  const handleStart = () => {
    setScreen('wizard');
    setStep(0);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      fetchMovies();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setScreen('hero');
    }
  };

  const fetchMovies = async () => {
    setScreen('loading');
    const maxRuntimeMap: Record<string, number> = {
      'Under 90 min': 90,
      'Under 2 hours': 120,
      'Under 2.5 hours': 150,
      'Any length': 300,
    };

    const payload = {
      mood: answers.mood,
      genres: answers.genres.includes('Surprise me') ? [] : answers.genres,
      audience: answers.audience,
      maxRuntime: maxRuntimeMap[answers.maxRuntime] || 300,
      languages: answers.languages.includes('Any') || answers.languages.length === 0 ? [] : answers.languages,
      preferences: answers.preferences,
      note: answers.note,
      excludeIds,
    };

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMovies(data.movies);
      setExcludeIds([...excludeIds, ...data.movies.map((m: Movie) => m.id)]);
      setScreen('results');
    } catch {
      // Fallback to mock data for demo
      const mockMovies = getMockMovies(answers, excludeIds);
      setMovies(mockMovies);
      setExcludeIds([...excludeIds, ...mockMovies.map((m: Movie) => m.id)]);
      setScreen('results');
    }
  };

  const handleShowMore = () => {
    fetchMovies();
  };

  const handleStartOver = () => {
    setScreen('hero');
    setStep(0);
    setAnswers({
      mood: '',
      genres: [],
      audience: '',
      maxRuntime: '',
      languages: [],
      preferences: { highlyRated: false, hiddenGems: false, recent: false, classics: false, mature: false },
      note: '',
    });
    setExcludeIds([]);
    setMovies([]);
  };

  const updateAnswer = useCallback(<K extends keyof WizardAnswers>(key: K, value: WizardAnswers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const renderWizardStep = () => {
    switch (step) {
      case 0:
        return (
          <WizardStep
            question="What's your mood tonight?"
            options={MOODS}
            selected={answers.mood}
            multiSelect={false}
            onSelect={(val: string) => updateAnswer('mood', val)}
          />
        );
      case 1:
        return (
          <WizardStep
            question="Pick your genres (up to 3)"
            options={[...GENRES, 'Surprise me']}
            selected={answers.genres}
            multiSelect={true}
            maxSelect={3}
            onSelect={(val: string) => {
              if (val === 'Surprise me') {
                updateAnswer('genres', ['Surprise me']);
              } else {
                const current = answers.genres.filter((g: string) => g !== 'Surprise me');
                if (current.includes(val)) {
                  updateAnswer('genres', current.filter((g: string) => g !== val));
                } else if (current.length < 3) {
                  updateAnswer('genres', [...current, val]);
                }
              }
            }}
          />
        );
      case 2:
        return (
          <WizardStep
            question="Who's watching?"
            options={AUDIENCES}
            selected={answers.audience}
            multiSelect={false}
            onSelect={(val: string) => updateAnswer('audience', val)}
          />
        );
      case 3:
        return (
          <WizardStep
            question="How much time do you have?"
            options={TIMES}
            selected={answers.maxRuntime}
            multiSelect={false}
            onSelect={(val: string) => updateAnswer('maxRuntime', val)}
          />
        );
      case 4:
        return (
          <WizardStep
            question="What languages? (optional)"
            options={LANGUAGES}
            selected={answers.languages}
            multiSelect={true}
            maxSelect={9}
            onSelect={(val: string) => {
              if (val === 'Any') {
                updateAnswer('languages', ['Any']);
              } else {
                const current = answers.languages.filter((l: string) => l !== 'Any');
                if (current.includes(val)) {
                  updateAnswer('languages', current.filter((l: string) => l !== val));
                } else {
                  updateAnswer('languages', [...current, val]);
                }
              }
            }}
          />
        );
      case 5:
        return (
          <WizardStep
            question="Any preferences? (optional)"
            options={PREFERENCES}
            selected={Object.entries(answers.preferences).filter(([, v]) => v).map(([k]) => {
              const map: Record<string, string> = {
                highlyRated: 'Highly rated only (7+)',
                hiddenGems: 'Hidden gems',
                recent: 'Recent (last 5 years)',
                classics: 'Classics (before 2000)',
                mature: 'Include mature content',
              };
              return map[k];
            })}
            multiSelect={true}
            maxSelect={5}
            isToggle={true}
            onSelect={(val: string) => {
              const map: Record<string, keyof typeof answers.preferences> = {
                'Highly rated only (7+)': 'highlyRated',
                'Hidden gems': 'hiddenGems',
                'Recent (last 5 years)': 'recent',
                'Classics (before 2000)': 'classics',
                'Include mature content': 'mature',
              };
              const key = map[val];
              updateAnswer('preferences', { ...answers.preferences, [key]: !answers.preferences[key] });
            }}
          />
        );
      case 6:
        return (
          <WizardStep
            question="Anything else? (optional)"
            isTextInput={true}
            textValue={answers.note}
            onTextChange={(val: string) => updateAnswer('note', val.slice(0, 200))}
            placeholder="A movie you loved, or something to avoid..."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0A' }}>
      {/* Progress bar */}
      {screen === 'wizard' && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-[#141414] z-50">
          <div className="progress-bar h-full" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        {screen === 'hero' && <Hero onStart={handleStart} />}
        {screen === 'wizard' && (
          <div className="w-full max-w-2xl fade-in" key={step}>
            {renderWizardStep()}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handleBack}
                className="text-sm text-[#8C8C8C] hover:text-[#F5F5F5] transition-colors duration-200"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (step === 0 && !answers.mood) ||
                  (step === 1 && answers.genres.length === 0) ||
                  (step === 2 && !answers.audience) ||
                  (step === 3 && !answers.maxRuntime)
                }
                className="gradient-btn px-8 py-3 rounded-full text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              >
                {step === TOTAL_STEPS - 1 ? 'Find my movies' : 'Next'}
              </button>
            </div>
          </div>
        )}
        {screen === 'loading' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full loading-glow" style={{ background: 'linear-gradient(135deg, #E63946, #FF7A2F)' }} />
            <p className="text-[#8C8C8C] text-lg">Finding your perfect movies...</p>
          </div>
        )}
        {screen === 'results' && (
          <Results
            movies={movies}
            onShowMore={handleShowMore}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[#8C8C8C]">
        Movie data by TMDB
      </footer>
    </div>
  );
}
