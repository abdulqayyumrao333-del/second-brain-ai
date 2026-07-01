import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoadingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-neutral-950 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
          Second Brain AI
        </h1>
        <p className="text-neutral-500 mt-1">Step 2 — Auth</p>
      </div>

      {loadingSession ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : session ? (
        <Dashboard session={session} />
      ) : (
        <AuthForm />
      )}
    </div>
  )
}

export default App
