# JobHunt — Full Stack Job Portal System

A production-style full-stack job portal built with the MERN stack, designed to demonstrate advanced MongoDB concepts, scalable backend architecture, and role-based application workflows. The platform connects applicants, recruiters, and administrators through a secure REST API and modern React frontend. 

---

## Features

### Authentication & Authorization

* JWT-based stateless authentication
* Secure password hashing with bcryptjs
* Role-based access control:

  * Applicant
  * Recruiter
  * Admin
* Middleware-protected routes
* Blacklisted user enforcement

### Applicant Features

* Browse and search jobs
* Advanced filtering:

  * Category
  * Location
  * Salary range
  * Full-text keyword search
* Apply to jobs
* Withdraw applications
* Bookmark jobs
* Track application status

### Recruiter Features

* Create, edit, and delete job postings
* View applicants for posted jobs
* Update application status:

  * In Progress
  * Shortlisted
  * Rejected
* Add recruiter notes/reasons

### Admin Features

* Platform-wide dashboard statistics
* User management
* Blacklist abusive users
* Moderate jobs
* Manage inactive listings

---

# Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## Frontend

* React.js
* Vite
* React Router DOM
* Tailwind CSS
* Axios

## Testing

* Jest
* Supertest
* Postman

---

# MongoDB Concepts Demonstrated

This project was specifically designed to demonstrate practical MongoDB engineering concepts:

* Nested Arrays
* Compound Indexes
* Text Indexing
* Unique Constraints
* `$inc` and `$set` Update Operators
* Populate (Manual Joins)
* Sharding Strategy
* Schema Validation
* Middleware Hooks

Examples include:

* Nested `requirements` arrays in jobs
* Full-text search on job listings
* Compound indexes for filters and sorting
* Atomic withdrawal counters using `$inc`



---

# Project Structure

```bash
JobHunt/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── vite.config.js
│
├── README.md
└── package.json
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/jobhunt.git
cd jobhunt
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jobhunt
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup` | Register user |
| POST   | `/api/auth/login`  | Login         |
| POST   | `/api/auth/logout` | Logout        |

## Jobs

| Method | Endpoint        | Description    |
| ------ | --------------- | -------------- |
| GET    | `/api/jobs`     | Browse jobs    |
| GET    | `/api/jobs/:id` | Get single job |
| POST   | `/api/jobs`     | Create job     |
| PUT    | `/api/jobs/:id` | Update job     |
| DELETE | `/api/jobs/:id` | Delete job     |

## Applications

| Method | Endpoint                            | Description     |
| ------ | ----------------------------------- | --------------- |
| POST   | `/api/applications/:jobId`          | Apply           |
| GET    | `/api/applications/my/applications` | My applications |
| DELETE | `/api/applications/:id/withdraw`    | Withdraw        |
| PUT    | `/api/applications/:id/status`      | Update status   |

## Bookmarks

| Method | Endpoint                | Description     |
| ------ | ----------------------- | --------------- |
| POST   | `/api/bookmarks/:jobId` | Bookmark        |
| GET    | `/api/bookmarks`        | Get bookmarks   |
| DELETE | `/api/bookmarks/:jobId` | Remove bookmark |

## Admin

| Method | Endpoint                         | Description      |
| ------ | -------------------------------- | ---------------- |
| GET    | `/api/admin/stats`               | Dashboard stats  |
| GET    | `/api/admin/users`               | All users        |
| PUT    | `/api/admin/users/:id/blacklist` | Toggle blacklist |



---

# Database Schema Overview

## Collections

* `users`
* `jobs`
* `applications`
* `bookmarks`

### Example Job Schema

```js
{
  recruiterId: ObjectId,
  title: String,
  companyName: String,
  location: String,
  salary: Number,
  description: String,
  category: String,

  tags: [String],

  requirements: [
    {
      skill: String,
      level: String,
      required: Boolean
    }
  ],

  isActive: Boolean
}
```



---

# Testing

Run backend tests:

```bash
npm test
```

Test suite includes:

* Authentication tests
* CRUD tests
* Authorization tests
* Validation tests
* Error handling tests

Total automated tests: **28 passing tests**. 

---

# Future Enhancements

* AI-based job recommendations
* Email notifications
* Pagination & infinite scroll
* Company logo uploads with GridFS
* Cloud deployment:

  * Railway
  * Vercel
  * MongoDB Atlas



---

# Screenshots

* Landing Page
* Jobs Listing
* Job Detail Page
* Recruiter Dashboard
* Admin Dashboard
* Applications Tracking
* Bookmark System

---

# License

This project was developed for academic and educational purposes as part of the Database Engineering course project at Thapar Institute of Engineering and Technology.

---

# Author

**Dron Garg**
Computer Science and Engineering
BE Third Year
TIET, Patiala

Based on the project report: 
