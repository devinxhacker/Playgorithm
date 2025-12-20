import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaQuestionCircle, 
  FaSearch, 
  FaChevronDown,
  FaGamepad,
  FaTrophy,
  FaUser,
  FaCreditCard,
  FaShieldAlt,
  FaCode,
  FaArrowLeft,
  FaDiscord,
  FaEnvelope
} from 'react-icons/fa';
import { GiSwordman } from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import './SupportPages.css';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    { id: 'all', label: 'All Topics', icon: FaQuestionCircle },
    { id: 'getting-started', label: 'Getting Started', icon: FaGamepad },
    { id: 'account', label: 'Account', icon: FaUser },
    { id: 'gameplay', label: 'Gameplay', icon: FaCode },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy },
    { id: 'billing', label: 'Billing', icon: FaCreditCard },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create an account on Playgorithm?',
      answer: 'Creating an account is simple! Click the "Login / Sign Up" button on the homepage, then select "Sign Up". You can register using your email address or sign in with Google/GitHub. Once registered, you\'ll have immediate access to all free games and challenges.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What programming languages are supported?',
      answer: 'Playgorithm currently supports JavaScript, Python, Java, C++, and TypeScript for coding challenges. For algorithm visualization games, you interact through our visual interface without needing to write code directly. We\'re constantly adding support for more languages based on community feedback.'
    },
    {
      id: 3,
      category: 'getting-started',
      question: 'Is Playgorithm free to use?',
      answer: 'Yes! Playgorithm offers a generous free tier that includes access to all algorithm games, basic coding challenges, and community features. Premium features like AI-powered mentoring, advanced analytics, and exclusive tournaments are available through our subscription plans.'
    },
    {
      id: 4,
      category: 'gameplay',
      question: 'How do Algorithm Battles work?',
      answer: 'Algorithm Battles are real-time 1v1 competitions where you solve coding problems against other players. Both players receive the same problem and must solve it as quickly and efficiently as possible. Points are awarded based on correctness, time complexity, and speed. You can join random matchmaking or challenge friends directly.'
    },
    {
      id: 5,
      category: 'gameplay',
      question: 'What is the Sorting Showdown game?',
      answer: 'Sorting Showdown is an interactive game where you learn and compete using different sorting algorithms. You can visualize how algorithms like Bubble Sort, Quick Sort, and Merge Sort work, then race against the clock or other players to sort arrays correctly. It\'s a fun way to understand time complexity in action!'
    },
    {
      id: 6,
      category: 'gameplay',
      question: 'How does the AI Mentor (AlgoBot) help me?',
      answer: 'AlgoBot is your personal AI assistant that reviews your code submissions, suggests optimizations, explains complex concepts in simple terms, and adapts to your skill level. It can help you understand why a solution is inefficient, recommend learning paths, and provide hints when you\'re stuck without giving away the answer.'
    },
    {
      id: 7,
      category: 'achievements',
      question: 'How do I earn XP and level up?',
      answer: 'You earn XP by completing challenges, winning battles, participating in tournaments, and maintaining daily streaks. Different activities award different XP amounts - harder challenges give more XP. As you accumulate XP, you\'ll level up and unlock new titles, badges, and exclusive content.'
    },
    {
      id: 8,
      category: 'achievements',
      question: 'What are badges and how do I unlock them?',
      answer: 'Badges are special achievements that showcase your accomplishments. Examples include "First Blood" (win your first battle), "Speed Demon" (solve a problem in under 2 minutes), "Graph Gladiator" (complete all graph challenges), and "Dynamic Dominator" (master dynamic programming). Each badge has specific unlock criteria displayed in your profile.'
    },
    {
      id: 9,
      category: 'achievements',
      question: 'How does the leaderboard ranking work?',
      answer: 'Leaderboards are updated in real-time based on your performance. Your rank is calculated using an ELO-style rating system that considers your wins, losses, problem difficulty, and opponent skill level. There are global leaderboards, weekly leaderboards, and category-specific rankings for different algorithm types.'
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Login" and then "Forgot Password". Enter your registered email address, and we\'ll send you a secure link to reset your password. The link expires after 24 hours for security. If you don\'t receive the email, check your spam folder or contact support.'
    },
    {
      id: 11,
      category: 'account',
      question: 'Can I change my username?',
      answer: 'Yes! Go to your Profile settings and click on "Edit Profile". You can change your display name at any time. Note that your username must be unique and follow our community guidelines. Previous usernames are not retained, and the change is immediate.'
    },
    {
      id: 12,
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'We\'re sorry to see you go! To delete your account, go to Profile > Settings > Account > Delete Account. You\'ll need to confirm your password and acknowledge that this action is permanent. All your data, progress, and achievements will be permanently deleted after a 30-day grace period.'
    },
    {
      id: 13,
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and in select regions, UPI and local payment methods. All payments are processed securely through Stripe. We never store your full card details on our servers.'
    },
    {
      id: 14,
      category: 'billing',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime from Profile > Settings > Subscription > Cancel Plan. You\'ll continue to have access to premium features until the end of your current billing period. No partial refunds are provided, but you won\'t be charged again after cancellation.'
    },
    {
      id: 15,
      category: 'security',
      question: 'Is my code and data secure?',
      answer: 'Absolutely. We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Your code submissions are processed in isolated sandbox environments. We never share your personal data or code with third parties without your explicit consent.'
    },
    {
      id: 16,
      category: 'security',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Profile > Settings > Security > Two-Factor Authentication. You can enable 2FA using an authenticator app (Google Authenticator, Authy) or receive codes via SMS. We highly recommend enabling 2FA to protect your account and achievements.'
    },
    {
      id: 17,
      category: 'gameplay',
      question: 'What happens if I disconnect during a battle?',
      answer: 'If you disconnect during an Algorithm Battle, you have 2 minutes to reconnect before the match is forfeited. Your progress is saved, and you\'ll resume from where you left off. If your opponent also disconnects, the match is declared a draw. Frequent disconnections may affect your reliability rating.'
    },
    {
      id: 18,
      category: 'getting-started',
      question: 'Can I use Playgorithm on mobile devices?',
      answer: 'Playgorithm is fully responsive and works on tablets and large mobile devices. However, for the best coding experience, especially for Algorithm Battles and challenges that require writing code, we recommend using a desktop or laptop with a physical keyboard.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <FaQuestionCircle />
          </motion.div>
          <h1 className="support-title">Help Center</h1>
          <p className="support-subtitle">
            Find answers to common questions, learn how to make the most of Playgorithm, 
            and get the support you need to become an algorithm champion.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="support-search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="search-input-wrapper">
            <FaSearch />
            <input 
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          className="category-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <cat.icon /> {cat.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <motion.div 
          className="faq-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredFAQs.length === 0 ? (
            <motion.div 
              className="support-card"
              variants={itemVariants}
              style={{ textAlign: 'center' }}
            >
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                No results found for "{searchQuery}". Try a different search term or category.
              </p>
            </motion.div>
          ) : (
            filteredFAQs.map((faq) => (
              <motion.div
                key={faq.id}
                className={`faq-item ${openFAQ === faq.id ? 'active' : ''}`}
                variants={itemVariants}
              >
                <div 
                  className="faq-question"
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                >
                  <h4>
                    <FaQuestionCircle />
                    {faq.question}
                  </h4>
                  <div className="faq-toggle">
                    <FaChevronDown />
                  </div>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Still Need Help Section */}
        <motion.div 
          className="support-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center' }}>
            Still Need Help?
          </h2>
          <div className="contact-options" style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
            <motion.div 
              className="contact-option-card"
              whileHover={{ y: -5 }}
              onClick={() => navigate('/contact')}
            >
              <div className="contact-option-icon" style={{ '--option-color': '#00ff88' }}>
                <FaEnvelope />
              </div>
              <h3 className="contact-option-title">Contact Support</h3>
              <p className="contact-option-desc">
                Send us a message and we'll respond within 24 hours
              </p>
            </motion.div>

            <motion.div 
              className="contact-option-card"
              whileHover={{ y: -5 }}
              onClick={() => window.open('https://discord.gg/mbZ8tw4n2p', '_blank')}
            >
              <div className="contact-option-icon" style={{ '--option-color': '#7289da' }}>
                <FaDiscord />
              </div>
              <h3 className="contact-option-title">Join Discord</h3>
              <p className="contact-option-desc">
                Get instant help from our community and moderators
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenter;
