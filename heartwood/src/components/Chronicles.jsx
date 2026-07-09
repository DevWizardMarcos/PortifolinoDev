import { chronicles } from '../content/chronicles'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import './Chronicles.css'

/**
 * Crônicas do Reino — eventos, workshops e liderança registrados
 * como um manuscrito iluminado: capitulares, anos à margem e a
 * pena do escriba ainda molhada na última entrada.
 */
export default function Chronicles() {
  return (
    <section id="legados" className="section chronicles">
      <div className="section__inner chronicles__inner">
        <SectionHeading
          tone="crimson"
          sigil="⸙ crônicas da guilda"
          title="Legados do Saber"
          subtitle="Aulas, eventos, workshops e liderança — o que os escribas registraram"
        />

        <ol className="chronicles__manuscript">
          {chronicles.map((entry, i) => (
            <Reveal as="li" key={entry.id} delay={60 * i} className="chronicle">
              <span className="chronicle__year" aria-label={`Ano de ${entry.year}`}>
                {entry.year}
              </span>
              <div className="chronicle__entry">
                <header className="chronicle__header">
                  <span className="chronicle__type">{entry.type}</span>
                  <h3 className="chronicle__title">{entry.title}</h3>
                </header>
                <p className="chronicle__text">
                  <span className="chronicle__capital" aria-hidden="true">
                    {entry.text.charAt(0)}
                  </span>
                  {entry.text.slice(1)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
