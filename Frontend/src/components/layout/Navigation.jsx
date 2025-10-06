import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa'
import { GiSwordman } from 'react-icons/gi'
import Button from '../ui/Button'
import AuthModal from '../auth/AuthModal'
import './Navigation.css'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#battles', label: 'Battles' },
    { href: '#leaderboard', label: 'Leaderboard' },
    { href: '#about', label: 'About' }
  ]

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode })
    setIsMobileMenuOpen(false)
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' })
  }

  return (
    <>
      <motion.nav 
        className={`gaming-nav ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="nav-container">
          {/* Logo */}
          <motion.a 
            href="#home"
            className="nav-logo cursor-target"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="logo-icon-wrapper"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <GiSwordman className="logo-icon" />
            </motion.div>
            <span className="logo-text">Playgorithm</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="nav-link cursor-target"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="nav-auth desktop-nav">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openAuthModal('login')}
              icon={<FaSignInAlt />}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openAuthModal('signup')}
              icon={<FaUserPlus />}
            >
              Join Battle
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="mobile-menu-toggle cursor-target"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="mobile-menu-content">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="mobile-nav-link cursor-target"
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0, 
                  x: isMobileMenuOpen ? 0 : -20 
                }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.a>
            ))}
            
            <div className="mobile-auth-buttons">
              <Button
                variant="ghost"
                size="md"
                onClick={() => openAuthModal('login')}
                icon={<FaSignInAlt />}
                className="mobile-auth-btn"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => openAuthModal('signup')}
                icon={<FaUserPlus />}
                className="mobile-auth-btn"
              >
                Join Battle
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </>
  )
}

export default Navigation