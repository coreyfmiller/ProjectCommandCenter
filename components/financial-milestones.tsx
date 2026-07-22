'use client'

import { useEffect, useState } from 'react'
import { Flag, Wrench, Car, Home, TrendingUp } from 'lucide-react'
import { getRevenueEntries } from '@/lib/local-store'

const milestones = [
  {
    id: 'floor',
    target: 1500,
    label: 'Garage Floor Fix',
    description: 'DIY the 16×8 floor section. Gut the garage. Minimum viable workspace.',
    icon: Wrench,
    color: 'text-yellow-500',
  },
  {
    id: 'workshop',
    target: 10000,
    label: 'Full Workshop',
    description: 'Insulate, refinish upstairs, electrical, heated year-round office/workshop.',
    icon: Wrench,
    color: 'text-orange-500',
  },
  {
    id: 'carport',
    target: 30000,
    label: 'Carport',
    description: '20×24 carport on driveway side. Parks 2 cars under cover. Not urgent — after workshop.',
    icon: Car,
    color: 'text-blue-500',
  },
  {
    id: 'rental',
    target: 150000,
    label: 'Accessory Dwelling',
    description: '1-bedroom rental unit on property. Ties into existing well. ~$1,500+/mo passive income. Look into NB grants + CMHC financing.',
    icon: Home,
    color: 'text-green-500',
  },
]

export function FinancialMilestones() {
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const entries = getRevenueEntries()
    setTotalRevenue(entries.reduce((sum, e) => sum + e.amount, 0))
  }, [])

  // Find current milestone (first one not yet reached)
  const currentIdx = milestones.findIndex(m => totalRevenue < m.target)
  const currentMilestone = currentIdx >= 0 ? milestones[currentIdx] : milestones[milestones.length - 1]

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="size-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Financial Milestones</h3>
        <span className="ml-auto text-xs text-muted-foreground">Business profits → real assets</span>
      </div>

      {/* Progress bar spanning all milestones */}
      <div className="relative mb-6">
        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-green-500 transition-all duration-700"
            style={{ width: `${Math.min((totalRevenue / milestones[milestones.length - 1].target) * 100, 100)}%` }}
          />
        </div>
        {/* Milestone markers */}
        <div className="absolute inset-x-0 top-0 h-2 flex items-center">
          {milestones.map((m, i) => {
            const position = (m.target / milestones[milestones.length - 1].target) * 100
            const reached = totalRevenue >= m.target
            return (
              <div
                key={m.id}
                className="absolute -top-0.5"
                style={{ left: `${Math.min(position, 99)}%` }}
              >
                <div className={`size-3 rounded-full border-2 ${reached ? 'bg-primary border-primary' : 'bg-background border-border'}`} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Milestone list */}
      <div className="space-y-3">
        {milestones.map((m, i) => {
          const reached = totalRevenue >= m.target
          const isCurrent = i === currentIdx
          const Icon = m.icon
          const progress = Math.min((totalRevenue / m.target) * 100, 100)

          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
                isCurrent ? 'border border-primary/30 bg-primary/5' :
                reached ? 'opacity-50' : ''
              }`}
            >
              <Icon className={`size-4 mt-0.5 shrink-0 ${reached ? 'text-primary' : m.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-medium ${reached ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {m.label}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground shrink-0">
                    ${m.target.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                {isCurrent && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[0.6rem] font-mono text-primary">{Math.round(progress)}%</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Current position callout */}
      <div className="mt-4 rounded-lg bg-background/50 border border-border p-3 text-center">
        <span className="text-xs text-muted-foreground">
          Total earned: <span className="font-mono font-semibold text-primary">${totalRevenue.toLocaleString()}</span>
          {currentIdx >= 0 && (
            <> · <span className="font-mono">${(currentMilestone.target - totalRevenue).toLocaleString()}</span> to {currentMilestone.label}</>
          )}
        </span>
      </div>
    </div>
  )
}
