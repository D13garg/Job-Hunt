// Seeds realistic job data with varied dates, recruiters, and applicants
// Run: node seedData.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Job = require("./models/Job");

const connectDB = require("./config/db");

// ── Helper: random date within last N months ──────────────────────────────────
const randomDate = (monthsAgo) => {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - monthsAgo);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
};

// ── Recruiters ────────────────────────────────────────────────────────────────
const recruiters = [
  { username: "TechNova HR",    email: "hr@technova.com",    password: "recruiter123", companyName: "TechNova Solutions",   companyLocation: "Bangalore" },
  { username: "Infosys Talent", email: "talent@infosys.com", password: "recruiter123", companyName: "Infosys Ltd",          companyLocation: "Pune" },
  { username: "Zomato People",  email: "people@zomato.com",  password: "recruiter123", companyName: "Zomato Pvt Ltd",       companyLocation: "Gurugram" },
  { username: "DRDO Recruit",   email: "recruit@drdo.gov",   password: "recruiter123", companyName: "DRDO",                 companyLocation: "Delhi" },
  { username: "Razorpay HR",    email: "hr@razorpay.com",    password: "recruiter123", companyName: "Razorpay",             companyLocation: "Bangalore" },
];

// ── Applicants ────────────────────────────────────────────────────────────────
const applicants = [
  { username: "Rahul Sharma",  email: "rahul@gmail.com",   password: "applicant123" },
  { username: "Priya Nair",    email: "priya@gmail.com",   password: "applicant123" },
  { username: "Arjun Mehta",   email: "arjun@gmail.com",   password: "applicant123" },
];

