import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllJobs, addBookmark, removeBookmark, getBookmarks } from '../api'
import JobCard from '../components/JobCard'
import FilterBar from '../components/FilterBar'

export default function Jobs() {
  const { user } = useAuth()
  const [jobs, setJobs]               = useState([])
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [filters, setFilters]         = useState({})

  const fetchJobs = useCallback(async (f = {}) => {
    setLoading(true)
    setError('')
    try {
      // Clean empty params
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''))
      const { data } = await getAllJobs(params)
      setJobs(data.jobs)
    } catch {
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchBookmarks = useCallback(async () => {
    if (user?.role !== 'applicant') return
    try {
      const { data } = await getBookmarks()
      setBookmarkedIds(new Set(data.bookmarks.map((b) => b.jobId._id)))
    } catch {}
  }, [user])

  useEffect(() => { fetchJobs(); fetchBookmarks() }, [fetchJobs, fetchBookmarks])

  const handleFilter = (f) => { setFilters(f); fetchJobs(f) }

  const handleBookmark = async (jobId) => {
    try {
      if (bookmarkedIds.has(jobId)) {
        await removeBookmark(jobId)
        setBookmarkedIds((prev) => { const s = new Set(prev); s.delete(jobId); return s })
      } else {
        await addBookmark(jobId)
        setBookmarkedIds((prev) => new Set([...prev, jobId]))
      }
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white mb-2">Browse Jobs</h1>
        <p className="text-slate-400">{jobs.length} opportunities found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-72 shrink-0">
          <FilterBar onFilter={handleFilter} />
        </aside>

        {/* Job grid */}
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-12">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No jobs match your filters.</p>
              <button onClick={() => handleFilter({})} className="btn-secondary mt-4 text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onBookmark={user?.role === 'applicant' ? handleBookmark : null}
                  isBookmarked={bookmarkedIds.has(job._id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
