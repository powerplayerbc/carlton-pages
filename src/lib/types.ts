// ── Landing Page (matches `landing_pages` Supabase table) ──────────────

export type TemplateType =
  | 'scorecard'
  | 'workshop'
  | 'live_session'
  | 'generic'

export type PageStatus = 'draft' | 'pending_review' | 'published' | 'archived'

export interface LandingPage {
  page_id: string
  slug: string
  template_type: TemplateType
  headline: string
  subheadline: string | null
  body_sections: BodySection[]
  cta_text: string
  cta_url: string
  price_display: string | null
  testimonial_ids: string[] | null
  hero_image_url: string | null
  meta_title: string
  meta_description: string
  stripe_payment_link: string | null
  variant_key: string | null
  status: PageStatus
  brand_id: string | null
  created_at: string
  updated_at: string
}

// ── Body Sections (JSONB array within landing_pages) ───────────────────

export type SectionType =
  | 'hero'
  | 'benefits'
  | 'how_it_works'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'features'
  | 'stats'
  | 'video'
  | 'text'
  | 'comparison'
  | 'form'

export interface BodySection {
  type: SectionType
  content: HeroContent
    | BenefitsContent
    | HowItWorksContent
    | TestimonialsContent
    | PricingContent
    | FaqContent
    | CtaContent
    | FeaturesContent
    | StatsContent
    | VideoContent
    | TextContent
    | ComparisonContent
    | FormContent
}

export interface HeroContent {
  headline: string
  subheadline?: string
  image_url?: string
  cta_text?: string
  cta_url?: string
  badge_text?: string
}

export interface BenefitsContent {
  heading?: string
  subheading?: string
  items: {
    icon?: string
    title: string
    description: string
  }[]
}

export interface HowItWorksContent {
  heading?: string
  subheading?: string
  steps: {
    number?: number
    title: string
    description: string
    icon?: string
  }[]
}

export interface TestimonialsContent {
  heading?: string
  testimonial_ids?: string[]
}

export interface PricingContent {
  heading?: string
  subheading?: string
  price: string
  original_price?: string
  currency?: string
  period?: string
  features?: string[]
  cta_text?: string
  cta_url?: string
  badge?: string
}

export interface FaqContent {
  heading?: string
  items: {
    question: string
    answer: string
  }[]
}

export interface CtaContent {
  heading: string
  subheading?: string
  cta_text: string
  cta_url: string
  urgency_text?: string
}

export interface FeaturesContent {
  heading?: string
  subheading?: string
  items: {
    icon?: string
    title: string
    description: string
  }[]
}

export interface StatsContent {
  heading?: string
  items: {
    value: string
    label: string
    suffix?: string
  }[]
}

export interface VideoContent {
  heading?: string
  video_url: string
  thumbnail_url?: string
  description?: string
}

export interface TextContent {
  heading?: string
  body: string
  alignment?: 'left' | 'center' | 'right'
}

export interface ComparisonContent {
  heading?: string
  before_label?: string
  after_label?: string
  items: {
    before: string
    after: string
  }[]
}

export interface FormContent {
  heading?: string
  subheading?: string
  form_id: string
  offer_id: string
}

// ── Form Definition (matches `offer_forms` Supabase table) ────────────

export interface FormField {
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number'
  label: string
  options?: string[]
  required: boolean
  placeholder?: string
  scoring_weight?: number
}

export interface OfferForm {
  form_id: string
  offer_id: string
  brand_id: string
  title: string
  fields: FormField[]
  thank_you_message: string | null
  redirect_url: string | null
  status: string
}

// ── Testimonial (matches `crm_testimonials` Supabase table) ───────────

export interface Testimonial {
  testimonial_id: string
  headline: string | null
  polished_text: string
  short_version: string | null
  attribution_name: string
  attribution_title: string | null
  attribution_company: string | null
  rating: number | null
  media_type: 'text' | 'video' | null
  video_url: string | null
}

// ── Analytics Events ──────────────────────────────────────────────────

export interface TrackingEvent {
  event_type: 'page_view' | 'scroll_depth' | 'cta_click' | 'form_submit'
  page_id: string
  slug: string
  visitor_id: string
  variant_key?: string | null
  metadata?: Record<string, string | number | boolean | null>
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
}
