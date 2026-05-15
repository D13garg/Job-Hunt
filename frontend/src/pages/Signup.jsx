import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signup as signupApi } from '../api'

export default function Signup() {
  const [form, setForm]     = useState({ username: '', email: '', password: '', role: 'applicant', companyName: '', companyLocation: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await signupApi(form)
      login(data.user, data.token)
      if (data.user.role === 'recruiter') return navigate('/dashboard')
      navigate('/jobs')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join JobHunt today</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Role toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg">
              {['applicant', 'recruiter'].map((r) => (
                <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 rounded-md text-sm font-medium capitalize transition-all ${form.role === r ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                  {r}
                </button>
              ))}
            </div>

            <div>
              <label className="label">Username</label>
              <input name="username" value={form.username} onChange={handle}
                placeholder="Your full name" className="input" required />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder="you@example.com" className="input" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handle}
                placeholder="Min 6 characters" className="input" required minLength={6} />
            </div>

            {/* Recruiter extra fields */}
            {form.role === 'recruiter' && (
              <>
                <div>
                  <label className="label">Company Name</label>
                  <input name="companyName" value={form.companyName} onChange={handle}
                    placeholder="Your company" className="input" required />
                </div>
                <div>
                  <label className="label">Company Location</label>
                  <input name="companyLocation" value={form.companyLocation} onChange={handle}
                    placeholder="e.g. Bangalore" className="input" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
