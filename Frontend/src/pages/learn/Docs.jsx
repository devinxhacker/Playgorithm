import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSearch,
  FaBookOpen,
  FaRocket,
  FaCode,
  FaGamepad,
  FaTrophy,
  FaUsers,
  FaCog,
  FaQuestionCircle,
  FaLightbulb,
  FaChevronRight,
  FaKeyboard,
  FaChartLine,
  FaMedal,
  FaGraduationCap
} from 'react-icons/fa';
import { 
  GiSwordman,
  GiSwordClash,
  GiTrophy
} from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './LearnPages.css';

const Docs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const navSections = [
    { id: 'getting-started', label: 'Getting Started', icon: FaRocket },
    { id: 'platform', label: 'Platform Features', icon: FaGamepad },
    { id: 'battles', label: 'Algorithm Battles', icon: GiSwordClash },
    { id: 'challenges', label: 'Coding Challenges', icon: FaCode },
    { id: 'leaderboard', label: 'Leaderboard & XP', icon: FaTrophy },
    { id: 'profile', label: 'Profile & Stats', icon: FaUsers },
    { id: 'settings', label: 'Account Settings', icon: FaCog },
    { id: 'keyboard', label: 'Keyboard Shortcuts', icon: FaKeyboard },
    { id: 'faq', label: 'FAQ', icon: FaQuestionCircle }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up with your email or use social login. Choose a unique username that will appear on leaderboards.',
      color: '#00ff88'
    },
    {
      step: 2,
      title: 'Complete Your Profile',
      description: 'Add your bio, select your preferred programming languages, and customize your avatar.',
      color: '#00d4ff'
    },
    {
      step: 3,
      title: 'Take the Skill Assessment',
      description: 'Optional assessment to determine your starting level and get personalized recommendations.',
      color: '#ff0080'
    },
    {
      step: 4,
      title: 'Start Playing & Learning',
      description: 'Jump into algorithm battles, solve coding challenges, or explore interactive tutorials.',
      color: '#ffaa00'
    }
  ];

  const features = [
    {
      title: 'Algorithm Visualizer',
      description: 'Watch algorithms come to life with step-by-step visualizations. See how sorting algorithms move elements, how graph algorithms traverse nodes, and how search algorithms find their targets.',
      icon: FaChartLine
    },
    {
      title: 'Sorting Showdown',
      description: 'Race against time or other players to sort arrays using different algorithms. Understand the efficiency of each approach through hands-on competition.',
      icon: GiSwordClash
    },
    {
      title: 'Coding Challenges',
      description: 'Solve curated problems organized by topic and difficulty. Get instant feedback, see optimal solutions, and track your improvement over time.',
      icon: FaCode
    },
    {
      title: 'Learning Paths',
      description: 'Follow structured courses from beginner to advanced. Each path includes lessons, visualizations, practice problems, and quizzes.',
      icon: FaGraduationCap
    },
    {
      title: 'AlgoBot AI Mentor',
      description: 'Get hints when stuck, explanations for concepts you don\'t understand, and personalized learning recommendations powered by AI.',
      icon: FaLightbulb
    },
    {
      title: 'Weekly Tournaments',
      description: 'Compete in weekly algorithm competitions with prizes, recognition, and a chance to climb the global leaderboard.',
      icon: GiTrophy
    }
  ];

  const battleRules = [
    { rule: 'Battles are 1v1 real-time competitions lasting 5-15 minutes', type: 'info' },
    { rule: 'Both players receive the same problem and starting conditions', type: 'info' },
    { rule: 'Points are awarded for correctness, efficiency, and speed', type: 'info' },
    { rule: 'Using external resources or pre-written code is prohibited', type: 'warning' },
    { rule: 'Disconnecting during a battle counts as a forfeit', type: 'warning' },
    { rule: 'Rating changes are calculated using the ELO system', type: 'info' }
  ];

  const xpActions = [
    { action: 'Complete a tutorial lesson', xp: '+10 XP' },
    { action: 'Solve an Easy challenge', xp: '+25 XP' },
    { action: 'Solve a Medium challenge', xp: '+50 XP' },
    { action: 'Solve a Hard challenge', xp: '+100 XP' },
    { action: 'Win an Algorithm Battle', xp: '+30 XP' },
    { action: 'First solution of the day', xp: '+20 XP bonus' },
    { action: '7-day streak bonus', xp: '+50 XP' },
    { action: 'Win a tournament round', xp: '+75 XP' }
  ];

  const keyboardShortcuts = [
    { key: 'Ctrl + Enter', action: 'Run code' },
    { key: 'Ctrl + S', action: 'Save solution' },
    { key: 'Ctrl + /', action: 'Toggle comment' },
    { key: 'Ctrl + Z', action: 'Undo' },
    { key: 'Ctrl + Shift + Z', action: 'Redo' },
    { key: 'Ctrl + F', action: 'Find in code' },
    { key: 'Ctrl + H', action: 'Find and replace' },
    { key: 'F11', action: 'Toggle fullscreen editor' },
    { key: 'Esc', action: 'Exit fullscreen / Close modal' },
    { key: 'Tab', action: 'Indent selected lines' },
    { key: 'Shift + Tab', action: 'Outdent selected lines' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="docs-content">
            <h2>Getting Started with Playgorithm</h2>
            <p>
              Welcome to Playgorithm, the gamified platform for learning algorithms and data structures! 
              Whether you're a complete beginner or an experienced developer looking to sharpen your skills, 
              this guide will help you get the most out of our platform.
            </p>
            
            <h3>Quick Start Guide</h3>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              {quickStartSteps.map((item) => (
                <motion.div 
                  key={item.step}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1.25rem',
                    borderRadius: '15px',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                    borderLeft: `4px solid ${item.color}`
                  }}
                  whileHover={{ x: 5 }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: item.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    color: '#0a0a0a',
                    fontFamily: 'Orbitron, monospace',
                    flexShrink: 0
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <h3>Recommended First Steps</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.8' }}>
              <li>Try the <strong style={{ color: '#00ff88' }}>Sorting Visualizer</strong> to see algorithms in action</li>
              <li>Complete the <strong style={{ color: '#00d4ff' }}>Introduction to Algorithms</strong> tutorial</li>
              <li>Solve your first <strong style={{ color: '#ffaa00' }}>Easy</strong> challenge to earn XP</li>
              <li>Join a <strong style={{ color: '#ff0080' }}>Practice Battle</strong> to get a feel for competitions</li>
            </ul>
          </div>
        );
      
      case 'platform':
        return (
          <div className="docs-content">
            <h2>Platform Features</h2>
            <p>
              Playgorithm offers a comprehensive suite of tools designed to make learning algorithms 
              engaging, interactive, and effective. Here's an overview of our main features:
            </p>
            
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'flex-start'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,212,255,0.2))',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#00ff88',
                    flexShrink: 0
                  }}>
                    <feature.icon />
                  </div>
                  <div>
                    <h4 style={{ color: '#ffffff', marginBottom: '0.5rem', fontFamily: 'Orbitron, monospace' }}>
                      {feature.title}
                    </h4>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'battles':
        return (
          <div className="docs-content">
            <h2>Algorithm Battles</h2>
            <p>
              Algorithm Battles are real-time 1v1 competitions where you race against another player 
              to solve algorithmic problems. It's the ultimate test of speed, accuracy, and problem-solving skills!
            </p>

            <h3>Battle Modes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ background: 'rgba(0,255,136,0.1)', padding: '1.25rem', borderRadius: '15px', border: '1px solid rgba(0,255,136,0.3)' }}>
                <h4 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>Ranked</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  Compete for rating points. Matched with players of similar skill level.
                </p>
              </div>
              <div style={{ background: 'rgba(0,212,255,0.1)', padding: '1.25rem', borderRadius: '15px', border: '1px solid rgba(0,212,255,0.3)' }}>
                <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>Practice</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  No rating at stake. Perfect for warming up or trying new strategies.
                </p>
              </div>
              <div style={{ background: 'rgba(255,170,0,0.1)', padding: '1.25rem', borderRadius: '15px', border: '1px solid rgba(255,170,0,0.3)' }}>
                <h4 style={{ color: '#ffaa00', marginBottom: '0.5rem' }}>Tournament</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  Special events with brackets, prizes, and glory. Check the Events page!
                </p>
              </div>
            </div>

            <h3>Rules & Scoring</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {battleRules.map((item, idx) => (
                <li key={idx} style={{ 
                  padding: '0.75rem 1rem',
                  background: item.type === 'warning' ? 'rgba(255,170,0,0.1)' : 'rgba(0,0,0,0.2)',
                  borderLeft: `3px solid ${item.type === 'warning' ? '#ffaa00' : '#00ff88'}`,
                  marginBottom: '0.5rem',
                  borderRadius: '0 10px 10px 0',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  {item.rule}
                </li>
              ))}
            </ul>

            <h3>Rating System</h3>
            <p>
              Playgorithm uses an ELO-based rating system. New players start at <code>1200</code> rating. 
              Winning against higher-rated opponents grants more points, while losing to lower-rated 
              opponents costs more. Your rating determines your rank tier:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              <span style={{ padding: '0.5rem 1rem', background: '#7b7b7b', borderRadius: '20px' }}>Bronze: 0-1199</span>
              <span style={{ padding: '0.5rem 1rem', background: '#c0c0c0', borderRadius: '20px', color: '#0a0a0a' }}>Silver: 1200-1499</span>
              <span style={{ padding: '0.5rem 1rem', background: '#ffd700', borderRadius: '20px', color: '#0a0a0a' }}>Gold: 1500-1799</span>
              <span style={{ padding: '0.5rem 1rem', background: '#00d4ff', borderRadius: '20px', color: '#0a0a0a' }}>Platinum: 1800-2099</span>
              <span style={{ padding: '0.5rem 1rem', background: '#ff0080', borderRadius: '20px' }}>Diamond: 2100+</span>
            </div>
          </div>
        );
      
      case 'challenges':
        return (
          <div className="docs-content">
            <h2>Coding Challenges</h2>
            <p>
              Practice makes perfect! Our curated collection of coding challenges covers everything 
              from basic array manipulation to advanced dynamic programming.
            </p>

            <h3>Difficulty Levels</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,255,136,0.1)', borderRadius: '15px' }}>
                <div style={{ fontSize: '2rem', color: '#00ff88', marginBottom: '0.5rem' }}>Easy</div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Basic concepts, single-step solutions</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,170,0,0.1)', borderRadius: '15px' }}>
                <div style={{ fontSize: '2rem', color: '#ffaa00', marginBottom: '0.5rem' }}>Medium</div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Multi-step logic, common patterns</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,0,128,0.1)', borderRadius: '15px' }}>
                <div style={{ fontSize: '2rem', color: '#ff0080', marginBottom: '0.5rem' }}>Hard</div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Advanced algorithms, optimization</p>
              </div>
            </div>

            <h3>Challenge Features</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2' }}>
              <li><strong>Multiple Language Support:</strong> Solve in JavaScript, Python, Java, C++, or Go</li>
              <li><strong>Test Cases:</strong> Visible examples + hidden test cases for validation</li>
              <li><strong>Time & Space Limits:</strong> Optimize your solution to meet constraints</li>
              <li><strong>Hints System:</strong> Get progressive hints if you're stuck (costs XP)</li>
              <li><strong>Editorial Solutions:</strong> Learn optimal approaches after solving</li>
              <li><strong>Discussion Forum:</strong> Discuss approaches with the community</li>
            </ul>

            <h3>Topics Covered</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['Arrays', 'Strings', 'Hash Tables', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 
                'Graphs', 'Sorting', 'Binary Search', 'Two Pointers', 'Sliding Window', 
                'Dynamic Programming', 'Recursion', 'Backtracking', 'Greedy', 'Bit Manipulation'].map(topic => (
                <span key={topic} style={{ 
                  padding: '0.4rem 0.8rem', 
                  background: 'rgba(0,212,255,0.15)', 
                  borderRadius: '20px',
                  color: '#00d4ff',
                  fontSize: '0.85rem'
                }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        );
      
      case 'leaderboard':
        return (
          <div className="docs-content">
            <h2>Leaderboard & XP System</h2>
            <p>
              Earn XP (experience points) by completing challenges, winning battles, and engaging 
              with the platform. Climb the leaderboard and showcase your algorithmic prowess!
            </p>

            <h3>How to Earn XP</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '15px', overflow: 'hidden' }}>
              {xpActions.map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderBottom: idx < xpActions.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{item.action}</span>
                  <span style={{ color: '#00ff88', fontFamily: 'Orbitron, monospace' }}>{item.xp}</span>
                </div>
              ))}
            </div>

            <h3>Leaderboard Categories</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2' }}>
              <li><strong>Global:</strong> All-time XP rankings across all users</li>
              <li><strong>Weekly:</strong> Resets every Monday - fresh competition each week</li>
              <li><strong>Monthly:</strong> Top performers get featured on the homepage</li>
              <li><strong>By Topic:</strong> See who dominates specific algorithm categories</li>
              <li><strong>Friends:</strong> Compare your progress with friends</li>
            </ul>

            <h3>Achievements & Badges</h3>
            <p>
              Earn special badges for milestones like "First Blood" (first battle win), "Streak Master" 
              (30-day streak), "DP Wizard" (50 DP problems solved), and many more. Badges are displayed 
              on your profile and show your accomplishments to the community.
            </p>
          </div>
        );
      
      case 'profile':
        return (
          <div className="docs-content">
            <h2>Profile & Stats</h2>
            <p>
              Your profile is your algorithmic identity. Showcase your skills, track your progress, 
              and see detailed statistics about your learning journey.
            </p>

            <h3>Profile Information</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2' }}>
              <li><strong>Avatar & Banner:</strong> Customize your look with unlockable cosmetics</li>
              <li><strong>Bio:</strong> Tell the community about yourself</li>
              <li><strong>Skills:</strong> Display your preferred languages and strongest topics</li>
              <li><strong>Social Links:</strong> Connect your GitHub, LinkedIn, and other profiles</li>
            </ul>

            <h3>Statistics Tracked</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2' }}>
              <li>Total problems solved (by difficulty and topic)</li>
              <li>Battle record (wins, losses, win rate)</li>
              <li>Current and longest streak</li>
              <li>XP earned and level progression</li>
              <li>Time spent on the platform</li>
              <li>Submission history and success rate</li>
              <li>Activity heatmap (GitHub-style contribution graph)</li>
            </ul>

            <h3>Privacy Settings</h3>
            <p>
              Control who can see your profile. Options include: <code>Public</code> (visible to everyone), 
              <code>Friends Only</code> (visible to accepted friends), or <code>Private</code> 
              (only you can see your full stats).
            </p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="docs-content">
            <h2>Account Settings</h2>
            <p>
              Manage your account preferences, security settings, and notifications from the Settings page.
            </p>

            <h3>Account Management</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2' }}>
              <li><strong>Email:</strong> Update your email address (requires verification)</li>
              <li><strong>Password:</strong> Change your password (requires current password)</li>
              <li><strong>Username:</strong> Can be changed once every 30 days</li>
              <li><strong>Linked Accounts:</strong> Connect/disconnect Google, GitHub, Discord</li>
              <li><strong>Delete Account:</strong> Permanently delete your account and data</li>
            </ul>

            <h3>Preferences</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2' }}>
              <li><strong>Default Language:</strong> Set your preferred coding language</li>
              <li><strong>Editor Theme:</strong> Light, Dark, or Monokai</li>
              <li><strong>Font Size:</strong> Adjust code editor font size</li>
              <li><strong>Auto-save:</strong> Enable/disable automatic solution saving</li>
            </ul>

            <h3>Notifications</h3>
            <ul style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '2' }}>
              <li>Battle invites and match found alerts</li>
              <li>Friend requests and messages</li>
              <li>Weekly progress reports</li>
              <li>Tournament and event announcements</li>
              <li>New challenges and features</li>
            </ul>
          </div>
        );
      
      case 'keyboard':
        return (
          <div className="docs-content">
            <h2>Keyboard Shortcuts</h2>
            <p>
              Master these keyboard shortcuts to code faster and navigate the platform efficiently.
            </p>

            <h3>Code Editor Shortcuts</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '15px', overflow: 'hidden' }}>
              {keyboardShortcuts.map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1.25rem',
                  borderBottom: idx < keyboardShortcuts.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <code style={{ 
                    background: 'rgba(0,255,136,0.2)', 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '5px',
                    color: '#00ff88'
                  }}>
                    {item.key}
                  </code>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{item.action}</span>
                </div>
              ))}
            </div>

            <h3>Navigation Shortcuts</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '15px', padding: '1rem', marginTop: '1.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                <code>Ctrl + K</code> - Open command palette (quick navigation)<br />
                <code>G then D</code> - Go to Dashboard<br />
                <code>G then C</code> - Go to Challenges<br />
                <code>G then B</code> - Go to Battles<br />
                <code>G then L</code> - Go to Leaderboard
              </p>
            </div>
          </div>
        );
      
      case 'faq':
        return (
          <div className="docs-content">
            <h2>Frequently Asked Questions</h2>
            
            <h3>General</h3>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong style={{ color: '#00ff88' }}>Q: Is Playgorithm free to use?</strong></p>
              <p>Yes! Core features including challenges, tutorials, and practice battles are completely free. Premium features are available for those who want extra perks.</p>
              
              <p><strong style={{ color: '#00ff88' }}>Q: What programming languages are supported?</strong></p>
              <p>We currently support JavaScript, Python, Java, C++, and Go. More languages are being added based on community demand.</p>
              
              <p><strong style={{ color: '#00ff88' }}>Q: Can I use Playgorithm on mobile?</strong></p>
              <p>The platform is optimized for desktop use due to the coding requirements. Mobile support for viewing tutorials and tracking progress is planned.</p>
            </div>

            <h3>Battles & Competitions</h3>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong style={{ color: '#00d4ff' }}>Q: How do I find opponents for battles?</strong></p>
              <p>Click "Find Match" and our matchmaking system will pair you with someone of similar skill level. You can also challenge friends directly.</p>
              
              <p><strong style={{ color: '#00d4ff' }}>Q: What happens if I disconnect during a battle?</strong></p>
              <p>You have 60 seconds to reconnect. If you don't return in time, the battle is forfeited and counts as a loss.</p>
              
              <p><strong style={{ color: '#00d4ff' }}>Q: Can I practice before entering ranked battles?</strong></p>
              <p>Absolutely! Use "Practice Mode" to compete without affecting your rating. It's perfect for warming up.</p>
            </div>

            <h3>Account & Progress</h3>
            <div>
              <p><strong style={{ color: '#ff0080' }}>Q: Can I reset my progress?</strong></p>
              <p>Progress cannot be reset, but you can always revisit and re-solve challenges. Your best solution is always saved.</p>
              
              <p><strong style={{ color: '#ff0080' }}>Q: How do I recover my account if I forgot my password?</strong></p>
              <p>Use the "Forgot Password" link on the login page. A reset link will be sent to your registered email.</p>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,255,136,0.1)', borderRadius: '15px', border: '1px solid rgba(0,255,136,0.3)' }}>
              <p style={{ margin: 0, textAlign: 'center' }}>
                Still have questions? Visit our <a href="/help" style={{ color: '#00ff88' }}>Help Center</a> or <a href="/contact" style={{ color: '#00ff88' }}>Contact Us</a>!
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="support-page">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="support-nav">
        <div className="container">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <GiSwordman className="brand-icon" />
            <span>Playgorithm</span>
          </div>
          <button className="nav-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        </div>
      </nav>

      <div className="support-container">
        {/* Header */}
        <motion.div 
          className="support-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="support-header-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaBookOpen />
          </motion.div>
          <h1 className="support-title">Documentation</h1>
          <p className="support-subtitle">
            Everything you need to know about using Playgorithm. From getting started 
            to mastering advanced features, we've got you covered.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ maxWidth: '500px', margin: '0 auto 2rem' }}
        >
          <div className="search-input-wrapper">
            <FaSearch />
            <input 
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 45px',
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '25px',
                color: '#ffffff',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
          {/* Sidebar Navigation */}
          <motion.div 
            className="docs-sidebar"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="docs-sidebar-title">Documentation</div>
            <ul className="docs-nav-list">
              {navSections.map((section) => (
                <li key={section.id} className="docs-nav-item">
                  <a 
                    className={activeSection === section.id ? 'active' : ''}
                    onClick={() => setActiveSection(section.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <section.icon />
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
