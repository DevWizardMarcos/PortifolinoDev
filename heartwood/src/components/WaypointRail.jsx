import { useEffect, useRef, useState } from 'react'
import { waypoints } from '../content/profile'
import './WaypointRail.css'

/**
 * O Fio Dourado — a trilha que costura o mundo.
 * É três coisas ao mesmo tempo: metáfora da jornada, indicador de
 * progresso e navegação real (cada runa é um link para um lugar).
 */
export default function WaypointRail() {
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState('inicio')
  const ticking = useRef(false)

  useEffect(() => {
    function measure() {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0)

      // Ativo = último lugar cujo topo já passou do meio da tela
      let current = waypoints[0].id
      for (const w of waypoints) {
        const el = document.getElementById(w.id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
          current = w.id
        }
      }
      setActiveId(current)
      ticking.current = false
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <nav className="rail" aria-label="Progresso da jornada">
      <div className="rail__thread" aria-hidden="true">
        <div className="rail__thread-fill" style={{ height: `${progress * 100}%` }} />
      </div>
      <ol className="rail__stops">
        {waypoints.map((w) => (
          <li key={w.id}>
            <a
              href={`#${w.id}`}
              className={`rail__stop ${activeId === w.id ? 'is-active' : ''}`}
              aria-current={activeId === w.id ? 'location' : undefined}
            >
              <span className="rail__rune" aria-hidden="true">
                {w.rune}
              </span>
              <span className="rail__label">{w.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
