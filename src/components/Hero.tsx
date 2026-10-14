interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-lg relative fade-in">
      {/* Decorative background glows */}
      <div
        className="absolute w-80 h-80 rounded-full opacity-[0.07] blur-[100px] -top-20"
        style={{ background: 'linear-gradient(135deg, #E63946, #FF7A2F)' }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-[0.05] blur-[80px] top-32 right-0"
        style={{ background: '#FF7A2F' }}
      />
      
      {/* Film icon */}
      <div className="mb-6 text-5xl">🎬</div>
      
      <h1
        className="text-4xl md:text-6xl font-bold mb-4 relative z-10 leading-tight"
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        Movie Night{' '}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #E63946, #FF7A2F)' }}
        >
          Picker
        </span>
      </h1>
      
      <p className="text-[#8C8C8C] text-lg md:text-xl mb-10 leading-relaxed relative z-10">
        Tell us your vibe. We'll pick tonight's movie.
      </p>
      
      <button
        onClick={onStart}
        className="gradient-btn px-10 py-4 rounded-full text-white text-lg font-semibold relative z-10"
      >
        Start
      </button>
      
      {/* Subtle hint */}
      <p className="text-[#8C8C8C] text-xs mt-16 opacity-50">
        7 quick questions · 3 perfect picks
      </p>
    </div>
  );
}
