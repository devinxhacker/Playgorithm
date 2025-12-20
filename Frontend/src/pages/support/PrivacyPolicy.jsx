import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaArrowLeft,
  FaUserShield,
  FaDatabase,
  FaCookieBite,
  FaShareAlt,
  FaChild,
  FaGlobe,
  FaLock,
  FaEdit
} from 'react-icons/fa';
import { GiSwordman } from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import './SupportPages.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const lastUpdated = 'December 15, 2025';

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: FaShieldAlt },
    { id: 'information-collected', title: 'Information We Collect', icon: FaDatabase },
    { id: 'how-we-use', title: 'How We Use Your Information', icon: FaUserShield },
    { id: 'cookies', title: 'Cookies & Tracking', icon: FaCookieBite },
    { id: 'data-sharing', title: 'Data Sharing & Disclosure', icon: FaShareAlt },
    { id: 'data-security', title: 'Data Security', icon: FaLock },
    { id: 'your-rights', title: 'Your Rights & Choices', icon: FaEdit },
    { id: 'children', title: 'Children\'s Privacy', icon: FaChild },
    { id: 'international', title: 'International Users', icon: FaGlobe },
    { id: 'changes', title: 'Policy Changes', icon: FaEdit },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            <FaShieldAlt />
          </motion.div>
          <h1 className="support-title">Privacy Policy</h1>
          <p className="support-subtitle">
            Your privacy matters to us. This policy explains how Playgorithm collects, 
            uses, and protects your personal information.
          </p>
          <p className="support-last-updated">Last Updated: {lastUpdated}</p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div 
          className="toc-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="toc-title">Quick Navigation</h3>
          <ul className="toc-list">
            {sections.map((section) => (
              <li key={section.id}>
                <a onClick={() => scrollToSection(section.id)}>
                  <section.icon /> {section.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Introduction */}
          <section id="introduction" className="support-section">
            <h2 className="support-section-title">
              <FaShieldAlt style={{ marginRight: '12px' }} />
              Introduction
            </h2>
            <div className="support-section-content">
              <p>
                Welcome to Playgorithm ("we," "our," or "us"). We are committed to protecting your 
                personal information and your right to privacy. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you use our platform at 
                playgorithm.com and our related services (collectively, the "Service").
              </p>
              <p>
                By accessing or using Playgorithm, you agree to the collection and use of information 
                in accordance with this Privacy Policy. If you do not agree with our policies and 
                practices, please do not use our Service.
              </p>
              <p>
                We encourage you to read this Privacy Policy carefully to understand our views and 
                practices regarding your personal data and how we will treat it.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section id="information-collected" className="support-section">
            <h2 className="support-section-title">
              <FaDatabase style={{ marginRight: '12px' }} />
              Information We Collect
            </h2>
            <div className="support-section-content">
              <p><strong>Information You Provide Directly:</strong></p>
              <ul>
                <li><strong>Account Information:</strong> When you register, we collect your username, email address, and password. If you sign up via third-party services (Google, GitHub), we receive your name and email from those providers.</li>
                <li><strong>Profile Information:</strong> Optional details you may add, such as display name, avatar, bio, and social media links.</li>
                <li><strong>Communication Data:</strong> Messages you send through our contact forms, support tickets, or community features.</li>
                <li><strong>Payment Information:</strong> If you subscribe to premium features, our payment processor (Stripe) collects payment details. We do not store full credit card numbers.</li>
              </ul>

              <p><strong>Information Collected Automatically:</strong></p>
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, features used, games played, challenges attempted, time spent on different sections, and interaction patterns.</li>
                <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device type, screen resolution, and language preferences.</li>
                <li><strong>Game Performance Data:</strong> Your solutions to coding challenges, algorithm choices, completion times, and scores for improving our platform and providing personalized recommendations.</li>
                <li><strong>Log Data:</strong> Server logs that record access times, pages viewed, and referring URLs.</li>
              </ul>

              <p><strong>Information from Third Parties:</strong></p>
              <ul>
                <li><strong>Social Logins:</strong> If you connect via Google or GitHub, we receive your public profile information and email address.</li>
                <li><strong>Analytics Partners:</strong> We may receive aggregated analytics data from services like Google Analytics.</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section id="how-we-use" className="support-section">
            <h2 className="support-section-title">
              <FaUserShield style={{ marginRight: '12px' }} />
              How We Use Your Information
            </h2>
            <div className="support-section-content">
              <p>We use your information for the following purposes:</p>
              <ul>
                <li><strong>Provide and Maintain the Service:</strong> Operating the platform, processing your requests, and delivering features you've requested.</li>
                <li><strong>Personalization:</strong> Customizing your learning experience, recommending challenges based on your skill level, and adapting AI mentor responses to your progress.</li>
                <li><strong>Leaderboards and Achievements:</strong> Displaying your username and achievements on public leaderboards if you opt-in.</li>
                <li><strong>Communication:</strong> Sending service-related announcements, responding to your inquiries, and notifying you about updates or security issues.</li>
                <li><strong>Marketing (with consent):</strong> Sending promotional emails about new features, tournaments, or educational content. You can opt out at any time.</li>
                <li><strong>Analytics and Improvement:</strong> Understanding how users interact with our platform to improve functionality, fix bugs, and develop new features.</li>
                <li><strong>Security:</strong> Detecting and preventing fraud, abuse, and security threats to protect our users and platform.</li>
                <li><strong>Legal Compliance:</strong> Complying with applicable laws, regulations, and legal processes.</li>
              </ul>
            </div>
          </section>

          {/* Cookies & Tracking */}
          <section id="cookies" className="support-section">
            <h2 className="support-section-title">
              <FaCookieBite style={{ marginRight: '12px' }} />
              Cookies & Tracking Technologies
            </h2>
            <div className="support-section-content">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on Playgorithm:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for the platform to function properly. These enable features like authentication, session management, and security. You cannot opt out of these.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences, such as theme choice, language, and notification preferences.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform. We use Google Analytics with IP anonymization enabled.</li>
                <li><strong>Performance Cookies:</strong> Collect information about page load times and errors to help us optimize the platform.</li>
              </ul>
              <p>
                <strong>Managing Cookies:</strong> Most browsers allow you to control cookies through settings. However, disabling essential cookies may prevent you from using certain features. 
                You can also opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </p>
              <p>
                <strong>Do Not Track:</strong> We currently do not respond to Do Not Track (DNT) browser signals as there is no industry standard for compliance.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section id="data-sharing" className="support-section">
            <h2 className="support-section-title">
              <FaShareAlt style={{ marginRight: '12px' }} />
              Data Sharing & Disclosure
            </h2>
            <div className="support-section-content">
              <p>We do not sell your personal data. We may share your information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> Trusted third parties who help us operate our platform (hosting providers, payment processors, email services). They are contractually bound to protect your data.</li>
                <li><strong>Public Leaderboards:</strong> If you participate in competitive features, your username, rank, and scores may be displayed publicly on leaderboards.</li>
                <li><strong>Community Features:</strong> Comments, forum posts, or content you share in community spaces are visible to other users.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government request, or to protect our rights, safety, or property.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity. We will notify you of any such change.</li>
                <li><strong>With Your Consent:</strong> We may share data for other purposes if you explicitly consent.</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section id="data-security" className="support-section">
            <h2 className="support-section-title">
              <FaLock style={{ marginRight: '12px' }} />
              Data Security
            </h2>
            <div className="support-section-content">
              <p>We take the security of your data seriously and implement industry-standard measures:</p>
              <ul>
                <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.3. Sensitive data at rest is encrypted using AES-256.</li>
                <li><strong>Secure Infrastructure:</strong> Our servers are hosted on secure cloud infrastructure with regular security audits and vulnerability assessments.</li>
                <li><strong>Access Controls:</strong> Employee access to user data is restricted on a need-to-know basis and protected by multi-factor authentication.</li>
                <li><strong>Code Sandboxing:</strong> User-submitted code is executed in isolated sandbox environments to prevent security risks.</li>
                <li><strong>Password Security:</strong> Passwords are hashed using bcrypt with appropriate salt rounds. We never store plaintext passwords.</li>
                <li><strong>Regular Backups:</strong> Data is backed up regularly with encrypted, geographically distributed storage.</li>
              </ul>
              <p>
                While we strive to protect your personal information, no method of transmission or storage is 100% secure. 
                If you discover a security vulnerability, please report it to <a href="mailto:security@playgorithm.com">security@playgorithm.com</a>.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section id="your-rights" className="support-section">
            <h2 className="support-section-title">
              <FaEdit style={{ marginRight: '12px' }} />
              Your Rights & Choices
            </h2>
            <div className="support-section-content">
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
                <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
                <li><strong>Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time.</li>
                <li><strong>Object to Processing:</strong> Object to processing for direct marketing or based on legitimate interests.</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
              </ul>
              <p>
                To exercise these rights, please contact us at <a href="mailto:privacy@playgorithm.com">privacy@playgorithm.com</a>. 
                We will respond within 30 days. Note that some rights may be limited based on legal obligations or legitimate business needs.
              </p>
              <p>
                <strong>Account Deletion:</strong> You can delete your account from Profile &gt; Settings &gt; Delete Account. 
                After a 30-day grace period, your data will be permanently removed from our active systems.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section id="children" className="support-section">
            <h2 className="support-section-title">
              <FaChild style={{ marginRight: '12px' }} />
              Children's Privacy
            </h2>
            <div className="support-section-content">
              <p>
                Playgorithm is designed for users who are at least 13 years old (or the minimum age in your jurisdiction). 
                We do not knowingly collect personal information from children under 13.
              </p>
              <p>
                If you are a parent or guardian and believe your child has provided us with personal information without your consent, 
                please contact us at <a href="mailto:privacy@playgorithm.com">privacy@playgorithm.com</a>. 
                We will promptly delete such information from our records.
              </p>
              <p>
                For users between 13-18, we recommend parental guidance when using online educational platforms.
              </p>
            </div>
          </section>

          {/* International Users */}
          <section id="international" className="support-section">
            <h2 className="support-section-title">
              <FaGlobe style={{ marginRight: '12px' }} />
              International Users
            </h2>
            <div className="support-section-content">
              <p>
                Playgorithm operates globally, and your information may be transferred to and processed in countries 
                other than your own, including India and the United States, where data protection laws may differ.
              </p>
              <p>
                <strong>For EU/EEA Users:</strong> We comply with GDPR requirements. Data transfers outside the EEA 
                are conducted using Standard Contractual Clauses approved by the European Commission or other valid legal mechanisms.
              </p>
              <p>
                <strong>For California Residents:</strong> Under the CCPA, you have the right to know what personal information 
                we collect, request deletion, and opt out of the sale of personal information. We do not sell personal information.
              </p>
              <p>
                By using Playgorithm, you consent to the transfer of your information to these locations for the purposes described in this policy.
              </p>
            </div>
          </section>

          {/* Policy Changes */}
          <section id="changes" className="support-section">
            <h2 className="support-section-title">
              <FaEdit style={{ marginRight: '12px' }} />
              Changes to This Policy
            </h2>
            <div className="support-section-content">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
                legal requirements, or for other operational reasons.
              </p>
              <p>
                When we make material changes, we will notify you by:
              </p>
              <ul>
                <li>Posting a prominent notice on our platform</li>
                <li>Sending an email to your registered address</li>
                <li>Updating the "Last Updated" date at the top of this policy</li>
              </ul>
              <p>
                We encourage you to review this Privacy Policy periodically. Your continued use of Playgorithm 
                after changes indicates your acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact */}
          <motion.div 
            className="support-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginTop: '3rem' }}
          >
            <h3 className="support-card-title" style={{ justifyContent: 'center' }}>
              <FaShieldAlt /> Questions About Privacy?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, 
              please contact our Data Protection Officer:
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@playgorithm.com" style={{ color: '#00ff88' }}>
                privacy@playgorithm.com
              </a>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              We aim to respond to all privacy-related inquiries within 30 days.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
