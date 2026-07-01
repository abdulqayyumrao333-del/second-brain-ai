import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard({ session }) {
  const [meStatus, setMeStatus] = useState('checking...')
  const [meError, setMeError] = useState(null)

  useEffect(() => {
    fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`)
        return res.json()
      })
      .then((data) => setMeStatus(`verified as ${data.email}`))
      .catch((err) => setMeError(err.message))
  }, [session.access_token])

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center space-y-4">
      <h2 className="text-xl font-semibold text-neutral-100">Welcome back</h2>
      <p className="text-neutral-400 text-sm">{session.user.email}</p>

      <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            meError ? 'bg-red-500' : meStatus === 'checking...' ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        />
        {meError ? (
          <span className="text-red-400">Backend auth check failed: {meError}</span>
        ) : (
          <span>Backend session: {meStatus}</span>
        )}
      </div>

      <button
        onClick={() => supabase.auth.signOut()}
        className="w-full rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-white"
      >
        Sign out
      </button>
    </div>
  )
}
