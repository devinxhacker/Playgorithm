import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileContract, 
  FaArrowLeft,
  FaUserCheck,
  FaGamepad,
  FaShieldAlt,
  FaBan,
  FaCopyright,
  FaExclamationTriangle,
  FaGavel,
  FaHandshake,
  FaEdit
} from 'react-icons/fa';
import { GiSwordman } from 'react-icons/gi';
import AnimatedBackground from '../../components/AnimatedBackground';
import './SupportPages.css';

const TermsOfService = () => {
  const navigate = useNavigate();
  const lastUpdated = 'December 15, 2025';
  const effectiveDate = 'January 1, 2025';

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: FaUserCheck },
    { id: 'eligibility', title: 'Eligibility', icon: FaUserCheck },
    { id: 'account', title: 'Account Terms', icon: FaShieldAlt },
    { id: 'usage', title: 'Acceptable Use', icon: FaGamepad },
    { id: 'prohibited', title: 'Prohibited Activities', icon: FaBan },
    { id: 'intellectual', title: 'Intellectual Property', icon: FaCopyright },
    { id: 'user-content', title: 'User Content', icon: FaEdit },
    { id: 'competitions', title: 'Competitions & Prizes', icon: FaGamepad },
    { id: 'disclaimers', title: 'Disclaimers', icon: FaExclamationTriangle },
    { id: 'liability', title: 'Limitation of Liability', icon: FaShieldAlt },
    { id: 'disputes', title: 'Dispute Resolution', icon: FaGavel },
    { id: 'general', title: 'General Terms', icon: FaHandshake },
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
            <FaFileContract />
          </motion.div>
          <h1 className="support-title">Terms of Service</h1>
          <p className="support-subtitle">
            Please read these terms carefully before using Playgorithm. 
            By using our platform, you agree to be bound by these terms.
          </p>
          <p className="support-last-updated">
            Last Updated: {lastUpdated} | Effective: {effectiveDate}
          </p>
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
          {/* Acceptance */}
          <section id="acceptance" className="support-section">
            <h2 className="support-section-title">
              <FaUserCheck style={{ marginRight: '12px' }} />
              1. Acceptance of Terms
            </h2>
            <div className="support-section-content">
              <p>
                Welcome to Playgorithm! These Terms of Service ("Terms") govern your access to and use of 
                the Playgorithm website, applications, and services (collectively, the "Service") operated 
                by Playgorithm ("Company," "we," "us," or "our").
              </p>
              <p>
                By creating an account, accessing, or using any part of the Service, you acknowledge that 
                you have read, understood, and agree to be bound by these Terms and our Privacy Policy. 
                If you do not agree to these Terms, you must not access or use the Service.
              </p>
              <p>
                We reserve the right to update or modify these Terms at any time. We will notify you of 
                material changes by posting the updated Terms on our website and updating the "Last Updated" 
                date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section id="eligibility" className="support-section">
            <h2 className="support-section-title">
              <FaUserCheck style={{ marginRight: '12px' }} />
              2. Eligibility
            </h2>
            <div className="support-section-content">
              <p>To use Playgorithm, you must:</p>
              <ul>
                <li>Be at least 13 years of age (or the minimum age of digital consent in your jurisdiction)</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be prohibited from using the Service under applicable laws</li>
                <li>Not have been previously banned from the platform for Terms violations</li>
              </ul>
              <p>
                If you are between 13 and 18 years old (or the age of majority in your jurisdiction), 
                you represent that your parent or legal guardian has reviewed and agrees to these Terms 
                on your behalf.
              </p>
              <p>
                If you are using Playgorithm on behalf of an organization (such as a school or company), 
                you represent that you have the authority to bind that organization to these Terms.
              </p>
            </div>
          </section>

          {/* Account Terms */}
          <section id="account" className="support-section">
            <h2 className="support-section-title">
              <FaShieldAlt style={{ marginRight: '12px' }} />
              3. Account Terms
            </h2>
            <div className="support-section-content">
              <p><strong>Account Registration:</strong></p>
              <ul>
                <li>You must provide accurate, complete, and current information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials</li>
                <li>You must not share your account with others or allow unauthorized access</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>

              <p><strong>Account Security:</strong></p>
              <ul>
                <li>Notify us immediately if you suspect unauthorized access to your account</li>
                <li>We recommend enabling two-factor authentication for enhanced security</li>
                <li>We are not liable for losses caused by unauthorized use of your account</li>
              </ul>

              <p><strong>Account Termination:</strong></p>
              <ul>
                <li>You may delete your account at any time through your account settings</li>
                <li>We may suspend or terminate your account for violations of these Terms</li>
                <li>Upon termination, your right to use the Service immediately ceases</li>
                <li>Certain provisions of these Terms survive termination (see Section 12)</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section id="usage" className="support-section">
            <h2 className="support-section-title">
              <FaGamepad style={{ marginRight: '12px' }} />
              4. Acceptable Use
            </h2>
            <div className="support-section-content">
              <p>You agree to use Playgorithm only for lawful purposes and in accordance with these Terms. You may:</p>
              <ul>
                <li>Access and use the Service for personal, educational, and competitive programming purposes</li>
                <li>Participate in challenges, battles, and tournaments as intended</li>
                <li>Share your achievements and progress on social media</li>
                <li>Provide feedback and suggestions to improve the platform</li>
                <li>Collaborate with other users through designated community features</li>
                <li>Use our AI mentor and learning resources to improve your skills</li>
              </ul>
              <p>
                You are responsible for ensuring that your use of the Service complies with all applicable 
                local, national, and international laws and regulations.
              </p>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section id="prohibited" className="support-section">
            <h2 className="support-section-title">
              <FaBan style={{ marginRight: '12px' }} />
              5. Prohibited Activities
            </h2>
            <div className="support-section-content">
              <p>You agree NOT to engage in any of the following prohibited activities:</p>
              
              <p><strong>Cheating & Unfair Advantages:</strong></p>
              <ul>
                <li>Using automated scripts, bots, or tools to complete challenges or battles</li>
                <li>Copying solutions from other users during timed competitions</li>
                <li>Exploiting bugs or vulnerabilities for unfair advantage</li>
                <li>Sharing real-time answers during live competitions</li>
                <li>Using multiple accounts to manipulate rankings or earn rewards</li>
              </ul>

              <p><strong>Harmful Content & Behavior:</strong></p>
              <ul>
                <li>Submitting code that contains malware, viruses, or harmful scripts</li>
                <li>Attempting to access other users' accounts or personal data</li>
                <li>Harassing, bullying, or threatening other users</li>
                <li>Posting offensive, discriminatory, or inappropriate content</li>
                <li>Impersonating other users, staff, or organizations</li>
              </ul>

              <p><strong>Platform Abuse:</strong></p>
              <ul>
                <li>Attempting to reverse engineer, decompile, or hack the platform</li>
                <li>Overloading servers with excessive requests (DoS attacks)</li>
                <li>Scraping or harvesting data without authorization</li>
                <li>Circumventing access controls or security measures</li>
                <li>Using the Service for commercial purposes without permission</li>
              </ul>

              <p>
                Violations may result in immediate suspension or permanent ban from the platform, 
                forfeiture of achievements and rewards, and potential legal action.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual" className="support-section">
            <h2 className="support-section-title">
              <FaCopyright style={{ marginRight: '12px' }} />
              6. Intellectual Property
            </h2>
            <div className="support-section-content">
              <p><strong>Our Intellectual Property:</strong></p>
              <p>
                The Service, including its original content, features, functionality, design, logos, 
                and branding, is owned by Playgorithm and is protected by international copyright, 
                trademark, patent, and other intellectual property laws.
              </p>
              <ul>
                <li>The Playgorithm name, logo, and related marks are our trademarks</li>
                <li>Challenge problems, educational content, and platform features are our proprietary content</li>
                <li>You may not copy, modify, distribute, or create derivative works without permission</li>
              </ul>

              <p><strong>Limited License:</strong></p>
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to access 
                and use the Service for personal, non-commercial purposes in accordance with these Terms.
              </p>

              <p><strong>Third-Party Content:</strong></p>
              <p>
                Some content on the platform may be licensed from third parties or contributed by users. 
                Such content remains the property of its respective owners.
              </p>
            </div>
          </section>

          {/* User Content */}
          <section id="user-content" className="support-section">
            <h2 className="support-section-title">
              <FaEdit style={{ marginRight: '12px' }} />
              7. User Content
            </h2>
            <div className="support-section-content">
              <p><strong>Your Code Submissions:</strong></p>
              <ul>
                <li>You retain ownership of code you write and submit on Playgorithm</li>
                <li>By submitting code, you grant us a license to store, display, and process it for platform functionality</li>
                <li>Your solutions may be used (anonymized) to improve our AI systems and challenge quality</li>
              </ul>

              <p><strong>Community Content:</strong></p>
              <ul>
                <li>Content you post in forums, comments, or discussions must comply with our Community Guidelines</li>
                <li>You grant us a worldwide, royalty-free license to use, display, and distribute community content</li>
                <li>We may remove content that violates our policies without notice</li>
              </ul>

              <p><strong>Content Responsibility:</strong></p>
              <ul>
                <li>You are solely responsible for content you submit or share</li>
                <li>You represent that you have all necessary rights to share such content</li>
                <li>You will not submit content that infringes on others' intellectual property rights</li>
              </ul>
            </div>
          </section>

          {/* Competitions */}
          <section id="competitions" className="support-section">
            <h2 className="support-section-title">
              <FaGamepad style={{ marginRight: '12px' }} />
              8. Competitions, Tournaments & Prizes
            </h2>
            <div className="support-section-content">
              <p><strong>Competition Rules:</strong></p>
              <ul>
                <li>Each competition may have specific rules posted on its page; those rules supplement these Terms</li>
                <li>Decisions by judges and automated systems regarding scores and rankings are final</li>
                <li>We reserve the right to disqualify participants who violate rules or engage in unfair practices</li>
              </ul>

              <p><strong>Prizes and Rewards:</strong></p>
              <ul>
                <li>XP, badges, and virtual rewards have no monetary value and cannot be exchanged for cash</li>
                <li>Physical or monetary prizes (if offered) are subject to eligibility requirements and may require tax documentation</li>
                <li>Winners may be required to verify their identity before receiving prizes</li>
                <li>Prizes are non-transferable and may not be substituted except at our discretion</li>
              </ul>

              <p><strong>Leaderboards:</strong></p>
              <ul>
                <li>Leaderboard rankings are based on platform algorithms and may be adjusted for fairness</li>
                <li>We reserve the right to recalculate rankings if cheating or technical issues are discovered</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section id="disclaimers" className="support-section">
            <h2 className="support-section-title">
              <FaExclamationTriangle style={{ marginRight: '12px' }} />
              9. Disclaimers
            </h2>
            <div className="support-section-content">
              <p>
                <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED.</strong>
              </p>
              <ul>
                <li>We do not guarantee that the Service will be uninterrupted, secure, or error-free</li>
                <li>We do not warrant that results obtained from the Service will be accurate or reliable</li>
                <li>We are not responsible for the accuracy of user-submitted content or AI-generated recommendations</li>
                <li>Learning outcomes depend on individual effort; we do not guarantee specific results</li>
              </ul>
              <p>
                Some jurisdictions do not allow disclaimer of implied warranties. In such cases, 
                the above disclaimers may not apply to you to the extent prohibited by law.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="liability" className="support-section">
            <h2 className="support-section-title">
              <FaShieldAlt style={{ marginRight: '12px' }} />
              10. Limitation of Liability
            </h2>
            <div className="support-section-content">
              <p>
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
              </p>
              <ul>
                <li>Playgorithm and its affiliates shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising from your use of the Service</li>
                <li>Our total liability for any claims related to the Service shall not exceed the amount 
                you paid us (if any) in the 12 months preceding the claim, or $100 USD, whichever is greater</li>
                <li>We are not liable for any loss of data, profits, or business opportunities</li>
              </ul>
              <p>
                These limitations apply regardless of the legal theory (contract, tort, negligence, etc.) 
                and even if we have been advised of the possibility of such damages.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section id="disputes" className="support-section">
            <h2 className="support-section-title">
              <FaGavel style={{ marginRight: '12px' }} />
              11. Dispute Resolution
            </h2>
            <div className="support-section-content">
              <p><strong>Informal Resolution:</strong></p>
              <p>
                Before filing a formal dispute, you agree to contact us at{' '}
                <a href="mailto:legal@playgorithm.com">legal@playgorithm.com</a> to attempt to resolve 
                the matter informally. Most concerns can be resolved quickly through direct communication.
              </p>

              <p><strong>Governing Law:</strong></p>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, 
                without regard to conflict of law principles.
              </p>

              <p><strong>Arbitration:</strong></p>
              <p>
                Any disputes not resolved informally shall be resolved through binding arbitration 
                in accordance with the Arbitration and Conciliation Act, 1996 of India. 
                Arbitration shall be conducted in English in Bangalore, India.
              </p>

              <p><strong>Class Action Waiver:</strong></p>
              <p>
                You agree to resolve disputes on an individual basis. You waive any right to participate 
                in class actions, class arbitrations, or representative proceedings.
              </p>
            </div>
          </section>

          {/* General Terms */}
          <section id="general" className="support-section">
            <h2 className="support-section-title">
              <FaHandshake style={{ marginRight: '12px' }} />
              12. General Terms
            </h2>
            <div className="support-section-content">
              <p><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and any 
              competition-specific rules, constitute the entire agreement between you and Playgorithm.</p>

              <p><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, 
              the remaining provisions shall remain in full force and effect.</p>

              <p><strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms shall 
              not be considered a waiver of those rights.</p>

              <p><strong>Assignment:</strong> You may not assign or transfer these Terms without our consent. 
              We may assign our rights and obligations without restriction.</p>

              <p><strong>Survival:</strong> Provisions relating to intellectual property, disclaimers, 
              limitation of liability, and dispute resolution shall survive termination of these Terms.</p>

              <p><strong>Force Majeure:</strong> We shall not be liable for any failure or delay caused by 
              circumstances beyond our reasonable control, including natural disasters, war, or infrastructure failures.</p>
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
              <FaFileContract /> Questions About These Terms?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@playgorithm.com" style={{ color: '#00ff88' }}>
                legal@playgorithm.com
              </a>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              For general support, please visit our{' '}
              <a 
                onClick={() => navigate('/help')} 
                style={{ color: '#00d4ff', cursor: 'pointer' }}
              >
                Help Center
              </a>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
