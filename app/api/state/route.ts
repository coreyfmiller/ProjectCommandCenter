import { put, head, list } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const STATE_KEY = 'command-center/state.json'

export async function GET() {
  try {
    // Check if state file exists
    const { blobs } = await list({ prefix: 'command-center/' })
    const stateBlob = blobs.find(b => b.pathname === STATE_KEY)
    
    if (!stateBlob) {
      return NextResponse.json({})
    }

    const res = await fetch(stateBlob.url)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[state] GET error:', error)
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    await put(STATE_KEY, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[state] POST error:', error)
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 })
  }
}
