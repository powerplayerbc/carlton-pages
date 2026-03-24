import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface FormResponse {
  question: string
  answer: string
  scoring_weight: number
}

interface SubmitBody {
  form_id: string
  offer_id: string
  page_id: string
  slug: string
  customer_name: string
  customer_email: string
  responses: FormResponse[]
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmitBody

    // Validate required fields
    if (!body.form_id || !body.customer_email || !body.responses) {
      return NextResponse.json(
        { error: 'Missing required fields: form_id, customer_email, responses' },
        { status: 400 }
      )
    }

    if (!Array.isArray(body.responses) || body.responses.length === 0) {
      return NextResponse.json(
        { error: 'Responses must be a non-empty array' },
        { status: 400 }
      )
    }

    // Fire-and-forget: upsert contact in CRM-BRIDGE
    const nameParts = (body.customer_name ?? '').trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    fetch('https://n8n.carltonaiservices.com/webhook/rdgr-crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'upsert_contact',
        parameters: {
          email: body.customer_email,
          first_name: firstName,
          last_name: lastName,
          source: 'landing_page',
          source_detail: body.slug || body.form_id,
          lifecycle_stage: 'lead',
          tags: ['landing-page-lead', body.offer_id].filter(Boolean),
        },
      }),
    }).catch((crmErr) => {
      console.error('CRM-BRIDGE upsert failed (non-blocking):', crmErr)
    })

    // Forward to the SCORECARD-PROCESS webhook
    try {
      await fetch(
        'https://n8n.carltonaiservices.com/webhook/scorecard-process',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: body.form_id,
            offer_id: body.offer_id,
            page_id: body.page_id,
            slug: body.slug,
            customer_name: body.customer_name,
            customer_email: body.customer_email,
            responses: body.responses,
          }),
        }
      )
    } catch (webhookErr) {
      // Log but do not fail the user submission if webhook is down
      console.error('Failed to forward to scorecard-process webhook:', webhookErr)
    }

    // Insert tracking event into landing_page_events
    const { error: insertError } = await supabase
      .from('landing_page_events')
      .insert({
        event_type: 'form_submit',
        page_id: body.page_id,
        slug: body.slug,
        visitor_id: null,
        metadata: {
          form_id: body.form_id,
          offer_id: body.offer_id,
          customer_email: body.customer_email,
        },
        user_agent: request.headers.get('user-agent') ?? null,
        referrer: request.headers.get('referer') ?? null,
        ip_address:
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      })

    if (insertError) {
      console.error('Failed to insert form_submit event:', insertError)
    }

    return NextResponse.json(
      { success: true, message: 'Submission received' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Submit API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
