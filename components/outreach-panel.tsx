"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  Globe,
  AlertTriangle,
  Share2,
  Mail,
  ChevronDown,
  ChevronUp,
  History,
  AlertCircle,
  Pencil,
} from "lucide-react"

interface Prospect {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  webPresence: "website" | "facebook-only" | "dead-site" | "none"
  siteStatus?: string
  foundEmails: string[]
  competitorContext?: string
  generatedEmail?: { subject: string; body: string }
}

interface HistoryEntry {
  id: string
  name: string
  email: string
  subject: string
  trade: string
  location: string
  sentAt: string
  status: "sent" | "failed"
}

const SENDER_OPTIONS = [
  { label: "Corey @ FundyLaunch", value: "hello@fundylaunch.com", name: "Corey at FundyLaunch" },
  { label: "Corey @ FundyLogic", value: "hello@fundylogic.com", name: "Corey at FundyLogic" },
]

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function OutreachPanel() {
  const [trade, setTrade] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [emails, setEmails] = useState<Record<string, string>>({})
  const [subjects, setSubjects] = useState<Record<string, string>>({})
  const [bodies, setBodies] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null)
  const [searchMeta, setSearchMeta] = useState<{ totalFound: number; needsHelp: number; withSite: number; competitionSummary?: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState("")
  const [senderEmail, setSenderEmail] = useState(SENDER_OPTIONS[0].value)

  useEffect(() => {
    fetch("/api/outreach/send")
      .then((r) => r.json())
      .then((data) => setHistory(data.history || []))
      .catch(() => {})
  }, [])

  const handleSearch = async () => {
    if (!trade.trim() || !location.trim()) return
    setLoading(true)
    setError("")
    setProspects([])
    setSelected(new Set())
    setEmails({})
    setSubjects({})
    setBodies({})
    setSendResult(null)
    setSearchMeta(null)

    try {
      const res = await fetch("/api/outreach/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade: trade.trim(), location: location.trim() }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        const foundProspects: Prospect[] = data.prospects || []
        setProspects(foundProspects)
        setSearchMeta({
          totalFound: data.totalFound,
          needsHelp: data.needsHelp,
          withSite: data.withSite,
          competitionSummary: data.competitionSummary,
        })
        // Auto-populate emails and email content
        const autoEmails: Record<string, string> = {}
        const autoSubjects: Record<string, string> = {}
        const autoBodies: Record<string, string> = {}
        const autoSelected = new Set<string>()
        foundProspects.forEach((p) => {
          if (p.foundEmails && p.foundEmails.length > 0) {
            autoEmails[p.id] = p.foundEmails[0]
            autoSelected.add(p.id)
          }
          if (p.generatedEmail) {
            autoSubjects[p.id] = p.generatedEmail.subject
            autoBodies[p.id] = p.generatedEmail.body
          }
        })
        setEmails(autoEmails)
        setSubjects(autoSubjects)
        setBodies(autoBodies)
        setSelected(autoSelected)
      }
    } catch {
      setError("Search failed. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const selectAll = () => {
    if (selected.size === prospects.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(prospects.map((p) => p.id)))
    }
  }

  // Validation: prospect is ready to send only if it has valid email + subject + body
  const isReadyToSend = (p: Prospect) => {
    return selected.has(p.id) && isValidEmail(emails[p.id] || "") && (subjects[p.id] || "").trim() && (bodies[p.id] || "").trim()
  }

  const readyToSend = prospects.filter(isReadyToSend).length
  const selectedMissingEmail = prospects.filter((p) => selected.has(p.id) && !isValidEmail(emails[p.id] || "")).length

  const handleSend = async () => {
    const toSend = prospects
      .filter(isReadyToSend)
      .map((p) => ({
        name: p.name,
        email: emails[p.id],
        subject: subjects[p.id],
        body: bodies[p.id],
        phone: p.phone,
        address: p.address,
        trade,
        location,
      }))

    if (toSend.length === 0) return

    setSending(true)
    try {
      const res = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospects: toSend, senderEmail }),
      })
      const data = await res.json()
      setSendResult({ sent: data.sent, failed: data.failed })

      // Refresh history
      const histRes = await fetch("/api/outreach/send")
      const histData = await histRes.json()
      setHistory(histData.history || [])
    } catch {
      setSendResult({ sent: 0, failed: toSend.length })
    } finally {
      setSending(false)
    }
  }

  const presenceIcon = (p: Prospect) => {
    switch (p.webPresence) {
      case "none":
        return <XCircle className="size-4 text-red-500" />
      case "facebook-only":
        return <Share2 className="size-4 text-blue-500" />
      case "dead-site":
        return <AlertTriangle className="size-4 text-yellow-500" />
      default:
        return <Globe className="size-4 text-green-500" />
    }
  }

  const presenceLabel = (p: Prospect) => {
    switch (p.webPresence) {
      case "none":
        return "No website"
      case "facebook-only":
        return "Facebook only"
      case "dead-site":
        return p.siteStatus || "Dead site"
      default:
        return "Has website"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="size-4 text-primary" />
          Find Prospects
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Trade (e.g. electricians, plumbers, roofers)"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            type="text"
            placeholder="Location (e.g. Quispamsis NB)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !trade.trim() || !location.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {loading ? "Searching..." : "Find Leads"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {searchMeta && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-muted-foreground">
              Found {searchMeta.totalFound} businesses • {searchMeta.withSite} have working sites (skipped) • <span className="text-primary font-medium">{searchMeta.needsHelp} need help</span>
            </p>
            {searchMeta.competitionSummary && (
              <p className="text-xs text-muted-foreground italic">{searchMeta.competitionSummary}</p>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {prospects.length > 0 && (
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Prospects ({prospects.length})
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="text-xs text-primary hover:underline"
              >
                {selected.size === prospects.length ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {prospects.map((p) => {
              const hasValidEmail = isValidEmail(emails[p.id] || "")
              const hasContent = (subjects[p.id] || "").trim() && (bodies[p.id] || "").trim()
              const isExpanded = expandedId === p.id
              const isEditing = editingId === p.id

              return (
                <div key={p.id} className={`rounded-lg border p-3 ${selected.has(p.id) && !hasValidEmail ? "border-yellow-500/50 bg-yellow-500/5" : "border-border bg-background"}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="mt-1 rounded border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-foreground">{p.name}</span>
                        <span className="flex items-center gap-1 text-xs">
                          {presenceIcon(p)}
                          <span className="text-muted-foreground">{presenceLabel(p)}</span>
                        </span>
                        {p.rating && (
                          <span className="text-xs text-muted-foreground">
                            ⭐ {p.rating} ({p.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.address}</p>
                      {p.phone && <p className="text-xs text-muted-foreground">{p.phone}</p>}

                      {/* Email input — always visible when selected */}
                      {selected.has(p.id) && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="email"
                              placeholder="Recipient email (required)"
                              value={emails[p.id] || ""}
                              onChange={(e) => setEmails((prev) => ({ ...prev, [p.id]: e.target.value }))}
                              className={`w-full rounded border px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 ${
                                emails[p.id] && !hasValidEmail ? "border-red-500 bg-red-500/5" : "border-border bg-muted"
                              }`}
                            />
                            {p.foundEmails && p.foundEmails.length > 0 && (
                              <span className="shrink-0 text-[10px] text-green-500 font-medium">Auto-found</span>
                            )}
                            {selected.has(p.id) && !hasValidEmail && (
                              <AlertCircle className="size-4 text-yellow-500 shrink-0" title="Need valid email to send" />
                            )}
                          </div>
                          {p.foundEmails && p.foundEmails.length > 1 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {p.foundEmails.slice(1).map((e) => (
                                <button
                                  key={e}
                                  onClick={() => setEmails((prev) => ({ ...prev, [p.id]: e }))}
                                  className="text-[10px] text-primary hover:underline"
                                >
                                  alt: {e}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Email preview / edit */}
                      {(subjects[p.id] || bodies[p.id]) && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : p.id)}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Mail className="size-3" />
                              {isExpanded ? "Hide" : "Preview"} email
                              {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                            </button>
                            <button
                              onClick={() => { setEditingId(isEditing ? null : p.id); setExpandedId(p.id) }}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="size-3" />
                              {isEditing ? "Done" : "Edit"}
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="mt-2 rounded border border-border bg-muted/50 p-3 text-xs space-y-2">
                              {isEditing ? (
                                <>
                                  <div>
                                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Subject</label>
                                    <input
                                      type="text"
                                      value={subjects[p.id] || ""}
                                      onChange={(e) => setSubjects((prev) => ({ ...prev, [p.id]: e.target.value }))}
                                      className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Body</label>
                                    <textarea
                                      value={bodies[p.id] || ""}
                                      onChange={(e) => setBodies((prev) => ({ ...prev, [p.id]: e.target.value }))}
                                      rows={6}
                                      className="mt-0.5 w-full rounded border border-border bg-background px-2 py-1.5 text-xs text-foreground resize-y focus:outline-none focus:ring-1 focus:ring-primary/40"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium text-foreground">Subject: {subjects[p.id]}</p>
                                  <p className="text-muted-foreground whitespace-pre-wrap">{bodies[p.id]}</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Send controls */}
          <div className="mt-4 border-t border-border pt-4 space-y-3">
            {/* Sender config */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-muted-foreground shrink-0">Send from:</label>
              <select
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="rounded border border-border bg-muted px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                {SENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label} ({opt.value})</option>
                ))}
              </select>
            </div>

            {/* Validation warnings */}
            {selectedMissingEmail > 0 && (
              <div className="flex items-center gap-2 text-xs text-yellow-600">
                <AlertCircle className="size-3.5" />
                {selectedMissingEmail} selected prospect{selectedMissingEmail > 1 ? "s" : ""} missing a valid email — won't be sent
              </div>
            )}

            {/* Send button */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {readyToSend} ready to send (valid email + message)
              </p>
              <button
                onClick={handleSend}
                disabled={sending || readyToSend === 0}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {sending ? "Sending..." : `Send ${readyToSend} Email${readyToSend !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>

          {sendResult && (
            <div className="mt-3 rounded-lg border border-border bg-muted/50 p-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span className="text-foreground">{sendResult.sent} sent</span>
                {sendResult.failed > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <XCircle className="size-4 text-red-500" />
                    <span className="text-red-500">{sendResult.failed} failed</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-semibold text-foreground w-full"
          >
            <History className="size-4 text-primary" />
            Sent History ({history.length})
            {showHistory ? <ChevronUp className="size-4 ml-auto" /> : <ChevronDown className="size-4 ml-auto" />}
          </button>
          {showHistory && (
            <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto">
              {history.slice(0, 50).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {h.status === "sent" ? (
                      <CheckCircle2 className="size-3 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="size-3 text-red-500 shrink-0" />
                    )}
                    <span className="text-foreground font-medium truncate">{h.name}</span>
                    <span className="text-muted-foreground truncate">{h.email}</span>
                  </div>
                  <span className="text-muted-foreground shrink-0 ml-2">
                    {new Date(h.sentAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
