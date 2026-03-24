import type { LandingPage } from '@/lib/types'

interface HeroProps {
  page: LandingPage
  badgeText?: string
  accentColor?: string
}

export function Hero({ page, badgeText, accentColor = 'accent' }: HeroProps) {
  return (
    <section className="relative overflow-hidden" aria-label="Page hero">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950" />
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-28 text-center sm:pb-28 sm:pt-36">
        {badgeText && (
          <div className="mb-8 inline-flex items-center rounded-full border border-accent-400/20 bg-accent-400/10 px-5 py-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent-400">
              {badgeText}
            </span>
          </div>
        )}

        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {page.headline}
        </h1>

        {page.subheadline && (
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-navy-200 sm:text-xl">
            {page.subheadline}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={page.cta_url}
            data-track-cta="hero-primary"
            className="inline-flex items-center rounded-xl bg-accent-500 px-8 py-4 text-base font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:shadow-accent-400/30 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
          >
            {page.cta_text}
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          {page.price_display && (
            <span className="text-sm text-navy-300">
              {page.price_display}
            </span>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy-950 to-transparent" />
    </section>
  )
}
