import type { LandingPage, Testimonial, BodySection, BenefitsContent, HowItWorksContent, FaqContent, StatsContent, CtaContent } from '@/lib/types'
import { Hero } from '@/components/shared/Hero'
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel'
import { PricingCard } from '@/components/shared/PricingCard'
import { Footer } from '@/components/shared/Footer'

interface ScorecardTemplateProps {
  page: LandingPage
  testimonials: Testimonial[]
  variantKey: string | null
}

export function ScorecardTemplate({ page, testimonials }: ScorecardTemplateProps) {
  return (
    <main className="min-h-screen bg-navy-950">
      <Hero page={page} badgeText="Free AI Assessment" />

      {/* Scorecard intro / what you'll learn */}
      <section className="py-20 sm:py-28" aria-label="What you will discover">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-accent-400">
                Your Personalized Report
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Find out exactly where AI can transform your business
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy-200">
                Our AI Readiness Scorecard analyzes your operations across key
                dimensions and delivers a personalized roadmap with specific,
                actionable recommendations.
              </p>
            </div>

            {/* Scorecard preview card */}
            <div className="rounded-2xl border border-navy-700/40 bg-gradient-to-br from-navy-800/60 to-navy-900/60 p-8 backdrop-blur">
              <h3 className="mb-6 text-lg font-bold text-white">Assessment Dimensions</h3>
              <div className="space-y-5">
                {[
                  { label: 'Process Automation', score: 85, color: 'bg-emerald-400' },
                  { label: 'Data Infrastructure', score: 62, color: 'bg-accent-400' },
                  { label: 'Customer Experience', score: 74, color: 'bg-sky-400' },
                  { label: 'Team AI Literacy', score: 45, color: 'bg-violet-400' },
                  { label: 'Strategic Alignment', score: 90, color: 'bg-rose-400' },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-navy-200">{dim.label}</span>
                      <span className="text-sm font-bold text-white">{dim.score}/100</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-navy-700">
                      <div
                        className={`h-full rounded-full ${dim.color} transition-all duration-1000`}
                        style={{ width: `${dim.score}%` }}
                        role="progressbar"
                        aria-valuenow={dim.score}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${dim.label}: ${dim.score} out of 100`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-xs text-navy-400">
                Sample scorecard results. Your report will be customized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic body sections */}
      {page.body_sections.map((section, idx) => (
        <ScorecardSection key={`${section.type}-${idx}`} section={section} index={idx} />
      ))}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <TestimonialCarousel testimonials={testimonials} heading="Business Leaders Trust Our Assessment" />
      )}

      {/* Pricing / CTA */}
      {page.stripe_payment_link ? (
        <PricingCard
          price={page.price_display ?? 'Free'}
          ctaText={page.cta_text}
          ctaUrl={page.stripe_payment_link}
          badge="Most Popular"
          heading="Get Your AI Readiness Score"
          subheading="Detailed analysis with actionable recommendations"
        />
      ) : (
        <section className="py-20 sm:py-28" aria-label="Get started">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Discover Your AI Potential?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-navy-200">
              Take the assessment today and get your personalized AI readiness
              report delivered to your inbox.
            </p>
            <a
              href={page.cta_url}
              data-track-cta="scorecard-bottom-cta"
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

function ScorecardSection({ section, index }: { section: BodySection; index: number }) {
  const isEven = index % 2 === 0

  switch (section.type) {
    case 'benefits': {
      const c = section.content as BenefitsContent
      return (
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'Benefits'}>
          <div className="mx-auto max-w-7xl px-6">
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
                <div
                  key={i}
                  className="rounded-2xl border border-navy-700/30 bg-navy-900/50 p-8 transition-colors duration-300 hover:border-accent-400/20"
                >
                  {item.icon && (
                    <span className="mb-4 inline-block text-3xl" aria-hidden="true">{item.icon}</span>
                  )}
                  <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                  <p className="leading-relaxed text-navy-300">{item.description}</p>
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
              <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
            )}
            {c.subheading && (
              <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-navy-300">
                {c.subheading}
              </p>
            )}
            <div className="relative">
              {/* Connecting line */}
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

    case 'stats': {
      const c = section.content as StatsContent
      return (
        <section className="bg-gradient-to-r from-navy-800/50 to-navy-900/50 py-16 sm:py-20" aria-label={c.heading || 'Statistics'}>
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
                    {stat.value}
                    {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
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
        <section className={`py-20 sm:py-28 ${isEven ? '' : 'bg-navy-900/30'}`} aria-label={c.heading || 'Frequently asked questions'}>
          <div className="mx-auto max-w-3xl px-6">
            {c.heading && (
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                {c.heading}
              </h2>
            )}
            <div className="space-y-6">
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
        <section className="py-20 sm:py-28" aria-label="Call to action">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.heading}</h2>
            {c.subheading && (
              <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-200">{c.subheading}</p>
            )}
            {c.urgency_text && (
              <p className="mt-4 text-sm font-semibold text-accent-400">{c.urgency_text}</p>
            )}
            <a
              href={c.cta_url}
              data-track-cta={`section-cta-${section.type}`}
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
