import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Home'
import useCounterAnimation from './hooks/useCounterAnimation'

export default function App() {
  useCounterAnimation()
  useEffect(() => { document.body.classList.add('page-loaded') }, [])
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header>
        <Navbar />
      </header>
      <section className="trust-section">
        <div className="trust-strip">
          <div className="trust-strip-item">
            <span className="trust-strip-icon">&#9878;&#65039;</span>
            <div className="trust-strip-text">
              <span className="trust-strip-num" data-target="20">0</span>
              <span className="trust-strip-label">years of experience</span>
            </div>
          </div>
          <div className="trust-strip-item">
            <span className="trust-strip-icon">&#11088;</span>
            <div className="trust-strip-text">
              <span className="trust-strip-num">4.9 / 5</span>
              <span className="trust-strip-label">client rating on Google</span>
            </div>
          </div>
          <div className="trust-strip-item">
            <span className="trust-strip-icon">&#128188;</span>
            <div className="trust-strip-text">
              <span className="trust-strip-num" data-target="1200">0</span>
              <span className="trust-strip-label">cases handled</span>
            </div>
          </div>
        </div>
      </section>
      <main id="main-content" tabIndex={-1}>
        <Home />
      </main>
      <Footer />
      <a className="demo-badge" href="mailto:amirrahm135@gmail.com?subject=BuildLab%20demo">Design demo · BuildLab</a>
    </>
  )
}
