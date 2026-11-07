/* eslint-disable react/prop-types -- this codebase does not use PropTypes anywhere */
import { useEffect, useState, useRef } from 'react'
import useRevealOnScroll from './hooks/useRevealOnScroll'
import TestimonialsCarousel from './components/TestimonialsCarousel'
import ContactForm from './components/ContactForm'
import { site, whatsappLink, CONSULT_PHRASE } from './config/site'
import { practiceAreas, AreaIcon } from './data/practiceAreas'

// Line icons for the "פרטי המשרד" contact rows — 24×24, shared stroke width.
const contactIconPaths = {
  pin: <><path d="M12 21.5S5.5 14.1 5.5 9.4A6.5 6.5 0 0 1 18.5 9.4c0 4.7-6.5 12.1-6.5 12.1Z" /><circle cx="12" cy="9.4" r="2.4" /></>,
  phone: <path d="M6.7 10.9c1.3 2.7 3.6 5 6.3 6.3l2-2c.3-.3.7-.4 1.1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1.1v3.2c0 .6-.4 1.1-1 1.1C10.5 21 3 13.5 3 4.4c0-.6.5-1 1.1-1h3.2c.6 0 1.1.4 1.1 1 0 1.2.2 2.4.6 3.5.2.4.1.8-.2 1.1l-2.1 2Z" />,
  chat: <path d="M20.5 11.6c0 4.4-3.8 8-8.5 8-1.2 0-2.4-.2-3.4-.7L4 20.5l1.6-4.4c-.6-1.1-1-2.4-1-3.7 0-4.4 3.8-8 8.5-8s8.5 3.5 8.5 8.2Z" />,
  fax: <><rect x="4.5" y="9.5" width="15" height="9" rx="1.4" /><path d="M7 9.5V5h10v4.5" /><path d="M8 14.8h3.2" /><rect x="14.7" y="13.8" width="3" height="4" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.8" /><path d="m4 7 8 6.2L20 7" /></>,
}
function ContactIcon({ type }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {contactIconPaths[type]}
    </svg>
  )
}
function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

const contactRows = [
  { type: 'pin', label: 'Address', value: site.address.full },
  { type: 'phone', label: 'Phone', value: site.phones.office.display, href: site.phones.office.href },
  { type: 'chat', label: 'WhatsApp', value: site.phones.whatsapp.display, href: whatsappLink(''), external: true },
  { type: 'fax', label: 'Fax', value: site.phones.fax.display },
  { type: 'mail', label: 'Email', value: site.email, href: `mailto:${site.email}` },
]

