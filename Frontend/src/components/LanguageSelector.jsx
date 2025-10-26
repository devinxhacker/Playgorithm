import React, { useState, useEffect } from 'react';
import './LanguageSelector.css';

const LanguageSelector = ({ onLanguageChange, selectedLanguage = 'cpp' }) => {
  const [languages, setLanguages] = useState([]);
  const [languageDetails, setLanguageDetails] = useState({});

  useEffect(() => {
    // Fetch supported languages from backend
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/games/languages/info');
      const data = await response.json();
      setLanguages(data.supportedLanguages || []);
      setLanguageDetails(data.languageDetails || {});
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Fallback to default languages
      setLanguages(['cpp', 'cpp17', 'cpp20', 'java', 'python3', 'javascript', 'c']);
      setLanguageDetails({
        cpp: { displayName: 'C++', version: 'g++ 9.4.0' },
        cpp17: { displayName: 'C++17', version: 'g++ 9.4.0' },
        cpp20: { displayName: 'C++20', version: 'g++ 10.3.0' },
        java: { displayName: 'Java', version: 'OpenJDK 11' },
        python3: { displayName: 'Python 3', version: 'Python 3.9' },
        javascript: { displayName: 'JavaScript', version: 'Node.js 16' },
        c: { displayName: 'C', version: 'gcc 9.4.0' }
      });
    }
  };

  const handleLanguageChange = (language) => {
    onLanguageChange(language);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="language-label">
        Programming Language:
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="language-dropdown cursor-target"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {languageDetails[lang]?.displayName || lang.toUpperCase()} 
            {languageDetails[lang]?.version && ` (${languageDetails[lang].version})`}
          </option>
        ))}
      </select>
      
      {languageDetails[selectedLanguage]?.description && (
        <div className="language-info">
          <small>{languageDetails[selectedLanguage].description}</small>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;