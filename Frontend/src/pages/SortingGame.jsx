import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCode, FaPlay, FaPause, FaRedo, FaForward } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./SortingGame.css";

// Algorithm metadata and code snippets
const ALGORITHMS = {
  bubble: { name: "Bubble Sort", difficulty: "easy", color: "#7b61ff" },
  selection: { name: "Selection Sort", difficulty: "easy", color: "#26d0ce" },
  insertion: { name: "Insertion Sort", difficulty: "medium", color: "#ffa801" },
  merge: { name: "Merge Sort", difficulty: "medium", color: "#2ed573" },
  quick: { name: "Quick Sort", difficulty: "hard", color: "#ff6b9d" },
  heap: { name: "Heap Sort", difficulty: "hard", color: "#9b59b6" },
};

const CODE_SNIPPETS = {
  bubble: [
    "for i in range(0, n-1):",
    "  for j in range(0, n-i-1):",
    "    if a[j] > a[j+1]:",
    "      swap(a[j], a[j+1])",
  ],
  selection: [
    "for i in range(0, n-1):",
    "  minIdx = i",
    "  for j in range(i+1, n):",
    "    if a[j] < a[minIdx]:",
    "      minIdx = j",
    "  swap(a[i], a[minIdx])",
  ],
  insertion: [
    "for i in range(1, n):",
    "  key = a[i]",
    "  j = i-1",
    "  while j >= 0 and a[j] > key:",
    "    a[j+1] = a[j]; j -= 1",
    "  a[j+1] = key",
  ],
  merge: [
    "def mergeSort(a):",
    "  if n <= 1: return",
    "  mid = n//2",
    "  left = mergeSort(a[:mid])",
    "  right = mergeSort(a[mid:])",
    "  merge(left, right)",
  ],
  quick: [
    "def quickSort(a, l, r):",
    "  if l >= r: return",
    "  p = partition(a, l, r)",
    "  quickSort(a, l, p-1)",
    "  quickSort(a, p+1, r)",
  ],
  heap: [
    "buildMaxHeap(a)",
    "for end in range(n-1, 0, -1):",
    "  swap(a[0], a[end])",
    "  siftDown(a, 0, end-1)",
  ],
};

// Instrumented step generators for demo + learning
const Engines = {
  bubble: {
    initialize: (arr) => ({ i: 0, j: 0, n: arr.length }),
    next: (arr, s) => {
      const { i, j, n } = s;
      if (i >= n - 1) return { done: true, sortedIndices: Array.from({ length: n }, (_, k) => k) };
      const comparing = [j, j + 1];
      const shouldSwap = arr[j] > arr[j + 1];
      const highlightLine = shouldSwap ? 3 : 2;
      let explanation = shouldSwap ? `Swap ${arr[j]} and ${arr[j + 1]} because ${arr[j]} > ${arr[j + 1]}` : `No swap needed for ${arr[j]} and ${arr[j + 1]}`;
      const advance = () => {
        let nj = j + 1;
        let ni = i;
        let sorted = [];
        if (nj >= n - i - 1) {
          nj = 0;
          ni = i + 1;
          sorted = [n - i - 1];
        }
        return { i: ni, j: nj, n };
      };
      return { comparing, shouldSwap, swap: shouldSwap ? [j, j + 1] : null, set: advance(), explanation, highlightLine };
    },
  },
  selection: {
    initialize: (arr) => ({ i: 0, j: 1, minIdx: 0, n: arr.length, phase: "scan" }),
    next: (arr, s) => {
      const { i, j, minIdx, n, phase } = s;
      if (i >= n - 1) return { done: true, sortedIndices: Array.from({ length: n }, (_, k) => k) };
      if (phase === "scan") {
        if (j >= n) {
          if (minIdx !== i) {
            return {
              comparing: [i, minIdx],
              shouldSwap: true,
              swap: [i, minIdx],
              set: { i: i + 1, j: i + 2, minIdx: i + 1, n, phase: "scan" },
              explanation: `Swap smallest found (${arr[minIdx]}) into position ${i}`,
              highlightLine: 5,
            };
          } else {
            return {
              comparing: [],
              shouldSwap: false,
              swap: null,
              set: { i: i + 1, j: i + 2, minIdx: i + 1, n, phase: "scan" },
              explanation: `Position ${i} already minimal (${arr[i]}), move to next i`,
              highlightLine: 0,
            };
          }
        }
        const shouldUpdateMin = arr[j] < arr[minIdx];
        const nextState = { i, j: j + 1, minIdx: shouldUpdateMin ? j : minIdx, n, phase: "scan" };
        return {
          comparing: [j, minIdx],
          shouldSwap: false,
          swap: null,
          set: nextState,
          explanation: shouldUpdateMin ? `${arr[j]} < ${arr[minIdx]} → new min at ${j}` : `${arr[j]} ≥ ${arr[minIdx]} → keep min at ${minIdx}`,
          highlightLine: shouldUpdateMin ? 4 : 3,
          minIndex: shouldUpdateMin ? j : minIdx,
        };
      }
    },
  },
  insertion: {
    initialize: (arr) => ({ i: 1, j: 1, key: arr[1], n: arr.length, phase: "shift" }),
    next: (arr, s) => {
      let { i, j, key, n } = s;
      if (i >= n) return { done: true, sortedIndices: Array.from({ length: n }, (_, k) => k) };
      if (j > 0 && arr[j - 1] > key) {
        return {
          comparing: [j - 1, j],
          shouldSwap: true,
          swap: [j - 1, j],
          set: { i, j: j - 1, key, n, phase: "shift" },
          explanation: `${arr[j - 1]} > key (${key}) → shift right`,
          highlightLine: 4,
        };
      } else {
        // place key (no-op if already in place)
        return {
          comparing: [],
          shouldSwap: false,
          swap: null,
          set: { i: i + 1, j: i + 1, key: arr[i + 1], n, phase: "shift" },
          explanation: `Place key and move to next i`,
          highlightLine: 5,
        };
      }
    },
  },
};

