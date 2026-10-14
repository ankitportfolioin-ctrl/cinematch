interface WizardStepProps {
  question: string;
  options?: string[];
  selected?: string | string[];
  multiSelect?: boolean;
  maxSelect?: number;
  onSelect?: (value: string) => void;
  isTextInput?: boolean;
  textValue?: string;
  onTextChange?: (value: string) => void;
  placeholder?: string;
  isToggle?: boolean;
}

export default function WizardStep({
  question,
  options = [],
  selected = [],
  multiSelect = false,
  onSelect,
  isTextInput = false,
  textValue = '',
  onTextChange,
  placeholder = '',
  isToggle = false,
}: WizardStepProps) {
  const isSelected = (option: string): boolean => {
    if (Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  return (
    <div className="fade-in">
      <h2
        className="text-2xl md:text-3xl font-bold mb-2 text-center"
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        {question}
      </h2>
      
      {!isTextInput && !isToggle && (
        <p className="text-center text-[#8C8C8C] text-sm mb-8">
          {multiSelect ? 'Select up to 3' : 'Choose one'}
        </p>
      )}
      {isToggle && (
        <p className="text-center text-[#8C8C8C] text-sm mb-8">
          Tap to toggle on/off
        </p>
      )}

      {isTextInput ? (
        <div className="max-w-md mx-auto">
          <textarea
            value={textValue}
            onChange={(e) => onTextChange?.(e.target.value)}
            placeholder={placeholder}
            maxLength={200}
            rows={3}
            className="w-full bg-[#141414] border border-[#232323] rounded-2xl px-5 py-4 text-[#F5F5F5] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF7A2F] transition-colors duration-200 resize-none text-base"
          />
          <p className="text-right text-xs text-[#8C8C8C] mt-2">
            {textValue.length}/200
          </p>
          <p className="text-center text-[#8C8C8C] text-xs mt-4">
            You can skip this and go to the next step.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect?.(option)}
              className={`
                px-5 py-3 rounded-full text-sm md:text-base font-medium
                transition-all duration-200 cursor-pointer select-none
                ${isSelected(option)
                  ? 'chip-selected text-[#FF7A2F]'
                  : isToggle
                    ? 'toggle-chip border border-[#232323] bg-[#141414] text-[#8C8C8C] hover:text-[#F5F5F5] hover:border-[#FF7A2F]'
                    : 'chip text-[#F5F5F5] hover:text-[#FF7A2F]'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
