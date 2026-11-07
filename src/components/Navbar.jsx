import { useState, useEffect, useRef } from 'react'
import { practiceAreas } from '../data/practiceAreas'

const areaLinks = practiceAreas.map(a => ({ href: '#areas', label: a.label }))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMobile = () => setMobileOpen(prev => {
    document.body.style.overflow = !prev ? 'hidden' : ''
    return !prev
  })
  const closeMobile = () => { setMobileOpen(false); document.body.style.overflow = '' }

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-row nav-row-logo">
          <div className="nav-row-inner">
            <a href="#home" className="nav-logo">
              <img src="/pics/emblem.svg" alt="" aria-hidden="true" className="nav-logo-img nav-logo-emblem" width="130" height="130" />
              <img src="/pics/logo-text.svg" alt="Lindner & Partner – Attorneys at Law" className="nav-logo-img nav-logo-text" width="360" height="62" />
            </a>
            <div className="nav-row-right nav-duns">
              <a href="#contact" className="nav-cta">Free consultation</a>
            </div>
            <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={toggleMobile} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <div className="nav-row nav-row-links">
          <div className="nav-row-inner">
            <ul className="nav-links">
              <li><a href="#about">About</a></li>
              <NavDropdown label="Practice areas" href="#areas" items={areaLinks} wide />
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <a href="#about" onClick={closeMobile}>About</a>
        <span className="mob-section-title">Practice areas</span>
        {areaLinks.map(a => <a key={a.label} href={a.href} onClick={closeMobile} className="mob-sub">{a.label}</a>)}
        <a href="#testimonials" onClick={closeMobile}>Testimonials</a>
        <a href="#contact" onClick={closeMobile}>Contact</a>
      </div>
    </>
  )
}

function NavDropdown({ label, href, items, wide }) {
  const timeoutRef = useRef(null)
  const [open, setOpen] = useState(false)
  const onEnter = () => { clearTimeout(timeoutRef.current); setOpen(true) }
  const onLeave = () => { timeoutRef.current = setTimeout(() => setOpen(false), 350) }
  return (
    <li className={`has-dropdown ${open ? 'dropdown-open' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <a href={href}>{label}</a>
      <div className={`nav-dropdown${wide ? ' nav-dropdown-wide' : ''}`}>
        {items.map(item => <a key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
      </div>
    </li>
  )
}
