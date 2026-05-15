import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar           from './components/Navbar'
import ProtectedRoute   from './components/ProtectedRoute'

import Home               from './pages/Home'
import Login              from './pages/Login'
import Signup             from './pages/Signup'
import Jobs               from './pages/Jobs'
import JobDetail          from './pages/JobDetail'
import MyApplications     from './pages/MyApplications'
import Bookmarks          from './pages/Bookmarks'
import RecruiterDashboard from './pages/RecruiterDashboard'
import PostJob            from './pages/PostJob'
import JobResponses       from './pages/JobResponses'
import AdminDashboard     from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* ── Public ──────────────────────────────────────────── */}
              <Route path="/"       element={<Home />} />
              <Route path="/login"  element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/jobs"   element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* ── Applicant only ───────────────────────────────────── */}
              <Route path="/my-applications" element={
                <ProtectedRoute roles={['applicant']}>
                  <MyApplications />
                </ProtectedRoute>
              } />
              <Route path="/bookmarks" element={
                <ProtectedRoute roles={['applicant']}>
                  <Bookmarks />
                </ProtectedRoute>
              } />

              {/* ── Recruiter only ───────────────────────────────────── */}
              <Route path="/dashboard" element={
                <ProtectedRoute roles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/post-job" element={
                <ProtectedRoute roles={['recruiter']}>
                  <PostJob />
                </ProtectedRoute>
              } />
              <Route path="/post-job/edit/:id" element={
                <ProtectedRoute roles={['recruiter']}>
                  <PostJob />
                </ProtectedRoute>
              } />
              <Route path="/jobs/:jobId/responses" element={
                <ProtectedRoute roles={['recruiter', 'admin']}>
                  <JobResponses />
                </ProtectedRoute>
              } />

              {/* ── Admin only ───────────────────────────────────────── */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* ── Fallback ─────────────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
