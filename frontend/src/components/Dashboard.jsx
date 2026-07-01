import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard({ session }) {
  const [meStatus, setMeStatus] = useState('checking...')
  const [meError, setMeError] = useState(null)

  const [gmailConnected, setGmailConnected] = useState(null)
  const [gmailError, setGmailError] = useState(null)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    fetch('/api/me', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`)
        return res.json()
      })
      .then((data) => setMeStatus(`verified as ${data.email}`))
      .catch((err) => setMeError(err.message))
  }, [session.access_token])

  const checkGmailStatus = () => {
    fetch('/api/gmail/status', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`)
        return res.json()
      })
      .then((data) => setGmailConnected(data.connected))
      .catch((err) => setGmailError(err.message))
  }

  useEffect(() => {
    checkGmailStatus()

    const params = new URLSearchParams(window.location.search)
    const gmailResult = params.get('gmail')
    if (gmailResult) {
      if (gmailResult === 'connected') checkGmailStatus()
      if (gmailResult === 'denied') setGmailError('Gmail connection was cancelled.')
      if (gmailResult === 'invalid_state' || gmailResult === 'error')
        setGmailError('Something went wrong connecting Gmail. Please try again.')

      window.history.replaceState({}, '', window.location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.access_token])

  async function handleConnectGmail() {
    setConnecting(true)
    setGmailError(null)
    try {
      const res = await fetch('/api/gmail/connect', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) throw new Error(`Backend responded with ${res.status}`)
      const { authUrl } = await res.json()
      window.location.href = authUrl
    } catch (err) {
      setGmailError(err.message)
      setConnecting(false)
    }
  }

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

      <div className="border-t border-neutral-800 pt-4 space-y-3">
        <p className="text-sm text-neutral-400">Gmail</p>

        {gmailError && <p className="text-sm text-red-400">{gmailError}</p>}

        {gmailConnected === true ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>Gmail connected</span>
          </div>
        ) : (
          <button
            onClick={handleConnectGmail}
            disabled={connecting || gmailConnected === null}
            className="w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {connecting
              ? 'Redirecting to Google…'
              : gmailConnected === null
              ? 'Checking…'
              : 'Connect Gmail'}
          </button>
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