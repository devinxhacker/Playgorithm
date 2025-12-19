import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const SettingsContext = createContext(null);

// Theme definitions with proper color palettes
export const THEMES = {
    default: {
        id: 'default',
        name: 'Playgorithm Default',
        primary: '#00ff88',
        secondary: '#ff0080',
        accent: '#00d4ff',
        background: '#0a0a0a',
        cardBg: 'rgba(15, 15, 15, 0.9)',
        textLight: '#ffffff',
        textMuted: '#b0b0b0',
    },
    cyberNeon: {
        id: 'cyberNeon',
        name: 'Cyber Neon',
        primary: '#00f3ff',
        secondary: '#bc13fe',
        accent: '#ff0080',
        background: '#0a0e1a',
        cardBg: 'rgba(15, 20, 35, 0.9)',
        textLight: '#ffffff',
        textMuted: '#b0b0b0',
    },
    synthwave: {
        id: 'synthwave',
        name: 'Synthwave',
        primary: '#ff00ff',
        secondary: '#00ffff',
        accent: '#ffff00',
        background: '#1a0033',
        cardBg: 'rgba(30, 0, 60, 0.9)',
        textLight: '#ffffff',
        textMuted: '#cc99ff',
    },
    matrixGreen: {
        id: 'matrixGreen',
        name: 'Matrix Green',
        primary: '#00ff41',
        secondary: '#00cc33',
        accent: '#39ff14',
        background: '#000000',
        cardBg: 'rgba(0, 20, 0, 0.9)',
        textLight: '#00ff41',
        textMuted: '#008f11',
    },
    cyberpunkYellow: {
        id: 'cyberpunkYellow',
        name: 'Cyberpunk Yellow',
        primary: '#fcee0a',
        secondary: '#00f0ff',
        accent: '#ff2a6d',
        background: '#0d1117',
        cardBg: 'rgba(20, 25, 35, 0.9)',
        textLight: '#ffffff',
        textMuted: '#a0a0a0',
    },
    deepPurple: {
        id: 'deepPurple',
        name: 'Deep Purple',
        primary: '#7b61ff',
        secondary: '#ff6b9d',
        accent: '#00d4ff',
        background: '#0a0e27',
        cardBg: 'rgba(15, 20, 45, 0.9)',
        textLight: '#ffffff',
        textMuted: '#b8b8ff',
    },
    toxicGreen: {
        id: 'toxicGreen',
        name: 'Toxic Green',
        primary: '#39ff14',
        secondary: '#00ff9d',
        accent: '#adff2f',
        background: '#0a1a0a',
        cardBg: 'rgba(10, 30, 10, 0.9)',
        textLight: '#ffffff',
        textMuted: '#90ee90',
    },
    electricBlue: {
        id: 'electricBlue',
        name: 'Electric Blue',
        primary: '#00d4ff',
        secondary: '#0080ff',
        accent: '#00ffff',
        background: '#0a1420',
        cardBg: 'rgba(10, 25, 40, 0.9)',
        textLight: '#ffffff',
        textMuted: '#87ceeb',
    },
    hotPink: {
        id: 'hotPink',
        name: 'Hot Pink',
        primary: '#ff1493',
        secondary: '#ff69b4',
        accent: '#ff00ff',
        background: '#1a0a14',
        cardBg: 'rgba(30, 10, 25, 0.9)',
        textLight: '#ffffff',
        textMuted: '#ffb6c1',
    },
    fireOrange: {
        id: 'fireOrange',
        name: 'Fire Orange',
        primary: '#ff6600',
        secondary: '#ff9500',
        accent: '#ffcc00',
        background: '#1a0f00',
        cardBg: 'rgba(30, 20, 0, 0.9)',
        textLight: '#ffffff',
        textMuted: '#ffb380',
    },
};

