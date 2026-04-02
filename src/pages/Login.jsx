// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState('email')
  const [otpSent, setOtpSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { authAPI } = await import('../services/api')
      await authAPI.sendOTP(form.phone)
      setOtpSent(true)
    } catch (err) {
      // Demo bypass: always show OTP sent
      setOtpSent(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setLoading(true)
    try {
      await login({ email: 'guest@swastya-demo.ai', password: '000000' })
      navigate('/')
    } catch {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg style={{ marginBottom: '8px' }} width="54" height="32" viewBox="0 0 40 24">
            <polyline points="2,14 10,14 14,4 18,22 22,2 26,16 30,12 38,12"
              stroke="url(#lgMain)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <defs>
              <linearGradient id="lgMain" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent2)" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ display: 'flex', gap: '6px', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            <span>Swastya</span>
            <span style={{ color: '#2998FF' }}>AI</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: 600 }}>Predict Health Early</p>
        </div>

        <h2 className={styles.title} style={{ marginTop: '16px' }}>Welcome back</h2>
        <p className={styles.sub}>Sign in to your health dashboard</p>

        {/* Login Method Tabs */}
        <div style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
          <button type="button"
            onClick={() => { setLoginMethod('email'); setOtpSent(false); setError('') }}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid', borderColor: loginMethod === 'email' ? '#5B6EF5' : '#e0e0e0', background: loginMethod === 'email' ? '#e0e7ff' : '#fff', color: loginMethod === 'email' ? '#5B6EF5' : '#888', fontWeight: 600, cursor: 'pointer' }}>
            ✉️ Gmail / Email
          </button>
          <button type="button"
            onClick={() => { setLoginMethod('phone'); setOtpSent(false); setError('') }}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid', borderColor: loginMethod === 'phone' ? '#5B6EF5' : '#e0e0e0', background: loginMethod === 'phone' ? '#e0e7ff' : '#fff', color: loginMethod === 'phone' ? '#5B6EF5' : '#888', fontWeight: 600, cursor: 'pointer' }}>
            📱 Phone OTP
          </button>
        </div>

        {/* Email / Gmail Login */}
        {loginMethod === 'email' && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Gmail / Email Address</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@gmail.com" required />
            </div>
            <div className={styles.field}>
              <label>Password <span style={{ color: '#aaa', fontSize: '0.8rem' }}>(use 000000 for demo)</span></label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="000000" required />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In with Email'}
            </button>
          </form>
        )}

        {/* Phone OTP Login */}
        {loginMethod === 'phone' && (
          <form onSubmit={otpSent ? handleSubmit : handleSendOTP} className={styles.form}>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input name="phone" type="tel" value={form.phone}
                onChange={handleChange} placeholder="+91 9876543210" required disabled={otpSent} />
            </div>
            {otpSent && (
              <div className={styles.field}>
                <label>OTP Code <span style={{ color: '#aaa', fontSize: '0.8rem' }}>(use 000000 for demo)</span></label>
                <input name="otp" type="text" value={form.otp}
                  onChange={handleChange} placeholder="000000" maxLength={6} required />
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Please wait…' : otpSent ? '✅ Verify & Login' : '📨 Send OTP'}
            </button>
            {otpSent && (
              <button type="button"
                onClick={() => { setOtpSent(false); setForm(f => ({ ...f, otp: '' })) }}
                style={{ background: 'none', border: 'none', color: '#5B6EF5', marginTop: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                ← Change Phone Number
              </button>
            )}
          </form>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          <span style={{ color: '#aaa', fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
        </div>

        {/* Guest / Demo Login */}
        <button
          onClick={handleGuestLogin}
          disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e0e0e0', background: '#fff', color: '#444', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}>
          🚀 Continue as Guest (Demo)
        </button>

        <p className={styles.switch} style={{ marginTop: '16px' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
