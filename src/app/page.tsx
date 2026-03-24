import { supabase } from '@/lib/supabase'
import type { LandingPage } from '@/lib/types'
import Link from 'next/link'

export const revalidate = 3600

export default async function HomePage() {
  const { data: pages } = await supabase
    .from('landing_pages')
    .select('slug, headline, subheadline, meta_description, template_type, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(12)

  return (
    <main className="min-h-screen bg-navy-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-32 text-center sm:py-40">
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-accent-400">
            Carlton AI Services
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            AI Solutions That{' '}
            <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
              Drive Results
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">
            Expert AI strategy, automation, and implementation for businesses
            ready to scale with intelligence.
          </p>
        </div>
      </section>

      {/* Published pages listing */}
      {pages && pages.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
            Resources
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page: Pick<LandingPage, 'slug' | 'headline' | 'subheadline' | 'meta_description' | 'template_type' | 'updated_at'>) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="group rounded-2xl border border-navy-700/50 bg-navy-900/60 p-8 backdrop-blur transition-all duration-300 hover:border-accent-400/30 hover:bg-navy-800/60 hover:shadow-lg hover:shadow-accent-400/5"
              >
                <span className="mb-3 inline-block rounded-full bg-accent-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
                  {page.template_type.replace('_', ' ')}
                </span>
                <h3 className="mb-2 text-lg font-bold text-white group-hover:text-accent-300 transition-colors">
                  {page.headline}
                </h3>
                {page.subheadline && (
                  <p className="text-sm leading-relaxed text-navy-300">
                    {page.subheadline}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {(!pages || pages.length === 0) && (
        <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <div className="rounded-2xl border border-navy-700/50 bg-navy-900/40 p-16">
            <p className="text-lg text-navy-300">
              No published pages yet. Content will appear here once landing pages
              are published via the CMS.
            </p>
          </div>
        </section>
      )}
    </main>
  )
}
