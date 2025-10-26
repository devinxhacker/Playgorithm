import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaPlay, 
  FaRedo, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTrophy,
  FaCode,
  FaLightbulb,
  FaForward,
  FaLock,
  FaStar
} from 'react-icons/fa';
import { GiSwordman } from 'react-icons/gi';
import './FlexboxArena.css';

const FlexboxArena = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userCode, setUserCode] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLockedMessage, setShowLockedMessage] = useState(false);

  const levels = [
    // Level 1-5: Basic justify-content
    {
      id: 1,
      title: "Welcome to Flexbox Arena",
      description: "Help the warrior reach the treasure chest!",
      instruction: "Use justify-content to move the warrior to the right side.",
      hint: "Try justify-content: flex-end;",
      targetProperty: "justify-content",
      correctValue: "flex-end",
      initialCode: "justify-content: flex-start;",
      items: [{ type: 'warrior', id: 1, color: 'red' }],
      targets: [{ type: 'treasure', position: 'end', color: 'red' }]
    },
    {
      id: 2,
      title: "Center the Hero",
      description: "Position the warrior in the center to activate the portal!",
      instruction: "Use justify-content to center the warrior horizontally.",
      hint: "justify-content: center; centers items along the main axis.",
      targetProperty: "justify-content",
      correctValue: "center",
      initialCode: "justify-content: flex-start;",
      items: [{ type: 'warrior', id: 1, color: 'yellow' }],
      targets: [{ type: 'treasure', position: 'center', color: 'yellow' }]
    },
    {
      id: 3,
      title: "Space Between Warriors",
      description: "Spread the warriors to guard all entrances!",
      instruction: "Use justify-content to distribute warriors with space between them.",
      hint: "justify-content: space-between; distributes items evenly.",
      targetProperty: "justify-content",
      correctValue: "space-between",
      initialCode: "justify-content: flex-start;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' }
      ],
      targets: [
        { type: 'treasure', position: 'start', color: 'red' },
        { type: 'treasure', position: 'end', color: 'yellow' }
      ]
    },
    {
      id: 4,
      title: "Space Around Formation",
      description: "Create equal space around each warrior!",
      instruction: "Use justify-content to add space around warriors.",
      hint: "justify-content: space-around; adds equal space around each item.",
      targetProperty: "justify-content",
      correctValue: "space-around",
      initialCode: "justify-content: flex-start;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' }
      ],
      targets: [
        { type: 'treasure', position: 'around-1', color: 'red' },
        { type: 'treasure', position: 'around-2', color: 'yellow' }
      ]
    },
    {
      id: 5,
      title: "Space Evenly",
      description: "Distribute warriors with perfectly even spacing!",
      instruction: "Use justify-content to create even space between and around warriors.",
      hint: "justify-content: space-evenly; creates equal space everywhere.",
      targetProperty: "justify-content",
      correctValue: "space-evenly",
      initialCode: "justify-content: flex-start;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' }
      ],
      targets: [
        { type: 'treasure', position: 'evenly-1', color: 'red' },
        { type: 'treasure', position: 'evenly-2', color: 'yellow' },
        { type: 'treasure', position: 'evenly-3', color: 'green' }
      ]
    },

    // Level 6-10: Basic align-items
    {
      id: 6,
      title: "Vertical Alignment",
      description: "Align the warrior to the top of the battlefield!",
      instruction: "Use align-items to move the warrior to the top.",
      hint: "align-items: flex-start; aligns items to the top.",
      targetProperty: "align-items",
      correctValue: "flex-start",
      initialCode: "align-items: stretch;",
      items: [{ type: 'warrior', id: 1, color: 'red' }],
      targets: [{ type: 'treasure', position: 'top', color: 'red' }]
    },
    {
      id: 7,
      title: "Bottom Alignment",
      description: "Send the warrior to the bottom position!",
      instruction: "Use align-items to align the warrior to the bottom.",
      hint: "align-items: flex-end; aligns items to the bottom.",
      targetProperty: "align-items",
      correctValue: "flex-end",
      initialCode: "align-items: stretch;",
      items: [{ type: 'warrior', id: 1, color: 'yellow' }],
      targets: [{ type: 'treasure', position: 'bottom', color: 'yellow' }]
    },
    {
      id: 8,
      title: "Perfect Center",
      description: "Position the warrior in the exact center!",
      instruction: "Use both justify-content and align-items to center perfectly.",
      hint: "Combine justify-content: center; and align-items: center;",
      targetProperty: "both",
      correctValue: "center center",
      initialCode: "justify-content: flex-start;\nalign-items: stretch;",
      items: [{ type: 'warrior', id: 1, color: 'green' }],
      targets: [{ type: 'treasure', position: 'center-center', color: 'green' }]
    },
    {
      id: 9,
      title: "Multiple Warriors Vertical",
      description: "Align all warriors to the center vertically!",
      instruction: "Use align-items to center all warriors vertically.",
      hint: "align-items: center; centers all items on the cross axis.",
      targetProperty: "align-items",
      correctValue: "center",
      initialCode: "align-items: stretch;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' }
      ],
      targets: [
        { type: 'treasure', position: 'v-center-1', color: 'red' },
        { type: 'treasure', position: 'v-center-2', color: 'yellow' },
        { type: 'treasure', position: 'v-center-3', color: 'green' }
      ]
    },
    {
      id: 10,
      title: "Baseline Alignment",
      description: "Align warriors to their baseline!",
      instruction: "Use align-items to align warriors to their baseline.",
      hint: "align-items: baseline; aligns items to their text baseline.",
      targetProperty: "align-items",
      correctValue: "baseline",
      initialCode: "align-items: stretch;",
      items: [
        { type: 'warrior', id: 1, color: 'red', size: 'small' },
        { type: 'warrior', id: 2, color: 'yellow', size: 'large' },
        { type: 'warrior', id: 3, color: 'green', size: 'medium' }
      ],
      targets: [
        { type: 'treasure', position: 'baseline-1', color: 'red' },
        { type: 'treasure', position: 'baseline-2', color: 'yellow' },
        { type: 'treasure', position: 'baseline-3', color: 'green' }
      ]
    },

    // Level 11-15: flex-direction
    {
      id: 11,
      title: "Column Formation",
      description: "Change to vertical formation!",
      instruction: "Use flex-direction to arrange warriors vertically.",
      hint: "flex-direction: column; changes the main axis to vertical.",
      targetProperty: "flex-direction",
      correctValue: "column",
      initialCode: "flex-direction: row;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' }
      ],
      targets: [
        { type: 'treasure', position: 'col-1', color: 'red' },
        { type: 'treasure', position: 'col-2', color: 'yellow' }
      ]
    },
    {
      id: 12,
      title: "Reverse Row",
      description: "Reverse the warrior order horizontally!",
      instruction: "Use flex-direction to reverse the horizontal order.",
      hint: "flex-direction: row-reverse; reverses the horizontal order.",
      targetProperty: "flex-direction",
      correctValue: "row-reverse",
      initialCode: "flex-direction: row;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' }
      ],
      targets: [
        { type: 'treasure', position: 'rev-1', color: 'green' },
        { type: 'treasure', position: 'rev-2', color: 'yellow' },
        { type: 'treasure', position: 'rev-3', color: 'red' }
      ]
    },
    {
      id: 13,
      title: "Reverse Column",
      description: "Reverse the vertical formation!",
      instruction: "Use flex-direction to reverse the vertical order.",
      hint: "flex-direction: column-reverse; reverses the vertical order.",
      targetProperty: "flex-direction",
      correctValue: "column-reverse",
      initialCode: "flex-direction: column;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' }
      ],
      targets: [
        { type: 'treasure', position: 'col-rev-1', color: 'yellow' },
        { type: 'treasure', position: 'col-rev-2', color: 'red' }
      ]
    },
    {
      id: 14,
      title: "Column with Centering",
      description: "Create a centered vertical formation!",
      instruction: "Use flex-direction: column and justify-content: center.",
      hint: "In column mode, justify-content controls vertical positioning.",
      targetProperty: "column-center",
      correctValue: "column center",
      initialCode: "flex-direction: row;\njustify-content: flex-start;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' }
      ],
      targets: [
        { type: 'treasure', position: 'col-center-1', color: 'red' },
        { type: 'treasure', position: 'col-center-2', color: 'yellow' }
      ]
    },
    {
      id: 15,
      title: "Column End Alignment",
      description: "Align warriors to the bottom in column mode!",
      instruction: "Use flex-direction: column and justify-content: flex-end.",
      hint: "In column mode, justify-content: flex-end moves items to bottom.",
      targetProperty: "column-end",
      correctValue: "column flex-end",
      initialCode: "flex-direction: row;\njustify-content: flex-start;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' }
      ],
      targets: [
        { type: 'treasure', position: 'col-end-1', color: 'red' },
        { type: 'treasure', position: 'col-end-2', color: 'yellow' }
      ]
    },

    // Level 16-20: flex-wrap and order
    {
      id: 16,
      title: "Wrap the Army",
      description: "Allow warriors to wrap to multiple lines!",
      instruction: "Use flex-wrap to allow wrapping.",
      hint: "flex-wrap: wrap; allows items to wrap to new lines.",
      targetProperty: "flex-wrap",
      correctValue: "wrap",
      initialCode: "flex-wrap: nowrap;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' },
        { type: 'warrior', id: 4, color: 'blue' },
        { type: 'warrior', id: 5, color: 'purple' }
      ],
      targets: []
    },
    {
      id: 17,
      title: "Wrap Reverse",
      description: "Wrap warriors in reverse order!",
      instruction: "Use flex-wrap to wrap in reverse.",
      hint: "flex-wrap: wrap-reverse; wraps items in reverse order.",
      targetProperty: "flex-wrap",
      correctValue: "wrap-reverse",
      initialCode: "flex-wrap: wrap;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' },
        { type: 'warrior', id: 4, color: 'blue' }
      ],
      targets: []
    },
    {
      id: 18,
      title: "Order Property",
      description: "Change the order of specific warriors!",
      instruction: "Use order property on the red warrior to move it to the end.",
      hint: "Add 'order: 1;' to move an item to the end.",
      targetProperty: "order",
      correctValue: "1",
      initialCode: "",
      items: [
        { type: 'warrior', id: 1, color: 'red', needsOrder: true },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' }
      ],
      targets: [
        { type: 'treasure', position: 'order-1', color: 'yellow' },
        { type: 'treasure', position: 'order-2', color: 'green' },
        { type: 'treasure', position: 'order-3', color: 'red' }
      ]
    },
    {
      id: 19,
      title: "Negative Order",
      description: "Use negative order to move warriors forward!",
      instruction: "Use order: -1 on the yellow warrior to move it first.",
      hint: "Negative order values move items before others.",
      targetProperty: "order",
      correctValue: "-1",
      initialCode: "",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow', needsOrder: true },
        { type: 'warrior', id: 3, color: 'green' }
      ],
      targets: [
        { type: 'treasure', position: 'neg-order-1', color: 'yellow' },
        { type: 'treasure', position: 'neg-order-2', color: 'red' },
        { type: 'treasure', position: 'neg-order-3', color: 'green' }
      ]
    },
    {
      id: 20,
      title: "Complex Ordering",
      description: "Reorder multiple warriors using different order values!",
      instruction: "Set order values to arrange: green(1), red(2), yellow(3).",
      hint: "Use order: 1; order: 2; order: 3; on different warriors.",
      targetProperty: "complex-order",
      correctValue: "1 2 3",
      initialCode: "",
      items: [
        { type: 'warrior', id: 1, color: 'red', needsOrder: true, orderValue: 2 },
        { type: 'warrior', id: 2, color: 'yellow', needsOrder: true, orderValue: 3 },
        { type: 'warrior', id: 3, color: 'green', needsOrder: true, orderValue: 1 }
      ],
      targets: [
        { type: 'treasure', position: 'complex-1', color: 'green' },
        { type: 'treasure', position: 'complex-2', color: 'red' },
        { type: 'treasure', position: 'complex-3', color: 'yellow' }
      ]
    },

    // Level 21-24: Advanced combinations
    {
      id: 21,
      title: "Align Content",
      description: "Align wrapped lines of warriors!",
      instruction: "Use align-content to center wrapped lines.",
      hint: "align-content: center; centers wrapped lines.",
      targetProperty: "align-content",
      correctValue: "center",
      initialCode: "flex-wrap: wrap;\nalign-content: stretch;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' },
        { type: 'warrior', id: 4, color: 'blue' },
        { type: 'warrior', id: 5, color: 'purple' },
        { type: 'warrior', id: 6, color: 'orange' }
      ],
      targets: []
    },
    {
      id: 22,
      title: "Align Self",
      description: "Individual warrior alignment!",
      instruction: "Use align-self on the yellow warrior to align it to flex-end.",
      hint: "align-self: flex-end; overrides align-items for individual items.",
      targetProperty: "align-self",
      correctValue: "flex-end",
      initialCode: "align-items: center;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow', needsAlignSelf: true },
        { type: 'warrior', id: 3, color: 'green' }
      ],
      targets: [
        { type: 'treasure', position: 'self-1', color: 'red' },
        { type: 'treasure', position: 'self-2', color: 'yellow' },
        { type: 'treasure', position: 'self-3', color: 'green' }
      ]
    },
    {
      id: 23,
      title: "Flex Grow",
      description: "Make warriors grow to fill space!",
      instruction: "Use flex-grow on the middle warrior to make it expand.",
      hint: "flex-grow: 1; makes an item grow to fill available space.",
      targetProperty: "flex-grow",
      correctValue: "1",
      initialCode: "",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow', needsFlexGrow: true },
        { type: 'warrior', id: 3, color: 'green' }
      ],
      targets: [
        { type: 'treasure', position: 'grow-1', color: 'red' },
        { type: 'treasure', position: 'grow-2', color: 'yellow' },
        { type: 'treasure', position: 'grow-3', color: 'green' }
      ]
    },
    {
      id: 24,
      title: "Master Challenge",
      description: "Use all flexbox properties to create the perfect formation!",
      instruction: "Combine multiple properties to achieve the target layout.",
      hint: "Use flex-direction, justify-content, align-items, and flex-wrap together.",
      targetProperty: "master",
      correctValue: "column wrap center center",
      initialCode: "flex-direction: row;\nflex-wrap: nowrap;\njustify-content: flex-start;\nalign-items: stretch;",
      items: [
        { type: 'warrior', id: 1, color: 'red' },
        { type: 'warrior', id: 2, color: 'yellow' },
        { type: 'warrior', id: 3, color: 'green' },
        { type: 'warrior', id: 4, color: 'blue' },
        { type: 'warrior', id: 5, color: 'purple' },
        { type: 'warrior', id: 6, color: 'orange' }
      ],
      targets: [
        { type: 'treasure', position: 'master-1', color: 'red' },
        { type: 'treasure', position: 'master-2', color: 'yellow' },
        { type: 'treasure', position: 'master-3', color: 'green' },
        { type: 'treasure', position: 'master-4', color: 'blue' },
        { type: 'treasure', position: 'master-5', color: 'purple' },
        { type: 'treasure', position: 'master-6', color: 'orange' }
      ]
    }
  ];

  const currentLevelData = levels[currentLevel - 1];

  useEffect(() => {
    // Ensure user can't access locked levels
    if (currentLevel > 1 && !completedLevels.has(currentLevel - 1)) {
      setCurrentLevel(1);
      return;
    }
    
    setUserCode(currentLevelData.initialCode);
    setIsCorrect(false);
    setShowHint(false);
  }, [currentLevel, completedLevels]);

  // Real-time checking as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAnswer();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [userCode, currentLevelData]);

  const checkAnswer = () => {
    const level = currentLevelData;
    let correct = false;

    switch (level.targetProperty) {
      case "both":
        correct = userCode.includes("justify-content: center") && userCode.includes("align-items: center");
        break;
      case "column-center":
        correct = userCode.includes("flex-direction: column") && userCode.includes("justify-content: center");
        break;
      case "column-end":
        correct = userCode.includes("flex-direction: column") && userCode.includes("justify-content: flex-end");
        break;
      case "order":
        correct = userCode.includes(`order: ${level.correctValue}`);
        break;
      case "complex-order":
        const hasOrder1 = userCode.includes("order: 1");
        const hasOrder2 = userCode.includes("order: 2");
        const hasOrder3 = userCode.includes("order: 3");
        correct = hasOrder1 && hasOrder2 && hasOrder3;
        break;
      case "align-self":
        correct = userCode.includes(`align-self: ${level.correctValue}`);
        break;
      case "flex-grow":
        correct = userCode.includes(`flex-grow: ${level.correctValue}`);
        break;
      case "master":
        correct = userCode.includes("flex-direction: column") && 
                  userCode.includes("flex-wrap: wrap") && 
                  userCode.includes("justify-content: center") &&
                  userCode.includes("align-items: center");
        break;
      default:
        const regex = new RegExp(`${level.targetProperty}:\\s*${level.correctValue}`);
        correct = regex.test(userCode);
    }

    setIsCorrect(correct);
    
    if (correct && !completedLevels.has(currentLevel)) {
      setCompletedLevels(prev => new Set([...prev, currentLevel]));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const prevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  const resetLevel = () => {
    setUserCode(currentLevelData.initialCode);
    setIsCorrect(false);
    setShowHint(false);
  };

  const getFlexboxStyles = () => {
    const styles = { 
      display: 'flex',
      minHeight: '200px',
      width: '100%',
      position: 'relative'
    };
    
    // Parse user code to extract CSS properties
    const lines = userCode.split('\n');
    lines.forEach(line => {
      const [property, value] = line.split(':').map(s => s?.trim());
      if (property && value) {
        const cleanValue = value.replace(';', '').trim();
        const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styles[camelCaseProperty] = cleanValue;
      }
    });
    
    return styles;
  };

  const getItemStyles = (item) => {
    const styles = {};
    
    // Parse individual item properties from user code
    const lines = userCode.split('\n');
    lines.forEach(line => {
      const [property, value] = line.split(':').map(s => s?.trim());
      if (property && value) {
        const cleanValue = value.replace(';', '').trim();
        
        // Apply individual properties to specific items
        if (item.needsOrder && property === 'order') {
          styles.order = cleanValue;
        }
        if (item.needsAlignSelf && property === 'align-self') {
          styles.alignSelf = cleanValue;
        }
        if (item.needsFlexGrow && property === 'flex-grow') {
          styles.flexGrow = cleanValue;
        }
      }
    });
    
    return styles;
  };

  return (
    <div className="flexbox-arena">
      {/* Header */}
      <div className="arena-header">
        <button onClick={() => navigate('/dashboard')} className="back-button cursor-target">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="arena-title">
          <GiSwordman className="arena-icon" />
          <h1>Flexbox Arena</h1>
        </div>
        <div className="level-info">
          <div className="level-selector">
            <select 
              value={currentLevel} 
              onChange={(e) => {
                const selectedLevel = parseInt(e.target.value);
                // Only allow access to level 1 or completed levels + 1
                if (selectedLevel === 1 || completedLevels.has(selectedLevel - 1)) {
                  setCurrentLevel(selectedLevel);
                } else {
                  // Show locked message
                  setShowLockedMessage(true);
                  setTimeout(() => setShowLockedMessage(false), 2000);
                }
              }}
              className="level-dropdown cursor-target"
            >
              {levels.map((level) => {
                const isAccessible = level.id === 1 || completedLevels.has(level.id - 1);
                return (
                  <option 
                    key={level.id} 
                    value={level.id}
                    disabled={!isAccessible}
                  >
                    Level {level.id} {completedLevels.has(level.id) ? '✓' : ''} {!isAccessible ? '[LOCKED]' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <span className="level-badge">Level {currentLevel}/{levels.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedLevels.size / levels.length) * 100}%` }}
            />
            <div 
              className="progress-accessible" 
              style={{ width: `${(Math.max(completedLevels.size + 1, 1) / levels.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="arena-content">
        {/* Left Panel - Instructions */}
        <div className="instructions-panel">
          <div className="level-header">
            <h2>{currentLevelData.title}</h2>
            <p className="level-description">{currentLevelData.description}</p>
          </div>

          <div className="instruction-card">
            <div className="instruction-icon">
              <FaCode />
            </div>
            <div className="instruction-content">
              <h3>Your Mission</h3>
              <p>{currentLevelData.instruction}</p>
            </div>
          </div>

          {showHint && (
            <motion.div 
              className="hint-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hint-icon">
                <FaLightbulb />
              </div>
              <div className="hint-content">
                <h4>Hint</h4>
                <p>{currentLevelData.hint}</p>
              </div>
            </motion.div>
          )}

          <div className="controls">
            <button 
              onClick={() => setShowHint(!showHint)} 
              className="hint-button cursor-target"
            >
              <FaLightbulb /> {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button onClick={resetLevel} className="reset-button cursor-target">
              <FaRedo /> Reset Level
            </button>
          </div>

          {completedLevels.size > 0 && (
            <div className="progress-controls">
              <button 
                onClick={() => {
                  setCompletedLevels(new Set());
                  setCurrentLevel(1);
                }} 
                className="reset-progress-button cursor-target"
              >
                <FaRedo /> Reset All Progress
              </button>
            </div>
          )}

          <div className="level-completion">
            {completedLevels.has(currentLevel) && (
              <div className="completion-badge">
                <FaCheckCircle /> Level Complete!
              </div>
            )}
            {!completedLevels.has(currentLevel) && currentLevel > 1 && !completedLevels.has(currentLevel - 1) && (
              <div className="locked-badge">
                <FaLock /> Complete Level {currentLevel - 1} to unlock this level
              </div>
            )}
            <div className="completion-stats">
              Completed: {completedLevels.size}/{levels.length} levels
            </div>
          </div>

          <div className="navigation">
            <button 
              onClick={prevLevel} 
              disabled={currentLevel === 1}
              className="nav-button cursor-target"
            >
              Previous
            </button>
            <button 
              onClick={nextLevel} 
              disabled={currentLevel === levels.length || !completedLevels.has(currentLevel)}
              className={`nav-button cursor-target ${!completedLevels.has(currentLevel) ? 'locked' : ''}`}
              title={!completedLevels.has(currentLevel) ? 'Complete this level to unlock next level' : 'Go to next level'}
            >
              {!completedLevels.has(currentLevel) ? (
                <><FaLock /> Complete Level First</>
              ) : (
                <>Next <FaForward /></>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Game Area */}
        <div className="game-panel">
          {/* Code Editor */}
          <div className="code-editor">
            <div className="editor-header">
              <FaCode /> CSS Flexbox Properties
            </div>
            <div className="editor-content">
              <div className="css-rule">
                <span className="selector">.battlefield</span>
                <span className="brace"> {`{`}</span>
              </div>
              <div className="css-properties">
                <span className="property">display</span>
                <span className="colon">:</span>
                <span className="value">flex</span>
                <span className="semicolon">;</span>
              </div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="code-input cursor-target"
                placeholder={`Enter CSS properties like:\n${currentLevelData.hint.split(':')[1]?.trim() || 'justify-content: center;'}`}
                rows={Math.max(4, userCode.split('\n').length + 1)}
              />
              <div className="css-rule">
                <span className="brace">{`}`}</span>
              </div>
            </div>
            <button onClick={checkAnswer} className="check-button cursor-target">
              <FaPlay /> Apply CSS
            </button>
          </div>

          {/* Battlefield Visualization */}
          <div className="battlefield-container">
            <div className="battlefield-header">
              <span>Battlefield Preview</span>
              {isCorrect && (
                <motion.div 
                  className="success-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <FaCheckCircle /> Perfect Formation!
                </motion.div>
              )}
            </div>
            <div 
              className={`battlefield ${isCorrect ? 'correct' : ''}`}
              style={getFlexboxStyles()}
            >
              {/* Render targets first (background) */}
              {currentLevelData.targets.map((target, index) => (
                <div 
                  key={`target-${index}`} 
                  className={`target ${target.type} ${target.position} ${target.color || ''} ${isCorrect ? 'target-hit' : ''}`}
                  data-color={target.color}
                />
              ))}
              
              {/* Render warriors with real-time movement */}
              {currentLevelData.items.map((item) => (
                <motion.div
                  key={`${currentLevel}-${item.id}`}
                  className={`game-item ${item.type} ${item.color || ''} ${item.size || ''} ${isCorrect ? 'warrior-success' : ''}`}
                  style={getItemStyles(item)}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: isCorrect ? 1.1 : 1, 
                    rotate: 0,
                    transition: { 
                      type: "spring", 
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  layout
                  transition={{ 
                    layout: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30 
                    } 
                  }}
                  data-color={item.color}
                >
                  <GiSwordman />
                  {isCorrect && (
                    <motion.div 
                      className="success-indicator-small"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <FaCheckCircle />
                    </motion.div>
                  )}
                  {item.needsOrder && (
                    <div className="property-indicator">order</div>
                  )}
                  {item.needsAlignSelf && (
                    <div className="property-indicator">align-self</div>
                  )}
                  {item.needsFlexGrow && (
                    <div className="property-indicator">flex-grow</div>
                  )}
                </motion.div>
              ))}
            </div>
            

          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="celebration-card"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <FaTrophy className="celebration-icon" />
              <h2>
                {currentLevel === levels.length ? 'Flexbox Master!' : 'Level Complete!'}
              </h2>
              <p>
                {currentLevel === levels.length 
                  ? 'You have mastered all 24 levels of Flexbox Arena!' 
                  : `Level ${currentLevel} conquered! The warriors are in perfect formation!`
                }
              </p>
              <div className="celebration-xp">
                +{currentLevel * 50} XP
              </div>
              {currentLevel === levels.length && (
                <div className="master-badge">
                  <FaTrophy /> Flexbox Grandmaster <FaTrophy />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked Level Message */}
      <AnimatePresence>
        {showLockedMessage && (
          <motion.div
            className="locked-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="locked-message"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
            >
              <FaTimesCircle className="locked-icon" />
              <h3>Level Locked!</h3>
              <p>Complete the previous level to unlock this one.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlexboxArena;