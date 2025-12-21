import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { GiSwordman } from "react-icons/gi";
import "./Footer.css";

const Footer = () => {
  return (
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
                href="https://github.com/Udaysapate212/Playgorithm"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/uday-sapate-b99872282/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="https://discord.gg/mbZ8tw4n2p"
                target="_blank"
                rel="noopener noreferrer"
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
              <li>
                <a href="/features" className="cursor-target">
                  Features
                </a>
              </li>
              <li>
                <a href="/battles" className="cursor-target">
                  Battles
                </a>
              </li>
              <li>
                <a href="/leaderboard" className="cursor-target">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="/tournaments" className="cursor-target">
                  Tournaments
                </a>
              </li>
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
              <li>
                <a href="/algorithms" className="cursor-target">
                  Algorithms
                </a>
              </li>
              <li>
                <a href="/data-structures" className="cursor-target">
                  Data Structures
                </a>
              </li>
              <li>
                <a href="/tutorials" className="cursor-target">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="/docs" className="cursor-target">
                  Docs
                </a>
              </li>
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
              <li>
                <a
                  href="https://discord.gg/mbZ8tw4n2p"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target"
                >
                  Discord
                </a>
              </li>
              <li>
                <a href="/forums" className="cursor-target">
                  Forums
                </a>
              </li>
              <li>
                <a href="/blog" className="cursor-target">
                  Blog
                </a>
              </li>
              <li>
                <a href="/events" className="cursor-target">
                  Events
                </a>
              </li>
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
              <li>
                <a href="/help" className="cursor-target">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="cursor-target">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="cursor-target">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="cursor-target">
                  Terms
                </a>
              </li>
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
  );
};

export default Footer;
