import { AnimatePresence, m } from 'framer-motion'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Bracket } from '../components/brand/Logo'
import { ArrowIcon, MagneticButton } from '../components/ui/MagneticButton'
import { ParallaxBracket } from '../components/ui/ParallaxBracket'
import { FadeIn } from '../components/ui/RevealText'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formEndpoint, siteConfig } from '../config'
import { contact } from '../content'
import { easeBrand } from '../lib/motion'

type Fields = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const t = contact.form

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = t.errors.nameRequired
  if (!f.email.trim()) e.email = t.errors.emailRequired
  else if (!EMAIL_RE.test(f.email.trim())) e.email = t.errors.emailInvalid
  if (!f.message.trim()) e.message = t.errors.messageRequired
  else if (f.message.trim().length < 10) e.message = t.errors.messageShort
  return e
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            id={`${id}-error`}
            className="mt-2 text-sm text-[#FF9EAE]"
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

const inputCls = (invalid: boolean) =>
  `block w-full rounded-xl border bg-navy-950/60 px-4 py-3.5 text-ink placeholder:text-ink-faint transition-colors duration-300 focus:outline-none focus-visible:outline-none ${
    invalid ? 'border-[#FF9EAE]/70 focus:border-[#FF9EAE]' : 'border-line hover:border-ink/30 focus:border-cyan'
  }`

function ContactForm() {
  const uid = useId()
  const ids = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message` }
  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorText, setErrorText] = useState(t.error)

  const update = (key: keyof Fields) => (value: string) => {
    const next = { ...fields, [key]: value }
    setFields(next)
    if (touched) setErrors(validate(next))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched(true)
    const found = validate(fields)
    setErrors(found)
    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0]
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
      setTouched(false)
    } catch {
      setErrorText(t.error)
      setStatus('error')
    }
  }

  const describedBy = (key: keyof Fields) => (errors[key] ? `${ids[key]}-error` : undefined)

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-navy-850/70 p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <m.div
            key="success"
            role="status"
            className="flex min-h-[26rem] flex-col items-center justify-center text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeBrand }}
          >
            <span className="flex items-center gap-3 text-cyan" aria-hidden="true">
              <Bracket side="left" className="h-12 w-auto" />
              <svg viewBox="0 0 24 24" className="h-10 w-10">
                <m.path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: easeBrand, delay: 0.2 }}
                />
              </svg>
              <Bracket side="right" className="h-12 w-auto" />
            </span>
            <p className="mt-8 max-w-sm text-lg font-medium">{t.success}</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm font-semibold text-cyan underline-offset-4 hover:underline"
            >
              {t.again}
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id={ids.name} label={t.name} error={errors.name}>
                <input
                  id={ids.name}
                  name="name"
                  autoComplete="name"
                  placeholder={t.namePlaceholder}
                  value={fields.name}
                  onChange={(e) => update('name')(e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy('name')}
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field id={ids.email} label={t.email} error={errors.email}>
                <input
                  id={ids.email}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  value={fields.email}
                  onChange={(e) => update('email')(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy('email')}
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>
            <Field id={ids.message} label={t.message} error={errors.message}>
              <textarea
                id={ids.message}
                name="message"
                rows={6}
                placeholder={t.messagePlaceholder}
                value={fields.message}
                onChange={(e) => update('message')(e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy('message')}
                className={`${inputCls(!!errors.message)} resize-y`}
              />
            </Field>
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
                    <m.p
                      className="text-[#FF9EAE]"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
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
  const { email, phone } = siteConfig.contact
  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <ParallaxBracket side="right" className="-right-24 top-32 hidden h-[34rem] lg:block" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionHeader id="kontakt-title" eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro} />
          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-md text-pretty text-ink-muted">{contact.about}</p>
            {(email || phone) && (
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
                {phone && (
                  <div>
                    <dt className="eyebrow">{contact.phoneLabel}</dt>
                    <dd className="mt-2 text-lg font-semibold">
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-cyan">
                        {phone}
                      </a>
                    </dd>
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
