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
import "../App.css";

function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
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
          <TargetCursor 
            spinDuration={2}
            hideDefaultCursor={true}
          />
          <AnimatedBackground />
          
          {/* Simple Navigation for Landing Page */}
          <nav className="landing-nav">
            <div className="container">
              <div className="nav-brand">
                <GiSwordman className="brand-icon" />
                <span>Playgorithm</span>
              </div>
              <button className="nav-login-btn" onClick={handleGetStarted}>
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
            viewport={{ once: true }}
          >
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">10K+</h3>
                <p className="stat-label">Active Players</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">500+</h3>
                <p className="stat-label">Algorithm Challenges</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">1M+</h3>
                <p className="stat-label">Battles Fought</p>
              </motion.div>
            </div>
            <div className="col-md-3">
              <motion.div className="stat-item" variants={fadeInUp}>
                <h3 className="stat-number">95%</h3>
                <p className="stat-label">Success Rate</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Battle Preview Section */}
      <section id="battles" className="battle-section py-5">
        <div className="container">
          <motion.div className="text-center mb-5" {...fadeInUp}>
            <h2 className="section-title">Algorithm Battles</h2>
            <p className="section-subtitle">
              Experience the thrill of real-time coding competitions
            </p>
          </motion.div>

          <motion.div
            className="row g-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
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
                    algorithm. Bubble sort vs Quick sort - who will win?
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
                  <h4>Dynamic Programming Duel</h4>
                  <span className="difficulty hard">Hard</span>
                </div>
                <div className="battle-content">
                  <p>
                    Master the art of optimization. Break down complex problems
                    into manageable subproblems.
                  </p>
                  <div className="battle-stats">
                    <span>
                      <FaUsers className="me-1" />
                      342 players
                    </span>
                    <span>
                      <FaTrophy className="me-1" />
                      2,000 XP
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
            {...fadeInUp}
          >
            <div className="col-lg-8">
              <h2 className="cta-title">Ready to Master Algorithms?</h2>
              <p className="cta-description">
                Join thousands of developers who've transformed their coding
                skills through gamified learning. Your algorithmic adventure
                awaits!
              </p>
              <Button
                variant="primary"
                size="lg"
                icon={<FaRocket />}
                onClick={handleGetStarted}
              >
                Start Your Journey
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gaming-footer py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub />
                </motion.a>
                <motion.a
                  href="#"
                  className="cursor-target"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter />
                </motion.a>
                <motion.a
                  href="#"
                  className="cursor-target"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaDiscord />
                </motion.a>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Platform</h5>
              <ul className="footer-links">
                <li><a href="#features" className="cursor-target">Features</a></li>
                <li><a href="#battles" className="cursor-target">Battles</a></li>
                <li><a href="#" className="cursor-target">Leaderboard</a></li>
                <li><a href="#" className="cursor-target">Tournaments</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Learn</h5>
              <ul className="footer-links">
                <li><a href="#" className="cursor-target">Algorithms</a></li>
                <li><a href="#" className="cursor-target">Data Structures</a></li>
                <li><a href="#" className="cursor-target">Tutorials</a></li>
                <li><a href="#" className="cursor-target">Docs</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Community</h5>
              <ul className="footer-links">
                <li><a href="#" className="cursor-target">Discord</a></li>
                <li><a href="#" className="cursor-target">Forums</a></li>
                <li><a href="#" className="cursor-target">Blog</a></li>
                <li><a href="#" className="cursor-target">Events</a></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 mb-4">
              <h5 className="footer-title">Support</h5>
              <ul className="footer-links">
                <li><a href="#" className="cursor-target">Help Center</a></li>
                <li><a href="#" className="cursor-target">Contact</a></li>
                <li><a href="#" className="cursor-target">Privacy</a></li>
                <li><a href="#" className="cursor-target">Terms</a></li>
              </ul>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright">
                &copy; 2024 Playgorithm. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-end">
              <p className="tagline">Where Algorithms Turn into Games 🎮</p>
            </div>
          </div>
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
