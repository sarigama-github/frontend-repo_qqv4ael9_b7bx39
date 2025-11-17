import { useEffect, useState } from 'react'

export default function History({ api, username }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!username) return
    fetch(`${api}/api/history/${username}`).then(r=>r.json()).then(setItems)
  }, [username, api])

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Recent Plays</h3>
      <div className="space-y-3 text-sm">
        {items.length === 0 && <div className="text-neutral-400">No history yet.</div>}
        {items.map((it)=> (
          <div key={it._id} className="flex items-center justify-between bg-white/5 rounded p-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-white/10 text-xs capitalize">{it.game}</span>
              <span className="text-neutral-300">Bet: {it.bet}</span>
              <span className={`${it.payout>=0? 'text-green-400':'text-red-400'}`}>Payout: {it.payout}</span>
            </div>
            <div className="text-neutral-400">Balance: {it.balance_after}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
