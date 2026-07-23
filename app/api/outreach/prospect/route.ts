import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

export type WebPresence = "website" | "facebook-only" | "dead-site" | "none"

export interface Prospect {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  category?: string
  webPresence: WebPresence
  siteStatus?: string
  generatedEmail?: { subject: string; body: string }
}

function isSocialUrl(url: string): boolean {
  return /facebook\.com|instagram\.com|yelp\.com|twitter\.com|x\.com|tiktok\.com/i.test(url)
}

export async function POST(req: NextRequest) {
  try {
    const { trade, location, radius = 15 } = await req.json()

    if (!trade || !location) {
      return NextResponse.json({ error: "trade and location are required" }, { status: 400 })
    }

    // Step 1: Geocode location
    const geoRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.location",
      },
      body: JSON.stringify({ textQuery: location, maxResultCount: 1 }),
    })
    const geoData = await geoRes.json()
    const coords = geoData.places?.[0]?.location
    if (!coords) {
      return NextResponse.json({ error: "Could not geocode location" }, { status: 400 })
    }

    // Step 2: Search for businesses
    const searchRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.primaryTypeDisplayName",
      },
      body: JSON.stringify({
        textQuery: `${trade} in ${location}`,
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: { latitude: coords.latitude, longitude: coords.longitude },
            radius: radius * 1000,
          },
        },
      }),
    })
    const searchData = await searchRes.json()
    const places = searchData.places || []

    // Step 3: Classify each prospect
    const prospects: Prospect[] = await Promise.all(
      places.map(async (place: any) => {
        const website = place.websiteUri || undefined
        let webPresence: WebPresence = "none"
        let siteStatus = "No website"

        if (website) {
          if (isSocialUrl(website)) {
            webPresence = "facebook-only"
            siteStatus = "Social media only"
          } else {
            try {
              const check = await fetch(website, {
                method: "HEAD",
                signal: AbortSignal.timeout(5000),
                redirect: "follow",
              })
              if (check.ok) {
                webPresence = "website"
                siteStatus = "Site loads"
              } else {
                webPresence = "dead-site"
                siteStatus = `Returns ${check.status}`
              }
            } catch {
              webPresence = "dead-site"
              siteStatus = "Site does not load"
            }
          }
        }

        return {
          id: place.id || crypto.randomUUID(),
          name: place.displayName?.text || "Unknown",
          address: place.formattedAddress || "",
          phone: place.nationalPhoneNumber || undefined,
          website,
          rating: place.rating || undefined,
          reviewCount: place.userRatingCount || undefined,
          category: place.primaryTypeDisplayName?.text || undefined,
          webPresence,
          siteStatus,
        }
      })
    )

    // Step 4: Filter to prospects that need help
    const needsHelp = prospects.filter((p) => p.webPresence !== "website")

    // Step 5: Generate personalized emails
    if (needsHelp.length > 0) {
      const descriptions = needsHelp
        .map((p, i) => {
          let situation = ""
          if (p.webPresence === "none") situation = "NO WEBSITE at all"
          else if (p.webPresence === "facebook-only") situation = "Only has a Facebook/social page, no real website"
          else if (p.webPresence === "dead-site") situation = `Website (${p.website}) — ${p.siteStatus}`
          return `${i + 1}. ${p.name} - ${p.address}. Phone: ${p.phone || "unknown"}. Rating: ${p.rating || "none"} (${p.reviewCount || 0} reviews). Situation: ${situation}.`
        })
        .join("\n")

      const prompt = `You write cold outreach emails for FundyLaunch, a web agency in Atlantic Canada building websites for local trades businesses.

Write personalized emails for each prospect. Each email offers a FREE competition report showing how they compare to other ${trade} in ${location}.

Rules:
- Short, casual, not salesy. Like a local reaching out.
- Reference their specific situation (no website, dead website, Facebook only)
- Mention their rating/reviews if good
- Hook: FREE competition report showing how they stack up against competitors
- CTA: reply or quick call
- Sign off as Corey from FundyLaunch (fundylaunch.com)
- No "I hope this finds you well"
- Keep each email under 130 words
- Mention you build sites for trades in NB

Return ONLY a valid JSON array. Each object: {"index": number, "subject": "string", "body": "string"}
No markdown, no explanation.

Prospects:
${descriptions}`

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4000 },
          }),
        }
      )

      const geminiData = await geminiRes.json()
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""

      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const emails = JSON.parse(jsonMatch[0])
          emails.forEach((e: any) => {
            if (needsHelp[e.index - 1]) {
              needsHelp[e.index - 1].generatedEmail = { subject: e.subject, body: e.body }
            }
          })
        }
      } catch (err) {
        console.error("Email parse error:", err)
      }
    }

    return NextResponse.json({
      location,
      trade,
      totalFound: prospects.length,
      needsHelp: needsHelp.length,
      withSite: prospects.length - needsHelp.length,
      prospects: needsHelp,
    })
  } catch (error) {
    console.error("Prospect error:", error)
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 })
  }
}
