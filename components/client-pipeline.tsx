'use client'

import { useState, useEffect } from 'react'
import { CircleCheck, Clock, DollarSign, ChevronRight } from 'lucide-react'
import type { ClientProject } from '@/lib/portfolio-data'
import { getPipelineStatuses, updateProspectStage, type ProspectStage } from '@/lib/local-store'

const STAGES: { id: ProspectStage; label: string; color: string }[] = [
  { id: 'cold', label: 'Cold', color: 'text-muted-foreground' },
  { id: 'contacted', label: 'Contacted', color: 'text-yellow-500' },
  { id: 'meeting', label: 'Meeting', color: 'text-orange-500' },
  { id: 'proposal', label: 'Proposal', color: 'text-blue-500' },
  { id: 'won', label: 'Won', color: 'text-green-500' },
  { id: 'lost', label: 'Lost', color: 'text-red-500' },
]

export function ClientPipeline({ projects }: { projects: ClientProject[] }) {
  const [statuses, setStatuses] = useState<Record<string, { stage: ProspectStage; value?: number; price?: string }>>({})
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState("")

  useEffect(() => {
    setStatuses(getPipelineStatuses())
  }, [])

  const active = projects.filter((p) => p.status === 'active')
  const prospects = projects.filter((p) => p.status === 'prospect')

  const handleStageClick = (id: string, stage: ProspectStage) => {
    const updated = updateProspectStage(id, stage)
    setStatuses({ ...updated })
  }

  const handlePriceSave = (id: string) => {
    const current = statuses[id] || { id, stage: 'cold' as ProspectStage }
    const updatedStatuses = { ...statuses }
    updatedStatuses[id] = { ...current, price: priceInput.trim() }
    localStorage.setItem('cc_pipeline', JSON.stringify(updatedStatuses))
    setStatuses(updatedStatuses)
    setEditingPrice(null)
    setPriceInput("")
  }

  const getProspectStage = (id: string): ProspectStage => {
    return statuses[id]?.stage || 'cold'
  }

  const getProspectPrice = (id: string, fallback?: string): string => {
    return (statuses[id] as any)?.price || fallback || ""
  }

  const wonCount = prospects.filter(p => getProspectStage(p.id) === 'won').length
  const contactedCount = prospects.filter(p => ['contacted', 'meeting', 'proposal'].includes(getProspectStage(p.id))).length

  return (
    <div className="space-y-6">
      {/* Active clients */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-success">
            Active Clients ({active.length})
          </h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3"
            >
              <CircleCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.description}</p>
              </div>
              {project.value && (
                <span className="shrink-0 font-mono text-xs text-success/80">{project.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prospects with pipeline */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-warning">
            Prospects ({prospects.length}) — {contactedCount} in progress, {wonCount} won
          </h3>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="size-3" />
            Click stages or price to edit
          </span>
        </div>
        <div className="space-y-2">
          {prospects.map((project) => {
            const stage = getProspectStage(project.id)
            const price = getProspectPrice(project.id, project.value)
            const stageConfig = STAGES.find(s => s.id === stage)!

            return (
              <div
                key={project.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-[0.65rem] text-muted-foreground">{project.description}</p>
                </div>

                {/* Stage pills */}
                <div className="flex items-center gap-1 shrink-0">
                  {STAGES.filter(s => s.id !== 'lost').map((s) => {
                    const isActive = s.id === stage
                    const isPast = STAGES.findIndex(x => x.id === s.id) < STAGES.findIndex(x => x.id === stage)
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleStageClick(project.id, s.id)}
                        className={`rounded px-1.5 py-0.5 text-[0.6rem] font-medium transition-colors ${
                          isActive
                            ? `${s.color} bg-current/10 ring-1 ring-current`
                            : isPast
                            ? 'text-primary/50 bg-primary/5'
                            : 'text-muted-foreground/40 hover:text-muted-foreground'
                        }`}
                        title={s.label}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => handleStageClick(project.id, 'lost')}
                    className={`rounded px-1.5 py-0.5 text-[0.6rem] font-medium transition-colors ${
                      stage === 'lost' ? 'text-red-500 bg-red-500/10 ring-1 ring-red-500' : 'text-muted-foreground/30 hover:text-red-400'
                    }`}
                    title="Lost"
                  >
                    ✗
                  </button>
                </div>

                {/* Editable price */}
                {editingPrice === project.id ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); handlePriceSave(project.id) }}
                    className="shrink-0"
                  >
                    <input
                      type="text"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      onBlur={() => handlePriceSave(project.id)}
                      placeholder="Free, $4K, etc"
                      autoFocus
                      className="w-20 rounded border border-border bg-muted px-1.5 py-0.5 text-[0.65rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setEditingPrice(project.id)
                      setPriceInput(price)
                    }}
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.65rem] transition-colors hover:bg-muted ${
                      price ? (price.toLowerCase() === 'free' ? 'text-green-500' : 'text-muted-foreground') : 'text-muted-foreground/40 italic'
                    }`}
                    title="Click to set price"
                  >
                    {price || 'set price'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
