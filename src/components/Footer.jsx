import { site } from '../config/site'

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <div className="fl">{site.legalName}</div>
          <p className="footer-tagline">Personal, committed legal representation in Munich since {site.foundedYear}.</p>
        </div>
        <div className="footer-col footer-contact">
          <h4>Contact</h4>
          <a href={site.phones.office.href}><span>{site.phones.office.display}</span></a>
          <a href={`mailto:${site.email}`}><span>{site.email}</span></a>
          <p><span>Fax: {site.phones.fax.display}</span></p>
        </div>
        <div className="footer-col footer-office">
          <h4>Office</h4>
          <p>{site.address.full}</p>
          <h5>Opening hours</h5>
          <dl className="footer-hours">
            <dt>Mon – Thu:</dt><dd>08:00–18:00</dd>
            <dt>Fri:</dt><dd>08:00–14:00</dd>
            <dt>Sat – Sun:</dt><dd>Closed</dd>
          </dl>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {site.legalName}. Design demo – fictional firm.</p>
        <p className="footer-legal">
          <a href="#about">About</a>
          <span className="footer-legal-sep" aria-hidden="true">·</span>
          <a href="#areas">Practice areas</a>
          <span className="footer-legal-sep" aria-hidden="true">·</span>
          <a href="#">Imprint</a>
          <span className="footer-legal-sep" aria-hidden="true">·</span>
          <a href="#">Privacy</a>
        </p>
      </div>
    </footer>
  )
}
