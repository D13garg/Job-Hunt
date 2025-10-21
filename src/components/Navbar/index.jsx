import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./index.css";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      <div className="main-page">
        <nav id="navbar">
          <h1 className="logo">
            Job<span>Hunt</span>
          </h1>

          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/post-job">Post Job</Link>
                </li>
                <li>
                  <Link to="/saved-job">Saved Job</Link>
                </li>
                {isAdmin() && (
                  <li>
                    <Link to="/admin">Admin</Link>
                  </li>
                )}
              </>
            )}
            <li>
              <Link to="/discussion">Discussion</Link>
            </li>
          </ul>

          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <span className="user-name">Welcome, {user.name}!</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="register-btn">Register</Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