// ── Jobs ──────────────────────────────────────────────────────────────────────
// postedAgo = months ago this job was posted
const jobTemplates = [
  {
    title: "Frontend Developer",
    category: "computer",
    location: "Bangalore",
    salary: 1200000,
    description: "We are looking for a skilled Frontend Developer with strong experience in React, TypeScript and modern CSS frameworks. You will be responsible for building and maintaining high-quality web applications that serve millions of users.\n\nResponsibilities:\n- Build reusable React components\n- Collaborate with designers and backend engineers\n- Optimize applications for speed and scalability\n- Write clean, maintainable code with proper test coverage",
    tags: ["React", "TypeScript", "Tailwind", "Frontend", "Remote"],
    requirements: [
      { skill: "React",       level: "expert",       required: true  },
      { skill: "TypeScript",  level: "intermediate", required: true  },
      { skill: "CSS",         level: "expert",       required: true  },
      { skill: "Node.js",     level: "beginner",     required: false },
    ],
    recruiterIndex: 0,
    postedAgo: 1,
  },
  {
    title: "Backend Engineer",
    category: "computer",
    location: "Pune",
    salary: 1500000,
    description: "Infosys is hiring a Backend Engineer to join our core platform team. You will design, build and scale APIs that power our enterprise clients across the globe.\n\nResponsibilities:\n- Design RESTful APIs and microservices\n- Optimize database queries and manage MongoDB clusters\n- Ensure high availability and fault tolerance\n- Conduct code reviews and mentor junior engineers",
    tags: ["Node.js", "MongoDB", "REST API", "Microservices", "Backend"],
    requirements: [
      { skill: "Node.js",    level: "expert",       required: true  },
      { skill: "MongoDB",    level: "expert",       required: true  },
      { skill: "Docker",     level: "intermediate", required: true  },
      { skill: "AWS",        level: "beginner",     required: false },
    ],
    recruiterIndex: 1,
    postedAgo: 2,
  },
  {
    title: "Data Analyst",
    category: "analytics",
    location: "Gurugram",
    salary: 900000,
    description: "Zomato is looking for a Data Analyst to join our growth analytics team. You will work with large datasets to uncover insights that drive product and business decisions.\n\nResponsibilities:\n- Analyze user behavior and funnel metrics\n- Build dashboards in PowerBI and Tableau\n- Write complex SQL queries for reporting\n- Work cross-functionally with product and marketing",
    tags: ["SQL", "Python", "PowerBI", "Tableau", "Analytics"],
    requirements: [
      { skill: "SQL",     level: "expert",       required: true  },
      { skill: "Python",  level: "intermediate", required: true  },
      { skill: "PowerBI", level: "intermediate", required: false },
      { skill: "Excel",   level: "expert",       required: true  },
    ],
    recruiterIndex: 2,
    postedAgo: 2,
  },
  {
    title: "Embedded Systems Engineer",
    category: "electronics",
    location: "Delhi",
    salary: 1100000,
    description: "DRDO is seeking an Embedded Systems Engineer to work on cutting-edge defence technology projects. You will develop firmware and low-level software for mission-critical hardware.\n\nResponsibilities:\n- Develop and test embedded firmware in C/C++\n- Work with ARM Cortex microcontrollers\n- Perform hardware-software integration and debugging\n- Document technical specifications",
    tags: ["Embedded C", "ARM", "RTOS", "Electronics", "Firmware"],
    requirements: [
      { skill: "Embedded C",  level: "expert",       required: true  },
      { skill: "ARM Cortex",  level: "intermediate", required: true  },
      { skill: "RTOS",        level: "intermediate", required: true  },
      { skill: "PCB Design",  level: "beginner",     required: false },
    ],
    recruiterIndex: 3,
    postedAgo: 3,
  },
  {
    title: "UI/UX Designer",
    category: "design",
    location: "Bangalore",
    salary: 1000000,
    description: "Razorpay is hiring a UI/UX Designer to craft beautiful and intuitive experiences for our payment products used by over 8 million businesses.\n\nResponsibilities:\n- Design user flows, wireframes and high-fidelity prototypes\n- Conduct user research and usability testing\n- Maintain and evolve the design system\n- Collaborate closely with product managers and engineers",
    tags: ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
    requirements: [
      { skill: "Figma",        level: "expert",       required: true  },
      { skill: "UX Research",  level: "intermediate", required: true  },
      { skill: "Illustration", level: "beginner",     required: false },
    ],
    recruiterIndex: 4,
    postedAgo: 1,
  },
  {
    title: "Machine Learning Engineer",
    category: "analytics",
    location: "Bangalore",
    salary: 2000000,
    description: "TechNova is hiring an ML Engineer to build intelligent systems that power our recommendation and fraud detection engines.\n\nResponsibilities:\n- Train and deploy ML models at scale\n- Work with large datasets using Spark and Pandas\n- Integrate models into production APIs\n- Research and prototype new approaches",
    tags: ["Python", "TensorFlow", "ML", "Deep Learning", "Pandas"],
    requirements: [
      { skill: "Python",      level: "expert",       required: true  },
      { skill: "TensorFlow",  level: "expert",       required: true  },
      { skill: "Spark",       level: "intermediate", required: false },
      { skill: "Docker",      level: "intermediate", required: true  },
    ],
    recruiterIndex: 0,
    postedAgo: 3,
  },
  {
    title: "DevOps Engineer",
    category: "computer",
    location: "Pune",
    salary: 1400000,
    description: "Infosys is looking for a DevOps Engineer to manage and automate our cloud infrastructure across AWS and Azure.\n\nResponsibilities:\n- Build and manage CI/CD pipelines\n- Maintain Kubernetes clusters\n- Monitor system health and handle incidents\n- Automate infrastructure with Terraform",
    tags: ["AWS", "Kubernetes", "CI/CD", "Terraform", "DevOps"],
    requirements: [
      { skill: "Kubernetes", level: "expert",       required: true  },
      { skill: "AWS",        level: "expert",       required: true  },
      { skill: "Terraform",  level: "intermediate", required: true  },
      { skill: "Python",     level: "beginner",     required: false },
    ],
    recruiterIndex: 1,
    postedAgo: 5,
  },
  {
    title: "Business Intelligence Analyst",
    category: "analytics",
    location: "Gurugram",
    salary: 850000,
    description: "Zomato's BI team is looking for an analyst to transform raw data into actionable business insights.\n\nResponsibilities:\n- Build and maintain BI dashboards\n- Work with stakeholders to define KPIs\n- Automate reporting workflows\n- Perform ad-hoc analysis for leadership",
    tags: ["SQL", "Tableau", "Excel", "BI", "Reporting"],
    requirements: [
      { skill: "SQL",     level: "expert",       required: true  },
      { skill: "Tableau", level: "expert",       required: true  },
      { skill: "Python",  level: "beginner",     required: false },
    ],
    recruiterIndex: 2,
    postedAgo: 6,
  },
  {
    title: "VLSI Design Engineer",
    category: "electronics",
    location: "Delhi",
    salary: 1300000,
    description: "DRDO is hiring a VLSI Design Engineer to work on custom chip design for strategic defence systems.\n\nResponsibilities:\n- RTL design using Verilog/VHDL\n- Synthesis, place and route\n- Static timing analysis\n- Work with FPGA prototyping boards",
    tags: ["Verilog", "VHDL", "FPGA", "VLSI", "Electronics"],
    requirements: [
      { skill: "Verilog",  level: "expert",       required: true  },
      { skill: "FPGA",     level: "intermediate", required: true  },
      { skill: "Cadence",  level: "intermediate", required: false },
    ],
    recruiterIndex: 3,
    postedAgo: 4,
  },
  {
    title: "Product Designer",
    category: "design",
    location: "Bangalore",
    salary: 1100000,
    description: "Razorpay is looking for a Product Designer to own the end-to-end design of new product features from discovery to launch.\n\nResponsibilities:\n- Own design for 1-2 product squads\n- Run design sprints and workshops\n- Build interactive prototypes for user testing\n- Work with engineering on pixel-perfect implementation",
    tags: ["Figma", "Product Design", "Prototyping", "User Testing", "Design"],
    requirements: [
      { skill: "Figma",          level: "expert",       required: true  },
      { skill: "Product Thinking",level: "expert",      required: true  },
      { skill: "Motion Design",  level: "beginner",     required: false },
    ],
    recruiterIndex: 4,
    postedAgo: 2,
  },
  {
    title: "Full Stack Developer",
    category: "computer",
    location: "Remote",
    salary: 1600000,
    description: "TechNova is hiring a Full Stack Developer to build end-to-end features across our SaaS platform.\n\nResponsibilities:\n- Build features across React frontend and Node.js backend\n- Design and query MongoDB databases\n- Write unit and integration tests\n- Deploy and monitor applications on AWS",
    tags: ["React", "Node.js", "MongoDB", "Full Stack", "Remote"],
    requirements: [
      { skill: "React",    level: "expert",       required: true  },
      { skill: "Node.js",  level: "expert",       required: true  },
      { skill: "MongoDB",  level: "intermediate", required: true  },
      { skill: "AWS",      level: "beginner",     required: false },
    ],
    recruiterIndex: 0,
    postedAgo: 1,
  },
  {
    title: "IoT Engineer",
    category: "electronics",
    location: "Pune",
    salary: 950000,
    description: "Infosys is seeking an IoT Engineer to build connected device solutions for smart manufacturing clients.\n\nResponsibilities:\n- Develop firmware for IoT devices\n- Integrate with cloud platforms (AWS IoT, Azure IoT Hub)\n- Design communication protocols (MQTT, CoAP)\n- Ensure device security and OTA update mechanisms",
    tags: ["IoT", "MQTT", "AWS IoT", "Embedded C", "Electronics"],
    requirements: [
      { skill: "Embedded C",  level: "intermediate", required: true  },
      { skill: "MQTT",        level: "intermediate", required: true  },
      { skill: "AWS IoT",     level: "beginner",     required: false },
    ],
    recruiterIndex: 1,
    postedAgo: 6,
  },
];

