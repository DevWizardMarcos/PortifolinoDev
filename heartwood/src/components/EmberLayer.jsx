import { useMemo } from 'react'
import './EmberLayer.css'

/**
 * Brasas douradas subindo pelo mundo inteiro — a mesma poeira mágica
 * do herói ao contato, costurando as regiões. Camada puramente
 * decorativa: pointer-events none, invisível para leitores de tela,
 * desligada com prefers-reduced-motion.
 */
const EMBER_COUNT = 14

export default function EmberLayer() {
  const embers = useMemo(
    () =>
      Array.from({ length: EMBER_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 7.3 + 4) % 100}%`,
        size: 2 + ((i * 13) % 3),
        duration: `${16 + ((i * 7) % 14)}s`,
        delay: `${-((i * 5) % 20)}s`,
        drift: `${((i % 5) - 2) * 30}px`,
      })),
    [],
  )

  return (
    <div className="embers" aria-hidden="true">
      {embers.map((e) => (
        <span
          key={e.id}
          className="embers__mote"
          style={{
            left: e.left,
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDuration: e.duration,
            animationDelay: e.delay,
            '--drift': e.drift,
          }}
        />
      ))}
    </div>
  )
}
