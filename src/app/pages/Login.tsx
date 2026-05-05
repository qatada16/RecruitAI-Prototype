import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'recruiter' | 'candidate'>('recruiter');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    login({ name, email, role });
    if (role === 'recruiter') navigate('/recruiter');
    else navigate('/candidate');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm">
        {/* Card */}
        <div
          className="rounded-lg px-5 sm:px-8 py-8 sm:py-10 border"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <span className="text-white font-semibold">R</span>
              </div>
              <span className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>RecruitAI</span>
            </div>
          </div>

          <h2
            className="text-center mb-1"
            style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Welcome back
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Sign in to your account</p>

          {error && (
            <div
              className="mb-4 px-3 py-2.5 rounded text-sm border"
              style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--error-border)', color: 'var(--error)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded border outline-none transition-colors"
                  style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-header)' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.backgroundColor = 'var(--bg-surface)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.backgroundColor = 'var(--bg-header)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded border outline-none transition-colors"
                  style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-header)' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.backgroundColor = 'var(--bg-surface)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.backgroundColor = 'var(--bg-header)'; }}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                I'm logging in as
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as 'recruiter' | 'candidate')}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm rounded border outline-none cursor-pointer"
                  style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-header)' }}
                >
                  <option value="recruiter">Recruiter</option>
                  <option value="candidate">Candidate</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-sm text-white rounded transition-colors mt-2 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'; }}
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium" style={{ color: 'var(--accent)' }}>
              Sign Up
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
          <Link to="/" style={{ color: 'var(--accent)' }}>â† Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
