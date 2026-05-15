import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getJobById, applyToJob, addBookmark, removeBookmark, getBookmarks } from '../api'
import StatusBadge from '../components/StatusBadge'

const categoryColors = {
  computer:    'bg-blue-900/50 text-blue-300 border-blue-700',
  analytics:   'bg-purple-900/50 text-purple-300 border-purple-700',
  design:      'bg-pink-900/50 text-pink-300 border-pink-700',
  electronics: 'bg-green-900/50 text-green-300 border-green-700',
}

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob]             = useState(null)
  const [loading, setLoading]     = useState(true)
  const [applying, setApplying]   = useState(false)
  const [applied, setApplied]     = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [applyForm, setApplyForm] = useState({ linkedinProfile: '', githubProfile: '' })
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getJobById(id)
        setJob(data)
      } catch { setError('Job not found') }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  useEffect(() => {
    if (user?.role !== 'applicant') return
    const checkBookmark = async () => {
      try {
        const { data } = await getBookmarks()
        setBookmarked(data.bookmarks.some((b) => b.jobId._id === id))
      } catch {}
    }
    checkBookmark()
  }, [id, user])

  const handleApply = async (e) => {
    e.preventDefault()
    setApplying(true)
    setError('')
    try {
      await applyToJob(id, applyForm)
      setApplied(true)
      setShowApplyForm(false)
      setSuccess('Application submitted successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
    } finally { setApplying(false) }
  }

  const handleBookmark = async () => {
    try {
      if (bookmarked) { await removeBookmark(id); setBookmarked(false) }
      else            { await addBookmark(id);    setBookmarked(true)  }
    } catch {}
  }

  const salary = job ? new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(job.salary) : ''

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error && !job) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center text-red-400">{error}</div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8 text-sm">
        ← Back to Jobs
      </button>

      {/* Header card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-white mb-1">{job.title}</h1>
            <p className="text-amber-400 font-semibold text-lg">{job.companyName}</p>
          </div>
          <span className={`badge border self-start ${categoryColors[job.category]}`}>
            {job.category}
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: '📍', label: 'Location', value: job.location },
            { icon: '💰', label: 'Salary',   value: `${salary}/yr` },
            { icon: '📅', label: 'Posted',   value: new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
          ].map((m) => (
            <div key={m.label} className="bg-slate-900/60 rounded-lg px-4 py-3">
              <p className="text-slate-500 text-xs mb-1">{m.icon} {m.label}</p>
              <p className="text-slate-100 text-sm font-medium">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-700/60 text-slate-300 px-3 py-1 rounded-md">{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        {user?.role === 'applicant' && (
          <div className="flex gap-3">
            {!applied ? (
              <button onClick={() => setShowApplyForm(!showApplyForm)} className="btn-primary">
                {showApplyForm ? 'Cancel' : 'Apply Now'}
              </button>
            ) : (
              <span className="btn-primary opacity-60 cursor-default">✓ Applied</span>
            )}
            <button onClick={handleBookmark}
              className={`btn-secondary flex items-center gap-2 ${bookmarked ? 'border-amber-500 text-amber-400' : ''}`}>
              <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        )}

        {/* Apply form */}
        {showApplyForm && (
          <form onSubmit={handleApply} className="mt-6 border-t border-slate-700 pt-6 space-y-4 animate-slide-down">
            <h3 className="font-semibold text-white">Your Application</h3>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div>
              <label className="label">LinkedIn Profile <span className="text-red-400">*</span></label>
              <input value={applyForm.linkedinProfile}
                onChange={(e) => setApplyForm({ ...applyForm, linkedinProfile: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile" className="input" required />
            </div>
            <div>
              <label className="label">GitHub Profile <span className="text-slate-500">(optional)</span></label>
              <input value={applyForm.githubProfile}
                onChange={(e) => setApplyForm({ ...applyForm, githubProfile: e.target.value })}
                placeholder="https://github.com/yourusername" className="input" />
            </div>
            <button type="submit" disabled={applying} className="btn-primary">
              {applying ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}

        {success && (
          <div className="mt-4 bg-green-900/30 border border-green-700 text-green-300 text-sm px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="card mb-6">
        <h2 className="font-display text-xl text-white mb-4">About This Role</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
      </div>

      {/* Requirements */}
      {job.requirements?.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-display text-xl text-white mb-4">Requirements</h2>
          <div className="space-y-3">
            {job.requirements.map((req, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${req.required ? 'bg-amber-500' : 'bg-slate-600'}`} />
                  <span className="text-slate-200 font-medium">{req.skill}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 capitalize">{req.level}</span>
                  {!req.required && <span className="badge bg-slate-700 text-slate-400">Optional</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company info */}
      <div className="card">
        <h2 className="font-display text-xl text-white mb-4">About the Company</h2>
        <div className="space-y-2 text-slate-300">
          <p><span className="text-slate-500">Company:</span> {job.recruiterId?.companyName || job.companyName}</p>
          <p><span className="text-slate-500">Location:</span> {job.recruiterId?.companyLocation || job.location}</p>
          <p><span className="text-slate-500">Contact:</span> {job.recruiterId?.email}</p>
        </div>
      </div>
    </div>
  )
}
