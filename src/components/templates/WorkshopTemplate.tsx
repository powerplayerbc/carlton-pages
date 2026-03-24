import type { LandingPage, Testimonial, BodySection, BenefitsContent, HowItWorksContent, FaqContent, VideoContent, FeaturesContent, CtaContent } from '@/lib/types'
import { Hero } from '@/components/shared/Hero'
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel'
import { PricingCard } from '@/components/shared/PricingCard'
import { Footer } from '@/components/shared/Footer'

interface WorkshopTemplateProps {
  page: LandingPage
  testimonials: Testimonial[]
  variantKey: string | null
}

export function WorkshopTemplate({ page, testimonials }: WorkshopTemplateProps) {
  // Extract a video section if present
  const videoSection = page.body_sections.find((s) => s.type === 'video')
  const otherSections = page.body_sections.filter((s) => s.type !== 'video')

  return (
    <main className="min-h-screen bg-navy-950">
      <Hero page={page} badgeText="Recorded Workshop" />

      {/* Video preview */}
      {videoSection && <VideoPreview section={videoSection} />}

      {/* What you will learn */}
      <section className="py-20 sm:py-28" aria-label="Workshop overview">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span className="text-sm font-semibold uppercase tracking-widest text-accent-400">
                Workshop Content
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                What You Will Learn
              </h2>
              <div className="mt-8 space-y-6">
                {[
                  {
                    title: 'Real-World Implementation',
                    desc: 'No theory-only fluff. Every concept comes with concrete examples and step-by-step walkthroughs.',
                  },
                  {
                    title: 'Immediate Applicability',
                    desc: 'Templates, frameworks, and tools you can use the same day you watch the recording.',
                  },
                  {
                    title: 'Expert-Led Instruction',
                    desc: 'Led by practitioners who have deployed these solutions in production environments.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-lg font-bold text-accent-400">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="mt-1 text-navy-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workshop details card */}
            <div className="lg:col-span-2">
              <div className="sticky top-8 rounded-2xl border border-navy-700/40 bg-gradient-to-b from-navy-800/80 to-navy-900/80 p-8 backdrop-blur">
                <h3 className="mb-6 text-xl font-bold text-white">Workshop Details</h3>
                <dl className="space-y-5">
                  {[
                    { label: 'Format', value: 'On-Demand Recording' },
                    { label: 'Duration', value: '60-90 minutes' },
                    { label: 'Access', value: 'Lifetime access' },
                    { label: 'Includes', value: 'Slides, templates, resources' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-navy-700/30 pb-4">
                      <dt className="text-sm text-navy-400">{item.label}</dt>
                      <dd className="text-sm font-semibold text-white">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={page.stripe_payment_link ?? page.cta_url}
                  data-track-cta="workshop-sidebar-cta"
                  className="mt-8 flex w-full items-center justify-center rounded-xl bg-accent-500 px-6 py-4 text-base font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:scale-[1.02]"
                >
                  {page.cta_text}
                </a>

                {page.price_display && (
                  <p className="mt-3 text-center text-sm text-navy-400">
                    {page.price_display}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic body sections */}
      {otherSections.map((section, idx) => (
        <WorkshopSection key={`${section.type}-${idx}`} section={section} index={idx} />
      ))}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <TestimonialCarousel testimonials={testimonials} heading="What Attendees Say" />
      )}

      {/* Bottom CTA */}
      {page.stripe_payment_link && (
        <PricingCard
          price={page.price_display ?? '$0'}
          ctaText={page.cta_text}
          ctaUrl={page.stripe_payment_link}
          heading="Get Instant Access"
          subheading="Watch at your own pace. Keep the materials forever."
          features={[
            'Full workshop recording in HD',
            'Downloadable slide deck',
            'Templates and frameworks',
            'Bonus resource links',
          ]}
        />
      )}

      <Footer />
    </main>
  )
}

function VideoPreview({ section }: { section: BodySection }) {
  const c = section.content as VideoContent
  return (
    <section className="py-16 sm:py-20" aria-label="Workshop preview">
      <div className="mx-auto max-w-4xl px-6">
        {c.heading && (
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            {c.heading}
          </h2>
        )}
        <div className="relative overflow-hidden rounded-2xl border border-navy-700/40 bg-navy-900/60 shadow-2xl shadow-navy-950/50">
          <div className="aspect-video">
            {c.video_url.includes('youtube') || c.video_url.includes('youtu.be') ? (
              <iframe
                src={c.video_url.replace('watch?v=', 'embed/')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={c.heading ?? 'Workshop preview video'}
              />
            ) : c.video_url.includes('vimeo') ? (
              <iframe
                src={c.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={c.heading ?? 'Workshop preview video'}
              />
            ) : (
              <video
                src={c.video_url}
                poster={c.thumbnail_url ?? undefined}
                controls
                className="h-full w-full object-cover"
              >
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

function WorkshopSection({ section, index }: { section: BodySection; index: number }) {
  const isEven = index % 2 === 0

  switch (section.type) {
    case 'features': {
      const c = section.content as FeaturesContent
      return (
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'Features'}>
          <div className="mx-auto max-w-6xl px-6">
            {c.heading && (
              <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
            )}
            {c.subheading && (
              <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-navy-300">
                {c.subheading}
              </p>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((item, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-navy-700/30 bg-navy-900/40 p-8 transition-all duration-300 hover:border-accent-400/20 hover:bg-navy-800/40"
                >
                  {item.icon && (
                    <span className="mb-4 inline-block text-3xl" aria-hidden="true">{item.icon}</span>
                  )}
                  <h3 className="mb-3 text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-navy-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'benefits': {
      const c = section.content as BenefitsContent
      return (
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'Benefits'}>
          <div className="mx-auto max-w-5xl px-6">
            {c.heading && (
              <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
            )}
            {c.subheading && (
              <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-navy-300">
                {c.subheading}
              </p>
            )}
            <div className="grid gap-8 sm:grid-cols-2">
              {c.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-500/10">
                    {item.icon ? (
                      <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                    ) : (
                      <svg className="h-6 w-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-navy-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'how_it_works': {
      const c = section.content as HowItWorksContent
      return (
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'How it works'}>
          <div className="mx-auto max-w-5xl px-6">
            {c.heading && (
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
            )}
            <div className="grid gap-8 sm:grid-cols-3">
              {c.steps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500 text-2xl font-extrabold text-navy-950 shadow-lg shadow-accent-500/20">
                    {step.number ?? i + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-navy-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'faq': {
      const c = section.content as FaqContent
      return (
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'Frequently asked questions'}>
          <div className="mx-auto max-w-3xl px-6">
            {c.heading && (
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
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
                  <div className="px-6 pb-6 leading-relaxed text-navy-300">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'cta': {
      const c = section.content as CtaContent
      return (
        <section className="bg-gradient-to-r from-accent-500/10 via-navy-900/50 to-accent-500/10 py-20 sm:py-28" aria-label="Call to action">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
            {c.subheading && (
              <p className="mx-auto mt-6 max-w-xl text-lg text-navy-200">{c.subheading}</p>
            )}
            {c.urgency_text && (
              <p className="mt-4 text-sm font-semibold text-accent-400">{c.urgency_text}</p>
            )}
            <a
              href={c.cta_url}
              data-track-cta={`workshop-section-cta`}
              className="mt-10 inline-flex items-center rounded-xl bg-accent-500 px-10 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:scale-[1.02]"
            >
              {c.cta_text}
            </a>
          </div>
        </section>
      )
    }

    default:
      return null
  }
}
