import { useState } from 'react'

export default function Blackjack({ api, username, balance, onResult }) {
  const [bet, setBet] = useState(10)
  const [playerCards, setPlayerCards] = useState([])
  const [dealerCards, setDealerCards] = useState([])
  const [status, setStatus] = useState('idle') // idle | player_turn | resolved
  const [canDouble, setCanDouble] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const start = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${api}/api/blackjack/start`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bet: Number(bet) })
      })
      const data = await res.json()
      if (data.status === 'resolved') {
        setPlayerCards(data.player || [])
        setDealerCards(data.dealer || [])
        setStatus('resolved')
        setCanDouble(false)
        if (typeof data.balance === 'number') onResult(data.balance)
        setMessage(`${data.outcome?.toUpperCase()} ${data.payout >= 0 ? `+${data.payout}` : data.payout}`)
      } else {
        setPlayerCards(data.player || [])
        setDealerCards(data.dealer || [])
        setStatus('player_turn')
        setCanDouble(!!data.can_double)
      }
    } finally {
      setLoading(false)
    }
  }

  const hit = async () => {
    if (status !== 'player_turn') return
    setLoading(true)
    try {
      const res = await fetch(`${api}/api/blackjack/hit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      const data = await res.json()
      setPlayerCards(data.player || [])
      setDealerCards(data.dealer || dealerCards)
      if (data.status === 'resolved') {
        setStatus('resolved')
        setCanDouble(false)
        if (typeof data.balance === 'number') onResult(data.balance)
        if (data.outcome) setMessage(`${data.outcome.toUpperCase()} ${data.payout >= 0 ? `+${data.payout}` : data.payout}`)
      } else {
        setStatus('player_turn')
        setCanDouble(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const stand = async () => {
    if (status !== 'player_turn') return
    setLoading(true)
    try {
      const res = await fetch(`${api}/api/blackjack/stand`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      const data = await res.json()
      setPlayerCards(data.player || [])
      setDealerCards(data.dealer || [])
      setStatus('resolved')
      setCanDouble(false)
      if (typeof data.balance === 'number') onResult(data.balance)
      if (data.outcome) setMessage(`${data.outcome.toUpperCase()} ${data.payout >= 0 ? `+${data.payout}` : data.payout}`)
    } finally {
      setLoading(false)
    }
  }

  const doubleDown = async () => {
    if (status !== 'player_turn' || !canDouble) return
    setLoading(true)
    try {
      const res = await fetch(`${api}/api/blackjack/double`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      const data = await res.json()
      setPlayerCards(data.player || [])
      setDealerCards(data.dealer || [])
      setStatus('resolved')
      setCanDouble(false)
      if (typeof data.balance === 'number') onResult(data.balance)
      if (data.outcome) setMessage(`DOUBLE: ${data.outcome.toUpperCase()} ${data.payout >= 0 ? `+${data.payout}` : data.payout}`)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setPlayerCards([])
    setDealerCards([])
    setStatus('idle')
    setCanDouble(false)
    setMessage('')
  }

  const showDealer = status === 'resolved'

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">Blackjack</h3>
        <span className="text-neutral-400 text-sm">Decide: Hit, Stand, Double</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <input type="number" min={1} max={1000} value={bet} onChange={e=>setBet(e.target.value)} disabled={status!=='idle'}
               className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm w-28" />
        {status === 'idle' && (
          <button onClick={start} disabled={loading}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-60 rounded px-4 py-2 text-sm">{loading? 'Dealing...' : 'Deal'}</button>
        )}
        {status === 'player_turn' && (
          <div className="flex gap-2">
            <button onClick={hit} disabled={loading}
                    className="bg-blue-500/20 hover:bg-blue-500/30 rounded px-3 py-2 text-sm">Hit</button>
            <button onClick={stand} disabled={loading}
                    className="bg-green-500/20 hover:bg-green-500/30 rounded px-3 py-2 text-sm">Stand</button>
            <button onClick={doubleDown} disabled={loading || !canDouble}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-50 rounded px-3 py-2 text-sm">Double</button>
          </div>
        )}
        {status === 'resolved' && (
          <button onClick={reset} className="bg-white/10 hover:bg-white/20 rounded px-3 py-2 text-sm">New Hand</button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-neutral-400 mb-1">Your Hand</div>
          <div className="font-mono text-lg">{playerCards.join(' ') || '—'}</div>
          <div className="text-neutral-400 mt-1">Total: {playerCards.length ? handTotal(playerCards) : '-'}</div>
        </div>
        <div>
          <div className="text-neutral-400 mb-1">Dealer</div>
          <div className="font-mono text-lg">{showDealer ? (dealerCards.join(' ') || '—') : (dealerCards[0] ? `${dealerCards[0]} ??` : '—')}</div>
          <div className="text-neutral-400 mt-1">Total: {showDealer ? (dealerCards.length ? handTotal(dealerCards) : '-') : '??'}</div>
        </div>
      </div>

      {message && (
        <div className="mt-4 text-sm font-medium">{message}</div>
      )}
    </div>
  )
}

function handTotal(cards){
  let total = 0
  let aces = 0
  for(const c of cards){
    const r = c.slice(0, -1)
    if(r === 'A'){ total += 11; aces += 1 }
    else if(['K','Q','J'].includes(r) || r==='10'){ total += 10 }
    else { total += Number(r) }
  }
  while(total > 21 && aces){ total -= 10; aces -= 1 }
  return total
}
