import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import Job from "./../../Assets/jobs.json";
import Filter from "../Filter";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const experience = [
  { min: 0, max: 1 },
  { min: 2, max: 3 },
  { min: 4, max: 5 },
  { min: 5, max: 10 },
];

const Jobs = () => {
  const navigate = useNavigate();
  const JobData = JSON.parse(localStorage.getItem("item")) || [];
  const allJobs = [...JobData, ...Job]; // Combine posted jobs and original jobs
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [searchterm, setSearchTerm] = useState("");
  const [active, setActive] = useState(false);
  
  function handleJobFilter(event) {
    const value = event.target.innerText;
    event.preventDefault();
    setFilteredJobs(
      allJobs.filter((job) => {
        return job.role === value;
      })
    );
  }
  function saveClick(jobData) {
    // Get existing saved jobs
    let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    
    // Check if job is already saved
    const isAlreadySaved = savedJobs.some(job => job.id === jobData.id);
    
    if (isAlreadySaved) {
      // Remove from saved jobs (unsave)
      savedJobs = savedJobs.filter(job => job.id !== jobData.id);
      alert("Job removed from saved jobs");
    } else {
      // Add to saved jobs
      savedJobs.push(jobData);
      alert("Job saved successfully!");
    }
    
    // Update localStorage
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    setActive(!active); // Toggle heart icon
  }
  const searchEvent = (event) => {
    const data = event.target.value;
    setSearchTerm(data);
    if (data !== "" && data.length > 2) {
      const filterData = allJobs.filter((item) => {
        if (item) {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(data.toLowerCase());
        } else {
          return false;
        }
      });
      setFilteredJobs(filterData);
    } else {
      setFilteredJobs(allJobs);
    }
  };
  function handleExperienceFilter(checkedState) {
    let filters = [];
    checkedState.forEach((item, index) => {
      if (item === true) {
        const filterS = allJobs.filter((job) => {
          return (
            job.experience >= experience[index].min &&
            job.experience <= experience[index].max
          );
        });
        filters = [...filters, ...filterS];
      }
    });
    setFilteredJobs(filters);
  }
  return (
    <>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Our Jobs</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {filteredJobs.map(
              ({ id, logo, company, position, location, posted, role, description }) => {
                return (
                  <div key={id} className="job-list">
                    <div 
                      className="job-card clickable-job-card"
                      onClick={() => navigate(`/job/${id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="job-name">
                        <img
                          src={
                            logo && logo.length > 20
                              ? logo
                              : require(`../../Assets/images/${logo || 'amazon.png'}`)
                          }
                          alt="logo"
                          className="job-profile"
                          onError={(e) => {
                            e.target.src = require(`../../Assets/images/amazon.png`);
                          }}
                        />
                        <div className="job-detail">
                          <h4>{company}</h4>
                          <h3>{position}</h3>
                          <div className="category">
                            <p>{location}</p>
                            <p>{role}</p>
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
                      <div className="job-button" onClick={(e) => e.stopPropagation()}>
                        <div className="job-posting">
                          <Link to="/apply-jobs">Apply Now</Link>
                        </div>
                        <div className="save-button">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const jobData = {
                                id,
                                logo,
                                company,
                                position,
                                location,
                                posted,
                                role,
                                description
                              };
                              saveClick(jobData);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {(() => {
                              const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
                              const isSaved = savedJobs.some(job => job.id === id);
                              return isSaved ? <AiFillHeart /> : <AiOutlineHeart />;
                            })()}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <Filter
            setFilteredJobs={setFilteredJobs}
            handleJobFilter={handleJobFilter}
            handleExperienceFilter={handleExperienceFilter}
            searchEvent={searchEvent}
          />
        </div>
      </div>
    </>
  );
};

export default Jobs;
