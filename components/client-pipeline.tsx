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
  const [statuses, setStatuses] = useState<Record<string, { stage: ProspectStage; value?: number }>>({})

  useEffect(() => {
    setStatuses(getPipelineStatuses())
  }, [])

  const active = projects.filter((p) => p.status === 'active')
  const prospects = projects.filter((p) => p.status === 'prospect')

  const handleAdvance = (id: string, currentStage: ProspectStage) => {
    const currentIdx = STAGES.findIndex(s => s.id === currentStage)
    const nextStage = STAGES[Math.min(currentIdx + 1, STAGES.length - 2)] // skip 'lost'
    const updated = updateProspectStage(id, nextStage.id)
    setStatuses({ ...updated })
  }

  const handleStageClick = (id: string, stage: ProspectStage) => {
    const updated = updateProspectStage(id, stage)
    setStatuses({ ...updated })
  }

  const getProspectStage = (id: string): ProspectStage => {
    return statuses[id]?.stage || 'cold'
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
            Click stages to advance
          </span>
        </div>
        <div className="space-y-2">
          {prospects.map((project) => {
            const stage = getProspectStage(project.id)
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

                {project.value && (
                  <span className="shrink-0 font-mono text-[0.6rem] text-muted-foreground">{project.value}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
