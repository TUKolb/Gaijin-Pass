import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function RegisterPage() {
  const { signUp }   = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]   = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.username || !form.email || !form.password) { setError('All fields are required.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    try {
      await signUp(form.email, form.password, form.username)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1 className="page-title">Create account</h1>
      <p className="page-subtitle">Join Gaijin Pass and start sharing your experiences.</p>

      <div className="card">
        <div className="form-group">
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} placeholder="your_handle" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="••••••••" />
        </div>

        {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
