'use client'

import { useState } from 'react'
import { Check, ArrowRight, Coins, Code2, Users, Clock, ChevronDown, ChevronUp, DollarSign, Globe } from 'lucide-react'
import type { FocusProject, FocusStatus } from '@/lib/portfolio-data'

const statusStyles: Record<FocusStatus, string> = {
  live: 'border-success/40 bg-success/15 text-success',
  almost: 'border-warning/40 bg-warning/15 text-warning',
  shipped: 'border-info/40 bg-info/15 text-info',
}

const dotStyles: Record<FocusStatus, string> = {
  live: 'bg-success',
  almost: 'bg-warning',
  shipped: 'bg-info',
}

export function FocusCard({ project }: { project: FocusProject }) {
  const [done, setDone] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      {/* accent glow line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />

      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground text-pretty leading-relaxed">{project.description}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[project.status]}`}
        >
          <span className={`size-1.5 rounded-full ${dotStyles[project.status]}`} aria-hidden="true" />
          {project.statusLabel}
        </span>
      </header>

      {/* Metadata row */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-1 text-[0.65rem] font-medium text-secondary-foreground">
          <Coins className="size-3" aria-hidden="true" />
          {project.monetization}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-[0.65rem] font-medium text-muted-foreground">
          <Users className="size-3" aria-hidden="true" />
          {project.buyer.split(',')[0]}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-[0.65rem] font-medium text-muted-foreground">
          <Clock className="size-3" aria-hidden="true" />
          {project.effortToFirstDollar}
        </span>
        {project.deployed && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-[0.65rem] font-medium text-success">
            <Globe className="size-3" aria-hidden="true" />
            Deployed
          </span>
        )}
      </div>

      {/* Next action with checkbox */}
      <button
        type="button"
        onClick={() => setDone((d) => !d)}
        aria-pressed={done}
        className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3 text-left transition-colors hover:border-primary/40"
      >
        <span
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
            done ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/50 bg-transparent'
          }`}
        >
          {done && <Check className="size-3.5" aria-hidden="true" />}
        </span>
        <span>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-primary">Next action</span>
          <span
            className={`mt-0.5 block text-sm ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
          >
            {project.nextAction}
          </span>
        </span>
      </button>

      {/* Revenue target */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Revenue target
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-primary">{project.revenueTarget}</div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          Details
          {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 space-y-3 border-t border-border pt-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          {/* Tech stack */}
          <div>
            <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              <Code2 className="size-3" /> Tech Stack
            </div>
            <div className="flex flex-wrap gap-1">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[0.6rem] text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing tiers */}
          {project.pricing && (
            <div>
              <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                <DollarSign className="size-3" /> Pricing
              </div>
              <div className="space-y-1">
                {project.pricing.map((tier) => (
                  <div key={tier.name} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{tier.name}</span>
                    <span className="font-mono text-primary">{tier.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && (
            <div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Key Features ({project.features.length})
              </div>
              <ul className="space-y-0.5 max-h-32 overflow-y-auto">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-1.5 text-[0.65rem] text-muted-foreground">
                    <span className="mt-1 size-1 shrink-0 rounded-full bg-primary/50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
