/* eslint-disable react/prop-types -- this codebase does not use PropTypes anywhere */
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import rawReviews from '../data/google-reviews.json'
import { GOOGLE_REVIEWS_URL } from '../config/site'

/* Real Google reviews, shown exactly as written in the JSON file and in its
   order. Entries need a non-empty `name` and `text`; any entry whose text
   still starts with "TODO" is a placeholder and is skipped. */
const reviews = (Array.isArray(rawReviews) ? rawReviews : []).filter(r =>
  r && typeof r.name === 'string' && r.name.trim() &&
  typeof r.text === 'string' && r.text.trim() &&
  !r.text.trim().startsWith('TODO'))

function Stars() {
  return (
    <div className="testi-stars" role="img" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z" />
        </svg>
      ))}
    </div>
  )
}

export function GoogleG({ size = 16 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

/* One card. The text is clamped to 5 lines; the toggle only appears when the
   review is actually longer than that. Side cards never expand. */
function ReviewCard({ review, role, expanded, onToggle }) {
  const isCenter = role === 'center'
  const textRef = useRef(null)
  const [overflows, setOverflows] = useState(false)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => {
      if (expanded) return
      setOverflows(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [review, expanded])

  const showToggle = isCenter && (overflows || expanded)

  return (
    <div
      className={`testi-card ${isCenter ? 'testi-card-center' : 'testi-card-side'}`}
      aria-hidden={isCenter ? undefined : 'true'}
    >
      <div className="testi-card-top">
        <div className="testi-quote-mark" aria-hidden="true">&quot;</div>
        <Stars />
      </div>
      <p
        ref={textRef}
        className={`testi-quote-text${isCenter && expanded ? ' is-expanded' : ''}`}
      >{review.text}</p>
      <div className="testi-toggle-row">
        {showToggle && (
          <button type="button" className="testi-toggle" onClick={onToggle} aria-expanded={expanded}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      <div className="testi-author-row">
        <div className="testi-author-initial" aria-hidden="true">{review.name.trim().charAt(0)}</div>
        <div className="testi-author-info">
          <span className="testi-author-name">{review.name}</span>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const total = reviews.length
  const autoRef = useRef(null)
  const touchStartX = useRef(0)

  const goTo = useCallback((n) => {
    setExpanded(false)
    setCurrent((n + total) % total)
  }, [total])

  const stopAuto = useCallback(() => clearInterval(autoRef.current), [])

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current)
    if (total < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    autoRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total)
    }, 5000)
  }, [total])

  /* Autoplay pauses while a review is expanded, so it isn't yanked away mid-read. */
  useEffect(() => {
    if (expanded) stopAuto()
    else startAuto()
    return stopAuto
  }, [expanded, startAuto, stopAuto])

  if (total === 0) return null

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
    stopAuto()
  }

  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX
    if (total > 1 && Math.abs(diff) > 50) {
      if (diff > 0) goTo(current + 1)
      else goTo(current - 1)
    }
    if (!expanded) startAuto()
  }

  const nav = (n) => { goTo(n); startAuto() }

  const prevIdx = (current - 1 + total) % total
  const nextIdx = (current + 1) % total
  /* With fewer than 3 reviews the side cards would repeat the centre one. */
  const showSides = total >= 3
  const toggle = () => setExpanded(v => !v)

  return (
    <section className="testi-section" id="testimonials" dir="rtl">
      <p className="testi-eyebrow">TESTIMONIALS</p>
      <h2 className="testi-title">What our clients say</h2>
      <p className="testi-source"><GoogleG size={16} /><span>Reviews from Google</span></p>
      <div className="testi-divider" aria-hidden="true" />

      <div
        className="testi-slider"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {total > 1 && (
          <button
            className="testi-arr testi-arr-prev"
            onClick={() => nav(current - 1)}
            aria-label="Previous"
          >&#8594;</button>
        )}

        <div className="testi-cards" key={current}>
          {showSides && <ReviewCard review={reviews[prevIdx]} role="side" />}
          <ReviewCard review={reviews[current]} role="center" expanded={expanded} onToggle={toggle} />
          {showSides && <ReviewCard review={reviews[nextIdx]} role="side" />}
        </div>

        {total > 1 && (
          <button
            className="testi-arr testi-arr-next"
            onClick={() => nav(current + 1)}
            aria-label="Next"
          >&#8592;</button>
        )}
      </div>

      {total > 1 && (
        <div className="testi-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`testi-dot${i === current ? ' active' : ''}`}
              onClick={() => nav(i)}
              aria-label={`Review ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
            />
          ))}
        </div>
      )}

      <a
        className="testi-google-btn"
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GoogleG size={18} />
        <span>All reviews on Google</span>
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    </section>
  )
}
