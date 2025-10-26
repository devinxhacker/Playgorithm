import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import './CodeEditor.css';

const CodeEditor = ({ gameId, onCodeChange, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gameId && selectedLanguage) {
      fetchStarterCode();
    }
  }, [gameId, selectedLanguage]);

  const fetchStarterCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/starter-code/${selectedLanguage}`);
      const data = await response.json();
      
      if (data.starterCode) {
        setCode(data.starterCode);
        onCodeChange && onCodeChange(data.starterCode);
      }
    } catch (error) {
      console.error('Error fetching starter code:', error);
      // Fallback starter code based on language
      const fallbackCode = getFallbackStarterCode(selectedLanguage);
      setCode(fallbackCode);
      onCodeChange && onCodeChange(fallbackCode);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackStarterCode = (language) => {
    const templates = {
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`,
      cpp17: `#include <iostream>
#include <vector>
#include <algorithm>
#include <optional>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your C++17 code here
    
    return 0;
}`,
      cpp20: `#include <iostream>
#include <vector>
#include <algorithm>
#include <ranges>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your C++20 code here
    
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Your Java code here
        
        scanner.close();
    }
}`,
      python3: `# Python 3 template
def main():
    # Your Python code here
    pass

if __name__ == "__main__":
    main()`,
      javascript: `// JavaScript (Node.js) template
function main() {
    // Your JavaScript code here
}

main();`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Your C code here
    
    return 0;
}`
    };
    
    return templates[language] || templates.cpp;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    onLanguageChange && onLanguageChange(language);
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange && onCodeChange(newCode);
  };

  const getLanguageForSyntaxHighlighting = (language) => {
    const mapping = {
      cpp: 'cpp',
      cpp17: 'cpp',
      cpp20: 'cpp',
      c: 'c',
      java: 'java',
      python: 'python',
      python3: 'python',
      javascript: 'javascript'
    };
    return mapping[language] || 'text';
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        <div className="editor-actions">
          <button 
            className="btn-secondary"
            onClick={fetchStarterCode}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reset Code'}
          </button>
        </div>
      </div>

      <div className="editor-container">
        <textarea
          className={`code-textarea language-${getLanguageForSyntaxHighlighting(selectedLanguage)}`}
          value={code}
          onChange={handleCodeChange}
          placeholder={`Write your ${selectedLanguage.toUpperCase()} code here...`}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        
        {loading && (
          <div className="editor-loading">
            <div className="loading-spinner"></div>
            <span>Loading starter code...</span>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <div className="editor-info">
          <span className="language-badge">
            {selectedLanguage.toUpperCase()}
          </span>
          <span className="char-count">
            {code.length} characters
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;