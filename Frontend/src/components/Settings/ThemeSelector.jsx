import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCheck } from 'react-icons/fa';

const ThemeSelector = () => {
  const { currentTheme, themes, changeTheme } = useTheme();

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-text font-display">
        Choose Your Theme
      </h3>
      <p className="text-sm mb-6 text-text/60">
        Select a color theme that matches your style
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(themes).map((theme) => (
          <div
            key={theme.id}
            onClick={() => changeTheme(theme.id)}
            className={`relative cursor-pointer rounded-xl p-4 transition-all duration-300 bg-background border ${
              currentTheme === theme.id
                ? 'border-cta shadow-lg shadow-cta/20'
                : 'border-border hover:border-cta/40'
            }`}
          >
            {/* Selected indicator */}
            {currentTheme === theme.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-cta">
                <FaCheck />
              </div>
            )}

            {/* Theme preview colors */}
            <div className="flex gap-2 mb-3">
              {Object.entries(theme.colors).slice(0, 6).map(([key, color]) => (
                <div
                  key={key}
                  className="w-8 h-8 rounded-lg shadow-md"
                  style={{ background: color }}
                />
              ))}
            </div>

            <h4 className="font-bold mb-1 text-text">{theme.name}</h4>
            <p className="text-xs text-text/60">{theme.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
