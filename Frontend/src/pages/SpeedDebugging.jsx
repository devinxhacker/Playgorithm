import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBug,
  FaCheckCircle,
  FaClock,
  FaFlagCheckered,
  FaInfoCircle,
  FaLightbulb,
  FaTimesCircle,
  FaTrophy,
} from 'react-icons/fa';
import { SPEED_DEBUGGING_LEVELS } from '../data/speedDebuggingData';
import './SpeedDebugging.css';

const buildInitialStats = () =>
  SPEED_DEBUGGING_LEVELS.reduce((acc, level, index) => {
    acc[level.id] = {
      unlocked: index === 0,
      completed: false,
      correct: 0,
      incorrect: 0,
      xpEarned: 0,
      questions: level.questions.map(() => ({ status: 'pending', attempts: 0 })),
    };
    return acc;
  }, {});

const buildInitialTimers = () =>
  SPEED_DEBUGGING_LEVELS.reduce((acc, level) => {
    acc[level.id] = level.timeLimit;
    return acc;
  }, {});

const buildInitialEditors = () =>
  SPEED_DEBUGGING_LEVELS.reduce((acc, level) => {
    acc[level.id] = level.questions.map((question) => question.snippet);
    return acc;
  }, {});

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const normalizeCode = (code) =>
  code
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .trim();

