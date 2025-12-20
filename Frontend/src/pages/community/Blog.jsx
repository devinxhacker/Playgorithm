import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaNewspaper,
  FaCode,
  FaTrophy,
  FaLightbulb,
  FaRocket,
  FaClock,
  FaBookOpen,
  FaChartLine,
  FaGamepad,
  FaBrain,
  FaGraduationCap,
  FaSearch,
  FaArrowRight
} from 'react-icons/fa';
import { GiSwordman, GiPodium, GiArtificialIntelligence } from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../support/SupportPages.css';
import './CommunityPages.css';

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'tutorials', label: 'Tutorials' },
    { id: 'tips', label: 'Tips & Tricks' },
    { id: 'updates', label: 'Platform Updates' },
    { id: 'interviews', label: 'Interview Prep' },
    { id: 'community', label: 'Community Stories' }
  ];

  const featuredPost = {
    id: 'featured-1',
    title: 'Mastering Dynamic Programming: From Zero to Hero',
    excerpt: 'Dynamic Programming (DP) is often considered one of the most challenging topics in computer science. In this comprehensive guide, we break down DP into digestible concepts, starting from basic memoization to advanced optimization techniques. Learn through real-world examples and interactive visualizations.',
    category: 'Tutorials',
    author: 'Dr. Sarah Chen',
    authorAvatar: 'SC',
    date: 'December 18, 2025',
    readTime: '15 min read',
    icon: FaBrain
  };

  const blogPosts = [
    {
      id: 1,
      title: '10 Graph Algorithms Every Developer Should Know',
      excerpt: 'From BFS and DFS to Dijkstra and Floyd-Warshall, master the essential graph algorithms that power navigation systems, social networks, and recommendation engines.',
      category: 'Tutorials',
      author: 'Alex Rivera',
      authorAvatar: 'AR',
      date: 'December 16, 2025',
      readTime: '12 min read',
      icon: FaCode
    },
    {
      id: 2,
      title: 'How I Went from 0 to Top 100 on the Leaderboard',
      excerpt: 'A personal journey of improvement, dedication, and the strategies that helped me climb the ranks. Plus, my favorite practice techniques and resources.',
      category: 'Community Stories',
      author: 'Maya Patel',
      authorAvatar: 'MP',
      date: 'December 14, 2025',
      readTime: '8 min read',
      icon: FaTrophy
    },
    {
      id: 3,
      title: 'New Feature: AI-Powered Code Reviews',
      excerpt: 'Introducing AlgoBot\'s new code review feature! Get instant feedback on your solutions, learn about edge cases you might have missed, and improve your code quality.',
      category: 'Platform Updates',
      author: 'Playgorithm Team',
      authorAvatar: 'PT',
      date: 'December 12, 2025',
      readTime: '5 min read',
      icon: GiArtificialIntelligence
    },
    {
      id: 4,
      title: 'Cracking the Coding Interview: A 30-Day Plan',
      excerpt: 'A structured study plan that covers all major topics - arrays, strings, trees, graphs, dynamic programming, and system design. Includes daily challenges and resources.',
      category: 'Interview Prep',
      author: 'James Wilson',
      authorAvatar: 'JW',
      date: 'December 10, 2025',
      readTime: '10 min read',
      icon: FaGraduationCap
    },
    {
      id: 5,
      title: 'Understanding Big O Notation: A Visual Guide',
      excerpt: 'Time and space complexity explained through interactive visualizations. See how O(n²) really compares to O(n log n) and why it matters for your code.',
      category: 'Tutorials',
      author: 'Emily Zhang',
      authorAvatar: 'EZ',
      date: 'December 8, 2025',
      readTime: '9 min read',
      icon: FaChartLine
    },
    {
      id: 6,
      title: '5 Common Mistakes in Sorting Showdown (And How to Avoid Them)',
      excerpt: 'Analysis of the most frequent errors players make in our sorting game, with tips on how to optimize your approach and climb the leaderboard faster.',
      category: 'Tips & Tricks',
      author: 'Kevin Lee',
      authorAvatar: 'KL',
      date: 'December 6, 2025',
      readTime: '6 min read',
      icon: FaGamepad
    },
    {
      id: 7,
      title: 'December Tournament Recap: The Best Moments',
      excerpt: 'Highlights from our biggest tournament yet! Watch the most impressive plays, hear from the winners, and see the strategies that dominated the competition.',
      category: 'Community Stories',
      author: 'Playgorithm Team',
      authorAvatar: 'PT',
      date: 'December 4, 2025',
      readTime: '7 min read',
      icon: FaTrophy
    },
    {
      id: 8,
      title: 'Recursion Demystified: Think Like a Computer',
      excerpt: 'Struggling with recursion? Learn the mental model that makes recursive thinking intuitive. Includes practice problems with step-by-step breakdowns.',
      category: 'Tutorials',
      author: 'Dr. Sarah Chen',
      authorAvatar: 'SC',
      date: 'December 2, 2025',
      readTime: '11 min read',
      icon: FaBrain
    },
    {
      id: 9,
      title: 'The Psychology of Problem Solving Under Pressure',
      excerpt: 'Why do we freeze during timed challenges? Sports psychology techniques adapted for coding competitions to help you perform your best when it matters.',
      category: 'Tips & Tricks',
      author: 'Dr. Mark Thompson',
      authorAvatar: 'MT',
      date: 'November 30, 2025',
      readTime: '8 min read',
      icon: FaLightbulb
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || 
      post.category.toLowerCase().replace(/[^a-z]/g, '') === activeCategory.replace(/[^a-z]/g, '');
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
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
    hidden: { opacity: 0, y: 30 },
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
            <FaNewspaper />
          </motion.div>
          <h1 className="support-title">Blog</h1>
          <p className="support-subtitle">
            Insights, tutorials, and stories from the Playgorithm community. 
            Level up your algorithm skills with expert guides and tips.
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div 
          className="featured-blog"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <div className="featured-blog-image">
            <featuredPost.icon />
            <span className="featured-badge">Featured</span>
          </div>
          <div className="featured-blog-content">
            <span className="blog-card-category">{featuredPost.category}</span>
            <h2 className="blog-card-title">{featuredPost.title}</h2>
            <p className="blog-card-excerpt">{featuredPost.excerpt}</p>
            <div className="blog-card-footer">
              <div className="blog-card-author">
                <div className="blog-author-avatar">{featuredPost.authorAvatar}</div>
                <span className="blog-author-name">{featuredPost.author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="blog-read-time">
                  <FaClock /> {featuredPost.readTime}
                </span>
                <motion.button
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: '#0a0a0a',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read More <FaArrowRight />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginBottom: '2rem' }}
        >
          <div className="search-input-wrapper" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
            <FaSearch />
            <input 
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 45px',
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '25px',
                color: '#ffffff',
                fontSize: '0.95rem'
              }}
            />
          </div>
          
          <div className="filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Grid */}
        <motion.div 
          className="blog-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              className="blog-card"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="blog-card-image">
                <post.icon />
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-card-category">{post.category}</span>
                  <span className="blog-card-date">{post.date}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-footer">
                  <div className="blog-card-author">
                    <div className="blog-author-avatar">{post.authorAvatar}</div>
                    <span className="blog-author-name">{post.author}</span>
                  </div>
                  <span className="blog-read-time">
                    <FaClock /> {post.readTime}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredPosts.length === 0 && (
          <motion.div 
            className="support-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '3rem' }}
          >
            <FaNewspaper style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No articles found matching your criteria.</p>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <h3 className="support-card-title" style={{ justifyContent: 'center' }}>
            <FaBookOpen /> Stay Updated
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Get the latest tutorials, tips, and updates delivered straight to your inbox. 
            No spam, just quality content for algorithm enthusiasts.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '0.75rem 1rem',
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem'
              }}
            />
            <motion.button
              className="event-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
