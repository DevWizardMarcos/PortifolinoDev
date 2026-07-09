import { useEffect, useState } from 'react'
import './JourneyBackdrop.css'

/**
 * O céu do mundo. Um único fundo fixo atravessa a página inteira e
 * muda de "região" em cross-fades lentos conforme o visitante viaja —
 * nenhuma seção tem fundo próprio, então não existem emendas.
 */
const CHAPTERS = [
  { chapter: 'limiar', sections: ['inicio'] },
  { chapter: 'biblioteca', sections: ['personagem'] },
  { chapter: 'camara', sections: ['portal', 'tabuleiro'] },
  { chapter: 'salao', sections: ['projetos', 'legados'] },
  { chapter: 'oraculo', sections: ['oraculo'] },
  { chapter: 'alvorada', sections: ['contato'] },
]

const chapterOf = (sectionId) =>
  CHAPTERS.find((c) => c.sections.includes(sectionId))?.chapter ?? 'limiar'

export default function JourneyBackdrop() {
  const [chapter, setChapter] = useState('limiar')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const targets = CHAPTERS.flatMap((c) => c.sections)
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    // A "região atual" é a seção que cruza a faixa central da tela
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setChapter(chapterOf(entry.target.id))
        }
      },
      { rootMargin: '-42% 0px -48% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="backdrop" aria-hidden="true">
      {CHAPTERS.map((c) => (
        <div
          key={c.chapter}
          className={`backdrop__layer backdrop__layer--${c.chapter} ${
            chapter === c.chapter ? 'is-active' : ''
          }`}
        />
      ))}
    </div>
  )
}
