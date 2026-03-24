import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify the revalidation secret
    const secret = body.secret || request.headers.get('x-revalidation-secret')
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const slug = body.slug as string | undefined

    if (slug) {
      // Revalidate a specific page
      revalidatePath(`/${slug}`)
      console.log(`Revalidated: /${slug}`)
    } else {
      // Revalidate all landing pages (homepage index + all dynamic pages)
      revalidatePath('/', 'layout')
      console.log('Revalidated: all pages')
    }

    return NextResponse.json({
      revalidated: true,
      slug: slug ?? 'all',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
