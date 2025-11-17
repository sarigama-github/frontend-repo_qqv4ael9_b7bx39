import { useState } from 'react'

export default function AuthCard({ onRegister }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username || username.length < 3) {
      setError('Username should be at least 3 characters')
      return
    }
    setLoading(true)
    try {
      await onRegister(username)
    } catch (e) {
      setError(e.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-2">Create your fun account</h2>
      <p className="text-sm text-neutral-400 mb-4">No real money. You start with 1000 credits.</p>
      <form onSubmit={submit} className="space-y-3">
        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username"
               className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <button disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 rounded px-3 py-2 text-sm font-medium">{loading? 'Creating...' : 'Start Playing'}</button>
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </form>
    </div>
  )
}
