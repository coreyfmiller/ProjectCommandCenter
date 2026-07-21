'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Plus, Trash2, TrendingUp } from 'lucide-react'
import { getRevenueEntries, addRevenueEntry, removeRevenueEntry, type RevenueEntry } from '@/lib/local-store'
import { stats } from '@/lib/portfolio-data'

const SOURCES = [
  { id: 'duelly', label: 'Duelly', color: 'bg-green-500' },
  { id: 'marketmojo', label: 'MarketMojo', color: 'bg-yellow-500' },
  { id: 'fundylaunch', label: 'FundyLaunch', color: 'bg-blue-500' },
  { id: 'fundylogic', label: 'FundyLogic', color: 'bg-purple-500' },
  { id: 'other', label: 'Other', color: 'bg-muted-foreground' },
]

export function RevenueTracker() {
  const [entries, setEntries] = useState<RevenueEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [source, setSource] = useState('duelly')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    setEntries(getRevenueEntries())
  }, [])

  const total = entries.reduce((sum, e) => sum + e.amount, 0)
  const progress = Math.min((total / stats.target) * 100, 100)

  const handleAdd = () => {
    if (!description.trim() || !amount) return
    const updated = addRevenueEntry({
      date: new Date().toISOString().split('T')[0],
      source,
      description: description.trim(),
      amount: parseFloat(amount),
    })
    setEntries(updated)
    setDescription('')
    setAmount('')
    setShowForm(false)
  }

  const handleRemove = (id: string) => {
    const updated = removeRevenueEntry(id)
    setEntries(updated)
  }

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      {/* Header + progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Revenue Earned</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          <Plus className="size-3" />
          Log Revenue
        </button>
      </div>

      {/* Big number + progress bar */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-black text-primary">${total.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">/ ${stats.target.toLocaleString()}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{Math.round(progress)}% of 90-day target</p>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
          <div className="flex gap-2">
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            >
              {SOURCES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            />
          </div>
          <input
            type="text"
            placeholder="Description (e.g. 'Launch Pack sale')"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!description.trim() || !amount}
            className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Add Entry
          </button>
        </div>
      )}

      {/* Entries list */}
      {entries.length > 0 && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {entries.map(entry => {
            const sourceConfig = SOURCES.find(s => s.id === entry.source)
            return (
              <div key={entry.id} className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2 group">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`size-2 rounded-full shrink-0 ${sourceConfig?.color || 'bg-muted'}`} />
                  <span className="text-xs text-foreground truncate">{entry.description}</span>
                  <span className="text-[0.6rem] text-muted-foreground shrink-0">{entry.date}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-semibold text-primary">+${entry.amount}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-400 transition-all"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <p className="text-xs text-muted-foreground/50 text-center py-3 italic">
          No revenue logged yet. Close your first deal and log it here.
        </p>
      )}
    </div>
  )
}
