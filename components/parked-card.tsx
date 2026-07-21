'use client'

import { useState } from 'react'
import { Ban, Bookmark, ChevronDown, ChevronUp, Code2, Clock, Users } from 'lucide-react'
import type { ParkedProject } from '@/lib/portfolio-data'

export function ParkedCard({ project }: { project: ParkedProject }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = project.isNote ? Bookmark : Ban

  return (
    <article className="flex flex-col rounded-xl border border-border/60 bg-card/40 p-4 opacity-80 transition-opacity hover:opacity-100">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
        <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
          {project.status}
        </span>
      </header>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{project.description}</p>

      {/* Block reason */}
      <div
        className={`mt-3 flex items-start gap-1.5 text-xs ${
          project.isNote ? 'text-secondary-foreground' : 'text-muted-foreground'
        }`}
      >
        <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>{project.block}</span>
      </div>

      {/* Quick metadata */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/40 px-1.5 py-0.5 text-[0.6rem] text-muted-foreground">
          <Clock className="size-2.5" />
          {project.effortToFirstDollar}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/40 px-1.5 py-0.5 text-[0.6rem] text-muted-foreground">
          <Users className="size-2.5" />
          {project.buyer.split(',')[0].split('(')[0].trim()}
        </span>
      </div>

      {/* Expand toggle */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 flex items-center gap-1 self-start text-[0.65rem] text-muted-foreground hover:text-primary transition-colors"
      >
        {expanded ? 'Less' : 'More'}
        {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 border-t border-border/40 pt-2 animate-in fade-in-0 duration-150">
          {/* Tech stack */}
          <div>
            <div className="flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              <Code2 className="size-2.5" /> Stack
            </div>
            <div className="flex flex-wrap gap-1">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded bg-muted/50 px-1 py-0.5 text-[0.55rem] text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          {project.features && (
            <div>
              <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Features ({project.features.length})
              </div>
              <ul className="space-y-0.5 max-h-24 overflow-y-auto">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-1 text-[0.6rem] text-muted-foreground">
                    <span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground/30" />
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
