'use client'

import { useEffect, useRef } from 'react'
import { loadFromCloud, saveToCloud } from '@/lib/cloud-sync'

/**
 * SyncProvider loads state from cloud on mount and 
 * watches for localStorage changes to sync back.
 */
export function SyncProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Load from cloud on mount
    loadFromCloud()

    // Listen for storage changes (from our own writes) and sync
    const originalSetItem = localStorage.setItem.bind(localStorage)
    localStorage.setItem = (key: string, value: string) => {
      originalSetItem(key, value)
      // Only sync keys that start with our prefix
      if (key.startsWith('cc_')) {
        saveToCloud()
      }
    }

    // Sync before page unload
    const handleBeforeUnload = () => {
      const state = JSON.parse(localStorage.getItem('cc_completed_tasks') || '[]')
      if (state.length > 0) {
        // Use sendBeacon for reliable sync on page close
        const body = JSON.stringify({
          completedTasks: JSON.parse(localStorage.getItem('cc_completed_tasks') || '[]'),
          revenue: JSON.parse(localStorage.getItem('cc_revenue_entries') || '[]'),
          seedlingsRevenue: JSON.parse(localStorage.getItem('cc_seedlings_revenue') || '[]'),
          pipeline: JSON.parse(localStorage.getItem('cc_pipeline') || '{}'),
          todayTasks: JSON.parse(localStorage.getItem('cc_today_tasks') || '[]'),
        })
        navigator.sendBeacon('/api/state', new Blob([body], { type: 'application/json' }))
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return <>{children}</>
}
