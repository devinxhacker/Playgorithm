import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { gameAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaClock, FaCode, FaTrophy, FaPlay } from "react-icons/fa";
import "./GameArena.css";

const GameArena = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [game, setGame] = useState(null);
  const [session, setSession] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setCode(gameResponse.data.starterCode || "");
      setTimeLeft(gameResponse.data.timeLimit);

      const sessionResponse = await gameAPI.startGame(gameId);
      setSession(sessionResponse.data);
      setIsRunning(true);
      setLoading(false);
    } catch (error) {
      console.error("Error loading game:", error);
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    setIsRunning(false);
    alert("Time's up! Your game session has ended.");
    navigate("/dashboard");
  };

  const runCode = async () => {
    // Simulate test execution (in production, this would call a code execution API)
    const results = game.testCases.map((testCase, index) => ({
      testCaseNumber: index + 1,
      passed: Math.random() > 0.3,
      actualOutput: "Sample output",
      expectedOutput: testCase.expectedOutput,
      executionTime: Math.floor(Math.random() * 100),
    }));
    setTestResults(results);
  };

  const submitCode = async () => {
    try {
      const response = await gameAPI.submitGame({
        gameId,
        sessionId: session.id,
        code,
        language,
      });

      if (response.data.success) {
        // Update user XP
        const updatedUser = { ...user };
        updatedUser.totalXP += response.data.xpEarned;
        updatedUser.level = Math.floor(updatedUser.totalXP / 100) + 1;
        updateUser(updatedUser);

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
          <h3>Problem Statement</h3>
          <p>{game.problemStatement}</p>

          <h4>Test Cases</h4>
          <div className="test-cases">
            {game.testCases.map((testCase, index) => (
              <div key={index} className="test-case">
                <strong>Test Case {index + 1}:</strong>
                <div>Input: {testCase.input}</div>
                <div>Expected Output: {testCase.expectedOutput}</div>
              </div>
            ))}
          </div>

          {testResults.length > 0 && (
            <div className="test-results">
              <h4>Test Results</h4>
              {testResults.map((result) => (
                <div
                  key={result.testCaseNumber}
                  className={`result ${result.passed ? "passed" : "failed"}`}
                >
                  <span>Test Case {result.testCaseNumber}</span>
                  <span>{result.passed ? "✓ Passed" : "✗ Failed"}</span>
                  <span>{result.executionTime}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="editor-section">
          <div className="editor-toolbar">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <div className="editor-actions">
              <button onClick={runCode} className="run-button">
                <FaPlay /> Run Code
              </button>
              <button onClick={submitCode} className="submit-button">
                <FaCode /> Submit
              </button>
            </div>
          </div>

          <Editor
            height="calc(100% - 60px)"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: !isRunning,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameArena;
