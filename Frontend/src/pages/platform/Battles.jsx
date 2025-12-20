import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaPlayCircle,
  FaClock,
  FaUsers,
  FaTrophy,
  FaChartLine,
  FaFire,
  FaBolt,
  FaShieldAlt,
  FaStar,
  FaQuestionCircle,
  FaArrowRight
} from 'react-icons/fa';
import { 
  GiSwordman, 
  GiSwordClash,
  GiCrossedSwords,
  GiTrophy,
  GiRank3,
  GiLaurelsTrophy,
  GiPodium
} from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './PlatformPages.css';

const Battles = () => {
  const navigate = useNavigate();

  const battleModes = [
    {
      id: 'ranked',
      title: 'Ranked Battle',
      subtitle: 'Competitive Mode',
      icon: GiRank3,
      color: '#00ff88',
      description: 'Put your rating on the line! Face opponents of similar skill level in intense 1v1 matches. Win to climb the leaderboard and earn prestigious rank tiers from Bronze to Diamond.',
      stats: [
        { icon: FaClock, label: '5-10 min' },
        { icon: FaUsers, label: 'ELO Matched' },
        { icon: FaTrophy, label: '±25 Rating' }
      ],
      features: ['Rating gains/losses', 'Rank progression', 'Season rewards', 'Match history']
    },
    {
      id: 'practice',
      title: 'Practice Battle',
      subtitle: 'Casual Mode',
      icon: GiCrossedSwords,
      color: '#00d4ff',
      description: 'No pressure, just practice! Perfect for warming up before ranked games or trying out new strategies. Your rating stays safe while you sharpen your skills.',
      stats: [
        { icon: FaClock, label: '5-15 min' },
        { icon: FaUsers, label: 'Any Skill' },
        { icon: FaTrophy, label: '+XP Only' }
      ],
      features: ['No rating at stake', 'Learn from losses', 'Try new approaches', 'Perfect warmup']
    },
    {
      id: 'blitz',
      title: 'Blitz Battle',
      subtitle: 'Speed Mode',
      icon: FaBolt,
      color: '#ffaa00',
      description: 'Think fast! Ultra-short time limits push your speed to the max. Less time for thinking means you need to rely on pattern recognition and muscle memory.',
      stats: [
        { icon: FaClock, label: '2-3 min' },
        { icon: FaUsers, label: 'ELO Matched' },
        { icon: FaTrophy, label: '±15 Rating' }
      ],
      features: ['Lightning fast', 'Quick matches', 'Speed ranking', 'Daily challenges']
    },
    {
      id: 'tournament',
      title: 'Tournament Battle',
      subtitle: 'Championship Mode',
      icon: GiLaurelsTrophy,
      color: '#ff0080',
      description: 'Compete in official tournaments with bracket-style elimination. Face multiple opponents in a single event, climb to the finals, and win exclusive prizes and glory!',
      stats: [
        { icon: FaClock, label: 'Event Based' },
        { icon: FaUsers, label: 'Bracket' },
        { icon: FaTrophy, label: 'Prizes!' }
      ],
      features: ['Weekly events', 'Prize pools', 'Exclusive badges', 'Global ranking']
    }
  ];

  const howItWorks = [
    { step: 1, title: 'Queue Up', description: 'Choose your battle mode and join the matchmaking queue' },
    { step: 2, title: 'Get Matched', description: "Our system finds an opponent of similar skill level" },
    { step: 3, title: 'Solve Together', description: 'Both players receive the same problem simultaneously' },
    { step: 4, title: 'Win & Climb', description: 'First to solve wins! Earn XP and rating points' }
  ];

  const rankTiers = [
    { name: 'Bronze', range: '0 - 1199', color: '#cd7f32', icon: '🥉' },
    { name: 'Silver', range: '1200 - 1499', color: '#c0c0c0', icon: '🥈' },
    { name: 'Gold', range: '1500 - 1799', color: '#ffd700', icon: '🥇' },
    { name: 'Platinum', range: '1800 - 2099', color: '#00d4ff', icon: '💎' },
    { name: 'Diamond', range: '2100+', color: '#ff0080', icon: '👑' }
  ];

  const liveStats = [
    { value: '1,247', label: 'Players Online', pulse: true },
    { value: '342', label: 'Active Battles', pulse: true },
    { value: '~45s', label: 'Avg. Queue Time', pulse: false },
    { value: '89,456', label: 'Battles Today', pulse: false }
  ];

  const topPlayers = [
    { rank: 1, name: 'AlgoMaster99', rating: 2450, tier: 'Diamond', wins: 892, avatar: 'A' },
    { rank: 2, name: 'CodeNinja', rating: 2380, tier: 'Diamond', wins: 756, avatar: 'C' },
    { rank: 3, name: 'BinaryBeast', rating: 2310, tier: 'Diamond', wins: 701, avatar: 'B' },
    { rank: 4, name: 'RecursiveKing', rating: 2245, tier: 'Diamond', wins: 645, avatar: 'R' },
    { rank: 5, name: 'GraphGuru', rating: 2198, tier: 'Diamond', wins: 612, avatar: 'G' }
  ];

  const faqs = [
    {
      q: 'How does matchmaking work?',
      a: 'Our ELO-based system matches you with players within a ±100 rating range. If no match is found quickly, the range gradually expands to ensure faster queue times.'
    },
    {
      q: 'What happens if I disconnect?',
      a: 'You have 60 seconds to reconnect. If you fail to return, the battle is forfeited and counts as a loss. We recommend a stable internet connection.'
    },
    {
      q: 'Can I choose which problems to solve?',
      a: 'Problems are randomly selected based on your rating. Higher-rated players get harder problems. This ensures fair and challenging matches for everyone.'
    },
    {
      q: 'How are ties handled?',
      a: 'If both players solve at the same time (within 1 second), the player with fewer code characters wins. If still tied, the match is a draw with reduced rating changes.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
          >
            <GiSwordClash />
          </motion.div>
          <h1 className="support-title">Algorithm Battles</h1>
          <p className="support-subtitle">
            Challenge players worldwide in real-time coding duels. Prove your algorithmic prowess, 
            climb the rankings, and become a legend on the leaderboard.
          </p>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            style={{ marginTop: '1rem' }}
          >
            <GiSwordClash /> Find a Battle
          </motion.button>
        </motion.div>

        {/* Live Stats */}
        <motion.div 
          className="live-stats-ticker"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {liveStats.map((stat, index) => (
            <div key={index} className="live-stat">
              <div className={`live-stat-value ${stat.pulse ? 'pulse' : ''}`}>
                {stat.pulse && <span style={{ 
                  width: '10px', 
                  height: '10px', 
                  background: '#00ff88', 
                  borderRadius: '50%',
                  animation: 'pulse-badge 2s infinite'
                }} />}
                {stat.value}
              </div>
              <div className="live-stat-label">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Battle Modes */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <GiCrossedSwords style={{ marginRight: '0.5rem' }} /> Battle Modes
          </h2>
          <motion.div 
            className="battle-modes-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {battleModes.map((mode) => (
              <motion.div
                key={mode.id}
                className="battle-mode-card"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                style={{ '--mode-color': mode.color }}
              >
                <div className="battle-mode-header">
                  <div className="battle-mode-icon">
                    <mode.icon />
                  </div>
                  <div className="battle-mode-title">
                    <h3>{mode.title}</h3>
                    <span>{mode.subtitle}</span>
                  </div>
                </div>
                <p className="battle-mode-description">{mode.description}</p>
                <div className="battle-mode-stats">
                  {mode.stats.map((stat, idx) => (
                    <div key={idx} className="battle-stat">
                      <stat.icon /> {stat.label}
                    </div>
                  ))}
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem', 
                  marginTop: '1rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {mode.features.map((feature, idx) => (
                    <span key={idx} style={{
                      padding: '0.25rem 0.6rem',
                      background: `${mode.color}15`,
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: mode.color
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            How Battles Work
          </h2>
          <div className="how-it-works">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                className="how-step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <motion.div 
                  className="how-step-number"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.step}
                </motion.div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rank Tiers */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <GiRank3 style={{ marginRight: '0.5rem' }} /> Rank Tiers
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
            Climb through 5 competitive tiers. Each tier unlocks exclusive rewards and recognition.
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem' 
          }}>
            {rankTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                style={{
                  background: 'rgba(15, 15, 15, 0.9)',
                  border: `2px solid ${tier.color}`,
                  borderRadius: '20px',
                  padding: '1.5rem 2rem',
                  textAlign: 'center',
                  minWidth: '150px'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: `0 10px 30px ${tier.color}30` }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{tier.icon}</div>
                <h4 style={{ 
                  color: tier.color, 
                  fontFamily: 'Orbitron, monospace', 
                  marginBottom: '0.25rem' 
                }}>
                  {tier.name}
                </h4>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  {tier.range}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard Preview */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <GiPodium style={{ marginRight: '0.5rem' }} /> Top Players
          </h2>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="leaderboard-preview">
              <div className="leaderboard-header">
                <h3><FaTrophy style={{ color: '#ffd700', marginRight: '0.5rem' }} /> Global Leaderboard</h3>
                <motion.button
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(0, 255, 136, 0.2)',
                    border: '1px solid #00ff88',
                    borderRadius: '20px',
                    color: '#00ff88',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                  whileHover={{ background: 'rgba(0, 255, 136, 0.3)' }}
                  onClick={() => navigate('/login')}
                >
                  View All <FaArrowRight style={{ marginLeft: '0.3rem' }} />
                </motion.button>
              </div>
              {topPlayers.map((player) => (
                <motion.div 
                  key={player.rank} 
                  className="leaderboard-row"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: player.rank * 0.1 }}
                >
                  <span className={`leaderboard-rank ${player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : 'default'}`}>
                    #{player.rank}
                  </span>
                  <div className="leaderboard-avatar">{player.avatar}</div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">{player.name}</div>
                    <div className="leaderboard-tier">{player.tier} • {player.wins} wins</div>
                  </div>
                  <div className="leaderboard-xp">{player.rating}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <FaQuestionCircle style={{ marginRight: '0.5rem' }} /> Battle FAQ
          </h2>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="support-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ marginBottom: '1rem' }}
              >
                <h4 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>{faq.q}</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.7' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="hero-feature-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <h2 style={{ 
            fontFamily: 'Orbitron, monospace', 
            fontSize: '2rem', 
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Ready to Battle?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Join thousands of players in real-time algorithm battles. 
            Your first battle is just a click away!
          </p>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            style={{ margin: '0 auto' }}
          >
            <GiSwordClash /> Start Your First Battle
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Battles;
