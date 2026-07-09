import { profile } from '../content/profile'
import './Hero.css'

/**
 * O Banner Principal — a arte original do DevWizardMarcos:
 * a biblioteca arcana, as fênix azul e vermelha, o mago ao centro.
 * A identidade é HTML puro sobre a arte; a regra dos 5 segundos vale:
 * nome, papel e convite legíveis no primeiro paint.
 */
export default function Hero() {
  const { brand, game } = profile

  return (
    <section id="inicio" className="hero" aria-label="Apresentação">
      {/* A arte do banner + véus de legibilidade e a fusão com o mundo */}
      <div className="hero__art" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__content">
        <h1 className="hero__title">
          <span className="hero__title-dev">{brand.dev}</span>
          <span className="hero__title-wizard">{brand.wizard}</span>
          <span className="hero__title-marcos">{brand.marcos}</span>
        </h1>

        <p className="hero__role">{profile.role}</p>
        <p className="hero__tagline">{profile.tagline}</p>

        {/* Barra de status: nível e experiência — o RPG do DevWizard */}
        <div className="hero__stats">
          <div className="hero__level">
            <span className="hero__stat-label">Nível</span>
            <span className="hero__level-number">{game.level}</span>
          </div>
          <div className="hero__xp">
            <span className="hero__stat-label">Experiência</span>
            <div
              className="hero__xp-track"
              role="img"
              aria-label={`Barra de experiência: ${game.xp}%`}
            >
              <div className="hero__xp-fill" style={{ width: `${game.xp}%` }} />
            </div>
          </div>
        </div>

        <div className="hero__actions">
          <a href="#personagem" className="btn btn--ghost">
            Iniciar Jornada
          </a>
          <a href="#projetos" className="btn btn--primary">
            Explorar Projetos
          </a>
        </div>
      </div>

      <a href="#personagem" className="hero__scroll-hint">
        <span aria-hidden="true">↓</span> seguir o fio dourado
      </a>
    </section>
  )
}
