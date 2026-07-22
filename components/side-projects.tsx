'use client'

import { useState, useEffect } from 'react'
import { Sprout, DollarSign, Package, CheckSquare, Calendar, ChevronDown, ChevronUp, Check, Plus, Trash2 } from 'lucide-react'
import { sideProjects, type SideProject } from '@/lib/portfolio-data'
import { getCompletedTasks, toggleTask, getSeedlingsRevenue, addSeedlingsRevenue, removeSeedlingsRevenue, type RevenueEntry } from '@/lib/local-store'

export function SideProjects() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [seedlingsEntries, setSeedlingsEntries] = useState<RevenueEntry[]>([])
  const [showSeedlingsForm, setShowSeedlingsForm] = useState(false)
  const [seedDesc, setSeedDesc] = useState('')
  const [seedAmount, setSeedAmount] = useState('')

  useEffect(() => {
    setCompleted(getCompletedTasks())
    setSeedlingsEntries(getSeedlingsRevenue())
  }, [])

  const handleToggle = (taskId: string) => {
    const updated = toggleTask(taskId)
    setCompleted(new Set(updated))
  }

  const handleAddSeedlings = () => {
    if (!seedDesc.trim() || !seedAmount) return
    const updated = addSeedlingsRevenue({
      date: new Date().toISOString().split('T')[0],
      source: 'seedlings',
      description: seedDesc.trim(),
      amount: parseFloat(seedAmount),
    })
    setSeedlingsEntries(updated)
    setSeedDesc('')
    setSeedAmount('')
    setShowSeedlingsForm(false)
  }

  const handleRemoveSeedlings = (id: string) => {
    const updated = removeSeedlingsRevenue(id)
    setSeedlingsEntries(updated)
  }

  const seedlingsTotal = seedlingsEntries.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-4">
      {sideProjects.map((project) => {
        const isExpanded = expanded === project.id
        const taskIds = project.tasks.map((_, i) => `side-${project.id}-${i}`)
        const doneCount = taskIds.filter(id => completed.has(id)).length

        return (
          <div key={project.id} className="rounded-xl border border-border bg-card/60 p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <Sprout className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">{project.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-green-500/10 border border-green-500/30 px-2.5 py-0.5 text-[0.65rem] font-medium text-green-500">
                  {project.status}
                </span>
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : project.id)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                >
                  {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
              </div>
            </div>

            {/* Quick stats row */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg bg-background/50 border border-border p-2.5">
                <div className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground mb-1">
                  <DollarSign className="size-3" /> Investment
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">${project.financials.investment.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-2.5">
                <div className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground mb-1">
                  <DollarSign className="size-3" /> Revenue Target
                </div>
                <p className="font-mono text-sm font-semibold text-green-500">${project.financials.revenueTarget.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-2.5">
                <div className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground mb-1">
                  <CheckSquare className="size-3" /> Tasks
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">{doneCount}/{project.tasks.length}</p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-2.5">
                <div className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground mb-1">
                  <Calendar className="size-3" /> Timeline
                </div>
                <p className="text-xs font-medium text-foreground">{project.timeline}</p>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                {/* Financials */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Financial Plan</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><span className="text-foreground font-medium">Source:</span> {project.financials.investmentSource}</p>
                    <p><span className="text-foreground font-medium">Model:</span> {project.financials.revenueModel}</p>
                    <p><span className="text-foreground font-medium">Breakeven:</span> {project.financials.breakeven}</p>
                  </div>
                </div>

                {/* Assets */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Assets Available</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.assets.map(asset => (
                      <span key={asset} className="rounded-md bg-green-500/5 border border-green-500/20 px-2 py-1 text-[0.65rem] text-green-400">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Task checklist */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Action Items ({doneCount}/{project.tasks.length})
                  </h4>
                  <ul className="space-y-1.5">
                    {project.tasks.map((task, i) => {
                      const taskId = `side-${project.id}-${i}`
                      const isDone = completed.has(taskId)
                      return (
                        <li key={taskId}>
                          <button
                            type="button"
                            onClick={() => handleToggle(taskId)}
                            className="flex items-start gap-2 text-left w-full group"
                          >
                            <span
                              className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                isDone
                                  ? 'border-green-500 bg-green-500 text-white'
                                  : 'border-muted-foreground/40 group-hover:border-green-500/60'
                              }`}
                            >
                              {isDone && <Check className="size-2.5" />}
                            </span>
                            <span className={`text-xs leading-relaxed ${isDone ? 'text-muted-foreground/50 line-through' : 'text-muted-foreground group-hover:text-foreground'}`}>
                              {task}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Seedlings Revenue Tracker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Revenue ({seedlingsEntries.length} sales)
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowSeedlingsForm(s => !s)}
                      className="flex items-center gap-1 text-[0.65rem] text-green-500 hover:text-green-400 transition-colors"
                    >
                      <Plus className="size-3" /> Log Sale
                    </button>
                  </div>

                  {/* Progress toward target */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-mono text-lg font-bold text-green-500">${seedlingsTotal.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">/ ${project.financials.revenueTarget.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${Math.min((seedlingsTotal / project.financials.revenueTarget) * 100, 100)}%` }} />
                    </div>
                  </div>

                  {showSeedlingsForm && (
                    <div className="mb-3 rounded-lg border border-green-500/30 bg-green-500/5 p-2.5 space-y-2">
                      <input
                        type="text"
                        placeholder="e.g. '12 tomato seedlings sold'"
                        value={seedDesc}
                        onChange={e => setSeedDesc(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddSeedlings()}
                        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount $"
                          value={seedAmount}
                          onChange={e => setSeedAmount(e.target.value)}
                          className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                        />
                        <button
                          type="button"
                          onClick={handleAddSeedlings}
                          disabled={!seedDesc.trim() || !seedAmount}
                          className="flex-1 rounded-md bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500/90 disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {seedlingsEntries.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {seedlingsEntries.map(entry => (
                        <div key={entry.id} className="flex items-center justify-between rounded bg-background/50 px-2 py-1.5 group">
                          <div className="flex items-center gap-2 min-w-0">
                            <Sprout className="size-3 text-green-500 shrink-0" />
                            <span className="text-xs text-foreground truncate">{entry.description}</span>
                            <span className="text-[0.6rem] text-muted-foreground shrink-0">{entry.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono text-xs font-semibold text-green-500">+${entry.amount}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSeedlings(entry.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-red-400 transition-all"
                            >
                              <Trash2 className="size-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
