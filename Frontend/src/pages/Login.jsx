import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import authImage from "../assets/images/auth-image.jpg";
import "./Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (isLogin) {
        result = await login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        result = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        });
      }

      if (result.success) {
        navigate("/");
      } else {
        // Handle error message (could be string or object)
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || 'Authentication failed';
        setError(errorMsg);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <img src={authImage} alt="Auth Background" className="auth-bg-image" />
        <div className="auth-overlay"></div>
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-card">
          <h1 className="login-title">
            {isLogin ? "Welcome Back!" : "Join Playgorithm"}
          </h1>
          <p className="login-subtitle">
            {isLogin
              ? "Login to continue your coding adventure"
              : "Start your algorithmic journey today"}
          </p>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="cursor-target"
              />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="cursor-target"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name (optional)"
                    className="cursor-target"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                minLength={6}
                className="cursor-target"
              />
            </div>

            <button type="submit" className="login-button cursor-target" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="toggle-button cursor-target"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
            
            {isLogin && (
              <div className="admin-login-link">
                <p>
                  Are you an admin?
                  <a href="/admin/login" className="admin-link cursor-target">
                    <FaShieldAlt className="admin-icon" />
                    Admin Login
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
