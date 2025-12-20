import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaGamepad,
  FaBrain,
  FaTrophy,
  FaRocket,
  FaCode,
  FaUsers,
  FaChartLine,
  FaLightbulb,
  FaPlayCircle,
  FaGraduationCap,
  FaMedal,
  FaFire,
  FaBolt,
  FaEye,
  FaComments,
  FaMobile,
  FaLock,
  FaInfinity,
  FaGlobe
} from 'react-icons/fa';
import { 
  GiSwordman, 
  GiSwordClash,
  GiTrophy,
  GiRank3,
  GiPuzzle,
  GiArtificialIntelligence,
  GiSpeedometer
} from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './PlatformPages.css';

const Features = () => {
  const navigate = useNavigate();

  const heroFeatures = [
    {
      icon: GiSwordClash,
      title: 'Real-Time Algorithm Battles',
      description: 'Challenge players worldwide in head-to-head coding battles. Race to solve algorithmic problems faster than your opponent with our real-time matchmaking system.',
      gradient: 'linear-gradient(135deg, #00ff88, #00d4ff)'
    }
  ];

  const mainFeatures = [
    {
      icon: FaEye,
      title: 'Interactive Visualizations',
      description: 'Watch algorithms come alive with step-by-step animated visualizations. Understand how sorting algorithms swap elements, how graph traversals explore nodes, and how dynamic programming builds solutions.',
      color: '#00ff88',
      tags: ['Sorting', 'Graphs', 'Trees', 'Pathfinding']
    },
    {
      icon: GiSwordClash,
      title: 'Competitive Battles',
      description: 'Test your skills in real-time 1v1 algorithm battles. Get matched with opponents of similar skill level and compete for rating points, XP, and glory on the leaderboard.',
      color: '#ff0080',
      tags: ['Ranked', 'Practice', 'Tournaments']
    },
    {
      icon: FaGraduationCap,
      title: 'Structured Learning Paths',
      description: 'Follow curated learning paths from beginner to advanced. Each path includes video lessons, interactive tutorials, practice problems, and quizzes to test your understanding.',
      color: '#00d4ff',
      tags: ['Beginner', 'Interview Prep', 'Competitive']
    },
    {
      icon: FaCode,
      title: 'Multi-Language Code Editor',
      description: 'Write and test code in JavaScript, Python, Java, C++, or Go. Our powerful editor features syntax highlighting, auto-completion, and instant feedback on your solutions.',
      color: '#9945ff',
      tags: ['JavaScript', 'Python', 'Java', 'C++', 'Go']
    },
    {
      icon: GiArtificialIntelligence,
      title: 'AI-Powered AlgoBot Mentor',
      description: 'Stuck on a problem? AlgoBot provides intelligent hints, explains complex concepts, and offers personalized recommendations based on your learning history.',
      color: '#ffaa00',
      tags: ['Hints', 'Explanations', 'Personalized']
    },
    {
      icon: FaChartLine,
      title: 'Detailed Analytics',
      description: 'Track your progress with comprehensive statistics. See your solve rate, time improvements, strengths and weaknesses, and compare with the community.',
      color: '#00ff88',
      tags: ['Progress', 'Statistics', 'Insights']
    },
    {
      icon: GiTrophy,
      title: 'Weekly Tournaments',
      description: 'Compete in weekly algorithm tournaments with brackets, prizes, and special recognition. Rise through the ranks and earn exclusive badges and rewards.',
      color: '#ffd700',
      tags: ['Prizes', 'Rankings', 'Badges']
    },
    {
      icon: FaUsers,
      title: 'Vibrant Community',
      description: 'Join thousands of algorithm enthusiasts. Discuss solutions, share strategies, participate in forums, and learn from fellow coders around the world.',
      color: '#00d4ff',
      tags: ['Forums', 'Discord', 'Discussions']
    },
    {
      icon: GiRank3,
      title: 'XP & Level System',
      description: 'Earn XP for every problem solved, battle won, and milestone achieved. Level up to unlock new features, cosmetics, and show off your progress.',
      color: '#ff0080',
      tags: ['Experience', 'Levels', 'Rewards']
    }
  ];

  const gamificationFeatures = [
    {
      icon: FaFire,
      title: 'Daily Streaks',
      description: 'Maintain your coding streak for bonus XP. Build consistency and develop a daily coding habit.',
      color: '#ff4444'
    },
    {
      icon: FaMedal,
      title: 'Achievement Badges',
      description: '50+ achievements to unlock. From "First Blood" to "Grandmaster", collect them all!',
      color: '#ffd700'
    },
    {
      icon: GiSpeedometer,
      title: 'Speed Challenges',
      description: 'Race against the clock in timed challenges. Optimize for both correctness and speed.',
      color: '#00d4ff'
    },
    {
      icon: FaBolt,
      title: 'Power-Ups',
      description: 'Earn power-ups in battles for advantages like extra time or hint reveals.',
      color: '#9945ff'
    }
  ];

  const technicalFeatures = [
    { icon: FaLock, title: 'Secure Environment', description: 'Sandboxed code execution with enterprise-grade security' },
    { icon: FaMobile, title: 'Responsive Design', description: 'Optimized for desktop with mobile tracking support' },
    { icon: FaInfinity, title: 'Unlimited Practice', description: 'Access 500+ problems with no daily limits' },
    { icon: FaGlobe, title: 'Global Servers', description: 'Low-latency servers for players worldwide' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
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
            <FaRocket />
          </motion.div>
          <h1 className="support-title">Platform Features</h1>
          <p className="support-subtitle">
            Discover everything Playgorithm has to offer. From real-time battles to AI-powered learning, 
            we've built the ultimate platform for mastering algorithms.
          </p>
        </motion.div>

        {/* Hero Feature */}
        <motion.div 
          className="hero-feature-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="hero-feature-content">
            <div className="hero-feature-text">
              <h2>Real-Time Algorithm Battles</h2>
              <p>
                Experience the thrill of competitive coding like never before. Our real-time battle system 
                matches you with opponents of similar skill level for intense 1v1 algorithm showdowns. 
                Solve problems faster, write cleaner code, and climb the global leaderboard.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.button
                  className="event-cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                >
                  <FaPlayCircle /> Start a Battle
                </motion.button>
                <motion.button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: '2px solid #00ff88',
                    borderRadius: '10px',
                    color: '#00ff88',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  whileHover={{ scale: 1.05, background: 'rgba(0,255,136,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/battles')}
                >
                  Learn More
                </motion.button>
              </div>
            </div>
            <div className="hero-feature-visual">
              <motion.div 
                className="hero-visual-icon"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(0, 255, 136, 0.3)',
                    '0 0 40px rgba(0, 255, 136, 0.5)',
                    '0 0 20px rgba(0, 255, 136, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <GiSwordClash />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            Core Features
          </h2>
          <motion.div 
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                style={{ 
                  '--feature-color': feature.color,
                  '--feature-gradient': `linear-gradient(90deg, ${feature.color}, ${feature.color}80)`
                }}
              >
                <div className="feature-card-icon">
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-card-tags">
                  {feature.tags.map((tag, idx) => (
                    <span key={idx} className="feature-tag">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Gamification Section */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <FaGamepad style={{ marginRight: '0.5rem' }} /> Gamification
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Learning algorithms should be fun! We've gamified the entire experience with rewards, 
            achievements, and competitive elements to keep you motivated.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {gamificationFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="support-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, borderColor: feature.color }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `${feature.color}20`,
                  border: `2px solid ${feature.color}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: feature.color,
                  margin: '0 auto 1rem'
                }}>
                  <feature.icon />
                </div>
                <h4 style={{ color: '#ffffff', fontFamily: 'Orbitron, monospace', marginBottom: '0.5rem' }}>
                  {feature.title}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: 0 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Features */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            Built for Performance
          </h2>
          <div className="live-stats-ticker">
            {technicalFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                style={{ textAlign: 'center', minWidth: '180px' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: '#00ff88',
                  margin: '0 auto 0.75rem'
                }}>
                  <feature.icon />
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.25rem' }}>
                  {feature.title}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: 0 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            flexWrap: 'wrap',
            gap: '2rem',
            textAlign: 'center',
            marginTop: '2rem'
          }}
        >
          <div>
            <motion.div 
              style={{ fontSize: '3rem', fontWeight: '700', color: '#00ff88', fontFamily: 'Orbitron, monospace' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              500+
            </motion.div>
            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Coding Challenges</div>
          </div>
          <div>
            <motion.div 
              style={{ fontSize: '3rem', fontWeight: '700', color: '#00d4ff', fontFamily: 'Orbitron, monospace' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              50+
            </motion.div>
            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Algorithm Visualizations</div>
          </div>
          <div>
            <motion.div 
              style={{ fontSize: '3rem', fontWeight: '700', color: '#ff0080', fontFamily: 'Orbitron, monospace' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.4 }}
            >
              25K+
            </motion.div>
            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Active Players</div>
          </div>
          <div>
            <motion.div 
              style={{ fontSize: '3rem', fontWeight: '700', color: '#ffaa00', fontFamily: 'Orbitron, monospace' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.5 }}
            >
              1M+
            </motion.div>
            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Battles Played</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <h3 className="support-card-title" style={{ justifyContent: 'center' }}>
            <FaRocket /> Ready to Level Up?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Join thousands of developers mastering algorithms through play. 
            Start your journey today – it's completely free!
          </p>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            style={{ margin: '0 auto' }}
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
