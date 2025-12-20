import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaCalendarAlt,
  FaTrophy,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaGift,
  FaLaptopCode,
  FaGraduationCap,
  FaGamepad,
  FaGlobe,
  FaBell,
  FaChevronRight
} from 'react-icons/fa';
import { GiSwordman, GiTrophy, GiPodium } from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './CommunityPages.css';

const Events = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Events', icon: FaCalendarAlt },
    { id: 'tournament', label: 'Tournaments', icon: FaTrophy },
    { id: 'hackathon', label: 'Hackathons', icon: FaLaptopCode },
    { id: 'workshop', label: 'Workshops', icon: FaGraduationCap },
    { id: 'challenge', label: 'Challenges', icon: FaGamepad }
  ];

  const events = [
    {
      id: 1,
      type: 'tournament',
      typeLabel: 'Tournament',
      title: 'Winter Algorithm Championship 2025',
      description: 'The ultimate test of algorithmic prowess! Compete against the best programmers in a 3-round elimination tournament covering sorting, graphs, and dynamic programming. Top 3 winners receive exclusive prizes and recognition.',
      date: { day: '28', month: 'Dec' },
      time: '3:00 PM IST',
      duration: '4 hours',
      location: 'Online',
      participants: 2500,
      maxParticipants: 5000,
      prize: '₹50,000 Prize Pool',
      color: '#00ff88',
      featured: true,
      registrationOpen: true
    },
    {
      id: 2,
      type: 'hackathon',
      typeLabel: 'Hackathon',
      title: 'Algorithm Innovation Hackathon',
      description: 'Build innovative solutions using algorithms! Create visualizations, optimization tools, or educational applications. Solo or team participation welcome. Judged on creativity, technical implementation, and impact.',
      date: { day: '05', month: 'Jan' },
      time: '9:00 AM IST',
      duration: '48 hours',
      location: 'Online',
      participants: 890,
      maxParticipants: 2000,
      prize: 'Prizes + Internship Opportunities',
      color: '#ff0080',
      featured: true,
      registrationOpen: true
    },
    {
      id: 3,
      type: 'workshop',
      typeLabel: 'Workshop',
      title: 'Master Graph Algorithms: From Basics to Advanced',
      description: 'A comprehensive 3-hour workshop covering BFS, DFS, shortest path algorithms, MST, and network flow. Includes hands-on coding exercises and real-world applications. Led by Dr. Sarah Chen, ex-Google engineer.',
      date: { day: '22', month: 'Dec' },
      time: '11:00 AM IST',
      duration: '3 hours',
      location: 'Online (Live)',
      participants: 456,
      maxParticipants: 500,
      prize: 'Certificate + Workshop Materials',
      color: '#9945ff',
      featured: false,
      registrationOpen: true
    },
    {
      id: 4,
      type: 'challenge',
      typeLabel: 'Weekly Challenge',
      title: 'Speed Coding: Binary Search Mastery',
      description: 'Test your binary search skills with 5 progressively challenging problems. Complete all problems within the time limit to earn bonus XP and an exclusive badge. New challenge every Monday!',
      date: { day: '23', month: 'Dec' },
      time: '12:00 AM IST',
      duration: '7 days',
      location: 'Platform Challenge',
      participants: 3200,
      maxParticipants: null,
      prize: '500 XP + Special Badge',
      color: '#00d4ff',
      featured: false,
      registrationOpen: true
    },
    {
      id: 5,
      type: 'tournament',
      typeLabel: 'Tournament',
      title: 'New Year Sorting Showdown',
      description: 'Ring in 2026 with our biggest Sorting Showdown tournament! Compete in real-time sorting races across multiple rounds. Special New Year themed challenges and exclusive rewards for top performers.',
      date: { day: '01', month: 'Jan' },
      time: '8:00 PM IST',
      duration: '2 hours',
      location: 'Online',
      participants: 1800,
      maxParticipants: 10000,
      prize: '₹25,000 + New Year Badge',
      color: '#ffaa00',
      featured: false,
      registrationOpen: true
    },
    {
      id: 6,
      type: 'workshop',
      typeLabel: 'Workshop',
      title: 'Interview Prep: FAANG Coding Rounds',
      description: 'Intensive workshop focused on cracking FAANG-style coding interviews. Covers common patterns, time management strategies, and how to communicate your thought process. Includes mock interview practice.',
      date: { day: '10', month: 'Jan' },
      time: '2:00 PM IST',
      duration: '4 hours',
      location: 'Online (Live)',
      participants: 678,
      maxParticipants: 1000,
      prize: 'Certificate + Interview Guide PDF',
      color: '#9945ff',
      featured: false,
      registrationOpen: true
    },
    {
      id: 7,
      type: 'challenge',
      typeLabel: 'Monthly Challenge',
      title: 'Dynamic Programming December',
      description: 'Complete 25 DP problems throughout December to unlock the "DP Master" title and exclusive avatar frame. Problems range from beginner to advanced, with hints available for each.',
      date: { day: '01', month: 'Dec' },
      time: 'All Month',
      duration: '31 days',
      location: 'Platform Challenge',
      participants: 4567,
      maxParticipants: null,
      prize: 'DP Master Title + Avatar Frame',
      color: '#00d4ff',
      featured: false,
      registrationOpen: true
    },
    {
      id: 8,
      type: 'hackathon',
      typeLabel: 'Hackathon',
      title: 'Edu-Tech Algorithm Jam',
      description: 'Create educational tools that make learning algorithms fun and accessible. Build games, visualizers, or interactive tutorials. Winning projects will be featured on Playgorithm and may be integrated into the platform!',
      date: { day: '20', month: 'Jan' },
      time: '10:00 AM IST',
      duration: '72 hours',
      location: 'Online',
      participants: 234,
      maxParticipants: 1000,
      prize: '₹1,00,000 + Platform Integration',
      color: '#ff0080',
      featured: false,
      registrationOpen: true
    }
  ];

  const filteredEvents = events.filter(event => {
    return activeFilter === 'all' || event.type === activeFilter;
  });

  const featuredEvents = filteredEvents.filter(e => e.featured);
  const regularEvents = filteredEvents.filter(e => !e.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
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
            <FaCalendarAlt />
          </motion.div>
          <h1 className="support-title">Events</h1>
          <p className="support-subtitle">
            Compete in tournaments, join hackathons, attend workshops, and challenge yourself. 
            There's always something exciting happening at Playgorithm!
          </p>
        </motion.div>

        {/* Upcoming Highlight */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(255, 0, 128, 0.1))',
            borderColor: '#00ff88',
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <GiTrophy style={{ fontSize: '1.5rem', color: '#ffaa00' }} />
            <span style={{ color: '#00ff88', fontWeight: '700', fontSize: '1.1rem' }}>NEXT BIG EVENT</span>
            <GiTrophy style={{ fontSize: '1.5rem', color: '#ffaa00' }} />
          </div>
          <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Winter Algorithm Championship 2025
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
            December 28, 2025 • 3:00 PM IST • ₹50,000 Prize Pool
          </p>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FaBell /> Register Now
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="filter-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginBottom: '2rem' }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <filter.icon /> {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Events Timeline */}
        <motion.div 
          className="events-timeline"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className={`event-card ${event.featured ? 'featured' : ''}`}
              variants={itemVariants}
              style={{ '--event-color': event.color }}
              whileHover={{ x: 10 }}
            >
              <div className="event-header">
                <div className="event-date-badge">
                  <div className="day">{event.date.day}</div>
                  <div className="month">{event.date.month}</div>
                </div>
                <div className="event-info">
                  <span className="event-type" style={{ background: event.color }}>
                    {event.typeLabel}
                  </span>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
              
              <div className="event-details">
                <div className="event-detail">
                  <FaClock />
                  <span>{event.time} ({event.duration})</span>
                </div>
                <div className="event-detail">
                  <FaGlobe />
                  <span>{event.location}</span>
                </div>
                <div className="event-detail">
                  <FaUsers />
                  <span>
                    {event.participants.toLocaleString()} joined
                    {event.maxParticipants && ` / ${event.maxParticipants.toLocaleString()}`}
                  </span>
                </div>
                <div className="event-detail">
                  <FaGift />
                  <span>{event.prize}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <motion.button
                  className="event-cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    background: event.registrationOpen 
                      ? `linear-gradient(135deg, ${event.color}, ${event.color}cc)` 
                      : 'rgba(100,100,100,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {event.registrationOpen ? (
                    <>Register <FaChevronRight /></>
                  ) : (
                    'Coming Soon'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredEvents.length === 0 && (
          <motion.div 
            className="support-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '3rem' }}
          >
            <FaCalendarAlt style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No events found in this category. Check back soon!</p>
          </motion.div>
        )}

        {/* Past Events Archive */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title">Past Event Highlights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <motion.div 
              className="support-card"
              whileHover={{ y: -5 }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <GiPodium style={{ fontSize: '2rem', color: '#ffaa00' }} />
                <div>
                  <h4 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>November Championship</h4>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>3,450 participants</span>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                Epic battles, incredible performances. Watch the highlights and learn from the winners.
              </p>
            </motion.div>

            <motion.div 
              className="support-card"
              whileHover={{ y: -5 }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <FaLaptopCode style={{ fontSize: '2rem', color: '#ff0080' }} />
                <div>
                  <h4 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>Fall Hackathon 2025</h4>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>1,200 participants</span>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                See the winning projects and innovative solutions created by our community.
              </p>
            </motion.div>

            <motion.div 
              className="support-card"
              whileHover={{ y: -5 }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <FaGraduationCap style={{ fontSize: '2rem', color: '#9945ff' }} />
                <div>
                  <h4 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>DP Workshop Series</h4>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>2,800 attendees</span>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                All 5 sessions now available on-demand. Perfect for mastering dynamic programming.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Notification CTA */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <h3 className="support-card-title" style={{ justifyContent: 'center' }}>
            <FaBell /> Never Miss an Event
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Enable notifications to get reminders about upcoming events, registration deadlines, 
            and exclusive early-access opportunities.
          </p>
          <motion.button
            className="event-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Enable Notifications
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;
