import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const roleRedirect = () => {
    if (!user) return null
    if (user.role === 'applicant') return '/jobs'
    if (user.role === 'recruiter') return '/dashboard'
    if (user.role === 'admin')     return '/admin'
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 text-center animate-fade-in">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          Your next opportunity is one click away
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl text-white leading-tight mb-6">
          Find Work That <br />
          <span className="text-amber-500">Means Something</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Connect with top recruiters across Computer Science, Analytics, Design and Electronics.
          Apply with confidence. Track your progress in real time.
        </p>

        {/* CTA */}
        {user ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={roleRedirect()} className="btn-primary text-base px-8 py-3">
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-3">Get Started — It's Free</Link>
            <Link to="/login"  className="btn-secondary text-base px-8 py-3">Login to Your Account</Link>
          </div>
        )}

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto border-t border-slate-800 pt-12">
          {[
            { label: 'Categories', value: '4' },
            { label: 'Roles Supported', value: '3' },
            { label: 'Real-time Status', value: '✓' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl text-amber-500 mb-1">{s.value}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
