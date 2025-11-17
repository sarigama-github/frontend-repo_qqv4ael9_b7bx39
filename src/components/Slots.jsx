import { useState } from 'react'

export default function Slots({ api, username, balance, onResult }) {
  const [bet, setBet] = useState(10)
  const [resData, setResData] = useState(null)
  const [loading, setLoading] = useState(false)

  const spin = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${api}/api/slots/spin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bet: Number(bet) })
      })
      const data = await res.json()
      setResData(data)
      onResult(data.balance)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">Slots</h3>
        <span className="text-neutral-400 text-sm">3-reel demo</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <input type="number" min={1} max={1000} value={bet} onChange={e=>setBet(e.target.value)}
               className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm w-28" />
        <button onClick={spin} disabled={loading}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-60 rounded px-4 py-2 text-sm">{loading? 'Spinning...' : 'Spin'}</button>
      </div>
      {resData && (
        <div className="space-y-2 text-sm">
          <div className="text-3xl tracking-wider">{resData.reels?.join('  ')}</div>
          <div>Outcome: <span className="font-semibold">{resData.outcome}</span> | Payout: {resData.payout}</div>
          <div>New Balance: <span className="font-semibold">{resData.balance}</span></div>
        </div>
      )}
    </div>
  )
}