export default function Home() {
  useRevealOnScroll()

  const [areaPopup, setAreaPopup] = useState(null)
  const heroCanvasRef = useRef(null)

  // Hero background — diagonal gold lines on canvas, redrawn on resize
  useEffect(() => {
    const canvas = heroCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const w = rect.width
      const h = rect.height
      ctx.clearRect(0, 0, w, h)

      // Diagonal gold lines: spacing 36px, every 3rd thicker
      const spacing = 36
      const diag = w + h
      for (let i = -h; i < diag; i += spacing) {
        const idx = Math.floor((i + h) / spacing)
        const isThick = idx % 3 === 0
        ctx.beginPath()
        ctx.strokeStyle = isThick ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.09)'
        ctx.lineWidth = isThick ? 1.2 : 0.7
        ctx.moveTo(i, 0)
        ctx.lineTo(i + h, h)
        ctx.stroke()
      }
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  // Escape key closes modals
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && areaPopup) setAreaPopup(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [areaPopup])

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = areaPopup !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [areaPopup])

  return (
    <>
      {/* HERO — animated canvas background with scales of justice + gold lines */}
      <section className="hero-framed" id="home">
        <canvas ref={heroCanvasRef} className="hero-framed-canvas" aria-hidden="true" />
        <div className="hero-framed-overlay" aria-hidden="true" />

        <span className="hf-corner hf-corner-tl" aria-hidden="true" />
        <span className="hf-corner hf-corner-tr" aria-hidden="true" />
        <span className="hf-corner hf-corner-bl" aria-hidden="true" />
        <span className="hf-corner hf-corner-br" aria-hidden="true" />

        <div className="hero-framed-content">
          <h1 className="hero-framed-headline">
            When an injury changes your life,
            <br />
            <span className="accent">experience and strategy make the difference.</span>
          </h1>
          <div className="hero-framed-divider" aria-hidden="true"></div>
          <p className="hero-framed-sub">
            Legal representation in complex personal injury, insurance, employment and medical malpractice cases.
            <br />
            A boutique law firm in Munich since 2003 &middot; personal, dedicated support
          </p>
          <div className="hero-framed-actions">
            <a href="#contact" className="btn-teal">Book a free consultation &#8594;</a>
            <a href="#areas" className="btn-outline-white">Our practice areas</a>
          </div>
        </div>

        <img src="/pics/emblem.svg" alt="" aria-hidden="true" className="hero-emblem" />
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text reveal-right">
              <p className="section-eyebrow">About the firm</p>
              <h2 className="section-title">Over 20 years of legal determination</h2>
              <div className="teal-rule" style={{ marginBottom: 28 }}></div>
              <p>Lindner &amp; Partner is a boutique law firm founded in Munich in 2003. We help people who have been injured enforce their rights – in personal injury, insurance, employment and medical malpractice cases.</p>
              <p>We support our clients from the first assessment of their claim, through tough and professional negotiations, all the way to representation in court.</p>
              <p>Every case is handled personally by a partner, with clear communication and transparent fees from day one.</p>
              <div className="badges-row">
                <span className="badge-chip">Since 2003</span>
                <span className="badge-chip">Boutique firm</span>
                <span className="badge-chip">English &amp; German</span>
              </div>
              <div style={{ marginTop: 28 }}>
                <a href="#contact" className="btn-teal">Talk to us &#8594;</a>
              </div>
            </div>
            <div className="about-visual reveal-left" style={{ transitionDelay: '.15s', overflow: 'hidden', padding: 0, margin: 0 }}>
              <img src="/pics/office.webp" alt="Meeting room of the firm" width="1582" height="1600" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="section section-light" id="areas">
        <div className="container">
          <div className="areas-intro reveal">
            <div className="areas-intro-text">
              <h2 className="section-title">Practice areas</h2>
              <p className="section-sub">Comprehensive legal support – we are with you at every step of the way.</p>
              <div className="teal-rule"></div>
            </div>
            <a href="#contact" className="areas-intro-cta">Book {CONSULT_PHRASE} &#8594;</a>
          </div>
          <div className="areas-grid stagger-reveal">
            {practiceAreas.map((area, i) => (
              <div className="area-card" key={i} onClick={() => setAreaPopup(area)} style={{ cursor: 'pointer' }}>
                <span className="area-icon"><AreaIcon iconKey={area.iconKey} /></span>
                <div className="area-label">{area.label}</div>
                <div className="area-desc">{area.desc}</div>
                <span className="area-link">Learn more &#8594;</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICE AREA POPUP */}
      {areaPopup && (
        <div className="area-popup-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setAreaPopup(null) }}>
          <div className="area-popup">
            <button className="area-popup-close" onClick={() => setAreaPopup(null)} aria-label="Close">&times;</button>
            <span className="area-popup-icon"><AreaIcon iconKey={areaPopup.iconKey} size={40} /></span>
            <h3 className="area-popup-title">{areaPopup.label}</h3>
            <p className="area-popup-desc">{areaPopup.desc}</p>
            <ul className="area-popup-points">
              {areaPopup.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <div className="area-popup-actions">
              <a href="#contact" className="btn-teal" onClick={() => setAreaPopup(null)}>Ask about your case &#8594;</a>
              <a
                href={whatsappLink('Hello, I would like advice on ' + areaPopup.label)}
                target="_blank" rel="noopener noreferrer"
                className="btn-outline-white"
                style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
              >💬 WhatsApp</a>
            </div>
          </div>
        </div>
      )}


      {/* TESTIMONIALS */}
      <div id="testimonials"><TestimonialsCarousel /></div>

      {/* CONTACT */}
      <section className="section section-alt" id="contact">
        <div className="container">
          <div className="reveal">
            <h2 className="section-title">Contact us – {CONSULT_PHRASE}</h2>
            <p className="section-sub">Fill in the form and we will get back to you shortly, or call us directly.</p>
            <div className="teal-rule"></div>
          </div>
          <div className="contact-wrap">
            <div className="contact-info-box reveal">
              <h3>Office details</h3>
              <div className="info-list">
                {contactRows.map(row => {
                  const icon = <span className="info-row-icon"><ContactIcon type={row.type} /></span>
                  const body = (
                    <span className="info-row-body">
                      <span className="info-row-label">{row.label}</span>
                      <span className="info-row-value">{row.value}</span>
                    </span>
                  )
                  if (row.href) {
                    return (
                      <a
                        key={row.type}
                        href={row.href}
                        className="info-row info-row-link"
                        {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {icon}
                        {body}
                        <span className="info-row-chevron"><ChevronIcon /></span>
                      </a>
                    )
                  }
                  return (
                    <div key={row.type} className="info-row">
                      {icon}
                      {body}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="contact-form-box reveal" style={{ transitionDelay: '.15s' }}>
              <h3>Send a message</h3>
              <ContactForm />
            </div>
          </div>
          <div className="map-wrap reveal" style={{ marginTop: 48, background: '#1B3A5C', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,.12)' }}>
            <p style={{ textAlign: 'center', marginBottom: 6, fontSize: '0.85rem', color: '#6BAAF0', fontWeight: 600, letterSpacing: 1 }}>Location</p>
            <h3 style={{ textAlign: 'center', marginBottom: 20, fontSize: '1.5rem', color: '#fff', fontWeight: 800 }}>Our office</h3>
            <div style={{ width: 60, height: 3, background: '#4A90D9', borderRadius: 2, margin: '0 auto 24px' }}></div>
            <div className="map-container">
              <iframe src={site.mapsEmbedUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office location"></iframe>
            </div>
            <p style={{ textAlign: 'center', marginTop: 16, color: '#94a3b8', fontSize: '0.95rem' }}>&#128205; {site.address.full}</p>
          </div>
        </div>
      </section>
    </>
  )
}