const SpeedDebugging = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(buildInitialStats);
  const [levelTimers, setLevelTimers] = useState(buildInitialTimers);
  const [editorState, setEditorState] = useState(buildInitialEditors);
  const [activeLevelId, setActiveLevelId] = useState(SPEED_DEBUGGING_LEVELS[0].id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const currentLevel = useMemo(
    () => SPEED_DEBUGGING_LEVELS.find((level) => level.id === activeLevelId),
    [activeLevelId]
  );
  const levelStat = stats[activeLevelId];
  const currentQuestion = currentLevel.questions[questionIndex];
  const questionStatus = levelStat.questions[questionIndex];
  const questionSolved = questionStatus?.status === 'correct';
  const timeLeft = levelTimers[activeLevelId];
  const perQuestionXp = Math.ceil(currentLevel.xpReward / currentLevel.questions.length);
  const progressPercent =
    currentLevel.questions.length === 0
      ? 0
      : (levelStat.correct / currentLevel.questions.length) * 100;
  const attemptsTaken = levelStat.correct + levelStat.incorrect;
  const summaryVisible = showSummary || timeLeft === 0 || levelStat.completed;
  const currentCode = editorState[activeLevelId]?.[questionIndex] ?? currentQuestion.snippet;

  useEffect(() => {
    setFeedback(null);
    setShowHint(false);
    setIsValidating(false);
  }, [questionIndex, activeLevelId]);

  useEffect(() => {
    if (summaryVisible) {
      return;
    }

    if (timeLeft <= 0) {
      setShowSummary(true);
      return;
    }

    const timerId = setInterval(() => {
      setLevelTimers((prev) => ({
        ...prev,
        [activeLevelId]: Math.max(prev[activeLevelId] - 1, 0),
      }));
    }, 1000);

    return () => clearInterval(timerId);
  }, [activeLevelId, summaryVisible, timeLeft]);

  const handleLevelChange = (levelId) => {
    if (levelId === activeLevelId || !stats[levelId].unlocked) {
      return;
    }
    const pendingIndex = stats[levelId].questions.findIndex((q) => q.status !== 'correct');
    setActiveLevelId(levelId);
    setQuestionIndex(pendingIndex === -1 ? 0 : pendingIndex);
    setShowSummary(false);
  };

  const handleCodeChange = (value) => {
    setEditorState((prev) => ({
      ...prev,
      [activeLevelId]: prev[activeLevelId].map((code, idx) => (idx === questionIndex ? value : code)),
    }));
  };

  const handleResetSnippet = () => {
    setEditorState((prev) => ({
      ...prev,
      [activeLevelId]: prev[activeLevelId].map((code, idx) =>
        idx === questionIndex ? currentQuestion.snippet : code
      ),
    }));
    setFeedback(null);
  };

  const handleRunFix = () => {
    if (questionSolved || summaryVisible || timeLeft === 0 || isValidating) {
      return;
    }

    setIsValidating(true);
    setFeedback(null);

    setTimeout(() => {
      const expected = normalizeCode(currentQuestion.fix);
      const candidate = normalizeCode(currentCode);
      const isCorrect = expected.length > 0 && candidate === expected;

      setStats((prev) => {
        const levelState = prev[activeLevelId];
        const alreadySolved = levelState.questions[questionIndex].status === 'correct';
        if (alreadySolved && isCorrect) {
          return prev;
        }

        const updatedQuestions = levelState.questions.map((entry, idx) => {
          if (idx !== questionIndex) {
            return entry;
          }
          if (entry.status === 'correct') {
            return entry;
          }
          return {
            status: isCorrect ? 'correct' : 'attempted',
            attempts: entry.attempts + 1,
          };
        });

        const updatedLevelState = {
          ...levelState,
          questions: updatedQuestions,
          correct: levelState.correct + (isCorrect ? 1 : 0),
          incorrect: levelState.incorrect + (isCorrect ? 0 : 1),
          xpEarned: levelState.xpEarned + (isCorrect ? perQuestionXp : 0),
        };

        let nextState = {
          ...prev,
          [activeLevelId]: updatedLevelState,
        };

        if (isCorrect) {
          const completed = updatedQuestions.every((q) => q.status === 'correct');
          if (completed && !updatedLevelState.completed) {
            const enhancedState = { ...updatedLevelState, completed: true };
            nextState = { ...nextState, [activeLevelId]: enhancedState };
            const levelIdx = SPEED_DEBUGGING_LEVELS.findIndex((level) => level.id === activeLevelId);
            const unlockedLevel = SPEED_DEBUGGING_LEVELS[levelIdx + 1];
            if (unlockedLevel) {
              nextState = {
                ...nextState,
                [unlockedLevel.id]: { ...nextState[unlockedLevel.id], unlocked: true },
              };
            }
            setShowSummary(true);
          }
        }

        return nextState;
      });

      setFeedback({
        type: isCorrect ? 'success' : 'error',
        message: isCorrect
          ? 'Fix accepted! Ship it.'
          : 'Not quite there yet. Compare against the requirements and try again.',
      });
      setIsValidating(false);
    }, 600);
  };

  const handleNextQuestion = () => {
    if (questionIndex < currentLevel.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleJumpToQuestion = (targetIndex) => {
    if (targetIndex === questionIndex) {
      return;
    }
    setQuestionIndex(targetIndex);
  };

  const handleRestartLevel = () => {
    setStats((prev) => ({
      ...prev,
      [activeLevelId]: {
        ...prev[activeLevelId],
        completed: false,
        correct: 0,
        incorrect: 0,
        xpEarned: 0,
        questions: currentLevel.questions.map(() => ({ status: 'pending', attempts: 0 })),
      },
    }));
    setEditorState((prev) => ({
      ...prev,
      [activeLevelId]: currentLevel.questions.map((question) => question.snippet),
    }));
    setLevelTimers((prev) => ({
      ...prev,
      [activeLevelId]: currentLevel.timeLimit,
    }));
    setQuestionIndex(0);
    setShowSummary(false);
  };

  const handleNextLevel = () => {
    const levelIndex = SPEED_DEBUGGING_LEVELS.findIndex((level) => level.id === activeLevelId);
    const nextLevel = SPEED_DEBUGGING_LEVELS[levelIndex + 1];
    if (!nextLevel || !stats[nextLevel.id].unlocked) {
      return;
    }
    const pendingIndex = stats[nextLevel.id].questions.findIndex((q) => q.status !== 'correct');
    setActiveLevelId(nextLevel.id);
    setQuestionIndex(pendingIndex === -1 ? 0 : pendingIndex);
    setShowSummary(false);
  };

  const nextLevel = (() => {
    const idx = SPEED_DEBUGGING_LEVELS.findIndex((level) => level.id === activeLevelId);
    return SPEED_DEBUGGING_LEVELS[idx + 1];
  })();

  const summaryHeading = timeLeft === 0 && !levelStat.completed ? 'Time Up' : 'Level Complete';

  return (
    <div className="speed-debugging">
      <header className="sd-header">
        <button className="ghost-button cursor-target" onClick={() => navigate('/challenges')}>
          <FaArrowLeft /> Back to Challenges
        </button>
        <div className="sd-title">
          <h1>Speed Debugging · Bug Hunt</h1>
          <p>Fix 10 buggy snippets per level before the timer melts down.</p>
        </div>
        <div className="sd-header-stats">
          <div className="stat-pill">
            <FaClock />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="stat-pill">
            <FaTrophy />
            <span>
              {levelStat.xpEarned}
              <small> / {currentLevel.xpReward} XP</small>
            </span>
          </div>
        </div>
      </header>

      <section className="sd-level-tabs">
        {SPEED_DEBUGGING_LEVELS.map((level) => {
          const stat = stats[level.id];
          const completedCount = stat.questions.filter((q) => q.status === 'correct').length;
          const locked = !stat.unlocked;
          return (
            <button
              key={level.id}
              className={`level-tab ${level.id === activeLevelId ? 'active' : ''} ${locked ? 'locked' : ''}`}
              disabled={locked}
              onClick={() => handleLevelChange(level.id)}
            >
              <div className="level-info">
                <span className="level-name">{level.name}</span>
                <span className={`level-badge ${level.difficulty.toLowerCase()}`}>{level.badgeLabel}</span>
              </div>
              <div className="level-progress">
                <span>{completedCount}/10 fixed</span>
                <small>{locked ? 'Locked' : level.description}</small>
              </div>
            </button>
          );
        })}
      </section>

      <section className="sd-content">
        <div className="question-panel">
          <div className="question-head">
            <div>
              <span className="question-index">Bug {questionIndex + 1}</span>
              <span className="bug-type">{currentQuestion.bugType}</span>
              <span className="bug-language">{currentQuestion.language.toUpperCase()}</span>
            </div>
            <div className="question-meta">
              <FaBug />
              <span>{currentQuestion.title}</span>
            </div>
          </div>

          <p className="question-prompt">{currentQuestion.prompt}</p>

          <div className="code-editor-card">
            <div className="editor-head">
              <span>Your fix</span>
              <span className={`editor-status ${questionSolved ? 'accepted' : 'pending'}`}>
                {questionSolved ? 'Accepted' : 'Awaiting validation'}
              </span>
            </div>
            <textarea
              className="sd-textarea"
              value={currentCode}
              onChange={(event) => handleCodeChange(event.target.value)}
              spellCheck={false}
              disabled={questionSolved || summaryVisible || timeLeft === 0}
            />
          </div>

          <div className="question-actions">
            <button className="hint-button cursor-target" onClick={() => setShowHint((prev) => !prev)}>
              <FaLightbulb /> {showHint ? 'Hide hint' : 'Show hint'}
            </button>
            <div className="validator-actions">
              <button
                className="ghost-button cursor-target"
                onClick={handleResetSnippet}
                disabled={questionSolved || summaryVisible || timeLeft === 0 || isValidating}
              >
                Reset snippet
              </button>
              <button
                className="primary-button cursor-target"
                onClick={handleRunFix}
                disabled={questionSolved || summaryVisible || timeLeft === 0 || isValidating}
              >
                {isValidating ? 'Validating...' : 'Run debug check'}
              </button>
            </div>
            {questionSolved && (
              <button className="next-button cursor-target" onClick={handleNextQuestion}>
                {questionIndex === currentLevel.questions.length - 1 ? (
                  <>
                    <FaFlagCheckered /> See summary
                  </>
                ) : (
                  <>
                    <FaBug /> Next bug
                  </>
                )}
              </button>
            )}
          </div>

          {feedback && (
            <div className={`feedback ${feedback.type}`}>
              {feedback.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
              <span>{feedback.message}</span>
            </div>
          )}

          {showHint && (
            <div className="hint-card">
              <FaLightbulb />
              <p>{currentQuestion.hint}</p>
            </div>
          )}

          {questionSolved && (
            <div className="solution-card">
              <div className="solution-header">
                <FaCheckCircle />
                <span>Fix applied</span>
              </div>
              <pre>
                <code>{currentQuestion.fix}</code>
              </pre>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <aside className="sd-side-panel">
          <div className="timer-card">
            <div className="timer-head">
              <FaClock />
              <span>Level timer</span>
            </div>
            <div className={`timer-value ${timeLeft < 60 ? 'warning' : ''}`}>{formatTime(timeLeft)}</div>
            <div className="progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="timer-stats">
              <div>
                Fixed
                <strong>{levelStat.correct}/10</strong>
              </div>
              <div>
                Attempts
                <strong>{attemptsTaken}</strong>
              </div>
            </div>
          </div>

          <div className="questions-card">
            <div className="card-header">
              <FaBug /> Bug tracker
            </div>
            <div className="question-dots">
              {currentLevel.questions.map((_, idx) => {
                const status = levelStat.questions[idx].status;
                return (
                  <button
                    key={`dot-${idx}`}
                    className={`dot ${status} ${idx === questionIndex ? 'active' : ''}`}
                    onClick={() => handleJumpToQuestion(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {summaryVisible ? (
            <div className="summary-card">
              <div className="card-header">
                {summaryHeading === 'Time Up' ? <FaClock /> : <FaFlagCheckered />}
                <span>{summaryHeading}</span>
              </div>
              <ul>
                <li>
                  <span>Fixed bugs</span>
                  <strong>{levelStat.correct} / 10</strong>
                </li>
                <li>
                  <span>XP earned</span>
                  <strong>{levelStat.xpEarned}</strong>
                </li>
                <li>
                  <span>Total attempts</span>
                  <strong>{attemptsTaken}</strong>
                </li>
              </ul>
              <div className="summary-actions">
                <button className="ghost-button cursor-target" onClick={handleRestartLevel}>
                  Retry level
                </button>
                {levelStat.completed && nextLevel && stats[nextLevel.id].unlocked && (
                  <button className="primary-button cursor-target" onClick={handleNextLevel}>
                    Continue to {nextLevel.name}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="summary-card info">
              <div className="card-header">
                <FaInfoCircle />
                <span>Pro tip</span>
              </div>
              <p>
                Scan for what the code intends to do before reading syntax. Matching intent to implementation makes
                bugs pop.
              </p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default SpeedDebugging;
