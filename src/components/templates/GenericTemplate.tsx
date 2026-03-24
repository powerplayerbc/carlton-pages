import type {
  LandingPage,
  Testimonial,
  BodySection,
  HeroContent,
  BenefitsContent,
  HowItWorksContent,
  TestimonialsContent,
  PricingContent,
  FaqContent,
  CtaContent,
  FeaturesContent,
  StatsContent,
  VideoContent,
  TextContent,
  ComparisonContent,
  FormContent,
} from '@/lib/types'
import { Hero } from '@/components/shared/Hero'
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel'
import { PricingCard } from '@/components/shared/PricingCard'
import { Footer } from '@/components/shared/Footer'
import { FormRenderer } from '@/components/shared/FormRenderer'

interface GenericTemplateProps {
  page: LandingPage
  testimonials: Testimonial[]
  variantKey: string | null
}

export function GenericTemplate({ page, testimonials }: GenericTemplateProps) {
  // Check if body_sections has an inline hero -- if so, skip the shared Hero
  const hasInlineHero = page.body_sections.some((s) => s.type === 'hero')

  // Check if body_sections has inline testimonials or pricing
  const hasInlineTestimonials = page.body_sections.some((s) => s.type === 'testimonials')
  const hasInlinePricing = page.body_sections.some((s) => s.type === 'pricing')

  return (
    <main className="min-h-screen bg-navy-950">
      {/* Use shared Hero unless there is an inline hero section */}
      {!hasInlineHero && <Hero page={page} />}

      {/* Render all body sections dynamically */}
      {page.body_sections.map((section, idx) => (
        <GenericSection
          key={`${section.type}-${idx}`}
          section={section}
          index={idx}
          page={page}
          testimonials={testimonials}
        />
      ))}

      {/* Fallback testimonials if not inline */}
      {!hasInlineTestimonials && testimonials.length > 0 && (
        <TestimonialCarousel testimonials={testimonials} />
      )}

      {/* Fallback pricing if not inline */}
      {!hasInlinePricing && page.stripe_payment_link && (
        <PricingCard
          price={page.price_display ?? '$0'}
          ctaText={page.cta_text}
          ctaUrl={page.stripe_payment_link}
          heading="Get Started Today"
        />
      )}

      {/* Fallback bottom CTA */}
      {!page.stripe_payment_link && !page.body_sections.some((s) => s.type === 'cta') && (
        <section className="py-20 sm:py-28" aria-label="Call to action">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Take the Next Step
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-navy-200">
              {page.subheadline ?? 'Start your journey today.'}
            </p>
            <a
              href={page.cta_url}
              data-track-cta="generic-bottom-cta"
              className="mt-10 inline-flex items-center rounded-xl bg-accent-500 px-10 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:scale-[1.02]"
            >
              {page.cta_text}
            </a>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

// ── Master section renderer ─────────────────────────────────────────────

function GenericSection({
  section,
  index,
  page,
  testimonials,
}: {
  section: BodySection
  index: number
  page: LandingPage
  testimonials: Testimonial[]
}) {
  const isEven = index % 2 === 0
  const bg = isEven ? '' : 'bg-navy-900/30'

  switch (section.type) {
    case 'hero':
      return <InlineHero content={section.content as HeroContent} page={page} />
    case 'benefits':
      return <BenefitsSection content={section.content as BenefitsContent} bg={bg} />
    case 'how_it_works':
      return <HowItWorksSection content={section.content as HowItWorksContent} bg={bg} />
    case 'testimonials':
      return <TestimonialCarousel testimonials={testimonials} heading={(section.content as TestimonialsContent).heading} />
    case 'pricing':
      return <InlinePricing content={section.content as PricingContent} />
    case 'faq':
      return <FaqSection content={section.content as FaqContent} bg={bg} />
    case 'cta':
      return <CtaSection content={section.content as CtaContent} />
    case 'features':
      return <FeaturesSection content={section.content as FeaturesContent} bg={bg} />
    case 'stats':
      return <StatsSection content={section.content as StatsContent} />
    case 'video':
      return <VideoSection content={section.content as VideoContent} bg={bg} />
    case 'text':
      return <TextSection content={section.content as TextContent} bg={bg} />
    case 'comparison':
      return <ComparisonSection content={section.content as ComparisonContent} bg={bg} />
    case 'form':
      return (
        <FormSection
          content={section.content as FormContent}
          page={page}
          bg={bg}
        />
      )
    default:
      return null
  }
}

// ── Inline Hero ─────────────────────────────────────────────────────────

function InlineHero({ content: c, page }: { content: HeroContent; page: LandingPage }) {
  return (
    <section className="relative overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950" />
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
          }}
        />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-28 text-center sm:pb-28 sm:pt-36">
        {c.badge_text && (
          <div className="mb-8 inline-flex items-center rounded-full border border-accent-400/20 bg-accent-400/10 px-5 py-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent-400">{c.badge_text}</span>
          </div>
        )}

        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {c.headline}
        </h1>

        {c.subheadline && (
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-navy-200 sm:text-xl">
            {c.subheadline}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={c.cta_url ?? page.cta_url}
            data-track-cta="hero-primary"
            className="inline-flex items-center rounded-xl bg-accent-500 px-8 py-4 text-base font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:shadow-accent-400/30 hover:scale-[1.02]"
          >
            {c.cta_text ?? page.cta_text}
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy-950 to-transparent" />
    </section>
  )
}

// ── Benefits ────────────────────────────────────────────────────────────

function BenefitsSection({ content: c, bg }: { content: BenefitsContent; bg: string }) {
  return (
    <section className={`py-20 sm:py-28 ${bg}`} aria-label={c.heading || 'Benefits'}>
      <div className="mx-auto max-w-7xl px-6">
        {c.heading && (
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
        )}
        {c.subheading && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-navy-300">{c.subheading}</p>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-navy-700/30 bg-navy-900/50 p-8 transition-all duration-300 hover:border-accent-400/20 hover:bg-navy-800/50"
            >
              {item.icon && <span className="mb-4 inline-block text-3xl" aria-hidden="true">{item.icon}</span>}
              <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
              <p className="leading-relaxed text-navy-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ────────────────────────────────────────────────────────

function HowItWorksSection({ content: c, bg }: { content: HowItWorksContent; bg: string }) {
  return (
    <section className={`py-20 sm:py-28 ${bg}`} aria-label={c.heading || 'How it works'}>
      <div className="mx-auto max-w-5xl px-6">
        {c.heading && (
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
        )}
        {c.subheading && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-navy-300">{c.subheading}</p>
        )}
        <div className="relative">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-accent-400/50 via-accent-400/20 to-transparent lg:block" />
          <div className="space-y-12">
            {c.steps.map((step, i) => (
              <div key={i} className="flex gap-6 lg:gap-8">
                <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-2xl font-extrabold text-navy-950 shadow-lg shadow-accent-500/20">
                  {step.number ?? i + 1}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-navy-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Features ────────────────────────────────────────────────────────────

function FeaturesSection({ content: c, bg }: { content: FeaturesContent; bg: string }) {
  return (
    <section className={`py-20 sm:py-28 ${bg}`} aria-label={c.heading || 'Features'}>
      <div className="mx-auto max-w-6xl px-6">
        {c.heading && (
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
        )}
        {c.subheading && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-navy-300">{c.subheading}</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-navy-700/30 bg-navy-900/40 p-8 transition-all duration-300 hover:border-accent-400/20 hover:bg-navy-800/40"
            >
              {item.icon && <span className="mb-4 inline-block text-3xl" aria-hidden="true">{item.icon}</span>}
              <h3 className="mb-3 text-lg font-bold text-white group-hover:text-accent-300 transition-colors">{item.title}</h3>
              <p className="leading-relaxed text-navy-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Stats ───────────────────────────────────────────────────────────────

function StatsSection({ content: c }: { content: StatsContent }) {
  return (
    <section className="bg-gradient-to-r from-navy-800/50 to-navy-900/50 py-16 sm:py-20" aria-label={c.heading || 'Statistics'}>
      <div className="mx-auto max-w-6xl px-6">
        {c.heading && (
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">{c.heading}</h2>
        )}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {c.items.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-extrabold text-accent-400 sm:text-5xl">
                {stat.value}{stat.suffix ?? ''}
              </p>
              <p className="mt-2 text-sm font-medium text-navy-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Video ───────────────────────────────────────────────────────────────

function VideoSection({ content: c, bg }: { content: VideoContent; bg: string }) {
  return (
    <section className={`py-16 sm:py-20 ${bg}`} aria-label={c.heading || 'Video'}>
      <div className="mx-auto max-w-4xl px-6">
        {c.heading && (
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">{c.heading}</h2>
        )}
        <div className="overflow-hidden rounded-2xl border border-navy-700/40 bg-navy-900/60 shadow-2xl shadow-navy-950/50">
          <div className="aspect-video">
            {c.video_url.includes('youtube') || c.video_url.includes('youtu.be') ? (
              <iframe
                src={c.video_url.replace('watch?v=', 'embed/')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={c.heading ?? 'Video'}
              />
            ) : c.video_url.includes('vimeo') ? (
              <iframe
                src={c.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={c.heading ?? 'Video'}
              />
            ) : (
              <video src={c.video_url} poster={c.thumbnail_url ?? undefined} controls className="h-full w-full object-cover">
                <track kind="captions" />
              </video>
            )}
          </div>
        </div>
        {c.description && (
          <p className="mt-6 text-center text-navy-300">{c.description}</p>
        )}
      </div>
    </section>
  )
}

// ── Text ────────────────────────────────────────────────────────────────

function TextSection({ content: c, bg }: { content: TextContent; bg: string }) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[c.alignment ?? 'left']

  return (
    <section className={`py-16 sm:py-20 ${bg}`} aria-label={c.heading || 'Content'}>
      <div className={`mx-auto max-w-3xl px-6 ${alignClass}`}>
        {c.heading && (
          <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
        )}
        <div className="prose prose-lg prose-invert max-w-none leading-relaxed text-navy-200">
          {/* Render body as paragraphs split by double newlines */}
          {c.body.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-6 last:mb-0">{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Comparison ──────────────────────────────────────────────────────────

function ComparisonSection({ content: c, bg }: { content: ComparisonContent; bg: string }) {
  return (
    <section className={`py-20 sm:py-28 ${bg}`} aria-label={c.heading || 'Comparison'}>
      <div className="mx-auto max-w-4xl px-6">
        {c.heading && (
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
        )}
        <div className="overflow-hidden rounded-2xl border border-navy-700/30">
          {/* Header */}
          <div className="grid grid-cols-2 bg-navy-800/60">
            <div className="border-r border-navy-700/30 px-6 py-4 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-red-400">
                {c.before_label ?? 'Without Us'}
              </span>
            </div>
            <div className="px-6 py-4 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                {c.after_label ?? 'With Us'}
              </span>
            </div>
          </div>

          {/* Rows */}
          {c.items.map((item, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 ${i % 2 === 0 ? 'bg-navy-900/30' : 'bg-navy-900/60'}`}
            >
              <div className="border-r border-navy-700/20 px-6 py-5">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-navy-300">{item.before}</span>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-white">{item.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Inline Pricing ──────────────────────────────────────────────────────

function InlinePricing({ content: c }: { content: PricingContent }) {
  return (
    <PricingCard
      price={c.price}
      originalPrice={c.original_price}
      period={c.period}
      features={c.features}
      ctaText={c.cta_text ?? 'Get Started'}
      ctaUrl={c.cta_url ?? '#'}
      badge={c.badge}
      heading={c.heading}
      subheading={c.subheading}
    />
  )
}

// ── FAQ ─────────────────────────────────────────────────────────────────

function FaqSection({ content: c, bg }: { content: FaqContent; bg: string }) {
  return (
    <section className={`py-20 sm:py-28 ${bg}`} aria-label={c.heading || 'Frequently asked questions'}>
      <div className="mx-auto max-w-3xl px-6">
        {c.heading && (
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
        )}
        <div className="space-y-4">
          {c.items.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-navy-700/40 bg-navy-900/40 backdrop-blur"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-lg font-semibold text-white transition-colors hover:text-accent-400 [&::-webkit-details-marker]:hidden">
                {item.question}
                <svg
                  className="h-5 w-5 flex-shrink-0 text-navy-400 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 leading-relaxed text-navy-300">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Form ───────────────────────────────────────────────────────────────

function FormSection({
  content: c,
  page,
  bg,
}: {
  content: FormContent
  page: LandingPage
  bg: string
}) {
  return (
    <section className={`py-20 sm:py-28 ${bg}`} aria-label={c.heading || 'Form'}>
      <div className="mx-auto max-w-2xl px-6">
        {c.heading && (
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {c.heading}
          </h2>
        )}
        {c.subheading && (
          <p className="mx-auto mb-12 max-w-xl text-center text-lg text-navy-300">
            {c.subheading}
          </p>
        )}
        <div className="rounded-2xl border border-navy-700/30 bg-navy-900/50 p-6 sm:p-10">
          <FormRenderer
            formId={c.form_id}
            offerId={c.offer_id}
            pageId={page.page_id}
            slug={page.slug}
          />
        </div>
      </div>
    </section>
  )
}

// ── CTA ─────────────────────────────────────────────────────────────────

function CtaSection({ content: c }: { content: CtaContent }) {
  return (
    <section className="py-20 sm:py-28" aria-label="Call to action">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-accent-400/10 bg-gradient-to-br from-accent-500/5 via-navy-900/80 to-accent-500/5 p-12 text-center backdrop-blur sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
          {c.subheading && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-200">{c.subheading}</p>
          )}
          {c.urgency_text && (
            <p className="mt-4 text-sm font-semibold text-accent-400">{c.urgency_text}</p>
          )}
          <a
            href={c.cta_url}
            data-track-cta="generic-section-cta"
            className="mt-10 inline-flex items-center rounded-xl bg-accent-500 px-10 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:shadow-accent-400/30 hover:scale-[1.02]"
          >
            {c.cta_text}
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