// Utility to generate demo steps for more complex algorithms (merge/quick/heap)
function instrumentedDemoSteps(algo, srcArray) {
  const steps = [];
  const arr = [...srcArray];
  const pushSwap = (i, j, expl, meta) => steps.push({ comparing: [i, j], shouldSwap: true, swap: [i, j], explanation: expl, meta });
  const pushCompare = (i, j, expl, meta) => steps.push({ comparing: [i, j], shouldSwap: false, swap: null, explanation: expl, meta });
  if (algo === "merge") {
    // simple demo using insertion to simulate merge (visual only)
    // This produces a stable sort via insertion logic, adequate for demo
    for (let i = 1; i < arr.length; i++) {
      let j = i;
      while (j > 0) {
        pushCompare(j - 1, j, `Compare ${arr[j - 1]} and ${arr[j]}`, { leftSize: j, rightSize: arr.length - j });
        if (arr[j - 1] > arr[j]) {
          pushSwap(j - 1, j, `Swap ${arr[j - 1]} and ${arr[j]}`, { leftSize: j, rightSize: arr.length - j });
          [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
          j--;
        } else break;
      }
    }
  } else if (algo === "quick") {
    const qs = (l, r) => {
      if (l >= r) return;
      const pivot = arr[r];
      let p = l;
      for (let i = l; i < r; i++) {
        pushCompare(i, r, `Compare ${arr[i]} with pivot ${pivot}`, { l, r, p, pivot, i });
        if (arr[i] <= pivot) {
          if (i !== p) { pushSwap(i, p, `Swap ${arr[i]} with ${arr[p]}`, { l, r, p, pivot, i }); [arr[i], arr[p]] = [arr[p], arr[i]]; }
          p++;
        }
      }
      pushSwap(p, r, `Place pivot at position ${p}`, { l, r, p, pivot });
      [arr[p], arr[r]] = [arr[r], arr[p]];
      qs(l, p - 1);
      qs(p + 1, r);
    };
    qs(0, arr.length - 1);
  } else if (algo === "heap") {
    const heapify = (n, i) => {
      let largest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n) { pushCompare(l, largest, `Compare ${arr[l]} and ${arr[largest]}`, { n, i, l, r }); if (arr[l] > arr[largest]) largest = l; }
      if (r < n) { pushCompare(r, largest, `Compare ${arr[r]} and ${arr[largest]}`, { n, i, l, r }); if (arr[r] > arr[largest]) largest = r; }
      if (largest !== i) { pushSwap(i, largest, `Swap ${arr[i]} and ${arr[largest]}`, { n, i, l, r }); [arr[i], arr[largest]] = [arr[largest], arr[i]]; heapify(n, largest); }
    };
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
    for (let end = n - 1; end > 0; end--) { pushSwap(0, end, `Swap max ${arr[0]} to end`, { n: end }); [arr[0], arr[end]] = [arr[end], arr[0]]; heapify(end, 0); }
  }
  return steps;
}

