import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaArrowLeft,
  FaDiscord,
  FaTwitter,
  FaGithub,
  FaPaperPlane,
  FaHeadset,
  FaBug,
  FaLightbulb,
  FaHandshake,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';
import { GiSwordman } from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import './SupportPages.css';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'partnership', label: 'Partnership / Business' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const contactOptions = [
    {
      icon: FaHeadset,
      title: 'General Support',
      description: 'Questions about features, gameplay, or your account',
      color: '#00ff88',
      action: () => setFormData(prev => ({ ...prev, category: 'general' }))
    },
    {
      icon: FaBug,
      title: 'Report a Bug',
      description: 'Found something broken? Let us know so we can fix it',
      color: '#ff4444',
      action: () => setFormData(prev => ({ ...prev, category: 'bug' }))
    },
    {
      icon: FaLightbulb,
      title: 'Feature Request',
      description: 'Have an idea to make Playgorithm better? We\'re all ears',
      color: '#ffaa00',
      action: () => setFormData(prev => ({ ...prev, category: 'feature' }))
    }
  ];

  const partnershipOption = {
    icon: FaHandshake,
    title: 'Partnerships',
    description: 'Interested in collaborating? Let\'s build something together',
    color: '#00d4ff',
    action: () => setFormData(prev => ({ ...prev, category: 'partnership' }))
  };

  const socialLinks = [
    { icon: FaDiscord, label: 'Discord', url: 'https://discord.gg/playgorithm', color: '#7289da' },
    { icon: FaTwitter, label: 'Twitter', url: 'https://twitter.com/playgorithm', color: '#1da1f2' },
    { icon: FaGithub, label: 'GitHub', url: 'https://github.com/playgorithm', color: '#ffffff' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Submit to Formspree
    try {
      const response = await fetch('https://formspree.io/f/xaqweydl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
          _subject: `[Playgorithm Contact] ${formData.subject}`
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <FaEnvelope />
          </motion.div>
          <h1 className="support-title">Contact Us</h1>
          <p className="support-subtitle">
            Have a question, feedback, or just want to say hello? We'd love to hear from you. 
            Our team typically responds within 24 hours.
          </p>
        </motion.div>

        {/* Contact Option Cards */}
        <motion.div 
          className="contact-options"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contactOptions.map((option, index) => (
            <motion.div
              key={option.title}
              className="contact-option-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={option.action}
            >
              <div className="contact-option-icon" style={{ '--option-color': option.color }}>
                <option.icon />
              </div>
              <h3 className="contact-option-title">{option.title}</h3>
              <p className="contact-option-desc">{option.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership Card - Centered */}
        <motion.div 
          style={{ display: 'flex', justifyContent: 'center', marginTop: '-0.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="contact-option-card"
            style={{ maxWidth: '350px' }}
            whileHover={{ y: -5 }}
            onClick={partnershipOption.action}
          >
            <div className="contact-option-icon" style={{ '--option-color': partnershipOption.color }}>
              <partnershipOption.icon />
            </div>
            <h3 className="contact-option-title">{partnershipOption.title}</h3>
            <p className="contact-option-desc">{partnershipOption.description}</p>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ maxWidth: '700px', margin: '3rem auto' }}
        >
          <h2 className="support-card-title">
            <FaPaperPlane /> Send us a Message
          </h2>

          {submitSuccess ? (
            <motion.div 
              className="form-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '2rem', textAlign: 'center' }}
            >
              <FaCheckCircle style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>Message Sent Successfully!</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button 
                className="submit-btn" 
                onClick={() => setSubmitSuccess(false)}
                style={{ maxWidth: '200px', margin: '0 auto' }}
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of your inquiry"
                />
                {errors.subject && <span className="form-error">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your question or concern in detail..."
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              {errors.submit && (
                <div className="form-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  {errors.submit}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spin" /> Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <h2 className="support-section-title" style={{ textAlign: 'center', borderBottom: 'none' }}>
            Connect With Us
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
            Follow us on social media for updates, tips, and community highlights
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '1rem 2rem',
                  background: 'rgba(15, 15, 15, 0.9)',
                  border: `1px solid ${link.color}40`,
                  borderRadius: '50px',
                  color: link.color,
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                <link.icon style={{ fontSize: '1.3rem' }} />
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Office Info */}
        <motion.div
          className="support-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '600px', margin: '4rem auto 0', textAlign: 'center' }}
        >
          <h3 className="support-card-title" style={{ justifyContent: 'center' }}>
            <FaEnvelope /> Email Us Directly
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
            For urgent matters or if you prefer email:
          </p>
          <a 
            href="mailto:support@playgorithm.com"
            style={{ 
              color: '#00ff88', 
              fontSize: '1.2rem', 
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            support@playgorithm.com
          </a>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem', fontSize: '0.9rem' }}>
            Business Hours: Monday - Friday, 9:00 AM - 6:00 PM IST
          </p>
        </motion.div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Contact;
