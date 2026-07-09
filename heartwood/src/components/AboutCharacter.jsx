import { profile } from '../content/profile'
import { arsenal } from '../content/skills'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import './AboutCharacter.css'

/**
 * Sobre o Personagem — a ficha do DevWizard no design original:
 * retrato à esquerda, blocos com rubricas carmesim à direita
 * (◆ Classe, ◆ História, ◆ Guilda Atual, ◆ Formação, ◆ Arsenal).
 */
function SheetBlock({ label, children }) {
  return (
    <Reveal className="sheet__block">
      <h3 className="sheet__label">
        <span aria-hidden="true">◆</span> {label}
      </h3>
      {children}
    </Reveal>
  )
}

export default function AboutCharacter() {
  const { about } = profile

  return (
    <section id="personagem" className="section character">
      <div className="section__inner">
        <SectionHeading
          tone="crimson"
          title="Sobre o Personagem"
          subtitle="Conheça o dev por trás da magia."
        />

        <div className="sheet">
          <Reveal className="sheet__portrait-frame">
            <img
              src="/img/foto_perfil.png"
              alt={`Retrato de ${profile.name}`}
              className="sheet__portrait"
              width="300"
              height="300"
              loading="lazy"
            />
          </Reveal>

          <div className="sheet__scroll">
            <SheetBlock label="Classe">
              <p className="sheet__classe">{about.classe}</p>
            </SheetBlock>

            <SheetBlock label="História">
              <div className="sheet__historia">
                {about.historia.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </SheetBlock>

            <SheetBlock label="Guilda Atual">
              <ul className="sheet__roles">
                {about.guilda.map((g) => (
                  <li key={`${g.role}-${g.org}`} className="sheet__role">
                    <h4 className="sheet__role-title">{g.role}</h4>
                    <p className="sheet__role-org">
                      {g.org} • {g.period}
                    </p>
                    <p className="sheet__role-text">{g.text}</p>
                  </li>
                ))}
              </ul>
            </SheetBlock>

            <SheetBlock label="Formação">
              <ul className="sheet__roles">
                {about.formacao.map((f) => (
                  <li key={f.course} className="sheet__role">
                    <h4 className="sheet__role-title">{f.course}</h4>
                    <p className="sheet__role-org">
                      {f.org} • {f.period}
                    </p>
                    <p className="sheet__role-text">{f.text}</p>
                  </li>
                ))}
              </ul>
            </SheetBlock>

            <SheetBlock label="Arsenal">
              <div className="sheet__arsenal">
                {arsenal.map((school) => (
                  <div key={school.id} className="sheet__school">
                    <h4 className="sheet__school-name">{school.school}</h4>
                    <ul className="sheet__stacks" aria-label={school.school}>
                      {school.skills.map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SheetBlock>
          </div>
        </div>
      </div>
    </section>
  )
}
