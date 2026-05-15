import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyApplications, withdrawApplication } from '../api'
import StatusBadge from '../components/StatusBadge'

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [withdrawing, setWithdrawing]   = useState(null)
  const [error, setError]               = useState('')

  const fetch = async () => {
    try {
      const { data } = await getMyApplications()
      setApplications(data.applications)
    } catch { setError('Failed to load applications') }
    finally  { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleWithdraw = async (appId) => {
    if (!confirm('Withdraw this application? This will be counted against your record.')) return
    setWithdrawing(appId)
    try {
      await withdrawApplication(appId)
      setApplications((prev) => prev.filter((a) => a._id !== appId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw')
    } finally { setWithdrawing(null) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white mb-2">My Applications</h1>
        <p className="text-slate-400">{applications.length} active application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      {error && <p className="text-red-400 mb-6">{error}</p>}

      {applications.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-500 text-lg mb-4">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <Link to={`/jobs/${app.jobId?._id}`}
                      className="font-display text-lg text-white hover:text-amber-400 transition-colors">
                      {app.jobId?.title}
                    </Link>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-slate-400 text-sm">{app.jobId?.companyName} · {app.jobId?.location}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.linkedinProfile && (
                    <a href={app.linkedinProfile} target="_blank" rel="noreferrer"
                      className="text-xs text-blue-400 hover:underline">LinkedIn ↗</a>
                  )}
                  <button onClick={() => handleWithdraw(app._id)}
                    disabled={withdrawing === app._id}
                    className="btn-danger text-xs py-1.5 px-3">
                    {withdrawing === app._id ? 'Withdrawing…' : 'Withdraw'}
                  </button>
                </div>
              </div>

              {/* Status reason */}
              {app.statusReason && (
                <div className="mt-4 border-t border-slate-700 pt-4">
                  <p className="text-xs text-slate-500 mb-1">Company note:</p>
                  <p className="text-sm text-slate-300 italic">"{app.statusReason}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
