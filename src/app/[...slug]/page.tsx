import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { LandingPage, Testimonial } from '@/lib/types'
import { ScorecardTemplate } from '@/components/templates/ScorecardTemplate'
import { WorkshopTemplate } from '@/components/templates/WorkshopTemplate'
import { LiveSessionTemplate } from '@/components/templates/LiveSessionTemplate'
import { GenericTemplate } from '@/components/templates/GenericTemplate'
import { AnalyticsTracker } from '@/components/shared/AnalyticsTracker'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getPage(slug: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

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
  const page = await getPage(fullSlug)

  if (!page) {
    return { title: 'Not Found' }
  }

  return {
    title: page.meta_title,
    description: page.meta_description,
    openGraph: {
      title: page.meta_title,
      description: page.meta_description,
      type: 'website',
      ...(page.hero_image_url && {
        images: [{ url: page.hero_image_url, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: page.meta_title,
      description: page.meta_description,
      ...(page.hero_image_url && { images: [page.hero_image_url] }),
    },
  }
}

export default async function LandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const fullSlug = slug.join('/')
  const page = await getPage(fullSlug)

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
      <AnalyticsTracker
        pageId={page.page_id}
        slug={fullSlug}
        variantKey={variantKey}
      />
      {renderTemplate(page.template_type, templateProps)}
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
