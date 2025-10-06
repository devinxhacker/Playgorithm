import { motion } from 'framer-motion'
import { GiSwordman } from 'react-icons/gi'
import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
          <div className="loading-content">
            {/* Logo */}
            <motion.div 
              className="loading-logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <GiSwordman className="logo-icon" />
              <span className="logo-text">Playgorithm</span>
            </motion.div>

            {/* Loader */}
            <motion.div
              className="loader-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="loader">
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              className="loading-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <p>Loading your algorithmic adventure...</p>
            </motion.div>
          </div>
    </motion.div>
  )
}

export default LoadingScreen