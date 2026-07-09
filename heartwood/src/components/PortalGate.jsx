import { useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import Reveal from './Reveal'
import './PortalGate.css'

/**
 * O Portal — ao fundo da biblioteca, um anel de pedra cintila.
 * Atravessá-lo leva à Câmara do Tabuleiro com um lampejo de luz.
 * Sem JavaScript de efeito? O botão continua sendo um link funcional.
 */
export default function PortalGate() {
  const reducedMotion = usePrefersReducedMotion()
  const [flashing, setFlashing] = useState(false)
  const timerRef = useRef(null)

  function cross(event) {
    event.preventDefault()
    const destination = document.getElementById('tabuleiro')
    if (!destination) return

    if (reducedMotion) {
      destination.scrollIntoView()
      return
    }

    setFlashing(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      destination.scrollIntoView({ behavior: 'auto' })
      setTimeout(() => setFlashing(false), 80)
    }, 380)
  }

  return (
    <section id="portal" className="section portal" aria-label="Portal para o Tabuleiro">
      <div className="section__inner portal__inner">
        <Reveal className="portal__stage">
          <div className="portal__ring" aria-hidden="true">
            <div className="portal__ring-outer" />
            <div className="portal__ring-shimmer" />
            <div className="portal__ring-core" />
          </div>

          <p className="portal__whisper">
            Um anel de pedra zumbe baixinho.
            <br />
            Do outro lado: o Tabuleiro Medieval — o mapa vivo do reino.
          </p>

          <a href="#tabuleiro" className="btn btn--primary portal__cta" onClick={cross}>
            Atravessar o portal
          </a>
        </Reveal>
      </div>

      {/* O lampejo da travessia */}
      <div className={`portal__flash ${flashing ? 'is-on' : ''}`} aria-hidden="true" />
    </section>
  )
}
