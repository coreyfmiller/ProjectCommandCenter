import { timelinePhases } from '@/lib/portfolio-data'
import { Circle } from 'lucide-react'

export function ExecutionTimeline() {
  return (
    <div className="relative">
      {/* connecting line */}
      <div
        className="absolute left-0 right-0 top-3 hidden h-px bg-border lg:block"
        aria-hidden="true"
      />
      <ol className="grid gap-4 lg:grid-cols-4">
        {timelinePhases.map((phase, index) => (
          <li key={phase.id} className="relative">
            <div className="flex items-center gap-3 lg:block">
              <span className="relative z-10 flex size-6 items-center justify-center rounded-full border border-primary/50 bg-background font-mono text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary lg:mt-3 lg:block">
                {phase.range}
              </span>
            </div>
            <div className="mt-3 rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground">{phase.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                {phase.detail}
              </p>
              {phase.tasks.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                  {phase.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Circle className="mt-0.5 size-2.5 shrink-0 text-primary/50" aria-hidden="true" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
