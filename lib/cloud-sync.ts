"use client"

// ─── Cloud Sync Layer ───────────────────────────────────────────────────────
// Syncs localStorage state to Vercel Blob via /api/state
// Falls back to localStorage if cloud is unavailable

const SYNC_DEBOUNCE_MS = 2000
let syncTimer: ReturnType<typeof setTimeout> | null = null

interface CloudState {
  completedTasks: string[]
  revenue: any[]
  seedlingsRevenue: any[]
  pipeline: Record<string, any>
  todayTasks: string[]
}

// All localStorage keys we want to persist
const LOCAL_KEYS = {
  completedTasks: 'cc_completed_tasks',
  revenue: 'cc_revenue_entries',
  seedlingsRevenue: 'cc_seedlings_revenue',
  pipeline: 'cc_pipeline',
  todayTasks: 'cc_today_tasks',
}

function gatherLocalState(): CloudState {
  const get = (key: string) => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : key === 'cc_pipeline' ? {} : []
    } catch { return key === 'cc_pipeline' ? {} : [] }
  }

  return {
    completedTasks: get(LOCAL_KEYS.completedTasks),
    revenue: get(LOCAL_KEYS.revenue),
    seedlingsRevenue: get(LOCAL_KEYS.seedlingsRevenue),
    pipeline: get(LOCAL_KEYS.pipeline),
    todayTasks: get(LOCAL_KEYS.todayTasks),
  }
}

function applyCloudState(state: CloudState) {
  if (state.completedTasks) localStorage.setItem(LOCAL_KEYS.completedTasks, JSON.stringify(state.completedTasks))
  if (state.revenue) localStorage.setItem(LOCAL_KEYS.revenue, JSON.stringify(state.revenue))
  if (state.seedlingsRevenue) localStorage.setItem(LOCAL_KEYS.seedlingsRevenue, JSON.stringify(state.seedlingsRevenue))
  if (state.pipeline) localStorage.setItem(LOCAL_KEYS.pipeline, JSON.stringify(state.pipeline))
  if (state.todayTasks) localStorage.setItem(LOCAL_KEYS.todayTasks, JSON.stringify(state.todayTasks))
}

/**
 * Load state from cloud. If cloud has data, apply it to localStorage.
 * If cloud is empty, push localStorage to cloud.
 */
export async function loadFromCloud(): Promise<boolean> {
  try {
    const res = await fetch('/api/state')
    if (!res.ok) return false
    
    const cloudState = await res.json() as CloudState
    
    // If cloud has data, use it
    if (cloudState.completedTasks && cloudState.completedTasks.length > 0) {
      applyCloudState(cloudState)
      return true
    }
    
    // If cloud is empty but local has data, push local to cloud
    const localState = gatherLocalState()
    if (localState.completedTasks.length > 0 || localState.revenue.length > 0) {
      await saveToCloud()
    }
    
    return true
  } catch {
    // Cloud unavailable, localStorage works as fallback
    return false
  }
}

/**
 * Save current localStorage state to cloud. Debounced.
 */
export function saveToCloud() {
  if (syncTimer) clearTimeout(syncTimer)
  
  syncTimer = setTimeout(async () => {
    try {
      const state = gatherLocalState()
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
    } catch {
      // Silently fail — localStorage is the source of truth
    }
  }, SYNC_DEBOUNCE_MS)
}

/**
 * Force immediate sync (no debounce)
 */
export async function forceSyncToCloud() {
  try {
    const state = gatherLocalState()
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    })
  } catch {}
}
