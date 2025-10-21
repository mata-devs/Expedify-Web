import { useState } from 'react'
import { auth, googleProvider } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

export default function AuthGate() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const doEmailSignIn = async () => {
    setLoading(true); setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, pw)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const doEmailSignUp = async () => {
    setLoading(true); setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, pw)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const doGoogle = async () => {
    setLoading(true); setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Sign in</h1>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
        <div className="row">
          <button className="btn" disabled={loading} onClick={doEmailSignIn}>Sign in</button>
          <button className="btn outline" disabled={loading} onClick={doEmailSignUp}>Create account</button>
        </div>
        <div className="sep">or</div>
        <button className="btn ghost" disabled={loading} onClick={doGoogle}>Continue with Google</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
