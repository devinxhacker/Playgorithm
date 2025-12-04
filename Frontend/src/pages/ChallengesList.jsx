import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaTrophy, FaPlay, FaArrowLeft } from 'react-icons/fa';
import './ChallengesList.css';

const ChallengesList = () => {
  const navigate = useNavigate();

  const challenges = [
    {
      id: 'graph-gladiator',
      name: 'Graph Gladiator',
      difficulty: 'MEDIUM',
      timeLimit: 600, // 10 minutes
      xpReward: 1000,
      testCount: 2,
      description: 'Navigate through complex graph structures and find the shortest path!'
    },
    {
      id: 'dynamic-programming-duel',
      name: 'Dynamic Programming Duel',
      difficulty: 'HARD',
      timeLimit: 900, // 15 minutes
      xpReward: 2000,
      testCount: 2,
      description: 'Master optimization by breaking down complex problems!'
    },
    {
      id: 'binary-search-challenge',
      name: 'Binary Search Challenge',
      difficulty: 'EASY',
      timeLimit: 300, // 5 minutes
      xpReward: 400,
      testCount: 2,
      description: 'Find elements in sorted arrays with lightning speed!'
    },
    {
      id: 'code-golf-fizzbuzz',
      name: 'Code Golf: FizzBuzz',
      difficulty: 'EASY',
      timeLimit: 600, // 10 minutes
      xpReward: 300,
      testCount: 1,
      description: 'Write the shortest code possible to solve FizzBuzz!'
    },
    {
      id: 'speed-debugging-bugs',
      name: 'Speed Debugging: Bug Hunt',
      difficulty: 'MEDIUM',
      timeLimit: 900, // 15 minutes across levels
      xpReward: 900,
      testCount: 30,
      description: 'Race through three levels of syntax, logic, and runtime fixes with 10 bugs each.',
      interactive: true,
      customRoute: '/game/speed-debugging'
    }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min${secs > 0 ? ` ${secs}s` : ''}`;
  };

  const handleChallengeClick = (challenge) => {
    if (challenge.customRoute) {
      navigate(challenge.customRoute);
      return;
    }
    navigate(`/coding-challenge/${challenge.id}`);
  };

  return (
    <div className="challenges-list">
      <div className="challenges-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="back-button cursor-target">
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
        <div className="header-center">
          <h1>Coding Challenges</h1>
          <p>Test your programming skills with these exciting challenges!</p>
        </div>
      </div>

      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card cursor-target">
            <div className="challenge-card-header">
              <div className="challenge-title">
                <h3>{challenge.name}</h3>
                {challenge.interactive && (
                  <span className="interactive-badge">INTERACTIVE</span>
                )}
              </div>
              <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
                {challenge.difficulty}
              </span>
            </div>

            <div className="challenge-description">
              <p>{challenge.description}</p>
            </div>

            <div className="challenge-stats">
              <div className="stat">
                <FaClock />
                <span>{formatTime(challenge.timeLimit)}</span>
              </div>
              <div className="stat">
                <FaTrophy />
                <span>{challenge.xpReward} XP</span>
              </div>
              <div className="stat">
                <span className="test-count">{challenge.testCount} tests</span>
              </div>
            </div>

            <button 
              className="play-button cursor-target"
              onClick={() => handleChallengeClick(challenge)}
            >
              <FaPlay /> Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesList;