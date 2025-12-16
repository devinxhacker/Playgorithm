import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authImage from '../../assets/images/auth-image.jpg';
import '../../pages/Login.css';
import './AdminAuth.css';

const AdminSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    adminSecret: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signup(formData, { isAdmin: true });
      if (response.success) {
        navigate('/admin');
      } else {
        const errorMsg = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Unable to create admin account';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Unexpected error while creating admin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-background">
        <img src={authImage} alt="Auth Background" className="admin-auth-bg-image" />
        <div className="admin-auth-overlay"></div>
      </div>

      <motion.div
        className="admin-auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-card-header">
          <p className="admin-pill">Verified Personnel</p>
          <h1>Request Admin Access</h1>
          <p>Provide the secure passphrase shared by the Playgorithm core team.</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="admin-user"
              className="cursor-target"
            />
          </label>

          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Alex Mercer"
              className="cursor-target"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@playgorithm.com"
              className="cursor-target"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Create a strong password"
              className="cursor-target"
            />
          </label>

          <label>
            Admin Secret
            <input
              type="password"
              name="adminSecret"
              value={formData.adminSecret}
              onChange={handleChange}
              required
              placeholder="Provided passphrase"
              className="cursor-target"
            />
          </label>

          <button type="submit" className="admin-primary cursor-target" disabled={loading}>
            {loading ? 'Verifying...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="admin-auth-actions">
          <p>
            Already cleared?
            <Link to="/admin/login" className="admin-link">
              Access Console
            </Link>
          </p>
          <p>
            Return to player login?
            <Link to="/login" className="admin-link">
              Go Back
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignup;
