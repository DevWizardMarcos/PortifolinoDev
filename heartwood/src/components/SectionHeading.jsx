import Reveal from './Reveal'
import './SectionHeading.css'

/**
 * Cabeçalho padrão de seção: sigilo + título + subtítulo.
 * tone: 'gold' (salões e relíquias) | 'crimson' (o personagem, as fênix).
 */
export default function SectionHeading({ sigil, title, subtitle, tone = 'gold' }) {
  return (
    <Reveal className={`section-heading section-heading--${tone}`}>
      {sigil && (
        <span className="section-heading__sigil" aria-hidden="true">
          {sigil}
        </span>
      )}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
    </Reveal>
  )
}
