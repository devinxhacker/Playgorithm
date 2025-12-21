import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { gameAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  FaClock, FaCode, FaTrophy, FaPlay, FaRedo, FaCheckCircle, FaTimesCircle, 
  FaFlask, FaClipboardList, FaTerminal, FaArrowLeft, FaExpand, FaCompress,
  FaLightbulb, FaBookmark, FaChevronRight, FaChevronDown, FaCog, FaPaperPlane,
  FaMemory, FaBolt, FaExclamationTriangle, FaCheck, FaTimes, FaSync
} from "react-icons/fa";
import { VscDebugStart, VscDebugStop } from "react-icons/vsc";
import LanguageSelector from "../components/LanguageSelector";
import "./GameArena.css";

const GameArena = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [game, setGame] = useState(null);
  const [session, setSession] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python3");
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStarterCode, setLoadingStarterCode] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [outputTab, setOutputTab] = useState("testcase");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedTestCase, setExpandedTestCase] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [executionStatus, setExecutionStatus] = useState(null); // 'running', 'success', 'error', 'timeout'
  const editorRef = useRef(null);
  const arenaRef = useRef(null);

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

      // Set default language from supported languages
      const defaultLang = gameResponse.data.supportedLanguages?.[0] || "python3";
      setLanguage(defaultLang);
      await loadStarterCode(defaultLang);

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
        setCode(getStarterCode(selectedLanguage, game));
      }
    } catch (error) {
      console.error("Error loading starter code:", error);
      setCode(getStarterCode(selectedLanguage, game));
    } finally {
      setLoadingStarterCode(false);
    }
  };

  const getStarterCode = (lang, gameData) => {
    const templates = {
      python3: `# ${gameData?.name || 'Solution'}
# Time Complexity: O(?)
# Space Complexity: O(?)

def solve():
    """
    Write your solution here.
    Read input using input() function.
    Print output using print() function.
    """
    # Your code here
    pass

if __name__ == "__main__":
    solve()`,
      python: `# ${gameData?.name || 'Solution'}

def solve():
    # Your code here
    pass

if __name__ == "__main__":
    solve()`,
      javascript: `/**
 * ${gameData?.name || 'Solution'}
 * Time Complexity: O(?)
 * Space Complexity: O(?)
 */

function solve() {
    // Read input from stdin
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    let lines = [];
    rl.on('line', (line) => {
        lines.push(line);
    });
    
    rl.on('close', () => {
        // Your code here
        // Process lines array
    });
}

solve();`,
      java: `/**
 * ${gameData?.name || 'Solution'}
 * Time Complexity: O(?)
 * Space Complexity: O(?)
 */

import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Your code here
        
        scanner.close();
    }
}`,
      cpp: `/**
 * ${gameData?.name || 'Solution'}
 * Time Complexity: O(?)
 * Space Complexity: O(?)
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`,
      c: `/**
 * ${gameData?.name || 'Solution'}
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Your code here
    
    return 0;
}`
    };
    
    return templates[lang] || templates.python3;
  };

  const handleTimeUp = () => {
    setIsRunning(false);
    setExecutionStatus('timeout');
  };

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    await loadStarterCode(newLanguage);
  };

  const resetCode = async () => {
    if (confirm("Reset to starter code? Your current code will be lost.")) {
      await loadStarterCode(language);
      setTestResults([]);
      setConsoleOutput("");
      setExecutionStatus(null);
    }
  };

  const getMonacoLanguage = (lang) => {
    const mapping = {
      cpp: 'cpp', cpp17: 'cpp', cpp20: 'cpp', c: 'c',
      java: 'java', python: 'python', python3: 'python',
      javascript: 'javascript', typescript: 'typescript'
    };
    return mapping[lang] || 'python';
  };

  const runCode = async () => {
    if (!code.trim()) {
      setConsoleOutput("Error: Please write some code before running!");
      setExecutionStatus('error');
      return;
    }

    setRunningTests(true);
    setTestResults([]);
    setExecutionStatus('running');
    setOutputTab('output');
    setConsoleOutput("Compiling and executing code...\n");
    
    // Simulate compilation phase
    await new Promise(resolve => setTimeout(resolve, 800));
    setConsoleOutput(prev => prev + `Language: ${language}\nCompilation: Success ✓\n\nRunning test cases...\n${'─'.repeat(40)}\n`);
    
    // Simulate test execution with realistic timing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const results = game.testCases.map((testCase, index) => {
      // Simulate execution based on code content
      const hasLogic = code.length > 100;
      const passed = hasLogic && Math.random() > 0.3;
      
      return {
        testCaseNumber: index + 1,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: passed ? testCase.expectedOutput : generateWrongOutput(testCase.expectedOutput),
        executionTime: Math.floor(Math.random() * 80) + 20,
        memoryUsed: (Math.random() * 5 + 2).toFixed(1),
        isHidden: testCase.isHidden,
        points: testCase.points || 10
      };
    });
    
    setTestResults(results);
    
    const passedCount = results.filter(r => r.passed).length;
    const totalPoints = results.filter(r => r.passed).reduce((sum, r) => sum + r.points, 0);
    
    setConsoleOutput(prev => 
      prev + `\nResults: ${passedCount}/${results.length} test cases passed\n` +
      `Points earned: ${totalPoints}/${results.reduce((sum, r) => sum + r.points, 0)}\n` +
      `Average execution time: ${Math.round(results.reduce((sum, r) => sum + r.executionTime, 0) / results.length)}ms\n`
    );
    
    setExecutionStatus(passedCount === results.length ? 'success' : 'error');
    setRunningTests(false);
  };

  const runCustomTest = async () => {
    if (!code.trim() || !customInput.trim()) {
      setCustomOutput("Please provide both code and custom input.");
      return;
    }

    setCustomOutput("Running with custom input...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate custom test execution
    setCustomOutput(`Input: ${customInput}\n\nOutput:\n[Simulated output for custom input]\n\nExecution time: ${Math.floor(Math.random() * 50) + 10}ms`);
  };

  const generateWrongOutput = (expected) => {
    const wrongOutputs = [
      "undefined", "null", "0", "-1", "[]", "{}",
      "Error: Index out of bounds",
      "TypeError: Cannot read property",
      expected.split('\n').slice(0, -1).join('\n'),
      expected + "\n" + expected.split('\n')[0]
    ];
    return wrongOutputs[Math.floor(Math.random() * wrongOutputs.length)];
  };

  const submitCode = async () => {
    if (testResults.length === 0) {
      alert("Please run your code first to verify it works!");
      return;
    }

    const passedCount = testResults.filter(r => r.passed).length;
    if (passedCount < testResults.length) {
      if (!confirm(`Only ${passedCount}/${testResults.length} tests passed. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    setExecutionStatus('running');
    setConsoleOutput("Submitting solution...\n");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const allPassed = testResults.every(r => r.passed);
      const earnedXP = allPassed ? game.xpReward : Math.floor(game.xpReward * (passedCount / testResults.length) * 0.5);
      
      const response = await gameAPI.submitGame({
        gameId,
        sessionId: session?.id,
        code,
        language,
        xpEarned: earnedXP,
        won: allPassed
      });

      if (response.data.success) {
        updateUser({
          ...user,
          totalXP: response.data.totalXP,
          level: response.data.level,
          gamesPlayed: response.data.gamesPlayed,
          gamesWon: response.data.gamesWon,
          winRate: response.data.winRate
        });

        setExecutionStatus('success');
        setConsoleOutput(prev => 
          prev + `\n${'═'.repeat(40)}\n` +
          `🎉 ${allPassed ? 'All tests passed!' : 'Partial solution accepted'}\n` +
          `XP Earned: +${earnedXP} XP\n` +
          `${'═'.repeat(40)}\n`
        );
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setExecutionStatus('error');
      setConsoleOutput(prev => prev + "\nError submitting solution. Please try again.\n");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 60) return "#ff4757";
    if (timeLeft < 300) return "#ffa502";
    return "#2ed573";
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await arenaRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      // Fallback to CSS-only fullscreen
      setIsFullscreen(!isFullscreen);
    }
  };

  // Listen for fullscreen changes (e.g., pressing Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  if (loading) {
    return (
      <div className="game-arena-loading">
        <div className="loading-content">
          <div className="code-loader">
            <div className="loader-line"></div>
            <div className="loader-line"></div>
            <div className="loader-line"></div>
          </div>
          <h3>Initializing Code Environment</h3>
          <p>Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={arenaRef} className={`game-arena ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="arena-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div className="problem-title">
            <h1>{game.name}</h1>
            <div className="problem-meta">
              <span className={`difficulty-badge ${game.difficulty.toLowerCase()}`}>
                {game.difficulty}
              </span>
              <span className="category-badge">{game.category?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="timer-display" style={{ '--timer-color': getTimeColor() }}>
            <FaClock />
            <span className={timeLeft < 60 ? 'pulse' : ''}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="xp-reward">
            <FaTrophy />
            <span>{game.xpReward} XP</span>
          </div>
          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="arena-main">
        {/* Left Panel - Problem Description */}
        <div className="problem-panel">
          <div className="panel-tabs">
            <button 
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              <FaClipboardList /> Description
            </button>
            <button 
              className={`tab ${activeTab === 'hints' ? 'active' : ''}`}
              onClick={() => setActiveTab('hints')}
            >
              <FaLightbulb /> Hints
            </button>
            <button 
              className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              <FaBookmark /> Submissions
            </button>
          </div>

          <div className="panel-content">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="description-content"
                >
                  <div className="problem-statement">
                    <p>{game.problemStatement}</p>
                  </div>

                  {game.constraints && (
                    <div className="constraints-section">
                      <h4>Constraints</h4>
                      <ul>
                        {game.constraints.map((c, i) => (
                          <li key={i}><code>{c}</code></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {game.examples && game.examples.length > 0 && (
                    <div className="examples-section">
                      <h4>Examples</h4>
                      {game.examples.map((example, idx) => (
                        <div key={idx} className="example-box">
                          <div className="example-header">Example {idx + 1}</div>
                          <div className="example-content">
                            <div className="example-io">
                              <strong>Input:</strong>
                              <pre>{example.input}</pre>
                            </div>
                            <div className="example-io">
                              <strong>Output:</strong>
                              <pre>{example.output}</pre>
                            </div>
                            {example.explanation && (
                              <div className="example-explanation">
                                <strong>Explanation:</strong>
                                <p>{example.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="test-cases-section">
                    <h4><FaFlask /> Sample Test Cases</h4>
                    {game.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
                      <div 
                        key={index} 
                        className={`test-case-card ${expandedTestCase === index ? 'expanded' : ''}`}
                      >
                        <div 
                          className="test-case-header"
                          onClick={() => setExpandedTestCase(expandedTestCase === index ? -1 : index)}
                        >
                          <span>Test Case {index + 1}</span>
                          <div className="test-case-meta">
                            <span className="points-badge">{testCase.points || 10} pts</span>
                            {expandedTestCase === index ? <FaChevronDown /> : <FaChevronRight />}
                          </div>
                        </div>
                        {expandedTestCase === index && (
                          <motion.div 
                            className="test-case-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                          >
                            <div className="io-block">
                              <label>Input:</label>
                              <pre>{testCase.input}</pre>
                            </div>
                            <div className="io-block">
                              <label>Expected Output:</label>
                              <pre>{testCase.expectedOutput}</pre>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                    {game.testCases.some(tc => tc.isHidden) && (
                      <div className="hidden-tests-notice">
                        <FaExclamationTriangle />
                        <span>{game.testCases.filter(tc => tc.isHidden).length} hidden test cases</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'hints' && (
                <motion.div
                  key="hints"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="hints-content"
                >
                  {game.hints && game.hints.length > 0 ? (
                    game.hints.map((hint, idx) => (
                      <div key={idx} className="hint-card">
                        <div className="hint-header" onClick={() => setShowHints(idx)}>
                          <FaLightbulb />
                          <span>Hint {idx + 1}</span>
                          <span className="hint-cost">-{10 * (idx + 1)} XP</span>
                        </div>
                        {showHints === idx && (
                          <div className="hint-body">{hint}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-hints">
                      <FaLightbulb />
                      <p>No hints available for this problem.</p>
                      <span>Try analyzing the examples carefully!</span>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'submissions' && (
                <motion.div
                  key="submissions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="submissions-content"
                >
                  <div className="no-submissions">
                    <FaBookmark />
                    <p>No submissions yet</p>
                    <span>Your submission history will appear here</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="editor-panel">
          <div className="editor-header">
            <div className="language-selector-wrapper">
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={handleLanguageChange}
                supportedLanguages={game.supportedLanguages}
              />
            </div>
            <div className="editor-controls">
              <button className="control-btn" onClick={() => setFontSize(f => Math.max(10, f - 2))} title="Decrease font size">
                A-
              </button>
              <span className="font-size-display">{fontSize}px</span>
              <button className="control-btn" onClick={() => setFontSize(f => Math.min(24, f + 2))} title="Increase font size">
                A+
              </button>
              <button className="control-btn reset" onClick={resetCode} disabled={loadingStarterCode} title="Reset code">
                <FaRedo />
              </button>
            </div>
          </div>

          <div className="code-editor-container">
            {loadingStarterCode && (
              <div className="editor-loading-overlay">
                <div className="spinner"></div>
                <span>Loading template...</span>
              </div>
            )}
            <Editor
              height="100%"
              language={getMonacoLanguage(language)}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                readOnly: !isRunning || loadingStarterCode,
                automaticLayout: true,
                wordWrap: "on",
                tabSize: 2,
                folding: true,
                lineDecorationsWidth: 10,
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                padding: { top: 15, bottom: 15 },
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="output-panel">
            <div className="output-tabs">
              <button 
                className={`output-tab ${outputTab === 'testcase' ? 'active' : ''}`}
                onClick={() => setOutputTab('testcase')}
              >
                <FaFlask /> Test Results
                {testResults.length > 0 && (
                  <span className={`result-badge ${testResults.every(r => r.passed) ? 'success' : 'error'}`}>
                    {testResults.filter(r => r.passed).length}/{testResults.length}
                  </span>
                )}
              </button>
              <button 
                className={`output-tab ${outputTab === 'output' ? 'active' : ''}`}
                onClick={() => setOutputTab('output')}
              >
                <FaTerminal /> Console
                {executionStatus && (
                  <span className={`status-indicator ${executionStatus}`}>
                    {executionStatus === 'running' && <FaSync className="spin" />}
                    {executionStatus === 'success' && <FaCheck />}
                    {executionStatus === 'error' && <FaTimes />}
                  </span>
                )}
              </button>
              <button 
                className={`output-tab ${outputTab === 'custom' ? 'active' : ''}`}
                onClick={() => setOutputTab('custom')}
              >
                <FaCog /> Custom Input
              </button>
            </div>

            <div className="output-content">
              {outputTab === 'testcase' && (
                <div className="test-results-panel">
                  {runningTests ? (
                    <div className="running-indicator">
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill"></div>
                      </div>
                      <span>Running test cases...</span>
                    </div>
                  ) : testResults.length > 0 ? (
                    <div className="results-grid">
                      {testResults.map((result, idx) => (
                        <div 
                          key={idx} 
                          className={`result-item ${result.passed ? 'passed' : 'failed'}`}
                        >
                          <div className="result-item-header">
                            <span className="result-icon">
                              {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
                            </span>
                            <span>Test {result.testCaseNumber}</span>
                            {result.isHidden && <span className="hidden-badge">Hidden</span>}
                          </div>
                          <div className="result-item-stats">
                            <span><FaBolt /> {result.executionTime}ms</span>
                            <span><FaMemory /> {result.memoryUsed}MB</span>
                          </div>
                          {!result.isHidden && !result.passed && (
                            <div className="result-diff">
                              <div className="diff-row">
                                <span className="diff-label">Expected:</span>
                                <code>{result.expectedOutput}</code>
                              </div>
                              <div className="diff-row">
                                <span className="diff-label">Got:</span>
                                <code className="wrong">{result.actualOutput}</code>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-output">
                      <FaFlask />
                      <p>Run your code to see test results</p>
                    </div>
                  )}
                </div>
              )}

              {outputTab === 'output' && (
                <div className="console-panel">
                  <pre className="console-output">{consoleOutput || "Console output will appear here..."}</pre>
                </div>
              )}

              {outputTab === 'custom' && (
                <div className="custom-input-panel">
                  <div className="custom-input-section">
                    <label>Custom Input:</label>
                    <textarea 
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter your test input here..."
                    />
                  </div>
                  <button className="run-custom-btn" onClick={runCustomTest}>
                    <VscDebugStart /> Run with Custom Input
                  </button>
                  {customOutput && (
                    <div className="custom-output-section">
                      <label>Output:</label>
                      <pre>{customOutput}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="editor-actions">
            <button 
              className="action-btn run"
              onClick={runCode}
              disabled={runningTests || loadingStarterCode || submitting}
            >
              {runningTests ? (
                <><FaSync className="spin" /> Running...</>
              ) : (
                <><FaPlay /> Run Code</>
              )}
            </button>
            <button 
              className="action-btn submit"
              onClick={submitCode}
              disabled={runningTests || loadingStarterCode || submitting}
            >
              {submitting ? (
                <><FaSync className="spin" /> Submitting...</>
              ) : (
                <><FaPaperPlane /> Submit</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArena;
