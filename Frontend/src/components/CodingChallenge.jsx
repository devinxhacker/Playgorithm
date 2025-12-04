import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { FaClock, FaCode, FaTrophy, FaPlay, FaRedo, FaCheckCircle, FaTimesCircle, FaFlask, FaClipboardList, FaTerminal, FaArrowLeft } from "react-icons/fa";
import LanguageSelector from './LanguageSelector';
import './CodingChallenge.css';

const CodingChallenge = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [runningTests, setRunningTests] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  const challenges = {
    'graph-gladiator': {
      name: 'Graph Gladiator',
      difficulty: 'MEDIUM',
      timeLimit: 600, // 10 minutes
      xpReward: 1000,
      problemStatement: 'Navigate through complex graph structures and find the shortest path! Given a weighted graph, find the shortest path between two nodes using Dijkstra\'s algorithm.',
      testCases: [
        { input: 'graph = [[0,1,4],[1,2,8],[2,3,7]], start = 0, end = 3', expectedOutput: '19' },
        { input: 'graph = [[0,1,2],[1,2,3],[0,2,10]], start = 0, end = 2', expectedOutput: '5' }
      ]
    },
    'dynamic-programming-duel': {
      name: 'Dynamic Programming Duel',
      difficulty: 'HARD',
      timeLimit: 900, // 15 minutes
      xpReward: 2000,
      problemStatement: 'Master optimization by breaking down complex problems! Solve the classic 0/1 Knapsack problem using dynamic programming.',
      testCases: [
        { input: 'weights = [1,3,4,5], values = [1,4,5,7], capacity = 7', expectedOutput: '9' },
        { input: 'weights = [2,1,3], values = [12,10,20], capacity = 5', expectedOutput: '32' }
      ]
    },
    'binary-search-challenge': {
      name: 'Binary Search Challenge',
      difficulty: 'EASY',
      timeLimit: 300, // 5 minutes
      xpReward: 400,
      problemStatement: 'Find elements in sorted arrays with lightning speed! Implement binary search to find the target element in a sorted array.',
      testCases: [
        { input: 'arr = [-1,0,3,5,9,12], target = 9', expectedOutput: '4' },
        { input: 'arr = [-1,0,3,5,9,12], target = 2', expectedOutput: '-1' }
      ]
    },
    'code-golf-fizzbuzz': {
      name: 'Code Golf: FizzBuzz',
      difficulty: 'EASY',
      timeLimit: 600, // 10 minutes
      xpReward: 300,
      problemStatement: 'Write the shortest code possible to solve FizzBuzz! Print numbers 1 to 100, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".',
      testCases: [
        { input: 'n = 15', expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz' }
      ]
    }
  };

  const loadChallenge = async () => {
    try {
      const challengeData = challenges[challengeId] || challenges['graph-gladiator'];
      setChallenge(challengeData);
      await loadStarterCode(selectedLanguage);
      setLoading(false);
    } catch (error) {
      console.error('Error loading challenge:', error);
      setLoading(false);
    }
  };

  const loadStarterCode = async (language) => {
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

main();`
    };
    
    setCode(templates[language] || templates.cpp);
  };

  const handleLanguageChange = async (newLanguage) => {
    setSelectedLanguage(newLanguage);
    await loadStarterCode(newLanguage);
  };

  const resetCode = async () => {
    if (confirm("Are you sure you want to reset your code? This will restore the original starter code.")) {
      await loadStarterCode(selectedLanguage);
    }
  };

  const getMonacoLanguage = (language) => {
    const mapping = {
      cpp: 'cpp',
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

    setRunningTests(true);
    setTestResults([]);
    
    setTimeout(() => {
      const results = challenge.testCases.map((testCase, index) => {
        const passed = Math.random() > 0.3; // 70% pass rate for demo
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
        };
      });
      setTestResults(results);
      setRunningTests(false);
      
      setTimeout(() => {
        const resultsElement = document.querySelector('.test-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }, 2000);
  };

  const generateIncorrectOutput = (expectedOutput, index) => {
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
      alert(`Challenge completed! You earned ${challenge.xpReward} XP!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  if (loading) {
    return (
      <div className="challenge-loading">
        <div className="spinner"></div>
        <p>Loading Challenge...</p>
      </div>
    );
  }

  return (
    <div className="coding-challenge">
      <div className="challenge-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="back-button cursor-target">
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
        <div className="challenge-info">
          <h1>{challenge.name}</h1>
          <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
            {challenge.difficulty}
          </span>
        </div>
        <div className="challenge-stats">
          <div className="stat">
            <FaClock />
            <span>{Math.floor(challenge.timeLimit / 60)}:{(challenge.timeLimit % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="stat">
            <FaTrophy />
            <span>{challenge.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="challenge-content">
        <div className="problem-section">
          <h3><FaClipboardList /> Problem Statement</h3>
          <div className="problem-statement">
            <p>{challenge.problemStatement}</p>
          </div>

          <h4><FaFlask /> Test Cases</h4>
          <div className="test-cases">
            {challenge.testCases.map((testCase, index) => (
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
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            <div className="editor-actions">
              <button 
                onClick={resetCode} 
                className="reset-button cursor-target"
                title="Reset to starter code"
              >
                <FaRedo /> Reset
              </button>
              <button 
                onClick={runCode} 
                className="run-button cursor-target"
                disabled={runningTests}
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
            <Editor
              height="100%"
              language={getMonacoLanguage(selectedLanguage)}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
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

export default CodingChallenge;