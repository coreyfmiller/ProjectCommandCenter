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

export function OutreachPanel() {
  const [trade, setTrade] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [emails, setEmails] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null)
  const [searchMeta, setSearchMeta] = useState<{ totalFound: number; needsHelp: number; withSite: number } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState("")

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
        const foundProspects = data.prospects || []
        setProspects(foundProspects)
        setSearchMeta({
          totalFound: data.totalFound,
          needsHelp: data.needsHelp,
          withSite: data.withSite,
        })
        // Auto-populate emails from foundEmails and auto-select those with emails
        const autoEmails: Record<string, string> = {}
        const autoSelected = new Set<string>()
        foundProspects.forEach((p: Prospect) => {
          if (p.foundEmails && p.foundEmails.length > 0) {
            autoEmails[p.id] = p.foundEmails[0]
            autoSelected.add(p.id)
          }
        })
        setEmails(autoEmails)
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

  const handleSend = async () => {
    const toSend = prospects
      .filter((p) => selected.has(p.id) && p.generatedEmail && emails[p.id])
      .map((p) => ({
        name: p.name,
        email: emails[p.id],
        subject: p.generatedEmail!.subject,
        body: p.generatedEmail!.body,
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
        body: JSON.stringify({ prospects: toSend }),
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

  const readyToSend = prospects.filter((p) => selected.has(p.id) && p.generatedEmail && emails[p.id]).length

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
          <p className="mt-3 text-xs text-muted-foreground">
            Found {searchMeta.totalFound} businesses • {searchMeta.withSite} have working sites (skipped) • <span className="text-primary font-medium">{searchMeta.needsHelp} need help</span>
          </p>
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
            {prospects.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-background p-3">
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

                    {/* Email input */}
                    {selected.has(p.id) && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            placeholder="Enter their email address to send"
                            value={emails[p.id] || ""}
                            onChange={(e) => setEmails((prev) => ({ ...prev, [p.id]: e.target.value }))}
                            className="w-full rounded border border-border bg-muted px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                          />
                          {p.foundEmails && p.foundEmails.length > 0 && (
                            <span className="shrink-0 text-[10px] text-green-500 font-medium">Auto-found</span>
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

                    {/* Email preview */}
                    {p.generatedEmail && (
                      <div className="mt-2">
                        <button
                          onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Mail className="size-3" />
                          Preview email
                          {expandedId === p.id ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                        </button>
                        {expandedId === p.id && (
                          <div className="mt-2 rounded border border-border bg-muted/50 p-3 text-xs space-y-1">
                            <p className="font-medium text-foreground">Subject: {p.generatedEmail.subject}</p>
                            <p className="text-muted-foreground whitespace-pre-wrap">{p.generatedEmail.body}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Send button */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              {readyToSend} of {selected.size} selected ready to send (need email address)
            </p>
            <button
              onClick={handleSend}
              disabled={sending || readyToSend === 0}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {sending ? "Sending..." : `Send ${readyToSend} Emails`}
            </button>
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
