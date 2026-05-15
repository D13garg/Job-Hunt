import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getApplicationsForJob, updateApplicationStatus, getJobById } from '../api'
import StatusBadge from '../components/StatusBadge'

export default function JobResponses() {
  const { jobId }   = useParams()
  const navigate    = useNavigate()
  const [job, setJob]                 = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading]         = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [updating, setUpdating]       = useState(null)
  const [reasonInputs, setReasonInputs] = useState({})
  const [error, setError]             = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          getJobById(jobId),
          getApplicationsForJob(jobId),
        ])
        setJob(jobRes.data)
        setApplications(appRes.data.applications)
      } catch { setError('Failed to load responses') }
      finally  { setLoading(false) }
    }
    fetchAll()
  }, [jobId])

  const filtered = statusFilter
    ? applications.filter((a) => a.status === statusFilter)
    : applications

  const handleStatusUpdate = async (appId, status) => {
    setUpdating(appId)
    try {
      const statusReason = reasonInputs[appId] || ''
      await updateApplicationStatus(appId, { status, statusReason })
      setApplications((prev) =>
        prev.map((a) => a._id === appId ? { ...a, status, statusReason } : a)
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed')
    } finally { setUpdating(null) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <button onClick={() => navigate('/dashboard')}
        className="text-slate-400 hover:text-amber-400 transition-colors text-sm mb-6 flex items-center gap-2">
        ← Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="font-display text-4xl text-white mb-1">Responses</h1>
        <p className="text-slate-400">
          {job?.title} · {applications.length} applicant{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && <p className="text-red-400 mb-6">{error}</p>}

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'in_progress', 'shortlisted', 'rejected'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              statusFilter === s
                ? 'bg-amber-500 text-slate-900 border-amber-500'
                : 'border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400'
            }`}>
            {s === '' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">
              ({s === '' ? applications.length : applications.filter((a) => a.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-500">No applications {statusFilter ? `with status "${statusFilter}"` : 'yet'}.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((app) => (
            <div key={app._id} className="card animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-semibold text-white text-lg">{app.applicantId?.username}</h3>
                    <StatusBadge status={app.status} />
                    {app.applicantId?.withdrawalCount > 2 && (
                      <span className="badge bg-orange-900/40 text-orange-300 border border-orange-700 text-xs">
                        ⚠ {app.applicantId.withdrawalCount} withdrawals
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{app.applicantId?.email}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* Profile links */}
                <div className="flex gap-3 text-sm shrink-0">
                  {app.linkedinProfile && (
                    <a href={app.linkedinProfile} target="_blank" rel="noreferrer"
                      className="text-blue-400 hover:underline">LinkedIn ↗</a>
                  )}
                  {app.githubProfile && (
                    <a href={app.githubProfile} target="_blank" rel="noreferrer"
                      className="text-slate-300 hover:underline">GitHub ↗</a>
                  )}
                </div>
              </div>

              {/* Status reason */}
              {app.statusReason && (
                <p className="text-sm text-slate-400 italic mb-4 bg-slate-900/50 px-3 py-2 rounded-lg">
                  "{app.statusReason}"
                </p>
              )}

              {/* Update controls */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={reasonInputs[app._id] || ''}
                    onChange={(e) => setReasonInputs({ ...reasonInputs, [app._id]: e.target.value })}
                    placeholder="Optional reason / note for applicant…"
                    className="input text-sm flex-1"
                  />
                  <div className="flex gap-2">
                    {['shortlisted', 'in_progress', 'rejected'].map((s) => (
                      <button key={s} disabled={updating === app._id || app.status === s}
                        onClick={() => handleStatusUpdate(app._id, s)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all disabled:opacity-40 ${
                          s === 'shortlisted' ? 'border-green-600 text-green-400 hover:bg-green-900/30' :
                          s === 'rejected'    ? 'border-red-600   text-red-400   hover:bg-red-900/30'   :
                                               'border-yellow-600 text-yellow-400 hover:bg-yellow-900/30'
                        } ${app.status === s ? 'opacity-40 cursor-default' : ''}`}>
                        {updating === app._id ? '…' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
