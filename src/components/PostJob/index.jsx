import React from "react";
import { useState } from "react";
import Navbar from "../Navbar";
import "./index.css";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const [company, setCompany] = useState("");
  const [logo, setLogo] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

const navigate=useNavigate();
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onabort = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleImg = (e) => {
    const file = e.target.files[0];
    getBase64(file).then((base64) => {
      localStorage["logo"] = base64;
      setLogo(base64);
    });
  };

  const handleSubmitButton = (e) => {
    e.preventDefault();
    
    if (company === "") {
      window.alert("Enter company name");
      return;
    } else if (position === "") {
      window.alert("Enter position");
      return;
    } else if (experience === "") {
      window.alert("Enter Experience");
      return;
    } else if (salary === "") {
      window.alert("Enter Salary");
      return;
    } else if (role === "") {
      window.alert("Enter Job Role");
      return;
    } else if (location === "") {
      window.alert("Enter Job Location");
      return;
    } else if (description === "") {
      window.alert("Enter Job Description");
      return;
    }

    // Parse experience from radio button values
    let experienceValue = 0;
    if (experience.includes("0-1")) experienceValue = 1;
    else if (experience.includes("2-3")) experienceValue = 2;
    else if (experience.includes("4-5")) experienceValue = 4;
    else if (experience.includes("5+")) experienceValue = 5;

    // Parse salary from dropdown values
    let salaryValue = 0;
    if (salary.includes("0-15")) salaryValue = 10000;
    else if (salary.includes("15-30")) salaryValue = 20000;
    else if (salary.includes("30-50")) salaryValue = 40000;
    else if (salary.includes("50-80")) salaryValue = 60000;
    else if (salary.includes("80+")) salaryValue = 80000;

    // Create job with proper structure matching original jobs
    const newJob = {
      id: Date.now(), // Generate unique ID
      company,
      position,
      salary: salaryValue,
      experience: experienceValue,
      role,
      location,
      description,
      logo: logo || "amazon.png", // Default logo if none provided
      posted: new Date().toISOString().split('T')[0], // Current date
      level: "Junior" // Default level
    };

    try {
      let savedJobs = [];
      if (localStorage.getItem("item")) {
        savedJobs = JSON.parse(localStorage.getItem("item"));
      }
      
      // Add new job to the array
      savedJobs.push(newJob);
      localStorage.setItem("item", JSON.stringify(savedJobs));
      
      window.alert("Job Posted Successfully!");
      navigate("/jobs");
    } catch (error) {
      window.alert("Error saving job. Please try again.");
      console.error("Error saving job:", error);
    }
  };
  return (
    <div>
      <Navbar />

      <div className="job-background">
        <div className="title">
          <h2>Post a Job</h2>
        </div>
      </div>
      <div className="container">
        <header className="header">
          <h1 className="post-job">Fill the form </h1>
        </header>
        <form>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Company Name"
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Enter Job Location
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Job Location"
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="logo-label" htmlFor="logo">
              Company logo
            </label>
            <label>
              <input
                type="file"
                id="myFile"
                name="filename"
                onChange={handleImg}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>What position are you posting for?</label>
            <select
              id="dropdown"
              name="role"
              className="form-control"
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option disabled selected value>
                Select position
              </option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Full Stack</option>
              <option>Devops</option>
              <option>Digital Marketing</option>
            </select>
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Enter Job Role
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Job Role"
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div
            className="form-group"
            onChange={(e) => setExperience(e.target.value)}
          >
            <label>Experience </label>
            <label>
              <input
                name="user-recommend"
                value="0-1 Year"
                type="radio"
                className="input-radio"
              />
              0-1 Year
            </label>
            <label>
              <input
                name="user-recommend"
                value=" 2-3 Years"
                type="radio"
                className="input-radio"
              />
              2-3 Years
            </label>
            <label>
              <input
                name="user-recommend"
                value=" 4-5 Years"
                type="radio"
                className="input-radio"
              />
              4-5 Years
            </label>
            <label>
              <input
                name="user-recommend"
                value="5+ Years"
                type="radio"
                className="input-radio"
              />
              5+ Years
            </label>
          </div>

          <div className="form-group">
            <label>Salary</label>
            <select
              className="form-control"
              onChange={(e) => setSalary(e.target.value)}
              required
            >
              <option disabled selected value>
                Select Salary
              </option>
              <option value="0-15K">0-15K</option>
              <option value="15-30K">15-30K</option>
              <option value="30K-50K">30K-50K</option>
              <option value="50K-80K">50K-80K</option>
              <option value="80K+">80K+</option>
            </select>
          </div>

          <div className="form-group">
            <label id="description-label" htmlFor="description">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Enter detailed job description, requirements, and responsibilities..."
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button" onClick={handleSubmitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
