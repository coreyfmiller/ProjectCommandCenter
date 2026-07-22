'use client'

import { useState, useEffect } from 'react'
import { Check, Plus, Trash2, Pencil, Sparkles } from 'lucide-react'
import { getCompletedTasks } from '@/lib/local-store'
import { focusProjects } from '@/lib/portfolio-data'

const STORAGE_KEY = 'cc_today_tasks'

interface TodayTask {
  id: string
  text: string
  source?: string // which project it came from
}

function loadTasks(): TodayTask[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveTasks(tasks: TodayTask[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function loadCompleted(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem('cc_today_completed')
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveCompleted(set: Set<string>) {
  localStorage.setItem('cc_today_completed', JSON.stringify([...set]))
}

// Auto-advance: find the next unchecked tasks across focus projects
function getNextTasks(completedGlobal: Set<string>, count: number): TodayTask[] {
  const suggestions: TodayTask[] = []
  
  for (const project of focusProjects) {
    if (!project.tasks) continue
    for (let i = 0; i < project.tasks.length; i++) {
      const taskId = `focus-${project.id}-${i}`
      if (!completedGlobal.has(taskId)) {
        suggestions.push({
          id: `suggest-${project.id}-${i}`,
          text: project.tasks[i],
          source: project.name,
        })
        break // only one per project
      }
    }
  }
  
  return suggestions.slice(0, count)
}

export function TodaySection() {
  const [tasks, setTasks] = useState<TodayTask[]>([])
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [newTask, setNewTask] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [suggestions, setSuggestions] = useState<TodayTask[]>([])

  useEffect(() => {
    const loaded = loadTasks()
    setCompleted(loadCompleted())
    const globalCompleted = getCompletedTasks()
    const nextTasks = getNextTasks(globalCompleted, 4)
    setSuggestions(nextTasks)
    
    // If no custom tasks set, use suggestions
    if (loaded.length === 0) {
      setTasks(nextTasks)
      saveTasks(nextTasks)
    } else {
      setTasks(loaded)
    }
  }, [])

  const toggleTask = (id: string) => {
    const updated = new Set(completed)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setCompleted(updated)
    saveCompleted(updated)
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const task: TodayTask = { id: `custom-${Date.now()}`, text: newTask.trim() }
    const updated = [...tasks, task]
    setTasks(updated)
    saveTasks(updated)
    setNewTask('')
  }

  const removeTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    saveTasks(updated)
  }

  const resetToSuggestions = () => {
    setTasks(suggestions)
    saveTasks(suggestions)
    setCompleted(new Set())
    saveCompleted(new Set())
  }

  const doneCount = tasks.filter(t => completed.has(t.id)).length
  const allDone = tasks.length > 0 && doneCount === tasks.length

  return (
    <div className={`rounded-xl border-2 p-5 transition-colors ${allDone ? 'border-green-500/40 bg-green-500/5' : 'border-primary/40 bg-primary/5'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            {allDone ? '✓ All Done Today' : "Today's Focus"}
          </h3>
          {allDone && <Sparkles className="size-4 text-green-500" />}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-primary">{doneCount}/{tasks.length}</span>
          <button
            type="button"
            onClick={() => setIsEditing(e => !e)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit tasks"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={resetToSuggestions}
            className="text-[0.65rem] text-muted-foreground hover:text-primary transition-colors"
            title="Reset to auto-suggested tasks"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Task list */}
      <ul className="space-y-2">
        {tasks.map((task) => {
          const isDone = completed.has(task.id)
          return (
            <li key={task.id} className="flex items-start gap-3 group">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors"
                style={{
                  borderColor: isDone ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  backgroundColor: isDone ? 'var(--color-primary)' : 'transparent',
                  color: isDone ? 'var(--color-primary-foreground)' : 'transparent',
                }}
              >
                {isDone && <Check className="size-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-sm leading-relaxed ${isDone ? 'text-muted-foreground/50 line-through' : 'text-foreground'}`}>
                  {task.text}
                </span>
                {task.source && (
                  <span className="ml-2 text-[0.6rem] text-muted-foreground/50">{task.source}</span>
                )}
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-400 transition-all"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {/* Add task input */}
      {isEditing && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a task for today..."
            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={addTask}
            disabled={!newTask.trim()}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Plus className="size-4" />
          </button>
        </div>
      )}

      {/* All done message */}
      {allDone && (
        <p className="mt-3 text-xs text-green-500/80 text-center italic">
          Everything checked off. Nice work. Open Kiro and ask "what's next?"
        </p>
      )}
    </div>
  )
}
