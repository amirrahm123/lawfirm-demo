import { useEffect } from 'react'

export default function useCounterAnimation() {
  useEffect(() => {
    const counters = document.querySelectorAll('[data-target]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const target = +el.dataset.target
        const duration = 2000
        const start = performance.now()

        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        }

        function update(now) {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = easeOutExpo(progress)
          el.textContent = Math.floor(eased * target)
          if (progress < 1) requestAnimationFrame(update)
          else el.textContent = target
        }

        requestAnimationFrame(update)
        observer.unobserve(el)
      })
    }, { threshold: 0.5 })

    counters.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  })
}
