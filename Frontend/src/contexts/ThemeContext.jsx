import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme configurations
const themes = {
  playgorithm: {
    id: 'playgorithm',
    name: 'Playgorithm',
    description: 'Default gaming theme with vibrant colors',
    colors: {
      background: '#0a0a0f',
      panel: '#1a1a2e',
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4ade80',
      text: '#e0e0e0',
      textSecondary: '#a0a0a0',
      border: '#2d3e50',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  
  cyberNeon: {
    id: 'cyberNeon',
    name: 'Cyber Neon',
    description: 'Futuristic neon cyberpunk theme',
    colors: {
      background: '#0d0221',
      panel: '#1a0b2e',
      primary: '#ff006e',
      secondary: '#8338ec',
      accent: '#00f5ff',
      text: '#f0f0f0',
      textSecondary: '#b0b0b0',
      border: '#3d2e5e',
      success: '#06ffa5',
      warning: '#ffbe0b',
      error: '#ff006e',
      info: '#8338ec',
    }
  },

  oceanBreeze: {
    id: 'oceanBreeze',
    name: 'Ocean Breeze',
    description: 'Calm ocean blues with turquoise accents',
    colors: {
      background: '#0a1520',
      panel: '#152535',
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#6dd4c4',
      text: '#dce3e8',
      textSecondary: '#8a95a3',
      border: '#1e3a52',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },

  sunsetGlow: {
    id: 'sunsetGlow',
    name: 'Sunset Glow',
    description: 'Warm sunset oranges and purples',
    colors: {
      background: '#1a0e2e',
      panel: '#2d1b4e',
      primary: '#ff6b9d',
      secondary: '#ffa07a',
      accent: '#ffd700',
      text: '#ffeef8',
      textSecondary: '#d4a5d4',
      border: '#3d2b5e',
      success: '#66bb6a',
      warning: '#ffb74d',
      error: '#ef5350',
      info: '#ab47bc',
    }
  },

  forestMist: {
    id: 'forestMist',
    name: 'Forest Mist',
    description: 'Natural greens with earthy tones',
    colors: {
      background: '#0d1f1a',
      panel: '#1a2f2a',
      primary: '#4ecca3',
      secondary: '#66d9a8',
      accent: '#a8e6cf',
      text: '#e8f5e9',
      textSecondary: '#a5d6a7',
      border: '#2d4f3a',
      success: '#66bb6a',
      warning: '#ffb74d',
      error: '#ef5350',
      info: '#26a69a',
    }
  },

  midnightPurple: {
    id: 'midnightPurple',
    name: 'Midnight Purple',
    description: 'Deep purples with aurora-like accents',
    colors: {
      background: '#0f0a1e',
      panel: '#1a1333',
      primary: '#b794f6',
      secondary: '#9f7aea',
      accent: '#e879f9',
      text: '#f3e8ff',
      textSecondary: '#d6bcfa',
      border: '#2d1f4e',
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#4299e1',
    }
  },
};

// Typography configurations
const typographies = {
  default: {
    id: 'default',
    name: 'Default (Rajdhani & Orbitron)',
    description: 'Gaming-focused fonts',
    fonts: {
      primary: "'Rajdhani', sans-serif",
      display: "'Orbitron', sans-serif",
      mono: "'Courier New', monospace"
    }
  },

  modern: {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Inter & Space Grotesk - Clean and professional',
    fonts: {
      primary: "'Inter', sans-serif",
      display: "'Space Grotesk', sans-serif",
      mono: "'JetBrains Mono', monospace"
    },
    googleFonts: [
      'Inter:wght@400;500;600;700',
      'Space+Grotesk:wght@400;500;600;700',
      'JetBrains+Mono:wght@400;500;600'
    ]
  },

  elegant: {
    id: 'elegant',
    name: 'Elegant Classic',
    description: 'Playfair Display & Poppins',
    fonts: {
      primary: "'Poppins', sans-serif",
      display: "'Playfair Display', serif",
      mono: "'Fira Code', monospace"
    },
    googleFonts: [
      'Poppins:wght@400;500;600;700',
      'Playfair+Display:wght@400;500;600;700;800',
      'Fira+Code:wght@400;500;600'
    ]
  },

  tech: {
    id: 'tech',
    name: 'Tech Forward',
    description: 'Chakra Petch & Exo - Futuristic',
    fonts: {
      primary: "'Chakra Petch', sans-serif",
      display: "'Exo', sans-serif",
      mono: "'Share Tech Mono', monospace"
    },
    googleFonts: [
      'Chakra+Petch:wght@400;500;600;700',
      'Exo:wght@400;500;600;700;800',
      'Share+Tech+Mono'
    ]
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'DM Sans & Lora',
    fonts: {
      primary: "'DM Sans', sans-serif",
      display: "'Lora', serif",
      mono: "'IBM Plex Mono', monospace"
    },
    googleFonts: [
      'DM+Sans:wght@400;500;600;700',
      'Lora:wght@400;500;600;700',
      'IBM+Plex+Mono:wght@400;500;600'
    ]
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('playgorithm-theme') || 'playgorithm';
  });

  const [currentTypography, setCurrentTypography] = useState(() => {
    return localStorage.getItem('playgorithm-typography') || 'default';
  });

  // Apply theme colors
  const applyTheme = (themeId) => {
    const theme = themes[themeId] || themes.playgorithm;
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  // Apply typography
  const applyTypography = (typographyId) => {
    const typography = typographies[typographyId] || typographies.default;
    const root = document.documentElement;

    root.style.setProperty('--font-primary', typography.fonts.primary);
    root.style.setProperty('--font-display', typography.fonts.display);
    root.style.setProperty('--font-mono', typography.fonts.mono);

    // Load Google Fonts if needed
    if (typography.googleFonts) {
      const existingLink = document.getElementById('typography-fonts');
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement('link');
      link.id = 'typography-fonts';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${typography.googleFonts.map(font => `family=${font}`).join('&')}&display=swap`;
      document.head.appendChild(link);
    }
  };

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem('playgorithm-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    applyTypography(currentTypography);
    localStorage.setItem('playgorithm-typography', currentTypography);
  }, [currentTypography]);

  const value = {
    currentTheme,
    currentTypography,
    themes,
    typographies,
    changeTheme: setCurrentTheme,
    changeTypography: setCurrentTypography,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