// ── Seed function ─────────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  // Clear existing data (except admin)
  const admin = await User.findOne({ role: "admin" });
  await User.deleteMany({ role: { $in: ["recruiter", "applicant"] } });
  await Job.deleteMany({});
  console.log("🗑  Cleared old recruiters, applicants and jobs");

  // Create recruiters
  const createdRecruiters = [];
  for (const r of recruiters) {
    const user = await User.create({ ...r, role: "recruiter" });
    createdRecruiters.push(user);
    console.log(`✅ Recruiter: ${r.username}`);
  }

  // Create applicants
  for (const a of applicants) {
    await User.create({ ...a, role: "applicant" });
    console.log(`✅ Applicant: ${a.username}`);
  }

  // Create jobs with varied dates
  for (const template of jobTemplates) {
    const recruiter = createdRecruiters[template.recruiterIndex];
    const postedDate = randomDate(template.postedAgo);

    const job = new Job({
      recruiterId:  recruiter._id,
      title:        template.title,
      companyName:  recruiter.companyName,
      location:     template.location,
      salary:       template.salary,
      description:  template.description,
      category:     template.category,
      tags:         template.tags,
      requirements: template.requirements,
      isActive:     true,
    });

    // Override timestamps to simulate varied posting dates
    job.createdAt = postedDate;
    job.updatedAt = postedDate;
    await job.save();

    console.log(`💼 Job: "${template.title}" — posted ~${template.postedAgo} month(s) ago`);
  }

  console.log("\n🎉 Seed complete!");
  console.log(`   ${recruiters.length} recruiters`);
  console.log(`   ${applicants.length} applicants`);
  console.log(`   ${jobTemplates.length} jobs across all categories`);
  console.log("\n📋 Recruiter login password: recruiter123");
  console.log("📋 Applicant login password: applicant123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});