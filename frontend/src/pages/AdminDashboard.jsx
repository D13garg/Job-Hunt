import { useState, useEffect } from 'react'
import { getAdminStats, getAllUsers, toggleBlacklist, getAllJobsAdmin, adminDeleteJob, adminUpdateJob } from '../api'
import StatusBadge from '../components/StatusBadge'

export default function AdminDashboard() {
  const [tab, setTab]         = useState('overview')
  const [stats, setStats]     = useState(null)
  const [users, setUsers]     = useState([])
  const [jobs, setJobs]       = useState([])
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, jobsRes] = await Promise.all([
          getAdminStats(),
          getAllUsers(),
          getAllJobsAdmin(),
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data.users)
        setJobs(jobsRes.data.jobs)
      } catch { setError('Failed to load admin data') }
      finally  { setLoading(false) }
    }
    fetchAll()
  }, [])

  const handleBlacklist = async (userId) => {
    try {
      const { data } = await toggleBlacklist(userId)
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isBlacklisted: data.isBlacklisted } : u))
    } catch (err) { alert(err.response?.data?.message || 'Failed') }
  }

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Permanently delete this job?')) return
    try {
      await adminDeleteJob(jobId)
      setJobs((prev) => prev.filter((j) => j._id !== jobId))
    } catch (err) { alert(err.response?.data?.message || 'Failed') }
  }

  const handleToggleActive = async (job) => {
    try {
      const { data } = await adminUpdateJob(job._id, { isActive: !job.isActive })
      setJobs((prev) => prev.map((j) => j._id === job._id ? data.job : j))
    } catch (err) { alert(err.response?.data?.message || 'Failed') }
  }

  const filteredUsers = roleFilter ? users.filter((u) => u.role === roleFilter) : users
  const salaryFmt = (n) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n)

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const tabs = ['overview', 'users', 'jobs']

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white mb-1">Admin Panel</h1>
        <p className="text-slate-400">Full platform control</p>
      </div>

      {error && <p className="text-red-400 mb-6">{error}</p>}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800 p-1 rounded-xl mb-8 w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      {tab === 'overview' && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
          {[
            { label: 'Total Users',      value: stats.totalUsers,        color: 'text-blue-400'   },
            { label: 'Total Jobs',       value: stats.totalJobs,         color: 'text-amber-400'  },
            { label: 'Applications',     value: stats.totalApplications, color: 'text-green-400'  },
            { label: 'Blacklisted',      value: stats.blacklistedUsers,  color: 'text-red-400'    },
          ].map((s) => (
            <div key={s.label} className="card text-center py-8">
              <p className={`font-display text-5xl mb-2 ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Users ────────────────────────────────────────────────────────── */}
      {tab === 'users' && (
        <div className="animate-fade-in">
          {/* Role filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {['', 'applicant', 'recruiter'].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  roleFilter === r
                    ? 'bg-amber-500 text-slate-900 border-amber-500'
                    : 'border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400'
                }`}>
                {r === '' ? 'All Users' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
                <span className="ml-1.5 text-xs opacity-70">
                  ({r === '' ? users.length : users.filter((u) => u.role === r).length})
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div key={u._id} className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${u.isBlacklisted ? 'border-red-900/50' : ''}`}>
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-semibold text-white">{u.username}</span>
                    <span className={`badge border text-xs capitalize ${
                      u.role === 'applicant' ? 'bg-blue-900/40 text-blue-300 border-blue-700' :
                      u.role === 'recruiter' ? 'bg-purple-900/40 text-purple-300 border-purple-700' :
                                               'bg-amber-900/40 text-amber-300 border-amber-700'
                    }`}>{u.role}</span>
                    {u.isBlacklisted && (
                      <span className="badge bg-red-900/40 text-red-300 border border-red-700 text-xs">Blacklisted</span>
                    )}
                    {u.role === 'applicant' && u.withdrawalCount > 2 && (
                      <span className="badge bg-orange-900/40 text-orange-300 border border-orange-700 text-xs">
                        ⚠ {u.withdrawalCount} withdrawals
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{u.email}</p>
                  {u.role === 'recruiter' && u.companyName && (
                    <p className="text-slate-500 text-xs mt-0.5">{u.companyName} · {u.companyLocation}</p>
                  )}
                </div>

                {u.role !== 'admin' && (
                  <button onClick={() => handleBlacklist(u._id)}
                    className={`shrink-0 text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
                      u.isBlacklisted
                        ? 'border-green-600 text-green-400 hover:bg-green-900/30'
                        : 'border-red-600 text-red-400 hover:bg-red-900/30'
                    }`}>
                    {u.isBlacklisted ? 'Un-blacklist' : 'Blacklist'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Jobs ─────────────────────────────────────────────────────────── */}
      {tab === 'jobs' && (
        <div className="animate-fade-in space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-display text-lg text-white">{job.title}</h3>
                    <span className={`badge border text-xs ${job.isActive ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{job.companyName} · {job.location} · {salaryFmt(job.salary)}/yr</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Posted by {job.recruiterId?.username} ({job.recruiterId?.email})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggleActive(job)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      job.isActive
                        ? 'border-slate-600 text-slate-400 hover:border-yellow-600 hover:text-yellow-400'
                        : 'border-green-600 text-green-400 hover:bg-green-900/30'
                    }`}>
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDeleteJob(job._id)}
                    className="btn-danger text-xs py-1.5 px-3">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
