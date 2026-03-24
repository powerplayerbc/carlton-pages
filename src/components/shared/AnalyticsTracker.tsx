'use client'

import { useEffect, useRef, useCallback } from 'react'

interface AnalyticsTrackerProps {
  pageId: string
  slug: string
  variantKey: string | null
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'carlton_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

function getUtmParams(): Record<string, string | null> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  }
}

async function sendEvent(
  eventType: string,
  pageId: string,
  slug: string,
  variantKey: string | null,
  metadata?: Record<string, string | number | boolean | null>
) {
  const visitorId = getVisitorId()
  const utm = getUtmParams()

  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        page_id: pageId,
        slug,
        visitor_id: visitorId,
        variant_key: variantKey,
        metadata,
        ...utm,
      }),
    })
  } catch {
    // Silently fail -- analytics should never break the page
  }
}

export function AnalyticsTracker({ pageId, slug, variantKey }: AnalyticsTrackerProps) {
  const hasTrackedView = useRef(false)
  const scrollMilestones = useRef<Set<number>>(new Set())

  // Track page view on mount
  useEffect(() => {
    if (hasTrackedView.current) return
    hasTrackedView.current = true
    sendEvent('page_view', pageId, slug, variantKey)
  }, [pageId, slug, variantKey])

  // Track scroll depth
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight <= 0) return

    const scrollPercent = Math.round((scrollTop / docHeight) * 100)
    const milestones = [50, 100]

    for (const milestone of milestones) {
      if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
        scrollMilestones.current.add(milestone)
        sendEvent('scroll_depth', pageId, slug, variantKey, {
          depth_percent: milestone,
        })
      }
    }
  }, [pageId, slug, variantKey])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Track CTA clicks via event delegation
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const ctaEl = target.closest('[data-track-cta]')
      if (ctaEl) {
        const ctaLabel = ctaEl.getAttribute('data-track-cta') ?? 'unknown'
        sendEvent('cta_click', pageId, slug, variantKey, {
          cta_label: ctaLabel,
          cta_href: (ctaEl as HTMLAnchorElement).href ?? '',
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pageId, slug, variantKey])

  // This component renders nothing -- purely behavioral
  return null
}
