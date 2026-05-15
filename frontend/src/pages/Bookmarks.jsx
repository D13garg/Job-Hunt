import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBookmarks, removeBookmark } from '../api'
import JobCard from '../components/JobCard'

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getBookmarks()
        setBookmarks(data.bookmarks)
      } catch { setError('Failed to load bookmarks') }
      finally  { setLoading(false) }
    }
    fetch()
  }, [])

  const handleRemove = async (jobId) => {
    try {
      await removeBookmark(jobId)
      setBookmarks((prev) => prev.filter((b) => b.jobId._id !== jobId))
    } catch {}
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white mb-2">Bookmarks</h1>
        <p className="text-slate-400">{bookmarks.length} saved job{bookmarks.length !== 1 ? 's' : ''}</p>
      </div>

      {error && <p className="text-red-400 mb-6">{error}</p>}

      {bookmarks.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-500 text-lg mb-4">No bookmarks yet. Save jobs to read later.</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {bookmarks.map((b) => (
            <div key={b._id} className="relative">
              <JobCard
                job={b.jobId}
                onBookmark={handleRemove}
                isBookmarked={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