// Font definitions
export const FONTS = {
    orbitron: {
        id: 'orbitron',
        name: 'Orbitron',
        category: 'Gaming',
        family: "'Orbitron', sans-serif",
        import: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&display=swap',
    },
    rajdhani: {
        id: 'rajdhani',
        name: 'Rajdhani',
        category: 'Gaming',
        family: "'Rajdhani', sans-serif",
        import: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap',
    },
    pressStart: {
        id: 'pressStart',
        name: 'Press Start 2P',
        category: 'Retro',
        family: "'Press Start 2P', cursive",
        import: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
    },
    exo2: {
        id: 'exo2',
        name: 'Exo 2',
        category: 'Futuristic',
        family: "'Exo 2', sans-serif",
        import: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&display=swap',
    },
    audiowide: {
        id: 'audiowide',
        name: 'Audiowide',
        category: 'Tech',
        family: "'Audiowide', cursive",
        import: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    },
    saira: {
        id: 'saira',
        name: 'Saira',
        category: 'Modern',
        family: "'Saira', sans-serif",
        import: 'https://fonts.googleapis.com/css2?family=Saira:wght@300;400;500;600;700&display=swap',
    },
    spaceMono: {
        id: 'spaceMono',
        name: 'Space Mono',
        category: 'Monospace',
        family: "'Space Mono', monospace",
        import: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
    },
    roboto: {
        id: 'roboto',
        name: 'Roboto',
        category: 'Clean',
        family: "'Roboto', sans-serif",
        import: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap',
    },
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('playgorithm_settings');
        return savedSettings ? JSON.parse(savedSettings) : {
            theme: 'default',
            sound: {
                masterVolume: 0.5,
                musicVolume: 0.5,
                sfxVolume: 0.8,
                enabled: true,
            },
            typography: {
                fontSize: 'medium',
                fontFamily: 'rajdhani',
            }
        };
    });

    useEffect(() => {
        localStorage.setItem('playgorithm_settings', JSON.stringify(settings));
        applyTheme(settings.theme);
        applyTypography(settings.typography);
    }, [settings]);

    const updateSettings = (section, key, value) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const updateFullSection = (section, data) => {
        setSettings((prev) => ({
            ...prev,
            [section]: data,
        }));
    }

    const changeTheme = (themeName) => {
        setSettings((prev) => ({ ...prev, theme: themeName }));
    };

    const applyTheme = (themeId) => {
        const theme = THEMES[themeId] || THEMES.default;
        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--dark-bg', theme.background);
        root.style.setProperty('--darker-bg', theme.background);
        root.style.setProperty('--card-bg', theme.cardBg);
        root.style.setProperty('--text-light', theme.textLight);
        root.style.setProperty('--text-muted', theme.textMuted);
        
        // Use solid colors for all themes (no gradients)
        root.style.setProperty('--gradient-primary', theme.primary);
        root.style.setProperty('--gradient-secondary', theme.secondary);
        
        root.style.setProperty('--neon-glow', `0 0 20px ${theme.primary}40`);
        root.style.setProperty('--neon-glow-pink', `0 0 20px ${theme.secondary}40`);
        
        // Add theme class to body for additional styling if needed
        document.body.setAttribute('data-theme', themeId);
    };

    const applyTypography = (typography) => {
        const root = document.documentElement;
        const font = FONTS[typography.fontFamily] || FONTS.rajdhani;

        // Load font if not already loaded
        const existingLink = document.querySelector(`link[href="${font.import}"]`);
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = font.import;
            document.head.appendChild(link);
        }

        // For headings, use Orbitron if available, otherwise use selected font
        const headingFont = typography.fontFamily === 'orbitron' ? font.family : 
                           (FONTS.orbitron ? FONTS.orbitron.family : font.family);

        // Apply font family to CSS variables
        root.style.setProperty('--font-primary', font.family);
        root.style.setProperty('--font-body', font.family);
        root.style.setProperty('--font-heading', headingFont);
        
        // Apply directly to body
        document.body.style.fontFamily = font.family;
        
        // Apply font size with responsive scaling
        const baseFontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
        };
        
        // Get base font size
        const baseFontSize = baseFontSizes[typography.fontSize] || baseFontSizes.medium;
        root.style.fontSize = baseFontSize;
        
        // Apply responsive scaling for mobile devices
        const applyResponsiveFontSize = () => {
            const width = window.innerWidth;
            let scaledSize = baseFontSize;
            
            if (width <= 375) {
                // Extra small devices
                scaledSize = typography.fontSize === 'small' ? '13px' : 
                            typography.fontSize === 'large' ? '16px' : '14px';
            } else if (width <= 576) {
                // Small devices
                scaledSize = typography.fontSize === 'small' ? '13px' : 
                            typography.fontSize === 'large' ? '17px' : '15px';
            } else if (width <= 768) {
                // Tablets
                scaledSize = typography.fontSize === 'small' ? '14px' : 
                            typography.fontSize === 'large' ? '17px' : '15px';
            }
            
            root.style.fontSize = scaledSize;
        };
        
        applyResponsiveFontSize();
        
        // Update on window resize
        const resizeHandler = () => applyResponsiveFontSize();
        window.removeEventListener('resize', resizeHandler);
        window.addEventListener('resize', resizeHandler);
        
        // Force update by adding a data attribute
        root.setAttribute('data-font', typography.fontFamily);
        root.setAttribute('data-font-size', typography.fontSize);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, changeTheme, updateFullSection }}>
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};
