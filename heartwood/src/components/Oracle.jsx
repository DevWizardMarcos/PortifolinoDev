import { useEffect, useRef, useState } from 'react'
import { oracleIntro, oracleDisclosure, oracleQuestions } from '../content/oracle'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import './Oracle.css'

/**
 * O Oráculo — a câmara mais funda da torre.
 * As respostas são preparadas (e o Oráculo é honesto quanto a isso);
 * a arquitetura já aceita um backend de IA real: basta trocar a
 * resolução da resposta por uma chamada de API neste componente.
 */
export default function Oracle() {
  const reducedMotion = usePrefersReducedMotion()
  const [asked, setAsked] = useState(null)
  const [typed, setTyped] = useState('')
  const intervalRef = useRef(null)

  function ask(question) {
    setAsked(question)
    clearInterval(intervalRef.current)

    if (reducedMotion) {
      setTyped(question.a)
      return
    }

    // A pena do Oráculo escreve a resposta
    setTyped('')
    let i = 0
    intervalRef.current = setInterval(() => {
      i += 2
      setTyped(question.a.slice(0, i))
      if (i >= question.a.length) clearInterval(intervalRef.current)
    }, 24)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <section id="oraculo" className="section oracle">
      <div className="section__inner oracle__inner">
        <SectionHeading
          sigil="☉ o oráculo"
          title="O Oráculo"
          subtitle="Pergunte, e as páginas responderão"
        />

        <Reveal className="oracle__chamber">
          <div className="oracle__eye" aria-hidden="true">
            <span className="oracle__eye-core">☉</span>
          </div>

          <p className="oracle__intro">{oracleIntro}</p>

          <div className="oracle__questions" role="group" aria-label="Perguntas ao Oráculo">
            {oracleQuestions.map((q) => (
              <button
                key={q.id}
                type="button"
                className={`oracle__question ${asked?.id === q.id ? 'is-asked' : ''}`}
                onClick={() => ask(q)}
                aria-pressed={asked?.id === q.id}
              >
                {q.q}
              </button>
            ))}
          </div>

          <div className="oracle__answer" role="region" aria-live="polite" aria-label="Resposta do Oráculo">
            {asked ? (
              <p className="oracle__answer-text">
                <span className="oracle__answer-mark" aria-hidden="true">
                  ❝
                </span>
                {typed}
              </p>
            ) : (
              <p className="oracle__answer-idle">O Oráculo aguarda em silêncio…</p>
            )}
          </div>

          <p className="oracle__disclosure">{oracleDisclosure}</p>
        </Reveal>
      </div>
    </section>
  )
}
