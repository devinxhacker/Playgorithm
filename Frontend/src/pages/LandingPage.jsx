import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaGamepad,
  FaBrain,
  FaTrophy,
  FaRocket,
  FaCode,
  FaUsers,
  FaPlay,
  FaGithub,
  FaTwitter,
  FaDiscord,
} from "react-icons/fa";
import {
  GiSwordman,
} from "react-icons/gi";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/AnimatedBackground";
import HeroSection from "../components/sections/HeroSection";
import Features from "../components/sections/Features";
import ScrollToTop from "../components/ui/ScrollToTop";
import TargetCursor from "../components/ui/TargetCursor";
import LoadingScreen from "../components/ui/LoadingScreen";
import Button from "../components/ui/Button";
import ScrollProgressBar from "../components/ui/ScrollProgressBar";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import algoBattlesImage from "../assets/images/algo-battles.jpg";
import "../App.css";
import "../styles/animations.css";

function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setHideNav(true);
      } else {
        // Scrolling up
        setHideNav(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="playgorithm-app">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
        
        {!isLoading && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
          <ScrollProgressBar />
          <TargetCursor 
            spinDuration={2}
            hideDefaultCursor={true}
          />
          <AnimatedBackground />
          
          {/* Simple Navigation for Landing Page */}
          <nav className={`landing-nav ${hideNav ? 'hidden' : ''}`}>
            <div className="container">
              <div className="nav-brand">
                <GiSwordman className="brand-icon" />
                <span>Playgorithm</span>
              </div>
              <button className="nav-login-btn cursor-target" onClick={handleGetStarted}>
                Login / Sign Up
              </button>
            </div>
          </nav>

          <HeroSection onGetStarted={handleGetStarted} />
          <Features />

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <motion.div
            className="row text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">
                  <AnimatedCounter end={10000} suffix="+" duration={2500} />
                </h3>
                <p className="stat-label">Active Players</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">
                  <AnimatedCounter end={500} suffix="+" duration={2000} />
                </h3>
                <p className="stat-label">Algorithm Challenges</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">
                  <AnimatedCounter end={1000000} suffix="+" duration={3000} />
                </h3>
                <p className="stat-label">Battles Fought</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">
                  <AnimatedCounter end={95} suffix="%" duration={2000} />
                </h3>
                <p className="stat-label">Success Rate</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Battle and CTA Sections with Shared Background */}
      <div className="battle-cta-wrapper">
        <div className="battle-bg-container">
          <img src={algoBattlesImage} alt="Algorithm Battles" className="battle-bg-image" />
          <div className="battle-overlay"></div>
        </div>

        {/* Battle Preview Section */}
        <section id="battles" className="battle-section py-5">
          <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Algorithm Battles
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience the thrill of real-time coding competitions
            </motion.p>
          </motion.div>

          <motion.div
            className="row g-4 battle-cards-row"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="col-lg-4">
              <motion.div className="battle-card cursor-target" variants={fadeInUp}>
                <div className="battle-header">
                  <h4>Sorting Showdown</h4>
                  <span className="difficulty easy">Easy</span>
                </div>
                <div className="battle-content">
                  <p>
                    Race against time to implement the fastest sorting
                    algorithm. Bubble sort vs Quick sort - who will claim victory?
                  </p>
                  <div className="battle-stats">
                    <span>
                      <FaUsers className="me-1" />
                      1,234 players
                    </span>
                    <span>
                      <FaTrophy className="me-1" />
                      500 XP
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-100"
                  onClick={handleGetStarted}
                >
                  Join Battle
                </Button>
              </motion.div>
            </div>

            <div className="col-lg-4">
              <motion.div className="battle-card featured cursor-target" variants={fadeInUp}>
                <div className="battle-header">
                  <h4>Graph Gladiator</h4>
                  <span className="difficulty medium">Medium</span>
                </div>
                <div className="battle-content">
                  <p>
                    Navigate through complex graph structures. Find the shortest
                    path before your opponent does!
                  </p>
                  <div className="battle-stats">
                    <span>
                      <FaUsers className="me-1" />
                      856 players
                    </span>
                    <span>
                      <FaTrophy className="me-1" />
                      1,000 XP
                    </span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleGetStarted}
                >
                  Join Battle
                </Button>
              </motion.div>
            </div>

            <div className="col-lg-4">
              <motion.div className="battle-card cursor-target" variants={fadeInUp}>
                <div className="battle-header">
                  <h4>Flexbox Arena</h4>
                  <span className="difficulty medium">Medium</span>
                </div>
                <div className="battle-content">
                  <p>
                    Master CSS Flexbox through interactive warrior battles.
                    Position your heroes and conquer the battlefield!
                  </p>
                  <div className="battle-stats">
                    <span>
                      <FaUsers className="me-1" />
                      567 players
                    </span>
                    <span>
                      <FaTrophy className="me-1" />
                      750 XP
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-100"
                  onClick={handleGetStarted}
                >
                  Join Battle
                </Button>
              </motion.div>
            </div>
          </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-5">
        <div className="container">
          <motion.div
            className="row justify-content-center text-center"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="col-lg-8">
              <motion.h2 
                className="cta-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to Master Algorithms?
              </motion.h2>
              <motion.p 
                className="cta-description"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join thousands of developers who've transformed their coding
                skills through gamified learning. Your algorithmic adventure
                awaits!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={<FaRocket />}
                  onClick={handleGetStarted}
                  className="hero-cta-primary"
                >
                  Start Your Journey
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="gaming-footer py-5">
        <div className="container">
          <motion.div 
            className="row"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="col-lg-4 mb-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="footer-brand mb-3">
                <GiSwordman className="me-2" />
                <span>Playgorithm</span>
              </div>
              <p className="footer-description">
                Where Algorithms Turn into Games. Transform your coding journey
                into an epic adventure.
              </p>
              <div className="social-links">
                <motion.a
                  href="#"
                  className="cursor-target"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub />
                </motion.a>
                <motion.a
                  href="#"
                  className="cursor-target"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter />
                </motion.a>
                <motion.a
                  href="#"
                  className="cursor-target"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaDiscord />
                </motion.a>
              </div>
            </motion.div>

            <motion.div 
              className="col-lg-2 col-md-6 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h5 className="footer-title">Platform</h5>
              <ul className="footer-links">
                <li><a href="#features" className="cursor-target">Features</a></li>
                <li><a href="#battles" className="cursor-target">Battles</a></li>
                <li><a href="#" className="cursor-target">Leaderboard</a></li>
                <li><a href="#" className="cursor-target">Tournaments</a></li>
              </ul>
            </motion.div>

            <motion.div 
              className="col-lg-2 col-md-6 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h5 className="footer-title">Learn</h5>
              <ul className="footer-links">
                <li><a href="#" className="cursor-target">Algorithms</a></li>
                <li><a href="#" className="cursor-target">Data Structures</a></li>
                <li><a href="#" className="cursor-target">Tutorials</a></li>
                <li><a href="#" className="cursor-target">Docs</a></li>
              </ul>
            </motion.div>

            <motion.div 
              className="col-lg-2 col-md-6 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h5 className="footer-title">Community</h5>
              <ul className="footer-links">
                <li><a href="#" className="cursor-target">Discord</a></li>
                <li><a href="#" className="cursor-target">Forums</a></li>
                <li><a href="#" className="cursor-target">Blog</a></li>
                <li><a href="#" className="cursor-target">Events</a></li>
              </ul>
            </motion.div>

            <motion.div 
              className="col-lg-2 col-md-6 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h5 className="footer-title">Support</h5>
              <ul className="footer-links">
                <li><a href="/help" className="cursor-target">Help Center</a></li>
                <li><a href="/contact" className="cursor-target">Contact</a></li>
                <li><a href="/privacy" className="cursor-target">Privacy</a></li>
                <li><a href="/terms" className="cursor-target">Terms</a></li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.hr 
            className="footer-divider"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.div 
            className="row align-items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="col-md-6">
              <p className="copyright">
                &copy; 2025 Playgorithm. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-end">
              <p className="tagline">Where Algorithms Turn into Games 🎮</p>
            </div>
          </motion.div>
        </div>
      </footer>

            <ScrollToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;
