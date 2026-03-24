import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { LandingPage, Testimonial } from '@/lib/types'
import { ScorecardTemplate } from '@/components/templates/ScorecardTemplate'
import { WorkshopTemplate } from '@/components/templates/WorkshopTemplate'
import { LiveSessionTemplate } from '@/components/templates/LiveSessionTemplate'
import { GenericTemplate } from '@/components/templates/GenericTemplate'
import { PreviewBanner } from '@/components/shared/PreviewBanner'

// Never cache preview pages
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getPreviewPage(slug: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .single() // No status filter - show any page

  if (error || !data) return null
  return data as LandingPage
}

async function getTestimonials(ids: string[]): Promise<Testimonial[]> {
  if (!ids || ids.length === 0) return []

  const { data, error } = await supabase
    .from('crm_testimonials')
    .select('*')
    .in('testimonial_id', ids)

  if (error || !data) return []
  return data as Testimonial[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const fullSlug = slug.join('/')
  const page = await getPreviewPage(fullSlug)

  if (!page) {
    return { title: 'Preview - Not Found' }
  }

  return {
    title: `[PREVIEW] ${page.meta_title}`,
    description: page.meta_description,
    robots: { index: false, follow: false },
  }
}

export default async function PreviewPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const fullSlug = slug.join('/')
  const page = await getPreviewPage(fullSlug)

  if (!page) {
    notFound()
  }

  // Fetch testimonials if the page references any
  const testimonials = await getTestimonials(page.testimonial_ids ?? [])

  // Determine variant (from query param or variant_key on the page)
  const variantKey =
    (typeof resolvedSearchParams.v === 'string' ? resolvedSearchParams.v : null) ??
    page.variant_key ??
    null

  // Render the appropriate template
  const templateProps = { page, testimonials, variantKey }

  return (
    <>
      <PreviewBanner page={page} />
      {/* No AnalyticsTracker in preview mode - don't pollute analytics */}
      <div className="pt-14">
        {renderTemplate(page.template_type, templateProps)}
      </div>
    </>
  )
}

function renderTemplate(
  templateType: string,
  props: { page: LandingPage; testimonials: Testimonial[]; variantKey: string | null }
) {
  switch (templateType) {
    case 'scorecard':
      return <ScorecardTemplate {...props} />
    case 'workshop':
      return <WorkshopTemplate {...props} />
    case 'live_session':
      return <LiveSessionTemplate {...props} />
    case 'generic':
    default:
      return <GenericTemplate {...props} />
  }
}
