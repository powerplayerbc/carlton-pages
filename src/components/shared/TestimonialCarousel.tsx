import type { Testimonial } from '@/lib/types'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  heading?: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-accent-400' : 'text-navy-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialCarousel({
  testimonials,
  heading = 'What Our Clients Say',
}: TestimonialCarouselProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="bg-navy-900/50 py-20 sm:py-28" aria-label="Testimonials">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.testimonial_id}
              className="relative flex flex-col rounded-2xl border border-navy-700/40 bg-navy-900/80 p-8 backdrop-blur"
            >
              {/* Decorative quote mark */}
              <svg
                className="absolute right-6 top-6 h-10 w-10 text-accent-400/10"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              {t.rating && <StarRating rating={t.rating} />}

              {t.headline && (
                <h3 className="mt-4 text-lg font-bold text-white">
                  {t.headline}
                </h3>
              )}

              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-navy-200">
                &ldquo;{t.short_version || t.polished_text}&rdquo;
              </blockquote>

              <div className="mt-6 border-t border-navy-700/40 pt-6">
                <p className="font-semibold text-white">{t.attribution_name}</p>
                {(t.attribution_title || t.attribution_company) && (
                  <p className="mt-1 text-sm text-navy-400">
                    {[t.attribution_title, t.attribution_company]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
