'use client'

import { useState } from 'react'
import { Check, ArrowRight, Coins } from 'lucide-react'
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
          <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{project.description}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[project.status]}`}
        >
          <span className={`size-1.5 rounded-full ${dotStyles[project.status]}`} aria-hidden="true" />
          {project.statusLabel}
        </span>
      </header>

      <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-secondary/60 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
        <Coins className="size-3.5" aria-hidden="true" />
        {project.monetization}
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
          <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-primary">Next action</span>
          <span
            className={`mt-0.5 block text-sm ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
          >
            {project.nextAction}
          </span>
        </span>
      </button>

      <footer className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Revenue target
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-foreground">{project.revenueTarget}</div>
        </div>
        <ArrowRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </footer>
    </article>
  )
}
