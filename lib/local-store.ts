"use client"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RevenueEntry {
  id: string
  date: string
  source: string // 'duelly' | 'marketmojo' | 'fundylaunch' | 'other'
  description: string
  amount: number
}

export type ProspectStage = 'cold' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost'

export interface ProspectStatus {
  id: string
  stage: ProspectStage
  value?: number
  notes?: string
}

export interface WeeklyNote {
  week: number
  shipped: string
  blockers: string
  updatedAt: string
}

// ─── Storage Keys ───────────────────────────────────────────────────────────

const KEYS = {
  completedTasks: 'cc_completed_tasks',
  revenue: 'cc_revenue_entries',
  seedlingsRevenue: 'cc_seedlings_revenue',
  pipeline: 'cc_pipeline',
  weeklyNotes: 'cc_weekly_notes',
} as const

// ─── Task Checkboxes ────────────────────────────────────────────────────────

export function getCompletedTasks(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  const raw = localStorage.getItem(KEYS.completedTasks)
  if (!raw) return new Set()
  return new Set(JSON.parse(raw))
}

export function toggleTask(taskId: string): Set<string> {
  const tasks = getCompletedTasks()
  if (tasks.has(taskId)) {
    tasks.delete(taskId)
  } else {
    tasks.add(taskId)
  }
  localStorage.setItem(KEYS.completedTasks, JSON.stringify([...tasks]))
  return tasks
}

// ─── Revenue Tracker ────────────────────────────────────────────────────────

export function getRevenueEntries(): RevenueEntry[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.revenue)
  if (!raw) return []
  return JSON.parse(raw)
}

export function addRevenueEntry(entry: Omit<RevenueEntry, 'id'>): RevenueEntry[] {
  const entries = getRevenueEntries()
  const newEntry: RevenueEntry = { ...entry, id: `rev-${Date.now()}` }
  entries.unshift(newEntry)
  localStorage.setItem(KEYS.revenue, JSON.stringify(entries))
  return entries
}

export function removeRevenueEntry(id: string): RevenueEntry[] {
  const entries = getRevenueEntries().filter(e => e.id !== id)
  localStorage.setItem(KEYS.revenue, JSON.stringify(entries))
  return entries
}

export function getTotalRevenue(): number {
  return getRevenueEntries().reduce((sum, e) => sum + e.amount, 0)
}

// ─── Pipeline ───────────────────────────────────────────────────────────────

export function getPipelineStatuses(): Record<string, ProspectStatus> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(KEYS.pipeline)
  if (!raw) return {}
  return JSON.parse(raw)
}

export function updateProspectStage(id: string, stage: ProspectStage, value?: number): Record<string, ProspectStatus> {
  const statuses = getPipelineStatuses()
  statuses[id] = { id, stage, value: value ?? statuses[id]?.value }
  localStorage.setItem(KEYS.pipeline, JSON.stringify(statuses))
  return statuses
}

// ─── Weekly Notes ───────────────────────────────────────────────────────────

export function getWeeklyNotes(): WeeklyNote[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.weeklyNotes)
  if (!raw) return []
  return JSON.parse(raw)
}

export function saveWeeklyNote(note: WeeklyNote): WeeklyNote[] {
  const notes = getWeeklyNotes()
  const idx = notes.findIndex(n => n.week === note.week)
  if (idx >= 0) {
    notes[idx] = note
  } else {
    notes.unshift(note)
  }
  localStorage.setItem(KEYS.weeklyNotes, JSON.stringify(notes))
  return notes
}


// ─── Seedlings Revenue (separate from FundyLogic) ───────────────────────────

export function getSeedlingsRevenue(): RevenueEntry[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.seedlingsRevenue)
  if (!raw) return []
  return JSON.parse(raw)
}

export function addSeedlingsRevenue(entry: Omit<RevenueEntry, 'id'>): RevenueEntry[] {
  const entries = getSeedlingsRevenue()
  const newEntry: RevenueEntry = { ...entry, id: `seed-${Date.now()}` }
  entries.unshift(newEntry)
  localStorage.setItem(KEYS.seedlingsRevenue, JSON.stringify(entries))
  return entries
}

export function removeSeedlingsRevenue(id: string): RevenueEntry[] {
  const entries = getSeedlingsRevenue().filter(e => e.id !== id)
  localStorage.setItem(KEYS.seedlingsRevenue, JSON.stringify(entries))
  return entries
}
