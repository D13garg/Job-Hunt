import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyJobs, deleteJob } from '../api'

export default function RecruiterDashboard() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const navigate              = useNavigate()

  const fetch = async () => {
    try {
      const { data } = await getMyJobs()
      setJobs(data.jobs)
    } catch { setError('Failed to load jobs') }
    finally  { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return
    try {
      await deleteJob(id)
      setJobs((prev) => prev.filter((j) => j._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  const salaryFmt = (n) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n)

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-white mb-1">My Job Postings</h1>
          <p className="text-slate-400">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/post-job" className="btn-primary">+ Post New Job</Link>
      </div>

      {error && <p className="text-red-400 mb-6">{error}</p>}

      {jobs.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-500 text-lg mb-4">You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn-primary">Post Your First Job</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h2 className="font-display text-xl text-white">{job.title}</h2>
                    <span className={`badge border text-xs ${job.isActive ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-1">
                    <span>📍 {job.location}</span>
                    <span>💰 {salaryFmt(job.salary)}/yr</span>
                    <span>🏷 {job.category}</span>
                    <span>📅 {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {job.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.tags.slice(0, 5).map((t) => (
                        <span key={t} className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/jobs/${job._id}/responses`}
                    className="btn-secondary text-xs py-1.5 px-3">
                    Responses
                  </Link>
                  <button onClick={() => navigate(`/post-job/edit/${job._id}`)}
                    className="btn-secondary text-xs py-1.5 px-3">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(job._id)}
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
