import { motion } from "framer-motion";
import { FaGamepad, FaBrain, FaTrophy, FaUsers, FaBolt } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import epicFeaturesImage from "../../assets/images/futuristic-ninja-digital-art.jpg";
import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: FaGamepad,
      title: "Learn Through Play",
      description:
        "Transform complex algorithms into interactive games. Drag-and-drop tree balancing, maze pathfinding, and sorting challenges.",
      color: "#00ff88",
    },
    {
      icon: FaBolt,
      title: "Algorithm Battles",
      description:
        "Compete in real-time 1v1 duels or challenge our AI. Code submissions evaluated on accuracy, time complexity, and efficiency.",
      color: "#00d4ff",
    },
    {
      icon: GiArtificialIntelligence,
      title: "AI-Powered Mentor",
      description:
        "Meet AlgoBot - your personal AI mentor that reviews code, suggests optimizations, and adapts to your skill level.",
      color: "#ff0080",
    },
    {
      icon: FaBrain,
      title: "Real-Time Visualization",
      description:
        "Watch algorithms come to life with stunning animations. See sorting swaps, graph traversals, and tree operations in action.",
      color: "#ff6b35",
    },
    {
      icon: FaTrophy,
      title: "Gamification & Rewards",
      description:
        "Earn XP, unlock achievements, climb leaderboards. From 'Dynamic Dominator' to 'Graph Gladiator' - collect them all!",
      color: "#00ff88",
    },
    {
      icon: FaUsers,
      title: "Community Battles",
      description:
        "Join tournaments, team challenges, and hackathon-style competitions. Connect with fellow algorithm warriors worldwide.",
      color: "#00d4ff",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section id="features" className="features-section">
      <div className="features-bg"></div>
      <div className="epic-features-bg">
        <img
          src={epicFeaturesImage}
          alt="Epic Features"
          className="epic-features-image"
        />
        <div className="epic-features-overlay"></div>
      </div>
      <div className="features-container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="features-title"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Epic Features
          </motion.h2>
          <motion.p
            className="features-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover what makes Playgorithm the ultimate coding battleground
          </motion.p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className="feature-card cursor-target"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="feature-icon"
                  style={{ "--feature-color": feature.color }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.3 },
                  }}
                >
                  <IconComponent />
                </motion.div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <motion.div
                  className="feature-glow"
                  style={{ "--glow-color": feature.color }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
