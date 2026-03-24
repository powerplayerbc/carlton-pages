import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { TrackingEvent } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackingEvent

    // Validate required fields
    if (!body.event_type || !body.page_id || !body.slug || !body.visitor_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, page_id, slug, visitor_id' },
        { status: 400 }
      )
    }

    // Validate event_type
    const validTypes = ['page_view', 'scroll_depth', 'cta_click', 'form_submit']
    if (!validTypes.includes(body.event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('landing_page_events').insert({
      event_type: body.event_type,
      page_id: body.page_id,
      slug: body.slug,
      visitor_id: body.visitor_id,
      variant_key: body.variant_key ?? null,
      metadata: body.metadata ?? null,
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_term: body.utm_term ?? null,
      utm_content: body.utm_content ?? null,
      user_agent: request.headers.get('user-agent') ?? null,
      referrer: request.headers.get('referer') ?? null,
      ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    })

    if (error) {
      console.error('Failed to insert tracking event:', error)
      return NextResponse.json({ error: 'Failed to record event' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Track API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Return 200 for preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
