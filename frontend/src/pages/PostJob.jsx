import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createJob, updateJob, getJobById } from '../api'

const emptyForm = {
  title: '', companyName: '', location: '', salary: '',
  description: '', category: 'computer', tags: '', requirements: [],
}

export default function PostJob() {
  const { id } = useParams()           // present when editing
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm]     = useState(emptyForm)
  const [reqInput, setReqInput] = useState({ skill: '', level: 'intermediate', required: true })
  const [loading, setLoading]   = useState(false)
  const [fetchLoad, setFetchLoad] = useState(isEdit)
  const [error, setError]       = useState('')

  // Load job data if editing
  useEffect(() => {
    if (!isEdit) return
    const fetch = async () => {
      try {
        const { data } = await getJobById(id)
        setForm({
          ...data,
          tags: data.tags?.join(', ') || '',
          salary: data.salary?.toString() || '',
        })
      } catch { setError('Failed to load job') }
      finally  { setFetchLoad(false) }
    }
    fetch()
  }, [id, isEdit])

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addRequirement = () => {
    if (!reqInput.skill.trim()) return
    setForm({ ...form, requirements: [...form.requirements, { ...reqInput }] })
    setReqInput({ skill: '', level: 'intermediate', required: true })
  }

  const removeReq = (i) => {
    setForm({ ...form, requirements: form.requirements.filter((_, idx) => idx !== i) })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }
      if (isEdit) { await updateJob(id, payload); navigate('/dashboard') }
      else        { await createJob(payload);     navigate('/dashboard') }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job')
    } finally { setLoading(false) }
  }

  if (fetchLoad) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white mb-2">{isEdit ? 'Edit Job' : 'Post a Job'}</h1>
        <p className="text-slate-400">Fill in the details below</p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-6">
          {/* Basic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Job Title <span className="text-red-400">*</span></label>
              <input name="title" value={form.title} onChange={handle} placeholder="e.g. Frontend Developer" className="input" required />
            </div>
            <div>
              <label className="label">Company Name <span className="text-red-400">*</span></label>
              <input name="companyName" value={form.companyName} onChange={handle} placeholder="Your company" className="input" required />
            </div>
            <div>
              <label className="label">Location <span className="text-red-400">*</span></label>
              <input name="location" value={form.location} onChange={handle} placeholder="e.g. Bangalore / Remote" className="input" required />
            </div>
            <div>
              <label className="label">Salary (₹/yr) <span className="text-red-400">*</span></label>
              <input name="salary" value={form.salary} onChange={handle} type="number" placeholder="e.g. 1200000" className="input" required min={0} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category <span className="text-red-400">*</span></label>
            <select name="category" value={form.category} onChange={handle} className="input">
              <option value="computer">Computer</option>
              <option value="analytics">Analytics</option>
              <option value="design">Design</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description <span className="text-red-400">*</span></label>
            <textarea name="description" value={form.description} onChange={handle}
              rows={5} placeholder="Describe the role, responsibilities and what you're looking for…"
              className="input resize-none" required />
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags / Skills <span className="text-slate-500 font-normal">(comma separated)</span></label>
            <input name="tags" value={form.tags} onChange={handle}
              placeholder="React, Node.js, Remote, Full-stack" className="input" />
          </div>

          {/* Requirements builder */}
          <div>
            <label className="label">Requirements</label>
            <div className="flex gap-2 mb-3">
              <input value={reqInput.skill}
                onChange={(e) => setReqInput({ ...reqInput, skill: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                placeholder="Skill name" className="input flex-1 text-sm" />
              <select value={reqInput.level}
                onChange={(e) => setReqInput({ ...reqInput, level: e.target.value })}
                className="input w-36 text-sm">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
              <label className="flex items-center gap-1.5 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" checked={reqInput.required}
                  onChange={(e) => setReqInput({ ...reqInput, required: e.target.checked })}
                  className="accent-amber-500" />
                Req.
              </label>
              <button type="button" onClick={addRequirement} className="btn-primary px-3 py-2 text-sm">+</button>
            </div>
            {form.requirements.length > 0 && (
              <div className="space-y-2">
                {form.requirements.map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${r.required ? 'bg-amber-500' : 'bg-slate-600'}`} />
                      <span className="text-slate-200">{r.skill}</span>
                      <span className="text-slate-500 capitalize">{r.level}</span>
                    </div>
                    <button type="button" onClick={() => removeReq(i)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Post Job'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary px-6">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
