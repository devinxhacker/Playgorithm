import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette, FaCog } from 'react-icons/fa';
import { useSettings, THEMES } from '../../context/SettingsContext';
import './ThemeIndicator.css';

const ThemeIndicator = ({ onOpenSettings }) => {
    const { settings, changeTheme } = useSettings();
    const [showThemePicker, setShowThemePicker] = useState(false);

    const currentTheme = THEMES[settings.theme] || THEMES.default;
    const themes = Object.values(THEMES);

    return (
        <div className="theme-indicator">
            <button 
                className="theme-indicator-btn cursor-target"
                onClick={() => setShowThemePicker(!showThemePicker)}
                title={`Current Theme: ${currentTheme.name}`}
            >
                <FaPalette />
            </button>

            <AnimatePresence>
                {showThemePicker && (
                    <motion.div
                        className="theme-picker-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="theme-picker-header">
                            <h3>Choose Theme</h3>
                            <button 
                                className="settings-link cursor-target"
                                onClick={() => {
                                    setShowThemePicker(false);
                                    onOpenSettings?.();
                                }}
                                title="Open Full Settings"
                            >
                                <FaCog /> More Settings
                            </button>
                        </div>
                        
                        <div className="theme-grid">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    className={`theme-option cursor-target ${settings.theme === theme.id ? 'active' : ''}`}
                                    onClick={() => {
                                        changeTheme(theme.id);
                                        setShowThemePicker(false);
                                    }}
                                >
                                    <div className="theme-preview">
                                        <div 
                                            className="theme-color-primary" 
                                            style={{ background: theme.primary }}
                                        />
                                        <div 
                                            className="theme-color-secondary" 
                                            style={{ background: theme.secondary }}
                                        />
                                        <div 
                                            className="theme-color-accent" 
                                            style={{ background: theme.accent }}
                                        />
                                    </div>
                                    <span className="theme-option-name">{theme.name}</span>
                                    {settings.theme === theme.id && (
                                        <div className="theme-active-badge">✓</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showThemePicker && (
                <div 
                    className="theme-picker-overlay"
                    onClick={() => setShowThemePicker(false)}
                />
            )}
        </div>
    );
};

export default ThemeIndicator;