const SortingGame = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Core state
  const [mode, setMode] = useState("menu"); // menu | demo | learning | completed
  const [algorithm, setAlgorithm] = useState("bubble");
  const [array, setArray] = useState([]);
  const [engineState, setEngineState] = useState(null);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [minIndex, setMinIndex] = useState(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [feedback, setFeedback] = useState({ message: "", type: "info" });
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [skin, setSkin] = useState("potions"); // bars | potions | crates
  const [activeLine, setActiveLine] = useState(0);
  const [rewardXP, setRewardXP] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const STORIES = {
    bubble: {
      title: "Potion Shelf Cleanup",
      text: "The Alchemist needs your help lining up potions by volume from smallest to largest. Compare neighbors and bubble the heaviest to the end!",
      defaultSkin: "potions"
    },
    selection: {
      title: "Treasure Lineup",
      text: "The Guild wants the smallest treasure up front each day. Scan the pile, pick the smallest, and place it at the start.",
      defaultSkin: "crates"
    },
    insertion: {
      title: "Library Shelves",
      text: "The Librarian inserts each new book into its proper spot. Shift heavier books right and place the key book in order.",
      defaultSkin: "bars"
    },
    merge: {
      title: "Cargo Merge",
      text: "Split cargo into halves and merge back neatly—watch the operation in a calm demo.",
      defaultSkin: "crates"
    },
    quick: {
      title: "Dungeon Keys",
      text: "Pick a pivot key and send smaller ones left, bigger ones right—see the partition magic in action.",
      defaultSkin: "bars"
    },
    heap: {
      title: "Skyport Loading",
      text: "Heap up the biggest crate to the top, then move it to the airship—repeat until sorted.",
      defaultSkin: "crates"
    }
  };

  // Derived demo steps for complex algorithms
  const demoStepsRef = useRef([]);
  const demoCursorRef = useRef(0);
  const demoMetaRef = useRef({});

  useEffect(() => {
    const seen = localStorage.getItem("sortingGameTutorialSeen");
    if (!seen) setShowTutorial(true);
  }, []);

  const newArray = (size = 8) => {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const start = (algo, startMode) => {
    setAlgorithm(algo);
    const arr = newArray(algo === "heap" ? 9 : 8);
    setArray(arr);
    setSwaps(0);
    setAccuracy(100);
    setFeedback({ message: "", type: "info" });
    setSelectedBar(null);
    setSorted([]);
    setMinIndex(null);
    setStepNumber(0);
    setDragOverIndex(null);
    setAutoPlay(false);
  const story = STORIES[algo];
  setSkin(story?.defaultSkin || "bars");
  setShowHint(false);
  setActiveLine(0);
    demoStepsRef.current = [];
    demoCursorRef.current = 0;
  demoMetaRef.current = {};
    if (startMode === "demo" && ["merge", "quick", "heap"].includes(algo)) {
      demoStepsRef.current = instrumentedDemoSteps(algo, arr);
    }
    const engine = Engines[algo];
    setEngineState(engine ? engine.initialize(arr) : null);
    setMode(startMode);
  };

  const highlightLine = activeLine;

  const getBarColor = (idx) => {
    if (swapping.includes(idx)) return "#e74c3c";
    if (comparing.includes(idx)) return "#f39c12";
    if (sorted.includes(idx)) return "#27ae60";
    if (minIndex === idx) return "#9b59b6";
    return `hsl(${240 + (array[idx] / array.length) * 100}, 70%, 60%)`;
  };

  const hintText = useMemo(() => {
    if (!showHint || mode !== 'learning') return '';
    const engine = Engines[algorithm];
    if (!engine || !engineState) return '';
    const step = engine.next(array, engineState);
    const expected = step?.comparing || [];
    if (!expected.length) return 'No comparison at this moment—place or proceed.';
    const a = expected[0], b = expected[1];
    const va = array[a], vb = array[b];
    switch (algorithm) {
      case 'bubble':
        return `Check neighbors at ${a} and ${b}. If ${va} > ${vb}, swap them.`;
      case 'selection':
        return `Scanning for minimum: compare ${va} (index ${a}) with current min ${vb} (index ${b}).`;
      case 'insertion':
        return `Shifting if needed: compare ${va} (left) with key ${vb} (right).`;
      default:
        return `Consider indices ${a} and ${b}.`;
    }
  }, [showHint, mode, algorithm, engineState, array]);

  const performSwap = async (i, j) => {
    setIsAnimating(true);
    setSwapping([i, j]);
    await new Promise((r) => setTimeout(r, 220));
    const copy = [...array];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setArray(copy);
    setSwapping([]);
    setIsAnimating(false);
  };

  const executeNextStep = async () => {
    if (isAnimating) return;
    if (mode === "demo" && ["merge", "quick", "heap"].includes(algorithm)) {
      const steps = demoStepsRef.current;
      if (demoCursorRef.current >= steps.length) return complete();
      const step = steps[demoCursorRef.current++];
      setComparing(step.comparing || []);
      setFeedback({ message: step.explanation || "", type: step.shouldSwap ? "success" : "info" });
      if (step.meta) demoMetaRef.current = step.meta;
      setActiveLine(typeof step.highlightLine === 'number' ? step.highlightLine : (step.shouldSwap ? (CODE_SNIPPETS[algorithm]?.length || 1) - 1 : 2));
      if (step.swap) {
        await performSwap(step.swap[0], step.swap[1]);
        setSwaps((s) => s + 1);
      }
      setStepNumber((n) => n + 1);
      if (demoCursorRef.current >= steps.length) complete();
      return;
    }
    const engine = Engines[algorithm];
    if (!engine || !engineState) return;
    const step = engine.next(array, engineState);
    if (step.done) return complete();
    setComparing(step.comparing || []);
    if (typeof step.minIndex === "number") setMinIndex(step.minIndex);
    setFeedback({ message: step.explanation || "", type: step.shouldSwap ? "success" : "info" });
    if (typeof step.highlightLine === 'number') setActiveLine(step.highlightLine);
    if (step.swap) {
      await performSwap(step.swap[0], step.swap[1]);
      setSwaps((s) => s + 1);
    }
    setEngineState({ ...engineState, ...(step.set || {}) });
    setStepNumber((n) => n + 1);
  };

  useEffect(() => {
    if (mode === "demo" && autoPlay) {
      const id = setInterval(() => executeNextStep(), 450);
      return () => clearInterval(id);
    }
  }, [mode, autoPlay, algorithm, engineState]);

  const complete = () => {
    setMode("completed");
    const gained = Math.max(50, 150 - swaps * 2);
    setRewardXP(gained);
    if (user) {
      const newXP = (user.totalXP || 0) + gained;
      updateUser({ ...user, totalXP: newXP });
    }
    setQuiz(generateQuiz(algorithm));
  };

  // Learning interactions
  const attemptMove = async (firstIdx, secondIdx, isSecond) => {
    if (isAnimating || mode !== "learning") return;
    const engine = Engines[algorithm];
    const step = engine.next(array, engineState);
    if (!step || step.done) return complete();
    const expected = step.comparing || [];
    if (!isSecond) {
      if (!expected.includes(firstIdx)) {
        setFeedback({ message: `❌ Choose one of [${expected.join(", ")}]`, type: "error" });
        setAccuracy((a) => Math.max(0, a - 3));
        return;
      }
      setSelectedBar(firstIdx);
      setFeedback({ message: `Now choose index ${expected.find((x) => x !== firstIdx)}`, type: "info" });
      return;
    }
    const pairOK = expected.length === 2 && ((firstIdx === expected[0] && secondIdx === expected[1]) || (firstIdx === expected[1] && secondIdx === expected[0]));
    if (!pairOK) {
      setFeedback({ message: `❌ Wrong pair. Expected [${expected.join(", ")}]`, type: "error" });
      setAccuracy((a) => Math.max(0, a - 5));
      setSelectedBar(null);
      return;
    }
    setSelectedBar(null);
    if (step.shouldSwap && step.swap) {
      await performSwap(step.swap[0], step.swap[1]);
      setSwaps((s) => s + 1);
      setFeedback({ message: `✅ ${step.explanation}`, type: "success" });
    } else {
      setFeedback({ message: `✅ ${step.explanation}`, type: "success" });
    }
    setEngineState({ ...engineState, ...(step.set || {}) });
    setStepNumber((n) => n + 1);
    if (engine.next(array, { ...engineState, ...(step.set || {}) }).done) complete();
  };

  // Quiz and share helpers
  function generateQuiz(algo) {
    const bank = {
      bubble: [
        { q: 'Bubble Sort worst-case time complexity?', a: ['O(n)', 'O(n log n)', 'O(n^2)'], c: 2 },
        { q: 'Bubble Sort compares which elements?', a: ['Any two', 'Adjacent neighbors', 'First and last'], c: 1 },
      ],
      selection: [
        { q: 'How many swaps per outer pass in Selection Sort?', a: ['0 or 1', 'At least i', 'Unlimited'], c: 0 },
        { q: 'Selection Sort finds...', a: ['Maximum prefix', 'Minimum of the unsorted part', 'Median every pass'], c: 1 },
      ],
      insertion: [
        { q: 'Insertion Sort works by...', a: ['Merging halves', 'Shifting larger left items right', 'Choosing a pivot'], c: 1 },
        { q: 'Best-case complexity for Insertion Sort?', a: ['O(n)', 'O(n log n)', 'O(n^2)'], c: 0 },
      ],
      quick: [
        { q: 'Quick Sort partitions around a...', a: ['median', 'pivot', 'random key only'], c: 1 },
        { q: 'Average time complexity of Quick Sort?', a: ['O(n)', 'O(n log n)', 'O(n^2)'], c: 1 },
      ],
      merge: [
        { q: 'Merge Sort space complexity?', a: ['O(1)', 'O(log n)', 'O(n)'], c: 2 },
        { q: 'Merge Sort time complexity?', a: ['O(n)', 'O(n log n)', 'O(n^2)'], c: 1 },
      ],
      heap: [
        { q: 'Heap Sort builds...', a: ['Binary search tree', 'Max-heap', 'Stack'], c: 1 },
        { q: 'Heap Sort time complexity?', a: ['O(n log n)', 'O(n)', 'O(n^2)'], c: 0 },
      ],
    };
    const pool = bank[algo] || bank.bubble;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { question: pick.q, options: pick.a, correct: pick.c };
  }

  const handleQuizAnswer = (idx) => {
    if (!quiz || quizResult) return;
    setQuizAnswer(idx);
    const correct = idx === quiz.correct;
    setQuizResult(correct ? 'correct' : 'wrong');
    if (correct && user) {
      const bonus = 25;
      const newXP = (user.totalXP || 0) + bonus;
      updateUser({ ...user, totalXP: newXP });
    }
  };

  const shareSummary = async () => {
    const text = `I just completed ${ALGORITHMS[algorithm]?.name} with ${accuracy}% accuracy and ${swaps} swaps!`;
    try {
      await navigator.clipboard.writeText(text);
      setFeedback({ message: 'Copied summary to clipboard!', type: 'success' });
    } catch {
      setFeedback({ message: text, type: 'info' });
    }
  };

  const onBarClick = (idx) => {
    if (mode !== "learning") return;
    if (selectedBar == null) attemptMove(idx, null, false);
    else attemptMove(selectedBar, idx, true);
  };
  const onDragStart = (e, idx) => {
    if (mode !== "learning" || isAnimating) return;
    try { e.dataTransfer.setData("text/plain", String(idx)); } catch {}
    setSelectedBar(idx);
  };
  const onDragOver = (e, idx) => { if (mode === "learning") { e.preventDefault(); setDragOverIndex(idx); } };
  const onDragLeave = () => setDragOverIndex(null);
  const onDrop = (e, idx) => {
    if (mode !== "learning" || isAnimating) return;
    e.preventDefault();
    const src = Number(e.dataTransfer?.getData("text/plain"));
    setDragOverIndex(null);
    if (!Number.isNaN(src) && src !== idx) attemptMove(src, idx, true);
  };

  // Variables and code-visualization data
  const variables = useMemo(() => {
    if (mode === 'learning') {
      if (algorithm === 'bubble' && engineState) {
        return { i: engineState.i, j: engineState.j };
      }
      if (algorithm === 'selection' && engineState) {
        return { i: engineState.i, j: engineState.j, minIdx: engineState.minIdx };
      }
      if (algorithm === 'insertion' && engineState) {
        return { i: engineState.i, j: engineState.j, key: engineState.key };
      }
    } else if (mode === 'demo' && demoStepsRef.current.length) {
      if (algorithm === 'quick') {
        const m = demoMetaRef.current || {}; return { l: m.l, r: m.r, pivotIndex: m.p, pivot: m.pivot };
      }
      if (algorithm === 'heap') {
        const m = demoMetaRef.current || {}; return { heapSize: m.n, i: m.i, left: m.l, right: m.r };
      }
      if (algorithm === 'merge') {
        const m = demoMetaRef.current || {}; return { leftSize: m.leftSize, rightSize: m.rightSize };
      }
    }
    return {};
  }, [mode, algorithm, engineState, stepNumber]);

  return (
    <div className="sorting-game">
      <div className="game-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="game-title">
          <h1>🎮 Sorting Showdown</h1>
          <p>Learn by doing: demos, guided steps, and challenges.</p>
        </div>
        <div className="score-display">
          <FaCode /> <span>{ALGORITHMS[algorithm]?.name}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === "menu" && (
          <motion.div className="game-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="menu-card">
              <h2>Choose an Algorithm</h2>
              <p className="menu-subtitle">Start with a Demo to watch, or jump into Learning to try steps yourself.</p>
              <div className="algorithms-grid">
                {Object.keys(ALGORITHMS).map((key) => {
                  const meta = ALGORITHMS[key];
                  return (
                    <motion.div key={key} className={`algorithm-card difficulty-${meta.difficulty}`} whileHover={{ y: -5, scale: 1.02 }}>
                      <div className="algorithm-icon">🧠</div>
                      <h3 style={{ margin: 6 }}>{meta.name}</h3>
                      <div className="algorithm-description">{meta.difficulty === 'easy' ? 'Great for getting started' : meta.difficulty === 'medium' ? 'Balanced challenge' : 'Advanced technique'}</div>
                      <div className="algorithm-complexity">Complexity: varies by algorithm</div>
                      <div className="algorithm-actions">
                        <button className="action-btn demo-btn" onClick={() => start(key, "demo")}><FaForward /> Demo</button>
                        <button className="action-btn play-btn" onClick={() => start(key, key === 'merge' || key === 'quick' || key === 'heap' ? 'demo' : 'learning')}>
                          <FaPlay /> {key === 'merge' || key === 'quick' || key === 'heap' ? 'Demo Only' : 'Learn'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="learning-info">
                <div className="info-grid">
                  <div className="info-item"><div className="info-icon">🎓</div><div>Interactive steps ensure you follow the algorithm correctly.</div></div>
                  <div className="info-item"><div className="info-icon">⌨️</div><div>Click or drag bars to act; hints guide you along.</div></div>
                  <div className="info-item"><div className="info-icon">💡</div><div>Code panel highlights the current line for each step.</div></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {(mode === "demo" || mode === "learning") && (
          <motion.div className="learning-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Code / Stats */}
            <div className="code-panel">
              <div className="panel-header"><FaCode /> Pseudocode</div>
              <div className="code-content">
                {(CODE_SNIPPETS[algorithm] || []).map((line, idx) => (
                  <div key={idx} className={`code-line ${highlightLine === idx ? 'active-line' : ''}`}>
                    <span className="line-number">{idx + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <div className="stats-panel">
                <div className="stat-row"><span>Steps</span><span>{stepNumber}</span></div>
                <div className="stat-row"><span>Swaps</span><span className="swap-stat">{swaps}</span></div>
                <div className="stat-row"><span>Accuracy</span><span className="accuracy-stat">{accuracy}%</span></div>
              </div>
              <div className="code-vis">
                <div className="array-chips">
                  {array.map((v, idx) => (
                    <div key={`chip-${idx}-${v}`} className={`chip ${comparing.includes(idx) ? 'comparing' : ''} ${swapping.includes(idx) ? 'swapping' : ''} ${sorted.includes(idx) ? 'sorted' : ''} ${minIndex === idx ? 'minimum' : ''}`}>
                      <span className="idx">{idx}</span>
                      <span className="val">{v}</span>
                    </div>
                  ))}
                </div>
                {Object.keys(variables).length > 0 && (
                  <div className="variables-grid">
                    {Object.entries(variables).map(([k, v]) => (
                      <div className="var" key={k}><span className="k">{k}</span><span className="v">{v ?? '-'}</span></div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visualization */}
            <div className="visualization-panel">
              <div className="algorithm-info-bar">
                <div className="phase-text">
                  <strong>{STORIES[algorithm]?.title}:</strong> {STORIES[algorithm]?.text}
                </div>
              </div>
              {feedback.message && <div className={`feedback-box ${feedback.type}`}>{feedback.message}</div>}
              <div className={`array-visualization ${feedback.type === 'error' ? 'shake' : ''}`}>
                <div className="legend">
                  <div className="legend-item"><div className="legend-color comparing-color" />Comparing</div>
                  <div className="legend-item"><div className="legend-color swapping-color" />Swapping</div>
                  <div className="legend-item"><div className="legend-color sorted-color" />Sorted</div>
                  <div className="legend-item"><div className="legend-color minimum-color" />Min</div>
                </div>
                <div className="bars-container">
                  {array.map((val, idx) => (
                    skin === 'bars' ? (
                      <motion.div
                        key={`bar-${idx}-${val}`}
                        className={`bar ${comparing.includes(idx) ? 'comparing' : ''} ${swapping.includes(idx) ? 'swapping' : ''} ${sorted.includes(idx) ? 'sorted' : ''} ${minIndex === idx ? 'minimum' : ''} ${dragOverIndex === idx ? 'drag-over' : ''} ${selectedBar === idx ? 'selected' : ''}`}
                        style={{ height: `${(val / array.length) * 100}%`, backgroundColor: getBarColor(idx), transformPerspective: 600 }}
                        onClick={() => onBarClick(idx)}
                        draggable={mode === 'learning'}
                        onDragStart={(e) => onDragStart(e, idx)}
                        onDragOver={(e) => onDragOver(e, idx)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, idx)}
                        whileHover={{ scale: 1.06, rotateX: 4, rotateY: -4 }}
                        whileTap={{ scale: 0.96 }}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      >
                        <span className="bar-value">{val}</span>
                      </motion.div>
                    ) : skin === 'potions' ? (
                      <motion.div
                        key={`potion-${idx}-${val}`}
                        className={`item potion ${comparing.includes(idx) ? 'comparing' : ''} ${swapping.includes(idx) ? 'swapping' : ''} ${sorted.includes(idx) ? 'sorted' : ''} ${dragOverIndex === idx ? 'drag-over' : ''} ${selectedBar === idx ? 'selected' : ''}`}
                        onClick={() => onBarClick(idx)}
                        draggable={mode === 'learning'}
                        onDragStart={(e) => onDragStart(e, idx)}
                        onDragOver={(e) => onDragOver(e, idx)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, idx)}
                        whileHover={{ scale: 1.06, rotateX: 3, rotateY: -3 }}
                        whileTap={{ scale: 0.96 }}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      >
                        <div className="neck" />
                        <div className="glass">
                          <div className="liquid" style={{ height: `${(val / array.length) * 100}%`, background: getBarColor(idx) }} />
                        </div>
                        <span className="label">{val}</span>
                        <div className="stand" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`crate-${idx}-${val}`}
                        className={`item crate ${comparing.includes(idx) ? 'comparing' : ''} ${swapping.includes(idx) ? 'swapping' : ''} ${sorted.includes(idx) ? 'sorted' : ''} ${dragOverIndex === idx ? 'drag-over' : ''} ${selectedBar === idx ? 'selected' : ''}`}
                        style={{ height: `${(val / array.length) * 100}%` }}
                        onClick={() => onBarClick(idx)}
                        draggable={mode === 'learning'}
                        onDragStart={(e) => onDragStart(e, idx)}
                        onDragOver={(e) => onDragOver(e, idx)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, idx)}
                        whileHover={{ scale: 1.04, rotateX: 2, rotateY: -2 }}
                        whileTap={{ scale: 0.96 }}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      >
                        <div className="slats" />
                        <span className="label">{val}</span>
                        <div className="stand" />
                      </motion.div>
                    )
                  ))}
                </div>
              </div>
              <div className="controls-section">
                {mode === 'demo' && (
                  <>
                    <button className="control-btn primary" onClick={() => setAutoPlay((p) => !p)}>{autoPlay ? <FaPause /> : <FaPlay />} {autoPlay ? 'Pause' : 'Auto Play'}</button>
                    <button className="control-btn secondary" onClick={executeNextStep}><FaForward /> Next Step</button>
                    <button className="control-btn" onClick={() => start(algorithm, 'demo')}><FaRedo /> Reset</button>
                  </>
                )}
                {mode === 'learning' && (
                  <>
                    <button className="control-btn secondary" onClick={() => setShowHint((s) => !s)}>{showHint ? 'Hide Hint' : 'Show Hint'}</button>
                    <button className="control-btn" onClick={() => start(algorithm, 'learning')}><FaRedo /> Restart</button>
                  </>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label htmlFor="skin" style={{ opacity: 0.8 }}>Skin</label>
                  <select id="skin" className="skin-select" value={skin} onChange={(e) => setSkin(e.target.value)}>
                    <option value="potions">Potions</option>
                    <option value="crates">Crates</option>
                    <option value="bars">Bars</option>
                  </select>
                </div>
              </div>
              {showHint && <div className="hint-box">{hintText}</div>}
            </div>
          </motion.div>
        )}

        {mode === "completed" && (
          <motion.div className="game-result won" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="result-card">
              <div className="confetti-layer">
                {Array.from({ length: 80 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="confetti-piece"
                    initial={{ y: -20, x: Math.random() * 600 - 300, rotate: 0, opacity: 0 }}
                    animate={{ y: 260 + Math.random() * 120, x: Math.random() * 600 - 300, rotate: 360 * (Math.random() * 2 - 1), opacity: 1 }}
                    transition={{ duration: 1.8 + Math.random(), delay: Math.random() * 0.6 }}
                  />
                ))}
              </div>
              <h2>Victory!</h2>
              <div className="reward-grid">
                <div className="badge">{ALGORITHMS[algorithm]?.name}</div>
                <div className="reward"><span className="k">Steps</span><span className="v">{stepNumber}</span></div>
                <div className="reward"><span className="k">Swaps</span><span className="v">{swaps}</span></div>
                <div className="reward"><span className="k">Accuracy</span><span className="v">{accuracy}%</span></div>
                <div className="reward highlight"><span className="k">XP Reward</span><span className="v">+{rewardXP}</span></div>
              </div>
              {quiz && (
                <div className="quiz-card">
                  <div className="quiz-title">Bonus Quiz</div>
                  <div className="quiz-q">{quiz.question}</div>
                  <div className="quiz-options">
                    {quiz.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className={`quiz-option ${quizAnswer === idx ? 'selected' : ''} ${quizResult && idx === quiz.correct ? 'correct' : ''} ${quizResult && quizAnswer === idx && idx !== quiz.correct ? 'wrong' : ''}`}
                        disabled={!!quizResult}
                        onClick={() => handleQuizAnswer(idx)}
                      >{opt}</button>
                    ))}
                  </div>
                  {quizResult && <div className={`quiz-result ${quizResult}`}>{quizResult === 'correct' ? 'Correct! +25 XP' : 'Good try! Review and improve.'}</div>}
                </div>
              )}
              <div className="result-buttons">
                <button className="primary" onClick={() => start(algorithm, 'demo')}><FaForward /> Watch Again</button>
                <button className="secondary" onClick={() => start(algorithm, 'learning')}><FaPlay /> Practice Again</button>
                <button className="secondary" onClick={() => setMode('menu')}><FaArrowLeft /> Menu</button>
                <button className="secondary" onClick={shareSummary}>Share</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.5)', zIndex: 50 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="menu-card" style={{ maxWidth: 640 }}>
              <h2>Welcome to Sorting Showdown</h2>
              <div className="game-instructions">
                <h3>How it works</h3>
                <ul>
                  <li>Start with a Demo to see the algorithm in action.</li>
                  <li>Switch to Learning to perform each step yourself.</li>
                  <li>Click or drag the bars being compared to proceed.</li>
                  <li>Watch the code highlight the current step.</li>
                </ul>
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:12 }}>
                <button className="action-btn play-btn" onClick={() => { setShowTutorial(false); localStorage.setItem('sortingGameTutorialSeen', '1'); }}><FaPlay /> Let me try</button>
                <button className="action-btn demo-btn" onClick={() => { setShowTutorial(false); setMode('menu'); }}><FaForward /> Back to menu</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortingGame;
