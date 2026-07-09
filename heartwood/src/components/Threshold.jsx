import Reveal from './Reveal'
import './Threshold.css'

/**
 * Uma passagem entre lugares do mundo. As seções nunca se encostam:
 * atravessa-se um limiar, e um sussurro anuncia o que vem adiante.
 */
export default function Threshold({ whisper }) {
  return (
    <div className="threshold" role="presentation">
      <Reveal className="threshold__inner">
        <span className="threshold__ornament" aria-hidden="true">
          <span className="threshold__line" />
          <span className="threshold__gem">◆</span>
          <span className="threshold__line" />
        </span>
        {whisper && <p className="threshold__whisper">{whisper}</p>}
      </Reveal>
    </div>
  )
}
