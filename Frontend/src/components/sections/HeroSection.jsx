import { motion } from 'framer-motion'
import { FaPlay, FaCode, FaTrophy, FaRocket, FaBolt } from 'react-icons/fa'
import { GiArtificialIntelligence, GiBrain } from 'react-icons/gi'
import Button from '../ui/Button'
import './HeroSection.css'

const HeroSection = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg">
        <div className="hero-grid"></div>
        <div className="hero-particles"></div>
      </div>
      
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1 
              className="hero-title"
              variants={itemVariants}
            >
              <span className="title-main">Playgorithm</span>
              <motion.span 
                className="title-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Play. Compete. Master Algorithms.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="hero-description"
              variants={itemVariants}
            >
              Where Algorithms Turn into Games. Transform your coding journey into an epic adventure 
              with AI-powered battles, real-time visualizations, and gamified learning experiences 
              that make complex concepts feel like child's play.
            </motion.p>
            
            <motion.div 
              className="hero-stats"
              variants={itemVariants}
            >
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Warriors</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Challenges</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Battles</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="hero-buttons"
              variants={itemVariants}
            >
              <Button
                variant="primary"
                size="lg"
                icon={<FaPlay />}
                className="hero-cta-primary"
              >
                Start Your Quest
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<FaRocket />}
                className="hero-cta-secondary"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <div className="simple-visual">
              {/* Main Icon Display */}
              <motion.div 
                className="main-icon-container cursor-target"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="main-icon">
                  <GiArtificialIntelligence size={80} />
                </div>
              </motion.div>

              {/* Simple Feature Icons */}
              <div className="feature-icons">
                <motion.div 
                  className="feature-icon cursor-target"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <FaCode size={24} />
                </motion.div>
                
                <motion.div 
                  className="feature-icon cursor-target"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <FaBolt size={24} />
                </motion.div>
                
                <motion.div 
                  className="feature-icon cursor-target"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <FaTrophy size={24} />
                </motion.div>
                
                <motion.div 
                  className="feature-icon cursor-target"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <GiBrain size={24} />
                </motion.div>
              </div>

              {/* Simple Glow Effect */}
              <motion.div 
                className="glow-ring"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator - Moved outside and below */}
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
        >
          <motion.div 
            className="scroll-arrow"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection