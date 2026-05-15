import { Link } from 'react-router-dom'

const categoryColors = {
  computer:    'bg-blue-900/50 text-blue-300 border-blue-700',
  analytics:   'bg-purple-900/50 text-purple-300 border-purple-700',
  design:      'bg-pink-900/50 text-pink-300 border-pink-700',
  electronics: 'bg-green-900/50 text-green-300 border-green-700',
}

export default function JobCard({ job, onBookmark, isBookmarked }) {
  const salaryFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(job.salary)

  return (
    <div className="card group hover:shadow-lg hover:shadow-black/20 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job._id}`}>
            <h3 className="font-display text-lg text-white group-hover:text-amber-400 transition-colors truncate">
              {job.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-sm mt-0.5">{job.companyName}</p>
        </div>
        <span className={`badge border ${categoryColors[job.category] || 'bg-slate-700 text-slate-300'} shrink-0`}>
          {job.category}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {salaryFormatted}/yr
        </span>
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-md">
              {tag}
            </span>
          ))}
          {job.tags.length > 4 && (
            <span className="text-xs text-slate-500">+{job.tags.length - 4} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <span className="text-xs text-slate-500">
          {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <div className="flex items-center gap-2">
          {onBookmark && (
            <button
              onClick={() => onBookmark(job._id)}
              className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
          <Link to={`/jobs/${job._id}`} className="btn-primary text-xs py-1.5 px-3">
            View →
          </Link>
        </div>
      </div>
    </div>
  )
}
