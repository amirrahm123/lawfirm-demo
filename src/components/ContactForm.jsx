import { useState, useRef, useEffect } from 'react'
import { site } from '../config/site'

const EMPTY = { fname: '', lname: '', phone: '', email: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v, consent) {
  const e = {}
  if (!v.fname.trim()) e.fname = 'Please enter your first name'
  if (!v.lname.trim()) e.lname = 'Please enter your last name'
  if (v.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number'
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = 'This email address is not valid'
  if (!v.message.trim()) e.message = 'Please write a short message'
  if (!consent) e.consent = 'Please accept the privacy notice to send the form'
  return e
}
const ORDER = ['fname', 'lname', 'phone', 'email', 'message', 'consent']

// DEMO: the form validates but does not send anything.
export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const refs = useRef({})
  const successRef = useRef(null)
  useEffect(() => { if (status === 'success') successRef.current?.focus() }, [status])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
    if (errors[name]) setErrors(er => { const n = { ...er }; delete n[name]; return n })
  }
  const onSubmit = (e) => {
    e.preventDefault()
    const next = validate(values, consent)
    setErrors(next)
    const first = ORDER.find(f => next[f])
    if (first) { refs.current[first]?.focus(); return }
    setStatus('sending')
    setTimeout(() => setStatus('success'), 700)
  }

  if (status === 'success') {
    return (
      <div className="form-success form-success--shown" aria-live="polite" role="status">
        <div className="check" aria-hidden="true">✅</div>
        <h4 ref={successRef} tabIndex={-1}>Message received!</h4>
        <p>We will get back to you as soon as possible.<br />You can also call us at <a href={site.phones.office.href}>{site.phones.office.display}</a>.</p>
        <button type="button" className="form-submit form-submit--secondary" onClick={() => { setValues(EMPTY); setConsent(false); setStatus('idle') }}>Send another request →</button>
      </div>
    )
  }

  const field = (name, label, props = {}) => {
    const err = errors[name]
    const Tag = name === 'message' ? 'textarea' : 'input'
    return (
      <div className={`form-group${err ? ' has-error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <Tag id={name} name={name} value={values[name]} onChange={onChange} ref={el => { refs.current[name] = el }}
          aria-invalid={err ? 'true' : undefined} aria-describedby={err ? `${name}-error` : undefined} {...props} />
        {err && <p id={`${name}-error`} className="form-error">{err}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        {field('fname', 'First name', { type: 'text', placeholder: 'Anna', autoComplete: 'given-name' })}
        {field('lname', 'Last name', { type: 'text', placeholder: 'Müller', autoComplete: 'family-name' })}
      </div>
      <div className="form-row">
        {field('phone', 'Phone', { type: 'tel', placeholder: '+49 170 0000000', autoComplete: 'tel', inputMode: 'tel' })}
        {field('email', 'Email (optional)', { type: 'email', placeholder: 'name@example.com', autoComplete: 'email' })}
      </div>
      {field('message', 'Your message', { placeholder: 'Tell us briefly about your case…' })}
      <div className={`form-group form-consent-check${errors.consent ? ' has-error' : ''}`}>
        <label htmlFor="consent" className="form-consent-check-label">
          <input type="checkbox" id="consent" checked={consent} ref={el => { refs.current.consent = el }}
            onChange={e => { setConsent(e.target.checked); setErrors(er => { const n = { ...er }; delete n.consent; return n }) }} />
          <span>I agree that my details are processed to answer my enquiry, as described in the privacy notice.</span>
        </label>
        {errors.consent && <p className="form-error">{errors.consent}</p>}
      </div>
      <button type="submit" className="form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message →'}
      </button>
    </form>
  )
}
