import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user' // default to user
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => 
      u.email === formData.email && 
      u.password === formData.password &&
      u.role === formData.role
    );

    if (user) {
      // Store current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      login(user);
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/');
      }, 100);
    } else {
      setError('Invalid credentials or role');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Job Portal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Login As</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button">Login</button>
        </form>
        

        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
          <br />
          <a href="/forgot-credentials">Forgot Credentials?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

