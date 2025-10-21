import React from "react";
import Navbar from "../Navbar";
import { AiFillDelete } from "react-icons/ai";
import "./index.css";

const SaveJobs = () => {
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
  
  const removeJob = (jobId) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    window.location.reload(); // Refresh to show updated list
  };
  
  return (
    <div>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Saved Jobs ({savedJobs.length})</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {savedJobs.length === 0 ? (
              <div className="no-jobs">
                <h3>No saved jobs yet</h3>
                <p>Save jobs by clicking the heart icon on job listings</p>
              </div>
            ) : (
              savedJobs.map(({ id, logo, company, position, location, role, salary, description }, index) => {
                return (
                  <div key={index} className="job-list">
                    <div className="job-card">
                      <div className="job-name">
                        <img
                          src={
                            logo && logo.length > 20
                              ? logo
                              : require(`../../Assets/images/${logo || 'amazon.png'}`)
                          }
                          alt={`${company} logo`}
                          className="job-profile"
                          onError={(e) => {
                            e.target.src = require(`../../Assets/images/amazon.png`);
                          }}
                        />
                        <div className="job-detail">
                          <h4>{company}</h4>
                          <h3>{position}</h3>
                          <div className="category">
                            <p>📍 {location}</p>
                            <p>💼 {role}</p>
                            {salary && <p>💰 ₹{salary.toLocaleString()}</p>}
                          </div>
                          {description && (
                            <p className="job-description-preview">
                              {description.length > 100
                                ? `${description.substring(0, 100)}...`
                                : description
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="job-button">
                        <div className="job-posting">
                          <a href="/apply-jobs">Apply Now</a>
                        </div>
                        <div className="save-button">
                          <button
                            onClick={() => removeJob(id)}
                            className="remove-btn"
                            title="Remove from saved jobs"
                          >
                            <AiFillDelete />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveJobs;
