import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import Spinner from '../components/Spinner'

export default function Register() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth }  = useAuthStore()
  const navigate     = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.post('/api/auth/register', form)
      const res = await api.post('/api/auth/login', form)
      setAuth(res.data.accessToken, { email: form.email })
      navigate('/decks')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
      }}>
        <div className="animate-in" style={{
          background: '#fff', borderRadius: 'var(--radius-xl)',
          padding: 'clamp(36px,5vw,56px) clamp(28px,5vw,48px)',
          width: '100%', maxWidth: 480,
          boxShadow: '0 12px 48px rgba(11,19,43,0.1)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--navy)', borderRadius: 16,
              width: 64, height: 64, marginBottom: 20,
            }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: '1.4rem', letterSpacing: '0.04em', color: 'white',
            }}>FC</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>Start learning</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '1.1rem', fontWeight:600 }}>Create your free account</p>
          </div>

          {error && (
              <div style={{
                background: 'var(--primary-light)', color: '#9A6600',
                padding: '14px 20px', borderRadius: 'var(--radius-md)',
                fontSize: '1rem', fontWeight: 800, marginBottom: 24,
                border: '1px solid #F5A62345',
              }}>{error}</div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { key: 'email',    type: 'email',    label: 'Email address',  placeholder: 'you@example.com' },
              { key: 'password', type: 'password', label: 'Password',       placeholder: 'min. 8 characters' },
            ].map(f => (
                <div key={f.key}>
                  <label style={{ display:'block', fontWeight:800, marginBottom:8, fontSize:'1rem', color:'var(--text-sub)' }}>
                    {f.label}
                  </label>
                  <input
                      type={f.type} value={form[f.key]} required placeholder={f.placeholder}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{
                        width:'100%', padding:'14px 18px',
                        border:'2px solid var(--border)', borderRadius:'var(--radius-md)',
                        fontSize:'1.1rem', outline:'none', background:'#FAFBFC',
                        transition:'border-color 0.2s', fontFamily:'var(--font-body)', fontWeight:600
                      }}
                      onFocus={e => e.target.style.borderColor='var(--primary)'}
                      onBlur={e  => e.target.style.borderColor='var(--border)'}
                  />
                </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={loading}
                    style={{ width:'100%', justifyContent:'center', marginTop:12, padding:'16px', fontSize:'1.15rem' }}>
              {loading ? <Spinner size={20} color="var(--navy)" /> : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:28, fontSize:'1.05rem', color:'var(--text-sub)', fontWeight:600 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--primary-dark)', fontWeight:800 }}>Sign in</Link>
          </p>
        </div>
      </div>
  )
}