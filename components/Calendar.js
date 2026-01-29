"use client"
import React from 'react'
import useStore from '../lib/store'

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function formatKey(d) {
  return d.toISOString().slice(0, 10)
}

export default function Calendar({ completions }) {
  const today = new Date()
  const start = startOfMonth(today)
  const totalDays = daysInMonth(today)

  const blanks = start.getDay() // Sunday=0
  const cells = []
  for (let i = 0; i < blanks; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(today.getFullYear(), today.getMonth(), d)
    cells.push({ d, key: formatKey(date), isToday: formatKey(date) === formatKey(today) })
  }

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-1">
          {today.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
        </h2>
        <p className="text-sm text-gray-400">Track your daily completions</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((x) => (
          <div key={x} className="text-center text-xs font-semibold text-gray-500 py-2">
            {x}
          </div>
        ))}

        {cells.map((c, idx) => (
          c ? (
            <div key={c.key} className="aspect-square flex items-center justify-center">
              <div
                className={`w-full h-full flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  completions && completions[c.key]
                    ? 'bg-green-500/60 text-white border border-green-400 shadow-xl shadow-green-500/40 animate-pulse'
                    : c.isToday
                    ? 'bg-white/20 text-white border border-white/40 shadow-md shadow-white/10'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {c.d}
              </div>
            </div>
          ) : (
            <div key={`blank-${idx}`} />
          )
        ))}
      </div>
    </div>
  )
}
