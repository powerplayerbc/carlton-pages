interface PricingCardProps {
  price: string
  originalPrice?: string
  period?: string
  features?: string[]
  ctaText: string
  ctaUrl: string
  badge?: string
  heading?: string
  subheading?: string
}

export function PricingCard({
  price,
  originalPrice,
  period,
  features,
  ctaText,
  ctaUrl,
  badge,
  heading,
  subheading,
}: PricingCardProps) {
  return (
    <section className="py-20 sm:py-28" aria-label="Pricing">
      <div className="mx-auto max-w-2xl px-6">
        {heading && (
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mb-12 max-w-xl text-center text-lg text-navy-300">
            {subheading}
          </p>
        )}

        <div className="relative rounded-3xl border border-accent-400/20 bg-gradient-to-b from-navy-800/80 to-navy-900/80 p-10 shadow-2xl shadow-accent-500/5 backdrop-blur sm:p-12">
          {badge && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-accent-500 px-5 py-1.5 text-sm font-bold uppercase tracking-wider text-navy-950">
                {badge}
              </span>
            </div>
          )}

          <div className="text-center">
            {/* Price display */}
            <div className="flex items-baseline justify-center gap-3">
              {originalPrice && (
                <span className="text-2xl text-navy-400 line-through" aria-label={`Original price ${originalPrice}`}>
                  {originalPrice}
                </span>
              )}
              <span className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                {price}
              </span>
              {period && (
                <span className="text-lg text-navy-400">/{period}</span>
              )}
            </div>

            {/* Features list */}
            {features && features.length > 0 && (
              <ul className="mt-10 space-y-4 text-left" role="list">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-6 w-6 flex-shrink-0 text-accent-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-navy-100">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <a
              href={ctaUrl}
              data-track-cta="pricing-cta"
              className="mt-10 inline-flex w-full items-center justify-center rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent-500/25 transition-all duration-200 hover:bg-accent-400 hover:shadow-accent-400/30 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 sm:w-auto sm:px-12"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
