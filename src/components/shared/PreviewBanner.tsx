'use client'

import type { LandingPage } from '@/lib/types'

interface PreviewBannerProps {
  page: LandingPage
}

export function PreviewBanner({ page }: PreviewBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black px-4 py-3 text-center font-semibold shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="text-sm sm:text-base">
          PREVIEW MODE — Status:{' '}
          <span className="uppercase tracking-wide">{page.status}</span>
          {' | '}
          <span className="font-mono text-xs sm:text-sm opacity-80">{page.page_id}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs sm:text-sm opacity-75">
            Actions available after migration to HUMAN-TASK-UTIL
          </span>
        </div>
      </div>
    </div>
  )
}
