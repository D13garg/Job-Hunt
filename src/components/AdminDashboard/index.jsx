import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AiFillDelete} from 'react-icons/ai';
import './index.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    loadData();
    
    // Set up a listener for storage changes (when other users add comments)
    const handleStorageChange = (e) => {
      if (e.key === 'sharedDiscussionComments') {
        const updatedComments = JSON.parse(e.newValue) || [];
        setComments(updatedComments);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadData = () => {
    // Load posted jobs
    const postedJobs = JSON.parse(localStorage.getItem('item')) || [];
    setJobs(postedJobs);

    // Load all comments from shared discussions
    const allComments = JSON.parse(localStorage.getItem('sharedDiscussionComments')) || [];
    setComments(allComments);
  };

  const refreshData = () => {
    loadData();
  };

  const deleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      localStorage.setItem('item', JSON.stringify(updatedJobs));
      setJobs(updatedJobs);
      alert('Job deleted successfully!');
    }
  };

  const deleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      localStorage.setItem('sharedDiscussionComments', JSON.stringify(updatedComments));
      setComments(updatedComments);
      alert('Comment deleted successfully!');
    }
  };

 

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-nav-section">
          <button 
            onClick={() => navigate('/')} 
            className="back-to-home-btn"
          >
            ← Back to Home
          </button>
          <div className="admin-nav-buttons">
            <button 
              onClick={() => navigate('/jobs')} 
              className="nav-btn jobs-btn"
            >
              💼 Jobs
            </button>
            <button 
              onClick={() => navigate('/discussion')} 
              className="nav-btn discussion-btn"
            >
              💬 Discussion
            </button>
          </div>
        </div>
        <div className="admin-title-section">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}! Manage jobs and comments.</p>
          <button 
            onClick={refreshData} 
            className="refresh-btn"
            title="Refresh data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs ({jobs.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments ({comments.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h2>Posted Jobs</h2>
            {jobs.length === 0 ? (
              <p className="no-data">No jobs posted yet.</p>
            ) : (
              <div className="jobs-list">
                {jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-info">
                      <h3>{job.position}</h3>
                      <p className="company">{job.company}</p>
                      <p className="location">{job.location}</p>
                      <p className="salary">${job.salary}</p>
                      {job.description && (
                        <p className="description">{job.description.substring(0, 100)}...</p>
                      )}
                    </div>
                    <div className="job-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => deleteJob(job.id)}
                        title="Delete Job"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comments-section">
            <h2>Discussion Comments</h2>
            {comments.length === 0 ? (
              <p className="no-data">No comments found.</p>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <strong>{comment.name}</strong>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => deleteComment(comment.id)}
                        title="Delete Comment"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

