import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
  });

  const [avatarUrl, setAvatarUrl] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
      });
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await userAPI.updateProfile({
        fullName: formData.fullName,
        avatarUrl: avatarUrl
      });

      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = () => {
    setTempAvatarUrl(avatarUrl);
    setShowAvatarModal(true);
  };

  const handleAvatarSave = () => {
    setAvatarUrl(tempAvatarUrl);
    setShowAvatarModal(false);
  };

  const handleAvatarCancel = () => {
    setTempAvatarUrl('');
    setShowAvatarModal(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header-bar">
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
          <span>←</span> Back to Dashboard
        </button>
        <h1 className="profile-page-title">Profile Management</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and view your progress</p>
        </div>

        <div className="profile-card">
          {message.text && (
            <div className={`${message.type}-message`}>
              {message.text}
            </div>
          )}

          <div className="profile-sections">
            {/* Avatar and Stats Section */}
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="profile-avatar"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {!avatarUrl && (
                  <div className="avatar-placeholder">
                    {getInitials(formData.fullName || formData.username)}
                  </div>
                )}
                <button
                  className="avatar-edit-btn"
                  onClick={handleAvatarChange}
                  title="Change Avatar"
                >
                  ✏️
                </button>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{user.level || 1}</span>
                  <span className="stat-label">Level</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.totalXP || 0}</span>
                  <span className="stat-label">Total XP</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.gamesPlayed || 0}</span>
                  <span className="stat-label">Games Played</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.gamesWon || 0}</span>
                  <span className="stat-label">Games Won</span>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="profile-details-section">
              <div className="profile-info-text">
                Update your profile information below. Your username and email cannot be changed.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="avatar-modal" onClick={handleAvatarCancel}>
          <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Profile Picture</h2>
            <input
              type="text"
              className="avatar-input"
              placeholder="Enter image URL"
              value={tempAvatarUrl}
              onChange={(e) => setTempAvatarUrl(e.target.value)}
            />
            {tempAvatarUrl && (
              <div className="avatar-preview">
                <img
                  src={tempAvatarUrl}
                  alt="Avatar Preview"
                  onError={(e) => {
                    e.target.src = '';
                    e.target.alt = 'Invalid image URL';
                  }}
                />
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleAvatarSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleAvatarCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
