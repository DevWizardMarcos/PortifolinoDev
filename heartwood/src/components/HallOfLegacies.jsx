import { useState } from 'react'
import { projects, projectCategories, impactStats, hallQuote } from '../content/projects'
import Reveal from './Reveal'
import './HallOfLegacies.css'

/**
 * ~ Salão dos Legados ~ — os projetos como Relíquias, sobre a arte
 * original do salão (a árvore de energia violeta entre colunas).
 * Filtros por categoria, selo de impacto e o Impacto Gerado ao fim.
 */
export default function HallOfLegacies() {
  const [category, setCategory] = useState('Todos')
  const visible =
    category === 'Todos' ? projects : projects.filter((p) => p.category === category)

  return (
    <section id="projetos" className="hall section">
      {/* A arte do salão, fundida com a noite do mundo nas bordas */}
      <div className="hall__art" aria-hidden="true" />
      <div className="hall__veil" aria-hidden="true" />

      <div className="section__inner hall__inner">
        <Reveal className="hall__header">
          <h2 className="hall__title">~ Salão dos Legados ~</h2>
          <p className="hall__subtitle">Cada projeto é uma marca. Cada marca é um legado.</p>
        </Reveal>

        <Reveal className="hall__relics-heading">
          <h3 className="hall__relics-title">Relíquias do Legado</h3>

          <div className="hall__filters" role="group" aria-label="Filtrar relíquias por categoria">
            {projectCategories.map((c) => (
              <button
                key={c}
                type="button"
                className={`hall__filter ${category === c ? 'is-active' : ''}`}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="hall__grid">
          {visible.map((p, i) => (
            <Reveal as="article" key={p.id} delay={70 * i} className="relic">
              <header className="relic__header">
                <span className="relic__rune" aria-hidden="true">
                  {p.rune}
                </span>
                <h4 className="relic__name">{p.name}</h4>
              </header>

              <p className="relic__label">{p.label}</p>
              <p className="relic__text">{p.text}</p>

              <ul className="relic__stack" aria-label="Tecnologias">
                {p.stack.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>

              <footer className="relic__footer">
                <span
                  className={`relic__impact ${
                    p.impact === 'Impacto Extremo' ? 'relic__impact--extreme' : ''
                  }`}
                >
                  {p.impact}
                </span>
                <span className="relic__count" aria-hidden="true">
                  {p.count}
                </span>
              </footer>

              {p.codeUrl && (
                <a
                  className="relic__link"
                  href={p.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ver ${p.name} no GitHub`}
                >
                  Ver relíquia ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>

        {/* Impacto Gerado */}
        <Reveal className="hall__impact">
          <h3 className="hall__impact-title">Impacto Gerado</h3>
          <dl className="hall__stats">
            {impactStats.map((s) => (
              <div key={s.label} className="hall__stat">
                <dt className="hall__stat-label">{s.label}</dt>
                <dd className="hall__stat-value">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="hall__quote">
            <em>
              {hallQuote[0]}
              <br />
              {hallQuote[1]}
            </em>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
