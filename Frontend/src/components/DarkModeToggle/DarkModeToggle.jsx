import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('playgorithm-dark-mode');
        return saved !== null ? saved === 'true' : true; // Default to dark
    });

    // Helper function to darken colors for light mode
    const darkenColor = (color, amount) => {
        if (!color || color === '') return '#3c3c3c';
        
        // Remove # and any whitespace
        let hex = color.replace('#', '').trim();
        
        // Handle 3-digit hex codes
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        // Validate hex format
        if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
            console.warn('Invalid color format:', color);
            return '#3c3c3c'; // Fallback dark gray
        }
        
        // Parse RGB values
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        
        // Darken by reducing brightness significantly
        r = Math.floor(r * (1 - amount));
        g = Math.floor(g * (1 - amount));
        b = Math.floor(b * (1 - amount));
        
        // Ensure minimum darkness for visibility on white background
        // Colors should be dark enough to read (at least 40% darker)
        const minValue = 50;
        const maxValue = 120; // Cap maximum brightness for better contrast
        
        r = Math.min(maxValue, Math.max(minValue, r));
        g = Math.min(maxValue, Math.max(minValue, g));
        b = Math.min(maxValue, Math.max(minValue, b));
        
        // Convert back to hex
        const toHex = (n) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    useEffect(() => {
        localStorage.setItem('playgorithm-dark-mode', isDark);
        document.documentElement.setAttribute('data-dark-mode', isDark ? 'dark' : 'light');
        document.body.setAttribute('data-dark-mode', isDark ? 'dark' : 'light');
        
        const applyModeStyles = () => {
            // Get current theme colors
            const root = document.documentElement;
            const currentPrimary = getComputedStyle(root).getPropertyValue('--primary-color').trim();
            const currentSecondary = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
            const currentAccent = getComputedStyle(root).getPropertyValue('--accent-color').trim();
            
            // Apply dark/light mode styles
            if (isDark) {
                // Dark Mode - Premium dark theme with original colors
                root.style.setProperty('--dark-bg', '#0a0e1a');
                root.style.setProperty('--darker-bg', '#050810');
                root.style.setProperty('--card-bg', 'rgba(15, 20, 35, 0.95)');
                root.style.setProperty('--text-light', '#ffffff');
                root.style.setProperty('--text-muted', '#a0aec0');
                root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
                root.style.setProperty('--hover-bg', 'rgba(255, 255, 255, 0.05)');
                root.style.setProperty('--input-bg', 'rgba(0, 0, 0, 0.4)');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
                
                // Restore original theme colors if they were saved
                const originalPrimary = root.style.getPropertyValue('--primary-color-original');
                const originalSecondary = root.style.getPropertyValue('--secondary-color-original');
                const originalAccent = root.style.getPropertyValue('--accent-color-original');
                
                if (originalPrimary && originalPrimary !== '') {
                    root.style.setProperty('--primary-color', originalPrimary);
                    root.style.setProperty('--secondary-color', originalSecondary);
                    root.style.setProperty('--accent-color', originalAccent);
                }
            } else {
                // Light Mode - Use darker versions of theme colors for visibility
                root.style.setProperty('--dark-bg', '#ffffff');
                root.style.setProperty('--darker-bg', '#f8fafc');
                root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.98)');
                root.style.setProperty('--text-light', '#0f172a');
                root.style.setProperty('--text-muted', '#475569');
                root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.12)');
                root.style.setProperty('--hover-bg', 'rgba(0, 0, 0, 0.04)');
                root.style.setProperty('--input-bg', 'rgba(248, 250, 252, 0.95)');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
                
                // Only save and darken if we haven't already saved the originals
                const alreadySaved = root.style.getPropertyValue('--primary-color-original');
                
                if (!alreadySaved || alreadySaved === '') {
                    // Save original colors
                    root.style.setProperty('--primary-color-original', currentPrimary);
                    root.style.setProperty('--secondary-color-original', currentSecondary);
                    root.style.setProperty('--accent-color-original', currentAccent);
                }
                
                // Always apply darkened versions in light mode
                const primaryToUse = alreadySaved && alreadySaved !== '' ? alreadySaved : currentPrimary;
                const secondaryToUse = root.style.getPropertyValue('--secondary-color-original') || currentSecondary;
                const accentToUse = root.style.getPropertyValue('--accent-color-original') || currentAccent;
                
                root.style.setProperty('--primary-color', darkenColor(primaryToUse, 0.6));
                root.style.setProperty('--secondary-color', darkenColor(secondaryToUse, 0.6));
                root.style.setProperty('--accent-color', darkenColor(accentToUse, 0.6));
            }
        };

        applyModeStyles();

        // Listen for theme changes and reapply mode styles
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    // Small delay to ensure theme colors are applied first
                    setTimeout(applyModeStyles, 50);
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, [isDark]);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
    };

    return (
        <button 
            className="dark-mode-toggle cursor-target"
            onClick={toggleDarkMode}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDark ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default DarkModeToggle;
