import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authImage from '../../assets/images/auth-image.jpg';
import '../../pages/Login.css';
import './AdminAuth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
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
      const response = await login(formData, { isAdmin: true });
      if (response.success) {
        navigate('/admin');
      } else {
        const errorMsg = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Unable to login as admin';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Unexpected error while logging in');
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
          <p className="admin-pill">Admin Access</p>
          <h1>Command Console</h1>
          <p>Unlock advanced controls to manage users, games, and leaderboards.</p>
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
              placeholder="admin-user"
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
              placeholder="••••••••"
              className="cursor-target"
            />
          </label>

          <button type="submit" className="admin-primary cursor-target" disabled={loading}>
            {loading ? 'Authorizing...' : 'Enter Dashboard'}
          </button>
        </form>

        <div className="admin-auth-actions">
          <p>
            Need an admin account?
            <Link to="/admin/signup" className="admin-link">
              Request Access
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

export default AdminLogin;
