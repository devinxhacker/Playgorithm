import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaTrophy,
  FaMedal,
  FaGift,
  FaBell,
  FaChevronRight,
  FaFilter,
  FaHistory,
  FaCrown,
  FaFire
} from 'react-icons/fa';
import { 
  GiSwordman, 
  GiTrophy,
  GiLaurelsTrophy,
  GiPodium,
  GiTrophyCup,
  GiCrownedSkull,
  GiDiamondTrophy,
  GiSwordsEmblem
} from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './PlatformPages.css';

const Tournaments = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('upcoming');

  const filters = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'live', label: 'Live Now' },
    { id: 'past', label: 'Past Events' }
  ];

  const featuredTournament = {
    id: 'winter-championship-2025',
    title: 'Winter Algorithm Championship 2025',
    type: 'Grand Championship',
    icon: GiCrownedSkull,
    color: '#00ff88',
    colorEnd: '#00d4ff',
    status: 'upcoming',
    date: 'January 15-17, 2025',
    startTime: '10:00 AM UTC',
    participants: 512,
    maxParticipants: 512,
    prize: '$5,000 + Exclusive Rewards',
    format: 'Double Elimination',
    description: 'The biggest algorithm tournament of the winter season! Compete against the best players worldwide in a 3-day championship event. Top 16 receive cash prizes and all participants earn exclusive Winter Champion badges.',
    requirements: ['Minimum 50 battles played', 'Gold rank or higher', 'Verified account'],
    prizes: [
      { place: '1st', reward: '$2,000 + Diamond Trophy + 1-Year Premium' },
      { place: '2nd', reward: '$1,000 + Platinum Trophy + 6-Month Premium' },
      { place: '3rd', reward: '$500 + Gold Trophy + 3-Month Premium' },
      { place: '4th-8th', reward: '$150 each + Silver Badge' },
      { place: '9th-16th', reward: '$50 each + Bronze Badge' }
    ]
  };

  const tournaments = [
    // Upcoming
    {
      id: 'weekly-battle-royale-52',
      title: 'Weekly Battle Royale #52',
      type: 'Weekly Tournament',
      icon: GiSwordsEmblem,
      color: '#00ff88',
      colorEnd: '#00d4ff',
      status: 'upcoming',
      date: 'December 22, 2024',
      time: '7:00 PM UTC',
      participants: 189,
      maxParticipants: 256,
      prize: '5,000 XP + Premium Badge',
      format: 'Single Elimination'
    },
    {
      id: 'dp-masters-challenge',
      title: 'DP Masters Challenge',
      type: 'Specialty Tournament',
      icon: GiDiamondTrophy,
      color: '#9945ff',
      colorEnd: '#ff0080',
      status: 'upcoming',
      date: 'December 28, 2024',
      time: '3:00 PM UTC',
      participants: 124,
      maxParticipants: 128,
      prize: '$500 + DP Master Title',
      format: 'Swiss System'
    },
    {
      id: 'new-year-showdown',
      title: 'New Year Showdown 2025',
      type: 'Special Event',
      icon: GiTrophyCup,
      color: '#ffd700',
      colorEnd: '#ffaa00',
      status: 'upcoming',
      date: 'January 1, 2025',
      time: '12:00 AM UTC',
      participants: 412,
      maxParticipants: 1024,
      prize: '$2,500 + New Year Champion Badge',
      format: 'Double Elimination'
    },
    // Live
    {
      id: 'speed-coding-sprint',
      title: 'Speed Coding Sprint',
      type: 'Daily Challenge',
      icon: FaFire,
      color: '#ff4444',
      colorEnd: '#ff8800',
      status: 'live',
      date: 'Now',
      time: 'Ends in 2h 15m',
      participants: 87,
      maxParticipants: 100,
      prize: '2,000 XP + Speed Demon Badge',
      format: 'Time Attack'
    },
    // Past
    {
      id: 'graph-theory-grand-prix',
      title: 'Graph Theory Grand Prix',
      type: 'Specialty Tournament',
      icon: GiTrophy,
      color: '#00d4ff',
      colorEnd: '#9945ff',
      status: 'past',
      date: 'December 10, 2024',
      time: 'Completed',
      participants: 256,
      maxParticipants: 256,
      prize: '$1,000 + Graph Master Title',
      format: 'Swiss System',
      winner: 'GraphGuru'
    },
    {
      id: 'weekly-battle-royale-51',
      title: 'Weekly Battle Royale #51',
      type: 'Weekly Tournament',
      icon: GiSwordsEmblem,
      color: '#00ff88',
      colorEnd: '#00d4ff',
      status: 'past',
      date: 'December 15, 2024',
      time: 'Completed',
      participants: 256,
      maxParticipants: 256,
      prize: '5,000 XP + Premium Badge',
      format: 'Single Elimination',
      winner: 'AlgoMaster99'
    },
    {
      id: 'autumn-championship',
      title: 'Autumn Championship 2024',
      type: 'Grand Championship',
      icon: GiLaurelsTrophy,
      color: '#ff8800',
      colorEnd: '#ff4444',
      status: 'past',
      date: 'November 20-22, 2024',
      time: 'Completed',
      participants: 512,
      maxParticipants: 512,
      prize: '$5,000 + Exclusive Rewards',
      format: 'Double Elimination',
      winner: 'RecursiveKing'
    }
  ];

  const pastWinners = [
    { tournament: 'Autumn Championship 2024', winner: 'RecursiveKing', prize: '$2,000' },
    { tournament: 'Summer Slam 2024', winner: 'CodeNinja', prize: '$2,000' },
    { tournament: 'Spring Showdown 2024', winner: 'BinaryBeast', prize: '$2,000' },
    { tournament: 'Winter Championship 2024', winner: 'AlgoMaster99', prize: '$2,000' }
  ];

  const filteredTournaments = tournaments.filter(t => {
    if (activeFilter === 'live') return t.status === 'live';
    if (activeFilter === 'past') return t.status === 'past';
    return t.status === 'upcoming';
  });

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
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
          >
            <GiTrophy />
          </motion.div>
          <h1 className="support-title">Tournaments</h1>
          <p className="support-subtitle">
            Compete in epic algorithm tournaments. Win prizes, earn glory, and prove you're 
            among the best coders in the world.
          </p>
        </motion.div>

        {/* Featured Tournament */}
        <motion.div
          className="hero-feature-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ border: '2px solid #ffd700', position: 'relative' }}
        >
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
            borderRadius: '20px',
            color: '#0a0a0a',
            fontWeight: '700',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <FaCrown /> Featured Event
          </div>
          
          <div className="hero-feature-content">
            <div className="hero-feature-text">
              <span style={{ 
                color: '#ffd700', 
                fontSize: '0.9rem', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                {featuredTournament.type}
              </span>
              <h2 style={{ 
                background: 'linear-gradient(135deg, #ffd700, #00ff88)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {featuredTournament.title}
              </h2>
              <p>{featuredTournament.description}</p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                margin: '1.5rem 0'
              }}>
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '0.75rem', 
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>DATE</div>
                  <div style={{ color: '#ffffff', fontWeight: '600' }}>{featuredTournament.date}</div>
                </div>
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '0.75rem', 
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>FORMAT</div>
                  <div style={{ color: '#ffffff', fontWeight: '600' }}>{featuredTournament.format}</div>
                </div>
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '0.75rem', 
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>PLAYERS</div>
                  <div style={{ color: '#ffffff', fontWeight: '600' }}>{featuredTournament.participants}/{featuredTournament.maxParticipants}</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.2))', 
                  padding: '0.75rem', 
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,215,0,0.3)'
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>PRIZE POOL</div>
                  <div style={{ color: '#ffd700', fontWeight: '700' }}>$5,000</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.button
                  className="event-cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#0a0a0a' }}
                >
                  <GiTrophy /> Register Now
                </motion.button>
                <motion.button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: '2px solid #ffd700',
                    borderRadius: '10px',
                    color: '#ffd700',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,215,0,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaBell /> Get Reminder
                </motion.button>
              </div>
            </div>
            
            <div className="hero-feature-visual">
              <motion.div 
                className="hero-visual-icon"
                style={{ borderColor: '#ffd700', color: '#ffd700' }}
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.3)',
                    '0 0 50px rgba(255, 215, 0, 0.5)',
                    '0 0 20px rgba(255, 215, 0, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <GiCrownedSkull />
              </motion.div>
            </div>
          </div>

          {/* Prize Breakdown */}
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(255,215,0,0.2)' 
          }}>
            <h4 style={{ color: '#ffd700', marginBottom: '1rem', fontFamily: 'Orbitron, monospace' }}>
              <FaGift style={{ marginRight: '0.5rem' }} /> Prize Breakdown
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {featuredTournament.prizes.map((prize, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  borderLeft: `3px solid ${idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#00ff88'}`
                }}>
                  <div style={{ color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#00ff88', fontWeight: '700' }}>
                    {prize.place}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    {prize.reward}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: '3rem', marginBottom: '2rem' }}
        >
          <div className="filter-tabs" style={{ justifyContent: 'center' }}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.id === 'live' && <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: '#ff4444', 
                  borderRadius: '50%',
                  marginRight: '0.5rem',
                  animation: 'pulse-badge 2s infinite'
                }} />}
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tournament Grid */}
        <motion.div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeFilter}
        >
          {filteredTournaments.map((tournament) => (
            <motion.div
              key={tournament.id}
              className={`tournament-card ${tournament.id === 'winter-championship-2025' ? 'featured' : ''}`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              style={{
                '--tournament-color': tournament.color,
                '--tournament-color-end': tournament.colorEnd
              }}
            >
              <div className="tournament-header">
                <span className={`tournament-badge ${tournament.status}`}>
                  {tournament.status === 'live' ? '🔴 LIVE' : tournament.status === 'past' ? 'COMPLETED' : 'UPCOMING'}
                </span>
                <div className="tournament-icon" style={{ '--tournament-color': tournament.color }}>
                  {typeof tournament.icon === 'function' ? <tournament.icon /> : <tournament.icon />}
                </div>
              </div>
              
              <div className="tournament-body">
                <span className="tournament-type" style={{ color: tournament.color }}>
                  {tournament.type}
                </span>
                <h3>{tournament.title}</h3>
                
                <div className="tournament-info">
                  <div className="tournament-info-item">
                    <div className="label"><FaCalendarAlt /> Date</div>
                    <div className="value">{tournament.date}</div>
                  </div>
                  <div className="tournament-info-item">
                    <div className="label"><FaClock /> Time</div>
                    <div className="value">{tournament.time}</div>
                  </div>
                  <div className="tournament-info-item">
                    <div className="label"><FaUsers /> Players</div>
                    <div className="value">{tournament.participants}/{tournament.maxParticipants}</div>
                  </div>
                  <div className="tournament-info-item">
                    <div className="label"><FaMedal /> Format</div>
                    <div className="value">{tournament.format}</div>
                  </div>
                </div>

                {tournament.status === 'past' && tournament.winner && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,170,0,0.1))',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,215,0,0.2)',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>WINNER</span>
                    <div style={{ color: '#ffd700', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                      <FaCrown /> {tournament.winner}
                    </div>
                  </div>
                )}

                <div className="tournament-prize">
                  <div className="label"><FaTrophy /> Prize</div>
                  <div className="value">{tournament.prize}</div>
                </div>

                <motion.button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: tournament.status === 'past' 
                      ? 'rgba(100,100,100,0.3)' 
                      : `linear-gradient(135deg, ${tournament.color}, ${tournament.colorEnd})`,
                    border: 'none',
                    borderRadius: '10px',
                    color: tournament.status === 'past' ? 'rgba(255,255,255,0.6)' : '#0a0a0a',
                    fontWeight: '600',
                    cursor: tournament.status === 'past' ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  whileHover={tournament.status !== 'past' ? { scale: 1.02 } : {}}
                  whileTap={tournament.status !== 'past' ? { scale: 0.98 } : {}}
                  onClick={() => tournament.status !== 'past' && navigate('/login')}
                >
                  {tournament.status === 'live' ? (
                    <>Watch Live <FaChevronRight /></>
                  ) : tournament.status === 'past' ? (
                    <>View Results</>
                  ) : (
                    <>Register <FaChevronRight /></>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTournaments.length === 0 && (
          <motion.div 
            className="support-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '3rem' }}
          >
            <GiTrophy style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              {activeFilter === 'live' ? 'No tournaments are live right now. Check back soon!' : 'No tournaments found.'}
            </p>
          </motion.div>
        )}

        {/* Hall of Fame */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <FaHistory style={{ marginRight: '0.5rem' }} /> Hall of Fame
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
            Celebrating our championship winners
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {pastWinners.map((entry, index) => (
              <motion.div
                key={index}
                className="support-card"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                <h4 style={{ color: '#ffd700', fontFamily: 'Orbitron, monospace' }}>{entry.winner}</h4>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                  {entry.tournament}
                </p>
                <span style={{ color: '#00ff88', fontWeight: '600' }}>{entry.prize}</span>
              </motion.div>
            ))}
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
            <FaBell /> Never Miss a Tournament
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Create an account to receive notifications about upcoming tournaments, 
            register early, and track your competitive history.
          </p>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            style={{ margin: '0 auto' }}
          >
            Create Free Account
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Tournaments;
