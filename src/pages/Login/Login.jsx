import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import API_URL from '../../config/api.js'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setMessage(data.message || 'Login failed.')
        return
      }

      login(data.token, data.user)

      navigate('/admin')
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-header">
          <p className="login-label">MAKTAB 230</p>
          <h1>Admin Login</h1>
          <p>Sign in to manage the school library.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter admin email"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />

          {message && <p className="login-message">{message}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <button
          type="button"
          className="login-back-button"
          onClick={() => navigate('/')}
        >
          ← Back to Library
        </button>
      </div>
    </main>
  )
}

export default Login
