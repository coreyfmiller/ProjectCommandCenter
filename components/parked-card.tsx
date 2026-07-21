import { Ban, Bookmark } from 'lucide-react'
import type { ParkedProject } from '@/lib/portfolio-data'

export function ParkedCard({ project }: { project: ParkedProject }) {
  const Icon = project.isNote ? Bookmark : Ban
  return (
    <article className="flex flex-col rounded-xl border border-border/60 bg-card/40 p-4 opacity-80 transition-opacity hover:opacity-100">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
        <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          {project.status}
        </span>
      </header>
      <p className="mt-1 text-xs text-muted-foreground">{project.description}</p>
      <div
        className={`mt-3 flex items-start gap-1.5 text-xs ${
          project.isNote ? 'text-secondary-foreground' : 'text-muted-foreground'
        }`}
      >
        <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>{project.block}</span>
      </div>
    </article>
  )
}
