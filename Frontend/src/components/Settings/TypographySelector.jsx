import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCheck, FaFont } from 'react-icons/fa';

const TypographySelector = () => {
  const { currentTypography, typographies, changeTypography } = useTheme();

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text font-display">
        <FaFont /> Choose Your Typography
      </h3>
      <p className="text-sm mb-6 text-text/60">
        Select a font style that enhances your reading experience
      </p>

      <div className="grid grid-cols-1 gap-4">
        {Object.values(typographies).map((typography) => (
          <div
            key={typography.id}
            onClick={() => changeTypography(typography.id)}
            className={`relative cursor-pointer rounded-xl p-5 transition-all duration-300 bg-background border ${
              currentTypography === typography.id
                ? 'border-accent shadow-lg shadow-accent/20'
                : 'border-border hover:border-accent/40'
            }`}
          >
            {/* Selected indicator */}
            {currentTypography === typography.id && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-accent">
                <FaCheck />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-cta/10">
                <FaFont className="text-xl text-cta" />
              </div>

              <div className="flex-1">
                <h4 
                  className="font-bold mb-1 text-lg text-text"
                  style={{ fontFamily: typography.fonts.display }}
                >
                  {typography.name}
                </h4>
                <p 
                  className="text-sm mb-3 text-text/60"
                  style={{ fontFamily: typography.fonts.primary }}
                >
                  {typography.description}
                </p>

                {/* Font preview */}
                <div className="p-3 rounded-lg text-sm bg-panel border border-border">
                  <p 
                    className="mb-2 text-text"
                    style={{ fontFamily: typography.fonts.display }}
                  >
                    Display: The quick brown fox jumps
                  </p>
                  <p 
                    className="text-text/60"
                    style={{ fontFamily: typography.fonts.primary }}
                  >
                    Body: The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypographySelector;
