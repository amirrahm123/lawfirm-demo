/** DEMO: fictional firm for a BuildLab design demo. */
export const site = {
  name: 'Lindner & Partner',
  legalName: 'Lindner & Partner Rechtsanwälte',
  tagline: 'Personal injury · Insurance · Employment law',
  foundedYear: 2003,
  address: { full: 'Musterstraße 8, 80331 Munich', short: 'Musterstraße 8, Munich' },
  phones: {
    office: { display: '+49 89 1234 5600', href: 'tel:+498912345600' },
    whatsapp: { display: '+49 151 1234 5600', number: '4915112345600' },
    fax: { display: '+49 89 1234 5601' },
  },
  email: 'office@lindner-partner-demo.de',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=Marienplatz+M%C3%BCnchen&output=embed',
}

export const CONSULT_PHRASE = 'a free initial consultation'
export const GOOGLE_REVIEWS_URL = '#'
export const whatsappLink = (text = '') =>
  `https://wa.me/${site.phones.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ''}`
