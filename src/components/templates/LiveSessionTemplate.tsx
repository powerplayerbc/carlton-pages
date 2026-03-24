import type { LandingPage, Testimonial, BodySection, BenefitsContent, HowItWorksContent, FaqContent, FeaturesContent, CtaContent, StatsContent } from '@/lib/types'
import { Hero } from '@/components/shared/Hero'
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel'
import { PricingCard } from '@/components/shared/PricingCard'
import { Footer } from '@/components/shared/Footer'

interface LiveSessionTemplateProps {
  page: LandingPage
  testimonials: Testimonial[]
  variantKey: string | null
}

export function LiveSessionTemplate({ page, testimonials }: LiveSessionTemplateProps) {
  return (
    <main className="min-h-screen bg-navy-950">
      {/* Urgency banner */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-500 py-3 text-center">
        <p className="text-sm font-semibold text-navy-950">
          Limited Spots Available &mdash; Reserve Your Seat Now
        </p>
      </div>

      <Hero page={page} badgeText="Live Session" />

      {/* Countdown / session details */}
      <section className="py-16 sm:py-20" aria-label="Session information">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <svg className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
                label: 'Date',
                value: 'Check confirmation email',
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: 'Duration',
                value: '60 minutes',
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                label: 'Format',
                value: 'Live + Q&A',
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                label: 'Guarantee',
                value: 'Full refund available',
              },
            ].map((detail) => (
              <div
                key={detail.label}
                className="flex flex-col items-center rounded-2xl border border-navy-700/30 bg-navy-900/40 p-6 text-center backdrop-blur"
              >
                {detail.icon}
                <p className="mt-3 text-sm text-navy-400">{detail.label}</p>
                <p className="mt-1 text-base font-bold text-white">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you will get */}
      <section className="bg-navy-900/30 py-20 sm:py-28" aria-label="What is included">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent-400">
              What Is Included
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Succeed
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Live Instruction',
                desc: 'Real-time teaching with an expert practitioner who has done this work in production.',
                icon: '🎯',
              },
              {
                title: 'Interactive Q&A',
                desc: 'Bring your specific challenges. Get personalized answers and recommendations.',
                icon: '💬',
              },
              {
                title: 'Session Recording',
                desc: 'Full recording delivered within 24 hours so you can review at your own pace.',
                icon: '🎥',
              },
              {
                title: 'Action Templates',
                desc: 'Ready-to-use templates and frameworks you can implement immediately.',
                icon: '📋',
              },
              {
                title: 'Resource Pack',
                desc: 'Curated links, tools, and reading materials to continue your learning.',
                icon: '📦',
              },
              {
                title: 'Community Access',
                desc: 'Join a group of like-minded professionals implementing the same strategies.',
                icon: '🤝',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-navy-700/30 bg-navy-900/60 p-8 transition-all duration-300 hover:border-accent-400/20"
              >
                <span className="mb-4 inline-block text-3xl" aria-hidden="true">{item.icon}</span>
                <h3 className="mb-3 text-lg font-bold text-white">{item.title}</h3>
                <p className="leading-relaxed text-navy-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic body sections */}
      {page.body_sections.map((section, idx) => (
        <LiveSessionSection key={`${section.type}-${idx}`} section={section} index={idx} />
      ))}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <TestimonialCarousel testimonials={testimonials} heading="From Past Participants" />
      )}

      {/* Pricing */}
      {page.stripe_payment_link ? (
        <PricingCard
          price={page.price_display ?? '$0'}
          ctaText={page.cta_text}
          ctaUrl={page.stripe_payment_link}
          badge="Reserve Your Spot"
          heading="Secure Your Seat"
          subheading="Limited capacity to ensure a high-quality, interactive experience"
          features={[
            'Live 60-minute session with Q&A',
            'Full session recording (24hr delivery)',
            'Slide deck and templates',
            'Resource pack and tool list',
            'Money-back guarantee',
          ]}
        />
      ) : (
        <section className="py-20 sm:py-28" aria-label="Register">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Join Us Live?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-navy-200">
              Seats are limited. Register now to guarantee your spot and get
              immediate access to pre-session materials.
            </p>
            <a
              href={page.cta_url}
              data-track-cta="live-session-bottom-cta"
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

function LiveSessionSection({ section, index }: { section: BodySection; index: number }) {
  const isEven = index % 2 === 0

  switch (section.type) {
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
            <div className="grid gap-6 sm:grid-cols-2">
              {c.items.map((item, i) => (
                <div key={i} className="flex gap-4 rounded-xl border border-navy-700/20 bg-navy-900/30 p-6">
                  <svg className="mt-1 h-6 w-6 flex-shrink-0 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-navy-300">{item.description}</p>
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
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'Process'}>
          <div className="mx-auto max-w-4xl px-6">
            {c.heading && (
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
            )}
            <div className="space-y-8">
              {c.steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-accent-400/30 bg-accent-400/10 text-xl font-extrabold text-accent-400">
                    {step.number ?? i + 1}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-navy-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((item, i) => (
                <div key={i} className="rounded-2xl border border-navy-700/30 bg-navy-900/40 p-8 transition-all duration-300 hover:border-accent-400/20">
                  {item.icon && (
                    <span className="mb-4 inline-block text-3xl" aria-hidden="true">{item.icon}</span>
                  )}
                  <h3 className="mb-3 text-lg font-bold text-white">{item.title}</h3>
                  <p className="leading-relaxed text-navy-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    case 'stats': {
      const c = section.content as StatsContent
      return (
        <section className="bg-gradient-to-r from-navy-900/60 to-navy-800/40 py-16 sm:py-20" aria-label={c.heading || 'Results'}>
          <div className="mx-auto max-w-6xl px-6">
            {c.heading && (
              <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
                {c.heading}
              </h2>
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

    case 'faq': {
      const c = section.content as FaqContent
      return (
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'FAQ'}>
          <div className="mx-auto max-w-3xl px-6">
            {c.heading && (
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
            )}
            <div className="space-y-4">
              {c.items.map((item, i) => (
                <details key={i} className="group rounded-xl border border-navy-700/40 bg-navy-900/40">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-lg font-semibold text-white transition-colors hover:text-accent-400 [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg className="h-5 w-5 flex-shrink-0 text-navy-400 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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

    case 'cta': {
      const c = section.content as CtaContent
      return (
        <section className="bg-gradient-to-r from-accent-500/5 via-navy-950 to-accent-500/5 py-20 sm:py-28" aria-label="Call to action">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
            {c.subheading && (
              <p className="mx-auto mt-6 max-w-xl text-lg text-navy-200">{c.subheading}</p>
            )}
            {c.urgency_text && (
              <p className="mt-4 inline-block rounded-full bg-accent-500/10 px-4 py-1 text-sm font-semibold text-accent-400">
                {c.urgency_text}
              </p>
            )}
            <div className="mt-10">
              <a
                href={c.cta_url}
                data-track-cta="live-session-section-cta"
                className="inline-flex items-center rounded-xl bg-accent-500 px-10 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:scale-[1.02]"
              >
                {c.cta_text}
              </a>
            </div>
          </div>
        </section>
      )
    }

    default:
      return null
  }
}
