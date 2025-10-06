import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaGamepad } from 'react-icons/fa'
import Button from './Button'
import './AuthForms.css'

export const LoginForm = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login:', formData)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <motion.form 
      className="auth-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="auth-header">
        <FaGamepad className="auth-icon" />
        <h2>Welcome Back, Warrior!</h2>
        <p>Continue your algorithmic journey</p>
      </div>

      <div className="form-group">
        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="gaming-input"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="gaming-input"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="form-options">
        <label className="checkbox-wrapper">
          <input type="checkbox" />
          <span className="checkmark"></span>
          Remember me
        </label>
        <a href="#" className="forgot-link">Forgot Password?</a>
      </div>

      <Button type="submit" size="lg" className="w-100 mb-3">
        Enter Battle Arena
      </Button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <div className="social-login">
        <Button variant="outline" className="social-btn">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" width="20" />
          Continue with Google
        </Button>
      </div>

      <p className="auth-switch">
        New to Playgorithm? 
        <button type="button" onClick={onSwitchToSignup} className="switch-btn">
          Join the Battle
        </button>
      </p>
    </motion.form>
  )
}

export const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Signup:', formData)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <motion.form 
      className="auth-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="auth-header">
        <FaGamepad className="auth-icon" />
        <h2>Join the Algorithm Arena!</h2>
        <p>Start your coding adventure today</p>
      </div>

      <div className="form-group">
        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="gaming-input"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="gaming-input"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="gaming-input"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="form-group">
        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="gaming-input"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="form-options">
        <label className="checkbox-wrapper">
          <input type="checkbox" required />
          <span className="checkmark"></span>
          I agree to the <a href="#">Terms & Conditions</a>
        </label>
      </div>

      <Button type="submit" size="lg" className="w-100 mb-3">
        Start My Journey
      </Button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <div className="social-login">
        <Button variant="outline" className="social-btn">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" width="20" />
          Sign up with Google
        </Button>
      </div>

      <p className="auth-switch">
        Already have an account? 
        <button type="button" onClick={onSwitchToLogin} className="switch-btn">
          Sign In
        </button>
      </p>
    </motion.form>
  )
}