import React from "react";
import Navbar from "../Navbar";
import JobReview from "../JobReview";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "./index.css";

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // Get all jobs (both original and posted)
  const JobData = JSON.parse(localStorage.getItem("item")) || [];
  const originalJobs = require("../../Assets/jobs.json");
  const allJobs = [...JobData, ...originalJobs];
  
  // Find the specific job
  const job = allJobs.find(j => j.id === parseInt(jobId));
  
  if (!job) {
    return (
      <div>
        <Navbar />
        <div className="job-detail-container">
          <div className="job-not-found">
            <h2>Job not found</h2>
            <p>The job you're looking for doesn't exist.</p>
            <button onClick={() => navigate("/jobs")} className="back-button">
              <AiOutlineArrowLeft /> Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isJobSaved = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    return savedJobs.some(savedJob => savedJob.id === job.id);
  };

  const toggleSave = () => {
    let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const isSaved = savedJobs.some(savedJob => savedJob.id === job.id);
    
    if (isSaved) {
      savedJobs = savedJobs.filter(savedJob => savedJob.id !== job.id);
      alert("Job removed from saved jobs");
    } else {
      savedJobs.push(job);
      alert("Job saved successfully!");
    }
    
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <div className="job-detail-container">
        <div className="job-detail-header">
          <button onClick={() => navigate("/jobs")} className="back-button">
            <AiOutlineArrowLeft /> Back to Jobs
          </button>
        </div>
        
        <div className="job-detail-card">
          <div className="job-detail-header-info">
            <div className="job-company-info">
              <img
                src={
                  job.logo && job.logo.length > 20
                    ? job.logo
                    : require(`../../Assets/images/${job.logo || 'amazon.png'}`)
                }
                alt="Company logo"
                className="job-detail-logo"
                onError={(e) => {
                  e.target.src = require(`../../Assets/images/amazon.png`);
                }}
              />
              <div className="job-basic-info">
                <h1 className="job-title">{job.position}</h1>
                <h2 className="job-company">{job.company}</h2>
                <div className="job-meta">
                  <span className="job-location">📍 {job.location}</span>
                  <span className="job-role">💼 {job.role}</span>
                  <span className="job-experience">⏰ {job.experience} years experience</span>
                </div>
              </div>
            </div>
            
            <div className="job-actions">
              <button onClick={toggleSave} className="save-job-btn">
                {isJobSaved() ? <AiFillHeart /> : <AiOutlineHeart />}
                {isJobSaved() ? "Saved" : "Save Job"}
              </button>
              <button 
                onClick={() => navigate("/apply-jobs")} 
                className="apply-job-btn"
              >
                Apply Now
              </button>
            </div>
          </div>
          
          <div className="job-detail-content">
            <div className="job-salary-info">
              <h3>💰 Salary</h3>
              <p>₹{job.salary?.toLocaleString() || 'Not specified'}</p>
            </div>
            
            <div className="job-description">
              <h3>📝 Job Description</h3>
              <div className="description-content">
                {job.description ? (
                  <p>{job.description}</p>
                ) : (
                  <p>No detailed description provided for this job.</p>
                )}
              </div>
            </div>
            
            <div className="job-requirements">
              <h3>📋 Requirements</h3>
              <ul>
                <li>Experience: {job.experience} years</li>
                <li>Role: {job.role}</li>
                <li>Level: {job.level || 'Not specified'}</li>
                <li>Location: {job.location}</li>
              </ul>
            </div>
            
            <div className="job-posted-info">
              <p><strong>Posted:</strong> {job.posted || 'Date not available'}</p>
            </div>
          </div>
          
          {/* Job Reviews Section */}
          <JobReview jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
