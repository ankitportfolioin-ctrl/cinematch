interface AmbiguousTitle {
  originalQuery: string;
  bestMatch: {
    id: number;
    title: string;
    year: number | null;
  };
  alternatives: Array<{
    id: number;
    title: string;
    year: number | null;
  }>;
}

interface TitleDisambiguationProps {
  ambiguousTitles: AmbiguousTitle[];
  onConfirm: (selections: Record<string, number>) => void;
  onCancel: () => void;
}

export default function TitleDisambiguation({ 
  ambiguousTitles, 
  onConfirm, 
  onCancel 
}: TitleDisambiguationProps) {
  const handleConfirm = () => {
    // For now, just use the best match for each ambiguous title
    // In a more sophisticated implementation, we'd let the user choose
    const selections: Record<string, number> = {};
    ambiguousTitles.forEach(t => {
      selections[t.originalQuery] = t.bestMatch.id;
    });
    onConfirm(selections);
  };

  return (
    <div className="w-full max-w-2xl fade-in">
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          We found multiple matches
        </h3>
        <p className="text-[#8C8C8C] mb-6">
          Some titles you mentioned have multiple versions. We've selected the most likely match, but you can review them below.
        </p>
        
        <div className="space-y-4">
          {ambiguousTitles.map((title, idx) => (
            <div key={idx} className="bg-[#1a1a1a] rounded-xl p-4">
              <p className="text-sm text-[#8C8C8C] mb-2">You mentioned: "{title.originalQuery}"</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-[#F5F5F5]">
                    {title.bestMatch.title}
                    {title.bestMatch.year && <span className="text-[#8C8C8C] font-normal"> ({title.bestMatch.year})</span>}
                  </p>
                  <p className="text-xs text-[#FF7A2F] mt-1">✓ Selected as best match</p>
                </div>
              </div>
              
              {title.alternatives.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#232323]">
                  <p className="text-xs text-[#8C8C8C] mb-2">Other possibilities:</p>
                  <div className="space-y-1">
                    {title.alternatives.map((alt, altIdx) => (
                      <p key={altIdx} className="text-sm text-[#8C8C8C]">
                        • {alt.title}
                        {alt.year && <span> ({alt.year})</span>}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleConfirm}
            className="gradient-btn px-6 py-2 rounded-full text-white font-medium flex-1"
          >
            Continue with these matches
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-full text-[#8C8C8C] border border-[#232323] hover:border-[#FF7A2F] hover:text-[#F5F5F5] transition-all duration-200"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
