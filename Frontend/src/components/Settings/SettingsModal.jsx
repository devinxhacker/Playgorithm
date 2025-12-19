import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPalette, FaVolumeUp, FaLock, FaTimes, FaCamera, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSettings, THEMES, FONTS } from '../../context/SettingsContext';
import { userAPI } from '../../services/api';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, updateUser } = useAuth();
    const { settings, changeTheme, updateSettings } = useSettings();

    // Profile State
    const [profileData, setProfileData] = useState({
        fullName: '',
        avatarUrl: '',
    });
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [tempAvatar, setTempAvatar] = useState('');

    // Security State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        otp: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [securityMessage, setSecurityMessage] = useState('');

    // Load user data
    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName || '',
                avatarUrl: user.avatarUrl || ''
            });
        }
    }, [user]);

    if (!isOpen) return null;

    // --- Handlers ---

    // Profile Handlers
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await userAPI.updateProfile(profileData);
            updateUser(response.data);
            alert('Profile updated successfully!');
            setIsEditingAvatar(false);
        } catch (error) {
            console.error('Update failed', error);
            alert('Failed to update profile');
        }
    };

    // Get themes and fonts from context
    const themes = Object.values(THEMES);
    const fonts = Object.values(FONTS);

    // Sound Handlers
    const handleVolumeChange = (type, value) => {
        updateSettings('sound', type, value);
    };

    // Security Handlers (Mock)
    const handleSendOTP = () => {
        if (!passwordData.currentPassword) {
            setSecurityMessage('Please enter current password');
            return;
        }
        // Mock API call
        setTimeout(() => {
            setOtpSent(true);
            setSecurityMessage('OTP sent to your email');
        }, 1000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSecurityMessage('Passwords do not match');
            return;
        }
        if (!passwordData.otp) {
            setSecurityMessage('Please enter OTP');
            return;
        }
        // Mock API Submit
        setTimeout(() => {
            setSecurityMessage('Password changed successfully!');
            setOtpSent(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' });
        }, 1000);
    };

    // --- Render Sections ---

    const renderProfile = () => (
        <div className="settings-section">
            <div className="section-header">
                <h3>Profile Settings</h3>
                <p>Manage your public profile and personal details</p>
            </div>

            <form onSubmit={handleProfileUpdate}>
                <div className="settings-avatar-section">
                    <img
                        src={profileData.avatarUrl || user?.avatarUrl || 'https://via.placeholder.com/150'}
                        alt="Avatar"
                        className="settings-avatar"
                    />
                    <button
                        type="button"
                        className="avatar-edit-trigger cursor-target"
                        onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                    >
                        <FaCamera /> Change Avatar
                    </button>

                    {isEditingAvatar && (
                        <div className="settings-group" style={{ width: '100%' }}>
                            <label>Avatar URL</label>
                            <input
                                type="text"
                                className="settings-input"
                                placeholder="Paste image URL..."
                                value={profileData.avatarUrl}
                                onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                <div className="settings-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        className="settings-input"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    />
                </div>

                <div className="settings-group">
                    <label>Username (Read Only)</label>
                    <input
                        type="text"
                        className="settings-input"
                        value={user?.username || ''}
                        disabled
                        style={{ opacity: 0.7 }}
                    />
                </div>

                <button type="submit" className="save-btn cursor-target">Save Changes</button>
            </form>
        </div>
    );

    const renderPersonalization = () => (
        <div className="settings-section">
            <div className="section-header">
                <h3>Personalization</h3>
                <p>Customize the look and feel of your dashboard</p>
            </div>

            <div className="settings-group">
                <h4>Color Theme</h4>
                <p className="control-desc" style={{ marginBottom: '20px' }}>Choose your preferred color scheme</p>
                <div className="theme-grid">
                    {themes.map(t => (
                        <div
                            key={t.id}
                            className={`theme-option cursor-target ${settings.theme === t.id ? 'active' : ''}`}
                            onClick={() => changeTheme(t.id)}
                        >
                            <div className="theme-preview">
                                <div className="tp-color" style={{ background: t.primary }}></div>
                                <div className="tp-color" style={{ background: t.secondary }}></div>
                                <div className="tp-color" style={{ background: t.accent }}></div>
                            </div>
                            <div className="theme-name">
                                {t.name}
                                {settings.theme === t.id && <FaCheck style={{ marginLeft: '5px', fontSize: '0.8rem' }} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="settings-group">
                <h4>Typography</h4>
                
                <div className="control-row">
                    <div className="control-label">
                        <span>Font Family</span>
                        <span className="control-desc">Choose your preferred font style</span>
                    </div>
                    <select
                        className="settings-input cursor-target"
                        style={{ width: 'auto', minWidth: '200px' }}
                        value={settings.typography.fontFamily}
                        onChange={(e) => updateSettings('typography', 'fontFamily', e.target.value)}
                    >
                        {fonts.map(font => (
                            <option key={font.id} value={font.id}>
                                {font.name} ({font.category})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-row">
                    <div className="control-label">
                        <span>Font Size</span>
                        <span className="control-desc">Adjust the text size for better readability</span>
                    </div>
                    <select
                        className="settings-input cursor-target"
                        style={{ width: 'auto' }}
                        value={settings.typography.fontSize}
                        onChange={(e) => updateSettings('typography', 'fontSize', e.target.value)}
                    >
                        <option value="small">Small (14px)</option>
                        <option value="medium">Medium (16px)</option>
                        <option value="large">Large (18px)</option>
                    </select>
                </div>

                <div className="font-preview">
                    <p style={{ fontFamily: FONTS[settings.typography.fontFamily]?.family }}>
                        The quick brown fox jumps over the lazy dog. 0123456789
                    </p>
                </div>
            </div>
        </div>
    );

    const renderSound = () => (
        <div className="settings-section">
            <div className="section-header">
                <h3>Sound & Audio</h3>
                <p>Configure immersive audio effects</p>
            </div>

            <div className="settings-group">
                <h4>Volume Control</h4>

                <div className="control-row">
                    <div className="control-label">
                        <span>Master Volume</span>
                    </div>
                    <div className="slider-container">
                        <input
                            type="range"
                            min="0" max="1" step="0.1"
                            value={settings.sound.masterVolume}
                            onChange={(e) => handleVolumeChange('masterVolume', parseFloat(e.target.value))}
                            className="settings-slider"
                        />
                        <span>{Math.round(settings.sound.masterVolume * 100)}%</span>
                    </div>
                </div>

                <div className="control-row">
                    <div className="control-label">
                        <span>Music</span>
                    </div>
                    <div className="slider-container">
                        <input
                            type="range"
                            min="0" max="1" step="0.1"
                            value={settings.sound.musicVolume}
                            onChange={(e) => handleVolumeChange('musicVolume', parseFloat(e.target.value))}
                            className="settings-slider"
                        />
                        <span>{Math.round(settings.sound.musicVolume * 100)}%</span>
                    </div>
                </div>

                <div className="control-row">
                    <div className="control-label">
                        <span>Sound Effects</span>
                    </div>
                    <div className="slider-container">
                        <input
                            type="range"
                            min="0" max="1" step="0.1"
                            value={settings.sound.sfxVolume}
                            onChange={(e) => handleVolumeChange('sfxVolume', parseFloat(e.target.value))}
                            className="settings-slider"
                        />
                        <span>{Math.round(settings.sound.sfxVolume * 100)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="settings-section">
            <div className="section-header">
                <h3>Security</h3>
                <p>Password management and account security</p>
            </div>

            <form onSubmit={handleChangePassword}>
                <div className="settings-group">
                    <h4>Change Password</h4>

                    <label>Current Password</label>
                    <input
                        type="password"
                        className="settings-input"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />

                    {!otpSent ? (
                        <button type="button" onClick={handleSendOTP} className="save-btn cursor-target" style={{ float: 'none', marginTop: '15px' }}>
                            Send OTP
                        </button>
                    ) : (
                        <>
                            <label style={{ marginTop: '15px', display: 'block' }}>New Password</label>
                            <input
                                type="password"
                                className="settings-input"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />

                            <label style={{ marginTop: '15px', display: 'block' }}>Confirm New Password</label>
                            <input
                                type="password"
                                className="settings-input"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />

                            <label style={{ marginTop: '15px', display: 'block' }}>OTP Code</label>
                            <input
                                type="text"
                                className="settings-input"
                                placeholder="Enter 6-digit code"
                                value={passwordData.otp}
                                onChange={(e) => setPasswordData({ ...passwordData, otp: e.target.value })}
                            />

                            <button type="submit" className="save-btn cursor-target" style={{ float: 'none', marginTop: '20px' }}>
                                Update Password
                            </button>
                        </>
                    )}

                    {securityMessage && (
                        <p style={{ color: securityMessage.includes('success') ? '#0aff68' : '#ff4757', marginTop: '15px' }}>
                            {securityMessage}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                className="settings-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="settings-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-button cursor-target" onClick={onClose}><FaTimes /></button>

                    <div className="settings-sidebar">
                        <h2>Settings</h2>
                        <nav className="settings-nav">
                            <button
                                className={`nav-item cursor-target ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <FaUser className="nav-icon" /> Profile
                            </button>
                            <button
                                className={`nav-item cursor-target ${activeTab === 'personalization' ? 'active' : ''}`}
                                onClick={() => setActiveTab('personalization')}
                            >
                                <FaPalette className="nav-icon" /> Personalization
                            </button>
                            <button
                                className={`nav-item cursor-target ${activeTab === 'sound' ? 'active' : ''}`}
                                onClick={() => setActiveTab('sound')}
                            >
                                <FaVolumeUp className="nav-icon" /> Sound
                            </button>
                            <button
                                className={`nav-item cursor-target ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <FaLock className="nav-icon" /> Security
                            </button>
                        </nav>
                    </div>

                    <div className="settings-content">
                        {activeTab === 'profile' && renderProfile()}
                        {activeTab === 'personalization' && renderPersonalization()}
                        {activeTab === 'sound' && renderSound()}
                        {activeTab === 'security' && renderSecurity()}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettingsModal;
