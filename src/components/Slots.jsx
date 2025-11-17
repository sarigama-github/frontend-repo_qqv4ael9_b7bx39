import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const symbols = ['🍒', '🍋', '🔔', '⭐', '7️⃣']

export default function Slots({ api, username, balance, onResult }) {
  const [bet, setBet] = useState(10)
  const [resData, setResData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [reels, setReels] = useState(['🎰', '🎰', '🎰'])

  const spin = async () => {
    if (spinning) return
    setSpinning(true)
    setLoading(true)
    // Pre-spin animation: cycle symbols
    const start = Date.now()
    const cycle = () => {
      const t = Date.now() - start
      setReels(prev => prev.map((_, i) => symbols[Math.floor((t/80 + i*2) % symbols.length)]))
      if (Date.now() - start < 900) requestAnimationFrame(cycle)
    }
    requestAnimationFrame(cycle)

    try {
      const res = await fetch(`${api}/api/slots/spin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bet: Number(bet) })
      })
      const data = await res.json()
      // Staggered stop animation
      await new Promise(r => setTimeout(r, 950))
      setReels([data.reels?.[0], reels[1], reels[2]])
      await new Promise(r => setTimeout(r, 300))
      setReels([data.reels?.[0], data.reels?.[1], reels[2]])
      await new Promise(r => setTimeout(r, 300))
      setReels([data.reels?.[0], data.reels?.[1], data.reels?.[2]])

      setResData(data)
      if (typeof data.balance === 'number') onResult(data.balance)
    } finally {
      setLoading(false)
      setTimeout(() => setSpinning(false), 400)
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

      <div className="flex items-center justify-center gap-3 mb-3">
        {reels.map((sym, i) => (
          <Reel key={i} symbol={sym} spinning={spinning} index={i} final={resData?.reels?.[i]} />)
        )}
      </div>

      {resData && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 text-sm">
          <div className="text-lg">Outcome: <span className="font-semibold">{resData.outcome}</span> | Payout: {resData.payout}</div>
          <div>New Balance: <span className="font-semibold">{resData.balance}</span></div>
        </motion.div>
      )}
    </div>
  )
}

function Reel({ symbol, spinning, index, final }){
  return (
    <motion.div
      className="w-20 h-24 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-inner flex items-center justify-center text-4xl"
      animate={spinning ? { y: [0, 8, 0], filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'] } : { y: 0, filter: 'blur(0px)' }}
      transition={{ repeat: spinning ? Infinity : 0, duration: 0.35, ease: 'easeInOut' }}
    >
      <motion.span
        key={`${symbol}-${final ?? ''}`}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        {symbol}
      </motion.span>
    </motion.div>
  )
}
