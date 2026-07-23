import { NextRequest, NextResponse } from "next/server"
import { put, list } from "@vercel/blob"

const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
const HISTORY_KEY = "command-center/outreach-history.json"

interface SendRequest {
  prospects: {
    name: string
    email: string
    subject: string
    body: string
    phone?: string
    address?: string
    trade?: string
    location?: string
  }[]
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

export async function POST(req: NextRequest) {
  try {
    const { prospects }: SendRequest = await req.json()

    if (!prospects || prospects.length === 0) {
      return NextResponse.json({ error: "No prospects to email" }, { status: 400 })
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Resend not configured" }, { status: 500 })
    }

    const results: { name: string; status: string; error?: string }[] = []

    for (const prospect of prospects) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Corey at FundyLaunch <hello@fundylaunch.com>",
            to: prospect.email,
            subject: prospect.subject,
            text: prospect.body,
            reply_to: "coreyfmiller@gmail.com",
          }),
        })

        if (res.ok) {
          results.push({ name: prospect.name, status: "sent" })
        } else {
          const err = await res.text()
          results.push({ name: prospect.name, status: "failed", error: err })
        }
      } catch (err: any) {
        results.push({ name: prospect.name, status: "failed", error: err.message })
      }
    }

    // Save to history
    try {
      const { blobs } = await list({ prefix: "command-center/" })
      const historyBlob = blobs.find((b) => b.pathname === HISTORY_KEY)
      let history: HistoryEntry[] = []

      if (historyBlob) {
        const res = await fetch(historyBlob.url)
        history = await res.json()
      }

      const newEntries: HistoryEntry[] = prospects.map((p, i) => ({
        id: crypto.randomUUID(),
        name: p.name,
        email: p.email,
        subject: p.subject,
        trade: p.trade || "",
        location: p.location || "",
        sentAt: new Date().toISOString(),
        status: results[i]?.status === "sent" ? "sent" : "failed",
      }))

      history = [...newEntries, ...history].slice(0, 200)

      await put(HISTORY_KEY, JSON.stringify(history), {
        access: "public",
        addRandomSuffix: false,
      })
    } catch (err) {
      console.error("History save error:", err)
    }

    return NextResponse.json({
      sent: results.filter((r) => r.status === "sent").length,
      failed: results.filter((r) => r.status === "failed").length,
      results,
    })
  } catch (error) {
    console.error("Send error:", error)
    return NextResponse.json({ error: "Send failed" }, { status: 500 })
  }
}

// GET: Retrieve outreach history
export async function GET() {
  try {
    const { blobs } = await list({ prefix: "command-center/" })
    const historyBlob = blobs.find((b) => b.pathname === HISTORY_KEY)

    if (!historyBlob) {
      return NextResponse.json({ history: [] })
    }

    const res = await fetch(historyBlob.url)
    const history = await res.json()
    return NextResponse.json({ history })
  } catch {
    return NextResponse.json({ history: [] })
  }
}
