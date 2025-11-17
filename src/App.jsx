import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import AuthCard from './components/AuthCard'
import Blackjack from './components/Blackjack'
import Slots from './components/Slots'
import Baccarat from './components/Baccarat'
import History from './components/History'

function App() {
  const api = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [tab, setTab] = useState('lobby')
  const [username, setUsername] = useState('')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('casino_user')
    if (saved) {
      const { username } = JSON.parse(saved)
      if (username) fetch(`${api}/api/player/${username}`).then(async r => {
        if (r.ok) {
          const d = await r.json(); setUsername(d.username); setBalance(d.balance)
        } else {
          localStorage.removeItem('casino_user')
        }
      })
    }
  }, [api])

  const register = async (name) => {
    const res = await fetch(`${api}/api/player/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, balance: 1000 })
    })
    if (!res.ok) {
      const t = await res.text(); throw new Error(t)
    }
    const data = await res.json()
    setUsername(data.username)
    setBalance(data.balance)
    localStorage.setItem('casino_user', JSON.stringify({ username: data.username }))
    setTab('lobby')
  }

  const reset = () => {
    localStorage.removeItem('casino_user')
    setUsername(''); setBalance(0); setTab('lobby')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <Navbar current={tab} onChange={setTab} username={username} balance={balance} onReset={reset} />
      <main className="max-w-6xl mx-auto px-4 py-8 grid gap-6">
        {!username ? (
          <div className="grid place-items-center py-20">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome to RainVibes Casino</h1>
              <p className="text-neutral-400 mt-2">Dark, sleek, and just for fun. No real money involved.</p>
            </div>
            <AuthCard onRegister={register} />
          </div>
        ) : (
          <>
            {tab === 'lobby' && (
              <section className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-b from-purple-900/50 to-neutral-900/60 border border-neutral-800 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Blackjack</h3>
                  <p className="text-sm text-neutral-400 mb-4">Beat the dealer in this auto-resolve demo.</p>
                  <button onClick={()=>setTab('blackjack')} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm">Play</button>
                </div>
                <div className="bg-gradient-to-b from-blue-900/50 to-neutral-900/60 border border-neutral-800 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Slots</h3>
                  <p className="text-sm text-neutral-400 mb-4">Spin 3 reels and try your luck.</p>
                  <button onClick={()=>setTab('slots')} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm">Play</button>
                </div>
                <div className="bg-gradient-to-b from-teal-900/50 to-neutral-900/60 border border-neutral-800 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Baccarat</h3>
                  <p className="text-sm text-neutral-400 mb-4">Bet on player, banker, or tie.</p>
                  <button onClick={()=>setTab('baccarat')} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm">Play</button>
                </div>
              </section>
            )}
            {tab === 'blackjack' && <Blackjack api={api} username={username} balance={balance} onResult={setBalance} />}
            {tab === 'slots' && <Slots api={api} username={username} balance={balance} onResult={setBalance} />}
            {tab === 'baccarat' && <Baccarat api={api} username={username} onResult={setBalance} />}
            {tab === 'history' && <History api={api} username={username} />}
          </>
        )}
      </main>
      <footer className="py-8 text-center text-neutral-600 text-xs">
        This is a demo casino for entertainment only. No real money or withdrawals.
      </footer>
    </div>
  )
}

export default App
