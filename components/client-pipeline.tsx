import { CircleCheck, Clock, DollarSign } from 'lucide-react'
import type { ClientProject } from '@/lib/portfolio-data'

export function ClientPipeline({ projects }: { projects: ClientProject[] }) {
  const active = projects.filter((p) => p.status === 'active')
  const prospects = projects.filter((p) => p.status === 'prospect')

  const prospectTotalLow = prospects.length * 3500
  const prospectTotalHigh = prospects.length * 5500

  return (
    <div className="space-y-6">
      {/* Active clients */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-success">
            Active Clients ({active.length})
          </h3>
          <span className="text-xs text-muted-foreground">
            Delivering now
          </span>
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

      {/* Prospects */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-warning">
            Warm Prospects ({prospects.length})
          </h3>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="size-3" />
            Pipeline value: ${prospectTotalLow.toLocaleString()}–${prospectTotalHigh.toLocaleString()}
          </span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground italic">
          Use MarketMojo to scan each one → generate PDF report → send cold outreach email
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {prospects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-2.5"
            >
              <Clock className="size-3.5 shrink-0 text-warning/70" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">{project.name}</p>
                <p className="text-[0.65rem] text-muted-foreground">{project.description}</p>
              </div>
              {project.value && (
                <span className="shrink-0 font-mono text-[0.6rem] text-warning/60">{project.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
