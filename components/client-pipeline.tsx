import { CircleCheck, Clock, CircleDot } from 'lucide-react'
import type { ClientProject } from '@/lib/portfolio-data'

const statusConfig = {
  active: { label: 'Active', icon: CircleCheck, color: 'text-success border-success/40 bg-success/15' },
  delivered: { label: 'Delivered', icon: CircleDot, color: 'text-info border-info/40 bg-info/15' },
  prospect: { label: 'Prospect', icon: Clock, color: 'text-warning border-warning/40 bg-warning/15' },
}

export function ClientPipeline({ projects }: { projects: ClientProject[] }) {
  const active = projects.filter((p) => p.status === 'active')
  const prospects = projects.filter((p) => p.status === 'prospect')

  return (
    <div className="space-y-6">
      {/* Active clients */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-success">
          Active Clients ({active.length})
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((project) => {
            const config = statusConfig[project.status]
            const Icon = config.icon
            return (
              <div
                key={project.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3"
              >
                <Icon className="size-4 shrink-0 text-success" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Prospects */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-warning">
          Warm Prospects ({prospects.length}) — Use MarketMojo to scan & pitch
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {prospects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-2.5"
            >
              <Clock className="size-3.5 shrink-0 text-warning/70" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-foreground">{project.name}</p>
                <p className="text-[0.65rem] text-muted-foreground">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
