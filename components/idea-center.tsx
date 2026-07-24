"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Plus, Trash2, ChevronDown, ChevronUp, Star } from "lucide-react"

interface Idea {
  id: string
  title: string
  description: string
  verdict: "build" | "park" | "kill" | "explore"
  reasoning: string
  effort: "low" | "medium" | "high"
  revenue: "recurring" | "one-time" | "none" | "unknown"
  fitsStack: boolean
  createdAt: string
}

const VERDICT_CONFIG = {
  build: { label: "Build", color: "text-green-500 bg-green-500/10 ring-green-500/30" },
  park: { label: "Park", color: "text-yellow-500 bg-yellow-500/10 ring-yellow-500/30" },
  kill: { label: "Kill", color: "text-red-500 bg-red-500/10 ring-red-500/30" },
  explore: { label: "Explore", color: "text-blue-500 bg-blue-500/10 ring-blue-500/30" },
}

const STORAGE_KEY = "cc_ideas"

function getIdeas(): Idea[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  return JSON.parse(raw)
}

function saveIdeas(ideas: Idea[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
}

export function IdeaCenter() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [verdict, setVerdict] = useState<Idea["verdict"]>("park")
  const [reasoning, setReasoning] = useState("")
  const [effort, setEffort] = useState<Idea["effort"]>("medium")
  const [revenue, setRevenue] = useState<Idea["revenue"]>("unknown")
  const [fitsStack, setFitsStack] = useState(false)

  useEffect(() => {
    setIdeas(getIdeas())
  }, [])

  const handleAdd = () => {
    if (!title.trim()) return
    const newIdea: Idea = {
      id: `idea-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      verdict,
      reasoning: reasoning.trim(),
      effort,
      revenue,
      fitsStack,
      createdAt: new Date().toISOString(),
    }
    const updated = [newIdea, ...ideas]
    setIdeas(updated)
    saveIdeas(updated)
    setTitle("")
    setDescription("")
    setVerdict("park")
    setReasoning("")
    setEffort("medium")
    setRevenue("unknown")
    setFitsStack(false)
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = ideas.filter((i) => i.id !== id)
    setIdeas(updated)
    saveIdeas(updated)
  }

  const handleVerdictChange = (id: string, newVerdict: Idea["verdict"]) => {
    const updated = ideas.map((i) => (i.id === id ? { ...i, verdict: newVerdict } : i))
    setIdeas(updated)
    saveIdeas(updated)
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {ideas.length} idea{ideas.length !== 1 ? "s" : ""} logged
          {ideas.filter((i) => i.verdict === "build").length > 0 && (
            <span className="text-green-500 ml-2">• {ideas.filter((i) => i.verdict === "build").length} ready to build</span>
          )}
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="size-3.5" />
          Add Idea
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
          <input
            type="text"
            placeholder="Idea title (e.g. 'Canadian Finance Dashboard')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <textarea
            placeholder="What is it? Who's it for? Why does it interest you?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <textarea
            placeholder="Quick take / reasoning (why build, park, or kill?)"
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Verdict</label>
              <select value={verdict} onChange={(e) => setVerdict(e.target.value as Idea["verdict"])} className="mt-0.5 w-full rounded border border-border bg-muted px-2 py-1.5 text-xs text-foreground">
                <option value="explore">Explore</option>
                <option value="build">Build</option>
                <option value="park">Park</option>
                <option value="kill">Kill</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Effort</label>
              <select value={effort} onChange={(e) => setEffort(e.target.value as Idea["effort"])} className="mt-0.5 w-full rounded border border-border bg-muted px-2 py-1.5 text-xs text-foreground">
                <option value="low">Low (1 day)</option>
                <option value="medium">Medium (1 week)</option>
                <option value="high">High (weeks+)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Revenue</label>
              <select value={revenue} onChange={(e) => setRevenue(e.target.value as Idea["revenue"])} className="mt-0.5 w-full rounded border border-border bg-muted px-2 py-1.5 text-xs text-foreground">
                <option value="unknown">Unknown</option>
                <option value="recurring">Recurring</option>
                <option value="one-time">One-time</option>
                <option value="none">None / free</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Fits stack?</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input type="checkbox" checked={fitsStack} onChange={(e) => setFitsStack(e.target.checked)} className="rounded border-border" />
                <span className="text-xs text-muted-foreground">{fitsStack ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Save Idea
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ideas list */}
      {ideas.length > 0 && (
        <div className="space-y-2">
          {ideas.map((idea) => {
            const config = VERDICT_CONFIG[idea.verdict]
            const isExpanded = expandedId === idea.id
            return (
              <div key={idea.id} className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-foreground">{idea.title}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[0.6rem] font-medium ring-1 ${config.color}`}>
                        {config.label}
                      </span>
                      {idea.fitsStack && (
                        <span className="flex items-center gap-0.5 text-[0.6rem] text-primary">
                          <Star className="size-2.5" /> Fits stack
                        </span>
                      )}
                      <span className="text-[0.6rem] text-muted-foreground">
                        {idea.effort} effort • {idea.revenue} revenue
                      </span>
                    </div>
                    {idea.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{idea.description}</p>
                    )}
                    {isExpanded && idea.reasoning && (
                      <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-primary/30 pl-2">{idea.reasoning}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {(["build", "explore", "park", "kill"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => handleVerdictChange(idea.id, v)}
                        className={`rounded px-1.5 py-0.5 text-[0.55rem] font-medium transition-colors ${
                          idea.verdict === v ? VERDICT_CONFIG[v].color + " ring-1" : "text-muted-foreground/40 hover:text-muted-foreground"
                        }`}
                      >
                        {VERDICT_CONFIG[v].label}
                      </button>
                    ))}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="p-1 text-muted-foreground/40 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {ideas.length === 0 && !showForm && (
        <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-6 text-center">
          <Lightbulb className="size-5 text-muted-foreground/50 mx-auto" />
          <p className="mt-2 text-xs text-muted-foreground">No ideas logged yet. Hit "Add Idea" when inspiration strikes.</p>
        </div>
      )}
    </div>
  )
}
