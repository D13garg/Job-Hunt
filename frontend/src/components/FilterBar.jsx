import { useState } from 'react'

export default function FilterBar({ onFilter }) {
  const [filters, setFilters] = useState({
    keyword: '', category: '', location: '',
    minSalary: '', maxSalary: '', sortBy: 'newest',
  })

  const handle = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value }
    setFilters(updated)
    onFilter(updated)
  }

  const reset = () => {
    const cleared = { keyword: '', category: '', location: '', minSalary: '', maxSalary: '', sortBy: 'newest' }
    setFilters(cleared)
    onFilter(cleared)
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Filters</h2>
        <button onClick={reset} className="text-xs text-slate-500 hover:text-amber-400 transition-colors">
          Reset all
        </button>
      </div>

      {/* Keyword */}
      <div>
        <label className="label">Keyword / Skill</label>
        <input name="keyword" value={filters.keyword} onChange={handle}
          placeholder="e.g. React, Python…" className="input text-sm" />
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select name="category" value={filters.category} onChange={handle} className="input text-sm">
          <option value="">All Categories</option>
          <option value="computer">Computer</option>
          <option value="analytics">Analytics</option>
          <option value="design">Design</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="label">Location</label>
        <input name="location" value={filters.location} onChange={handle}
          placeholder="e.g. Bangalore" className="input text-sm" />
      </div>

      {/* Salary range */}
      <div>
        <label className="label">Salary Range (₹)</label>
        <div className="flex gap-2">
          <input name="minSalary" value={filters.minSalary} onChange={handle}
            placeholder="Min" type="number" className="input text-sm" />
          <input name="maxSalary" value={filters.maxSalary} onChange={handle}
            placeholder="Max" type="number" className="input text-sm" />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="label">Sort By</label>
        <select name="sortBy" value={filters.sortBy} onChange={handle} className="input text-sm">
          <option value="newest">Newest First</option>
          <option value="salary_desc">Salary: High to Low</option>
          <option value="salary_asc">Salary: Low to High</option>
        </select>
      </div>
    </div>
  )
}
