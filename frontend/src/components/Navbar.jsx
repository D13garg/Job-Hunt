import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout as logoutApi } from '../api'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logoutApi() } catch {}
    logout()
    navigate('/')
  }

  const navLinks = () => {
    if (!user) return null
    if (user.role === 'applicant') return (
      <>
        <Link to="/jobs" className="text-slate-300 hover:text-amber-400 transition-colors">Browse Jobs</Link>
        <Link to="/bookmarks" className="text-slate-300 hover:text-amber-400 transition-colors">Bookmarks</Link>
        <Link to="/my-applications" className="text-slate-300 hover:text-amber-400 transition-colors">Applications</Link>
      </>
    )
    if (user.role === 'recruiter') return (
      <>
        <Link to="/dashboard" className="text-slate-300 hover:text-amber-400 transition-colors">Dashboard</Link>
        <Link to="/post-job" className="text-slate-300 hover:text-amber-400 transition-colors">Post Job</Link>
      </>
    )
    if (user.role === 'admin') return (
      <>
        <Link to="/jobs" className="text-slate-300 hover:text-amber-400 transition-colors">All Jobs</Link>
        <Link to="/admin" className="text-slate-300 hover:text-amber-400 transition-colors">Admin Panel</Link>
      </>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl text-white">Job</span>
          <span className="font-display text-2xl text-amber-500">Hunt</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks()}
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Welcome, <span className="text-amber-400 font-semibold">{user.username}</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-4">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"  className="btn-secondary text-sm py-1.5 px-4">Login</Link>
              <Link to="/signup" className="btn-primary  text-sm py-1.5 px-4">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
