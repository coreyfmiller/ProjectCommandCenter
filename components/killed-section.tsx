import { Trash2, GitMerge } from 'lucide-react'
import type { KilledProject } from '@/lib/portfolio-data'

export function KilledSection({ projects }: { projects: KilledProject[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const Icon = project.action === 'kill' ? Trash2 : GitMerge
        return (
          <div
            key={project.id}
            className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/30 p-3 opacity-60"
          >
            <Icon
              className={`mt-0.5 size-4 shrink-0 ${
                project.action === 'kill' ? 'text-destructive/70' : 'text-warning/70'
              }`}
              aria-hidden="true"
            />
            <div>
              <span className="text-sm font-medium text-foreground">{project.name}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">{project.reason}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
