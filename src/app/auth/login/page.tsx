// ─── src/app/auth/login/page.tsx ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [mode, setMode]         = useState<'login' | 'signup'>('login')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0d12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans, DM Sans, system-ui)',
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: '#161b27',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '36px 32px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 16, fontWeight: 700, color: '#f0f4ff' }}>VintedPro</div>
            <div style={{ fontSize: 11, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CRM Dashboard</div>
          </div>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#f0f4ff', marginBottom: 6 }}>
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h1>
        <p style={{ fontSize: 13, color: '#8892a4', marginBottom: 24 }}>
          {mode === 'login' ? 'Accédez à votre espace vendeur' : 'Démarrez gratuitement'}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8892a4', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email
            </label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              style={{
                width: '100%', padding: '10px 14px',
                background: '#111520', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, color: '#f0f4ff', fontSize: 14,
                fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8892a4', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mot de passe
            </label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px',
                background: '#111520', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, color: '#f0f4ff', fontSize: 14,
                fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', marginBottom: 16,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, color: '#f87171', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '11px',
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            border: 'none', borderRadius: 8,
            color: 'white', fontSize: 14, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontFamily: 'inherit',
          }}>
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8892a4' }}>
          {mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span
            style={{ color: '#06b6d4', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? "S'inscrire" : "Se connecter"}
          </span>
        </div>
      </div>
    </div>
  )
}
