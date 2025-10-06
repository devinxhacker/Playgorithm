import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa'
import { GiSwordman } from 'react-icons/gi'
import Button from '../ui/Button'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="auth-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="auth-close cursor-target"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>

            {/* Header */}
            <div className="auth-header">
              <motion.div 
                className="auth-logo"
                whileHover={{ scale: 1.05 }}
              >
                <GiSwordman className="logo-icon" />
                <span>Playgorithm</span>
              </motion.div>
              <h2 className="auth-title">
                {mode === 'login' ? 'Welcome Back, Warrior!' : 'Join the Battle!'}
              </h2>
              <p className="auth-subtitle">
                {mode === 'login' 
                  ? 'Ready to continue your algorithmic journey?' 
                  : 'Start your epic coding adventure today'
                }
              </p>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <Button variant="ghost" className="social-btn">
                <FaGoogle />
                Continue with Google
              </Button>
              <Button variant="ghost" className="social-btn">
                <FaGithub />
                Continue with GitHub
              </Button>
            </div>

            <div className="divider">
              <span>or</span>
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <motion.div 
                  className="input-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Choose your warrior name"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </motion.div>
              )}

              <motion.div 
                className="input-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mode === 'signup' ? 0.2 : 0.1 }}
              >
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                className="input-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mode === 'signup' ? 0.3 : 0.2 }}
              >
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle cursor-target"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              {mode === 'signup' && (
                <motion.div 
                  className="input-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </motion.div>
              )}

              {mode === 'login' && (
                <div className="forgot-password">
                  <a href="#" className="forgot-link cursor-target">Forgot your password?</a>
                </div>
              )}

              <Button 
                variant="primary" 
                size="lg" 
                className="auth-submit"
                type="submit"
              >
                {mode === 'login' ? 'Enter the Arena' : 'Begin Your Quest'}
              </Button>
            </form>

            {/* Mode Toggle */}
            <div className="auth-toggle">
              <p>
                {mode === 'login' ? "New to Playgorithm? " : "Already have an account? "}
                <button
                  type="button"
                  className="toggle-link cursor-target"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                >
                  {mode === 'login' ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal