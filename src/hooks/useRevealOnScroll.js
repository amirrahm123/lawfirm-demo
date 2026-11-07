import { useEffect, useLayoutEffect } from 'react'

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-reveal'

// Whatever the observer has not revealed by then is shown anyway, so a slow or
// broken IntersectionObserver (some in-app browsers) never leaves content hidden.
const FALLBACK_MS = 1500

// Reveal slightly before an element scrolls into view.
const ROOT_MARGIN = '0px 0px 60px 0px'

// Small delay between press cards that reveal together, for a light stagger.
const STAGGER_MS = 70
const MAX_STAGGER_STEPS = 4

const prefersNoMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  || document.documentElement.classList.contains('a11y-no-motion')

const showAll = () =>
  document.querySelectorAll(SELECTOR).forEach(el => el.classList.add('visible'))

export default function useRevealOnScroll() {
  // Arm the page before first paint. The CSS hides .reveal elements only while
  // html.reveal-ready is set, so without this hook (or with reduced motion,
  // where it never arms) content is simply visible.
  useLayoutEffect(() => {
    if (prefersNoMotion()) return
    const root = document.documentElement
    root.classList.add('reveal-ready')
    return () => root.classList.remove('reveal-ready')
  }, [])

  useEffect(() => {
    const timer = setTimeout(showAll, FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [])

  // No dependency list on purpose: runs after every render so elements that
  // appear later are observed too.
  useEffect(() => {
    if (prefersNoMotion() || typeof IntersectionObserver !== 'function') {
      showAll()
      return
    }

    const observer = new IntersectionObserver(entries => {
      let step = 0
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target
        if (el.parentElement?.classList.contains('press-grid')) {
          const delay = Math.min(step++, MAX_STAGGER_STEPS) * STAGGER_MS
          if (delay) {
            el.style.transitionDelay = `${delay}ms`
            // Clear it once the fade is done so hover effects aren't delayed.
            setTimeout(() => { el.style.transitionDelay = '' }, delay + 700)
          }
        }
        el.classList.add('visible')
        observer.unobserve(el)
      })
    }, { threshold: 0, rootMargin: ROOT_MARGIN })

    document.querySelectorAll(SELECTOR).forEach(el => {
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  })
}
