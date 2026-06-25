import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import galeLogo from '../assets/gale-logo.png'

const demoUsers = [
  { role: 'Admin', email: 'admin@gale.dev', password: 'Admin@123' },
  { role: 'Edit', email: 'editor@gale.dev', password: 'Editor@123' },
  { role: 'Read', email: 'reader@gale.dev', password: 'Reader@123' },
]

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@gale.dev')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    const success = await login(email, password)
    setIsLoading(false)
    if (!success) {
      setError('Invalid credentials. Try one of the demo users below.')
      return
    }
    navigate('/dashboard')
  }

  const useDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="login">
      <aside className="login-brand">
        <span className="login-aurora aurora-1" aria-hidden="true" />
        <span className="login-aurora aurora-2" aria-hidden="true" />
        <span className="login-aurora aurora-3" aria-hidden="true" />
        <span className="login-grid-overlay" aria-hidden="true" />
        <img src={galeLogo} alt="" aria-hidden="true" className="login-brand-watermark" />

        <div className="login-brand-inner">
          <div className="login-logo-wrap reveal" style={{ animationDelay: '0.05s' }}>
            <img src={galeLogo} alt="GALE Partners" className="login-brandmark" />
          </div>
          <h1 className="login-display reveal" style={{ animationDelay: '0.18s' }}>
            Skycrane
          </h1>
          <p className="login-tagline reveal" style={{ animationDelay: '0.3s' }}>
            The playground for curiosity.
          </p>
        </div>
        <p className="login-brand-foot reveal" style={{ animationDelay: '0.42s' }}>
          GALE Partners LLP — © {new Date().getFullYear()}
        </p>
      </aside>

      <main className="login-panel">
        <div className="login-form-wrap">
          <p className="eyebrow">Sign in</p>
          <h2>Welcome back</h2>
          <p className="login-sub">Sign in to access the GALE Skycrane workspace.</p>

          <form onSubmit={onSubmit} className="login-form">
            <label className="field">
              Work email
              <div className="input-icon">
                <Mail size={16} />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                />
              </div>
            </label>
            <label className="field">
              Password
              <div className="input-icon">
                <Lock size={16} />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                />
              </div>
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="btn btn-primary full" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
              {!isLoading ? <ArrowRight size={16} /> : null}
            </button>
          </form>

          <div className="demo-block">
            <span className="demo-label">Demo accounts</span>
            <div className="demo-list">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  className="demo-chip"
                  onClick={() => useDemo(user.email, user.password)}
                >
                  <strong>{user.role}</strong>
                  <span>{user.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
