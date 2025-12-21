import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { gameAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaClock, FaCode, FaTrophy, FaPlay, FaRedo, FaCheckCircle, FaTimesCircle, FaFlask, FaClipboardList, FaTerminal } from "react-icons/fa";
import LanguageSelector from "../components/LanguageSelector";
import "./GameArena.css";

const GameArena = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [game, setGame] = useState(null);
  const [session, setSession] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStarterCode, setLoadingStarterCode] = useState(false);
  const [runningTests, setRunningTests] = useState(false);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  useEffect(() => {
    if (timeLeft > 0 && isRunning) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRunning) {
      handleTimeUp();
    }
  }, [timeLeft, isRunning]);

  const loadGame = async () => {
    try {
      const gameResponse = await gameAPI.getGameById(gameId);
      setGame(gameResponse.data);
      setTimeLeft(gameResponse.data.timeLimit);

      // Load starter code for default language
      await loadStarterCode(language);

      const sessionResponse = await gameAPI.startGame(gameId);
      setSession(sessionResponse.data);
      setIsRunning(true);
      setLoading(false);
    } catch (error) {
      console.error("Error loading game:", error);
      setLoading(false);
    }
  };

  const loadStarterCode = async (selectedLanguage) => {
    setLoadingStarterCode(true);
    try {
      const response = await fetch(`/api/games/${gameId}/starter-code/${selectedLanguage}`);
      const data = await response.json();
      
      if (data.starterCode) {
        setCode(data.starterCode);
      } else {
        // Fallback to default starter code
        setCode(getFallbackStarterCode(selectedLanguage));
      }
    } catch (error) {
      console.error("Error loading starter code:", error);
      // Fallback to default starter code
      setCode(getFallbackStarterCode(selectedLanguage));
    } finally {
      setLoadingStarterCode(false);
    }
  };

  const getFallbackStarterCode = (selectedLanguage) => {
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
    
    return templates[selectedLanguage] || templates.cpp;
  };

  const handleTimeUp = () => {
    setIsRunning(false);
    alert("Time's up! Your game session has ended.");
    navigate("/dashboard");
  };

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    await loadStarterCode(newLanguage);
  };

  const resetCode = async () => {
    if (confirm("Are you sure you want to reset your code? This will restore the original starter code.")) {
      await loadStarterCode(language);
    }
  };

  const getMonacoLanguage = (language) => {
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
    return mapping[language] || 'cpp';
  };

  const runCode = async () => {
    if (!code.trim()) {
      alert("Please write some code before running tests!");
      return;
    }

    // Show loading state
    setRunningTests(true);
    setTestResults([]);
    
    // Simulate test execution (in production, this would call a code execution API)
    setTimeout(() => {
      const results = game.testCases.map((testCase, index) => {
        const passed = Math.random() > 0.4; // 60% pass rate for demo
        const actualOutput = passed 
          ? testCase.expectedOutput 
          : generateIncorrectOutput(testCase.expectedOutput, index);
        
        return {
          testCaseNumber: index + 1,
          passed,
          actualOutput,
          expectedOutput: testCase.expectedOutput,
          executionTime: Math.floor(Math.random() * 150) + 25,
          input: testCase.input,
          memoryUsed: Math.floor(Math.random() * 50) + 10,
          compilationTime: Math.floor(Math.random() * 500) + 100,
        };
      });
      setTestResults(results);
      setRunningTests(false);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.querySelector('.test-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }, 2000);
  };

  const generateIncorrectOutput = (expectedOutput, index) => {
    // Generate realistic incorrect outputs for demo
    const incorrectOutputs = [
      "null",
      "undefined", 
      "0",
      "-1",
      "[]",
      "Error: Index out of bounds",
      "Compilation Error",
      expectedOutput.replace(/\d+/g, (match) => String(parseInt(match) + 1)),
      expectedOutput.split('').reverse().join(''),
    ];
    return incorrectOutputs[index % incorrectOutputs.length];
  };

  const submitCode = async () => {
    try {
      const response = await gameAPI.submitGame({
        gameId,
        sessionId: session.id,
        code,
        language,
        xpEarned: 50,
        won: true
      });

      if (response.data.success) {
        // Update user with stats from backend response
        updateUser({
          ...user,
          totalXP: response.data.totalXP,
          level: response.data.level,
          gamesPlayed: response.data.gamesPlayed,
          gamesWon: response.data.gamesWon,
          winRate: response.data.winRate
        });

        alert(`Congratulations! You earned ${response.data.xpEarned} XP!`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="game-arena-loading">
        <div className="spinner"></div>
        <p>Loading Game...</p>
      </div>
    );
  }

  return (
    <div className="game-arena">
      <div className="game-arena-header">
        <div className="game-info">
          <h1>{game.name}</h1>
          <span className={`difficulty ${game.difficulty.toLowerCase()}`}>
            {game.difficulty}
          </span>
        </div>
        <div className="game-stats">
          <div className="stat">
            <FaClock />
            <span className={timeLeft < 60 ? "time-warning" : ""}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="stat">
            <FaTrophy />
            <span>{game.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="game-arena-content">
        <div className="problem-section">
          <h3><FaClipboardList /> Problem Statement</h3>
          <div className="problem-statement">
            <p>{game.problemStatement}</p>
          </div>

          <h4><FaFlask /> Test Cases</h4>
          <div className="test-cases">
            {game.testCases.map((testCase, index) => (
              <div key={index} className="test-case">
                <strong>Test Case {index + 1}:</strong>
                <div>Input: {testCase.input}</div>
                <div>Expected Output: {testCase.expectedOutput}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-section">
          <div className="editor-toolbar">
            <div className="language-selector-container">
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            <div className="editor-actions">
              <button 
                onClick={resetCode} 
                className="reset-button cursor-target"
                disabled={loadingStarterCode}
                title="Reset to starter code"
              >
                <FaRedo /> Reset
              </button>
              <button 
                onClick={runCode} 
                className="run-button cursor-target"
                disabled={runningTests || loadingStarterCode}
              >
                {runningTests ? (
                  <>
                    <div className="button-spinner"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <FaPlay /> Run Code
                  </>
                )}
              </button>
              <button onClick={submitCode} className="submit-button cursor-target">
                <FaCode /> Submit
              </button>
            </div>
          </div>

          <div className="editor-container">
            {loadingStarterCode && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <span>Loading starter code...</span>
              </div>
            )}

            <Editor
              height="100%"
              language={getMonacoLanguage(language)}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: !isRunning || loadingStarterCode,
                automaticLayout: true,
                wordWrap: "on",
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  useShadows: false,
                  verticalHasArrows: true,
                  horizontalHasArrows: true,
                },
                padding: { top: 15, bottom: 15 },
              }}
            />
          </div>
        </div>

        <div className="output-section">
          {runningTests && (
            <div className="running-tests">
              <div className="running-header">
                <div className="spinner"></div>
                <span>Running Tests...</span>
              </div>
              <div className="running-progress">
                <div className="progress-bar"></div>
              </div>
            </div>
          )}

          {testResults.length > 0 && !runningTests ? (
            <div className="test-results">
              <h4><FaTerminal /> Execution Results</h4>
              {testResults.map((result) => (
                <div
                  key={result.testCaseNumber}
                  className={`result-card ${result.passed ? "passed" : "failed"}`}
                >
                  <div className="result-header">
                    <span className="result-test">Test Case {result.testCaseNumber}</span>
                    <span className="result-status">
                      {result.passed ? (
                        <><FaCheckCircle /> Passed</>
                      ) : (
                        <><FaTimesCircle /> Failed</>
                      )}
                    </span>
                    <span className="result-time">{result.executionTime}ms</span>
                  </div>
                  <div className="result-details">
                    <div className="result-io">
                      <div className="io-section">
                        <strong>Input:</strong>
                        <code className="input-code">{result.input}</code>
                      </div>
                      <div className="io-section">
                        <strong>Expected Output:</strong>
                        <code className="expected-code">{result.expectedOutput}</code>
                      </div>
                      <div className="io-section">
                        <strong>Your Output:</strong>
                        <code className={result.passed ? "correct" : "incorrect"}>
                          {result.actualOutput}
                        </code>
                      </div>
                      {!result.passed && (
                        <div className="error-info">
                          <FaTimesCircle /> Output mismatch detected
                        </div>
                      )}
                    </div>
                    <div className="execution-stats">
                      <div className="stat-item">
                        <span>Execution Time:</span>
                        <span>{result.executionTime}ms</span>
                      </div>
                      <div className="stat-item">
                        <span>Memory Used:</span>
                        <span>{result.memoryUsed}MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="results-summary">
                <div className="summary-stats">
                  <div className="summary-item">
                    <span>Total Tests:</span>
                    <span>{testResults.length}</span>
                  </div>
                  <div className="summary-item">
                    <span>Passed:</span>
                    <span className="passed-count">{testResults.filter(r => r.passed).length}</span>
                  </div>
                  <div className="summary-item">
                    <span>Failed:</span>
                    <span className="failed-count">{testResults.filter(r => !r.passed).length}</span>
                  </div>
                  <div className="summary-item">
                    <span>Success Rate:</span>
                    <span className="success-rate">
                      {Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : !runningTests && (
            <div className="no-results">
              <FaTerminal />
              <h4>Console Output</h4>
              <p>Run your code to see test results and execution output here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameArena;
