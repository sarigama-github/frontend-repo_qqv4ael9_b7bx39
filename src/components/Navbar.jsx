import { useState } from 'react'

export default function Navbar({ current, onChange, username, balance, onReset }) {
  const tabs = [
    { id: 'lobby', label: 'Lobby' },
    { id: 'blackjack', label: 'Blackjack' },
    { id: 'slots', label: 'Slots' },
    { id: 'baccarat', label: 'Baccarat' },
    { id: 'history', label: 'History' },
  ]
  return (
    <header className="w-full bg-neutral-900/70 backdrop-blur border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500" />
          <span className="text-white font-semibold">RainVibes Casino</span>
        </div>
        <nav className="hidden sm:flex items-center gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => onChange(t.id)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${current===t.id? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>{t.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-neutral-400">{username ? 'Player' : 'Guest'}</div>
            <div className="text-sm text-white font-medium">{username || 'Not signed in'}</div>
          </div>
          <div className="px-3 py-1.5 rounded bg-white/10 text-white text-sm">💰 {balance}</div>
          <button onClick={onReset} className="text-neutral-300 hover:text-white text-sm">Reset</button>
        </div>
      </div>
      <div className="sm:hidden px-4 pb-3 flex gap-2 overflow-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${current===t.id? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>{t.label}</button>
        ))}
      </div>
    </header>
  )
}
