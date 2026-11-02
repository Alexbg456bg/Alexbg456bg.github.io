import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { Bracket, Logo } from '../components/brand/Logo'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formEndpoint, siteConfig } from '../config'
import { about, contact } from '../content'
import { easeBrand } from '../lib/motion'
import { useLocation } from 'react-router-dom'
import type { PrefillState } from './Services'

type Fields = { name: string; email: string; message: string }
type Key = keyof Fields
type Status = 'idle' | 'sending' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const t = contact.form
const ERROR = '#FF9EAE'

function validateField(key: Key, value: string): string | undefined {
  const v = value.trim()
  if (key === 'name') return v ? undefined : t.errors.nameRequired
  if (key === 'email') {
    if (!v) return t.errors.emailRequired
    return EMAIL_RE.test(v) ? undefined : t.errors.emailInvalid
  }
  if (!v) return t.errors.messageRequired
  return v.length < 10 ? t.errors.messageShort : undefined
}

/** Input with a label that floats up on focus or when filled (transform only). */
function FloatingField({
  id,
  label,
  value,
  error,
  multiline = false,
  type = 'text',
  autoComplete,
  inputMode,
  onChange,
  onBlur,
}: {
  id: string
  label: string
  value: string
  error?: string
  multiline?: boolean
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'text'
  onChange: (v: string) => void
  onBlur: () => void
}) {
  const invalid = !!error
  const cls = `peer block w-full rounded-xl border bg-navy-950/60 px-4 pb-3 pt-7 text-ink placeholder-transparent transition-colors duration-300 focus:outline-none ${
    invalid ? 'border-[#FF9EAE]/70 focus:border-[#FF9EAE]' : 'border-line hover:border-ink/30 focus:border-cyan'
  }`
  const common = {
    id,
    name: id,
    value,
    placeholder: label,
    'aria-invalid': invalid,
    'aria-describedby': invalid ? `${id}-error` : undefined,
    onBlur,
    className: cls,
  }
  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...common} rows={6} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-y`} />
        ) : (
          <input
            {...common}
            type={type}
            autoComplete={autoComplete}
            inputMode={inputMode}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-[1.15rem] origin-left text-ink-muted transition-transform duration-300 ease-brand peer-focus:-translate-y-3 peer-focus:scale-[0.78] peer-focus:text-cyan peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.78]"
        >
          {label}
        </label>
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            id={`${id}-error`}
            className="mt-2 text-sm"
            style={{ color: ERROR }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Brackets slide together and the logo draws itself. */
function Success({ onAgain }: { onAgain: () => void }) {
  // The logo starts drawing as the brackets meet.
  const [showLogo, setShowLogo] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setShowLogo(true), 750)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <m.div
      key="success"
      role="status"
      className="flex min-h-[26rem] flex-col items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="relative flex h-24 w-64 items-center justify-center" aria-hidden="true">
        <m.span
          className="absolute left-0 text-cyan"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 40, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1, ease: easeBrand }}
        >
          <Bracket side="left" className="h-20 w-auto" />
        </m.span>
        <m.span
          className="absolute right-0 text-cyan"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: -40, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1, ease: easeBrand }}
        >
          <Bracket side="right" className="h-20 w-auto" />
        </m.span>
        {showLogo && <Logo ink="white" draw title={null} className="h-20 w-auto" />}
      </span>
      <p className="mt-8 max-w-sm text-lg font-medium">{t.success}</p>
      <button type="button" onClick={onAgain} className="mt-6 text-sm font-semibold text-cyan underline-offset-4 hover:underline">
        {t.again}
      </button>
    </m.div>
  )
}

function ContactForm() {
  const uid = useId()
  const ids: Record<Key, string> = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message` }
  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorText, setErrorText] = useState(t.error)
  const [prefilled, setPrefilled] = useState(false)
  // The service picker opens this page with its summary in the router state.
  const { state } = useLocation() as { state: PrefillState | null }
  useEffect(() => {
    if (!state?.prefill) return
    setFields((f) => ({ ...f, message: state.prefill ?? '' }))
    setPrefilled(true)
  }, [state])

  const errorFor = (key: Key) => (touched[key] ? validateField(key, fields[key]) : undefined)
  const update = (key: Key) => (value: string) => setFields((f) => ({ ...f, [key]: value }))
  const blur = (key: Key) => () => setTouched((tt) => ({ ...tt, [key]: true }))

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    const firstInvalid = (['name', 'email', 'message'] as Key[]).find((k) => validateField(k, fields[k]))
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus()
      return
    }
    if (!formEndpoint) {
      setErrorText(t.notConfigured)
      setStatus('error')
      return
    }
    const honeypot = (e.currentTarget.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value
    setStatus('sending')
    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...fields, _gotcha: honeypot ?? '' }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('success')
      setFields({ name: '', email: '', message: '' })
      setTouched({})
      setPrefilled(false)
    } catch {
      setErrorText(t.error)
      setStatus('error')
    }
  }

  return (
    <div className="glass-border relative overflow-hidden rounded-card bg-navy-850/60 p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <Success onAgain={() => setStatus('idle')} />
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            className="grid gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FloatingField id={ids.name} label={t.name} autoComplete="name" value={fields.name} error={errorFor('name')} onChange={update('name')} onBlur={blur('name')} />
              <FloatingField
                id={ids.email}
                label={t.email}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={fields.email}
                error={errorFor('email')}
                onChange={update('email')}
                onBlur={blur('email')}
              />
            </div>
            <FloatingField id={ids.message} label={t.message} multiline value={fields.message} error={errorFor('message')} onChange={update('message')} onBlur={blur('message')} />
            <AnimatePresence>
              {prefilled && (
                <m.p className="-mt-2 text-sm text-cyan" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {t.prefilled}
                </m.p>
              )}
            </AnimatePresence>
            <p className="-mt-1 flex items-start gap-2 text-sm text-ink-faint">
              <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true">
                <path d="M4 7V5a4 4 0 1 1 8 0v2M3.5 7h9v7h-9z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {t.privacy}
            </p>
            {/* Spam trap for Formspree; hidden from people and assistive tech. */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <MagneticButton type="submit" disabled={status === 'sending'} strength={0.2}>
                {status === 'sending' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" aria-hidden="true" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    {t.submit}
                    <ArrowIcon className="transition-transform duration-300 ease-brand group-hover:translate-x-1" />
                  </>
                )}
              </MagneticButton>
              <div aria-live="polite" className="min-h-6 text-sm">
                <AnimatePresence>
                  {status === 'error' && (
                    <m.p style={{ color: ERROR }} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      {errorText}
                    </m.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Contact() {
  const { email, phones } = siteConfig.contact
  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="section">
      <div className="container-x relative grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionHeader as="h1" id="kontakt-title" eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro} />
          <FadeIn delay={0.2}>
            <div className="mt-8 flex items-center gap-4">
              <span className="flex -space-x-3">
                {about.people.map((person) => (
                  <img
                    key={person.name}
                    src={person.photo}
                    width={640}
                    height={800}
                    alt={person.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 rounded-full object-cover object-[50%_25%] ring-4 ring-navy-950"
                  />
                ))}
              </span>
              <p className="text-sm font-semibold text-ink-muted">{contact.replyBy}</p>
            </div>
            {(email || phones.length > 0) && (
              <dl className="mt-10 grid gap-5">
                {email && (
                  <div>
                    <dt className="eyebrow">{contact.emailLabel}</dt>
                    <dd className="mt-2 text-lg font-semibold">
                      <a href={`mailto:${email}`} className="hover:text-cyan">
                        {email}
                      </a>
                    </dd>
                  </div>
                )}
                {phones.length > 0 && (
                  <div>
                    <dt className="eyebrow">{contact.phoneLabel}</dt>
                    {phones.map((p) => (
                      <dd key={p.tel} className="mt-2">
                        <a href={`tel:${p.tel}`} className="text-lg font-semibold hover:text-cyan">
                          {p.display}
                        </a>
                        <span className="ml-2 text-sm text-ink-muted">{p.name}</span>
                      </dd>
                    ))}
                  </div>
                )}
              </dl>
            )}
          </FadeIn>
        </div>
        <FadeIn delay={0.1}>
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  )
}
