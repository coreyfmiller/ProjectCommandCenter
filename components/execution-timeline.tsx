'use client'

import { useState, useEffect } from 'react'
import { Check, Circle } from 'lucide-react'
import { timelinePhases } from '@/lib/portfolio-data'
import { getCompletedTasks, toggleTask } from '@/lib/local-store'

export function ExecutionTimeline() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCompleted(getCompletedTasks())
  }, [])

  const handleToggle = (taskId: string) => {
    const updated = toggleTask(taskId)
    setCompleted(new Set(updated))
  }

  return (
    <div className="relative">
      {/* connecting line */}
      <div
        className="absolute left-0 right-0 top-3 hidden h-px bg-border lg:block"
        aria-hidden="true"
      />
      <ol className="grid gap-4 lg:grid-cols-4">
        {timelinePhases.map((phase, index) => {
          const phaseTasks = phase.tasks.map((_, i) => `${phase.id}-task-${i}`)
          const doneCount = phaseTasks.filter(id => completed.has(id)).length
          const totalCount = phase.tasks.length
          const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

          return (
            <li key={phase.id} className="relative">
              <div className="flex items-center gap-3 lg:block">
                <span className="relative z-10 flex size-6 items-center justify-center rounded-full border border-primary/50 bg-background font-mono text-xs font-semibold text-primary">
                  {progress === 100 ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary lg:mt-3 lg:block">
                  {phase.range}
                </span>
              </div>
              <div className="mt-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{phase.label}</h3>
                  <span className="text-[0.65rem] font-mono text-muted-foreground">
                    {doneCount}/{totalCount}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1 w-full rounded-full bg-border mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground text-pretty mb-3">
                  {phase.detail}
                </p>
                {phase.tasks.length > 0 && (
                  <ul className="space-y-1.5 border-t border-border pt-3">
                    {phase.tasks.map((task, i) => {
                      const taskId = `${phase.id}-task-${i}`
                      const isDone = completed.has(taskId)
                      return (
                        <li key={taskId}>
                          <button
                            type="button"
                            onClick={() => handleToggle(taskId)}
                            className="flex items-start gap-2 text-left w-full group"
                          >
                            <span
                              className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                isDone
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/40 group-hover:border-primary/60'
                              }`}
                            >
                              {isDone && <Check className="size-2.5" />}
                            </span>
                            <span className={`text-xs leading-relaxed ${isDone ? 'text-muted-foreground/50 line-through' : 'text-muted-foreground group-hover:text-foreground'}`}>
                              {task}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
