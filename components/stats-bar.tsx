'use client'

import { useEffect, useState } from 'react'
import { FolderGit2, Target, CircleDollarSign, Flag, Timer, Users, Flame } from 'lucide-react'
import { SPRINT_START, SPRINT_LENGTH_DAYS, stats } from '@/lib/portfolio-data'

function getDaysRemaining() {
  const end = new Date(SPRINT_START)
  end.setDate(end.getDate() + SPRINT_LENGTH_DAYS)
  const diffMs = end.getTime() - Date.now()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, Math.min(SPRINT_LENGTH_DAYS, days))
}

type Stat = {
  label: string
  value: string
  icon: typeof Target
  accent?: boolean
}

export function StatsBar() {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)

  useEffect(() => {
    setDaysRemaining(getDaysRemaining())
    const interval = setInterval(() => setDaysRemaining(getDaysRemaining()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const items: Stat[] = [
    { label: 'Total projects', value: String(stats.totalProjects), icon: FolderGit2 },
    { label: 'In focus', value: String(stats.focus), icon: Target },
    { label: 'Revenue-ready', value: String(stats.revenueReady), icon: CircleDollarSign },
    { label: 'Active clients', value: String(stats.activeClients), icon: Users },
    { label: 'Warm leads', value: String(stats.warmLeads), icon: Flame },
    {
      label: '90-day target',
      value: `$${stats.target.toLocaleString()}`,
      icon: Flag,
      accent: true,
    },
    {
      label: 'Days remaining',
      value: daysRemaining === null ? '—' : String(daysRemaining),
      icon: Timer,
      accent: true,
    },
  ]

  return (
    <section aria-label="Portfolio overview" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${
                item.accent ? 'text-primary' : 'text-foreground'
              }`}
            >
              {item.value}
            </div>
          </div>
        )
      })}
    </section>
  )
}
