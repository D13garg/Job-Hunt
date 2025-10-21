import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotCredentials = () => {
  const [masterKey, setMasterKey] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleMasterKeySubmit = (e) => {
    e.preventDefault();
    if (masterKey === '0000') {
      setShowResetForm(true);
      setError('');
    } else {
      setError('Invalid master key');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    
    // Update user credentials
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === resetData.email);
    
    if (userIndex !== -1) {
      users[userIndex].password = resetData.password;
      users[userIndex].role = resetData.role;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Credentials updated successfully!');
      navigate('/login');
    } else {
      setError('User not found');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Credentials</h2>
        
        {!showResetForm ? (
          <form onSubmit={handleMasterKeySubmit}>
            <div className="form-group">
              <label htmlFor="masterKey">Master Key</label>
              <input
                type="password"
                id="masterKey"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                placeholder="Enter master key"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="auth-button">Verify</button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit}>
            <div className="form-group">
              <label htmlFor="email">User Email</label>
              <input
                type="email"
                id="email"
                value={resetData.email}
                onChange={(e) => setResetData({...resetData, email: e.target.value})}
                placeholder="Enter user email to reset"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={resetData.password}
                onChange={(e) => setResetData({...resetData, password: e.target.value})}
                placeholder="Enter new password"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={resetData.role}
                onChange={(e) => setResetData({...resetData, role: e.target.value})}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="auth-button">Reset Credentials</button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowResetForm(false)}
            >
              Back
            </button>
          </form>
        )}
        
        <p className="auth-link">
          <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotCredentials;