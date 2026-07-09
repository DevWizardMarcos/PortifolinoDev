import { useRef, useState } from 'react'
import { profile } from '../content/profile'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import './Contact.css'

/**
 * A Lanterna — leve uma luz consigo.
 * O e-mail é copiável em um clique: recrutadores copiam e-mails,
 * e um mailto sozinho não basta (design doc §13.2).
 */
export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard bloqueado: o mailto ao lado continua funcionando
    }
  }

  return (
    <section id="contato" className="section contact">
      <div className="section__inner contact__inner">
        <SectionHeading
          sigil="✶ a fênix"
          title="Envie a Fênix"
          subtitle="O próximo capítulo ainda não foi escrito. Vamos conversar?"
        />

        <Reveal className="contact__card">
          <p className="contact__email-label">E-mail</p>
          <div className="contact__email-row">
            <a href={`mailto:${profile.email}`} className="contact__email">
              {profile.email}
            </a>
            <button type="button" className="btn btn--ghost contact__copy" onClick={copyEmail}>
              {copied ? 'Copiado ✓' : 'Copiar'}
            </button>
          </div>
          <span role="status" aria-live="polite" className="visually-hidden">
            {copied ? 'E-mail copiado para a área de transferência' : ''}
          </span>

          <div className="contact__links">
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>

          <p className="contact__promise">
            A fênix parte ao amanhecer e retorna em até 48h. Sério — pode cronometrar.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
