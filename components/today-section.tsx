'use client'

import { useState, useEffect } from 'react'
import { Check, Circle } from 'lucide-react'

const STORAGE_KEY = 'cc_today_tasks'

interface TodayTask {
  id: string
  text: string
}

const DEFAULT_TASKS: TodayTask[] = [
  { id: 'today-1', text: 'Add Supabase auth to Command Center (persist data across devices)' },
  { id: 'today-2', text: 'Test MarketMojo Stripe checkout with test card (4242...)' },
  { id: 'today-3', text: 'Finish 8 demo sites on v0.dev — paste URLs to Kiro for deploy' },
  { id: 'today-4', text: 'Optimize FundyLaunch OG image (1200×630 via squoosh.app)' },
]

function getCompleted(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveCompleted(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function TodaySection() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCompleted(getCompleted())
  }, [])

  const toggle = (id: string) => {
    const updated = new Set(completed)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setCompleted(updated)
    saveCompleted(updated)
  }

  const doneCount = DEFAULT_TASKS.filter(t => completed.has(t.id)).length

  return (
    <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Today&apos;s Focus</h3>
        <span className="font-mono text-xs text-primary">{doneCount}/{DEFAULT_TASKS.length}</span>
      </div>
      <ul className="space-y-2">
        {DEFAULT_TASKS.map((task) => {
          const isDone = completed.has(task.id)
          return (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => toggle(task.id)}
                className="flex items-start gap-3 text-left w-full group"
              >
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    isDone
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/50 group-hover:border-primary/60'
                  }`}
                >
                  {isDone && <Check className="size-3" />}
                </span>
                <span className={`text-sm leading-relaxed ${isDone ? 'text-muted-foreground/50 line-through' : 'text-foreground'}`}>
                  {task.text}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
