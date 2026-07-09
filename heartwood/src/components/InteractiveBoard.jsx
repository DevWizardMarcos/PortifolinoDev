import { useState } from 'react'
import { boardSeats } from '../content/board'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import './InteractiveBoard.css'

/**
 * O Tabuleiro Interativo — um mapa do reino gravado em pedra.
 * Cada runa é um domínio real da carreira; tocá-la conta a história
 * e oferece uma viagem até o lugar correspondente do mundo.
 * Totalmente navegável por teclado; o painel é uma região aria-live.
 */
export default function InteractiveBoard() {
  const [selectedId, setSelectedId] = useState(boardSeats[0].id)
  const selected = boardSeats.find((s) => s.id === selectedId)

  return (
    <section id="tabuleiro" className="section board-section">
      <div className="section__inner">
        <SectionHeading
          sigil="♜ o tabuleiro"
          title="O Tabuleiro Medieval"
          subtitle="Toque uma runa e descubra cada domínio do reino"
        />

        <div className="board-section__layout">
          <Reveal className="board" role="group" aria-label="Runas do tabuleiro">
            {/* Círculos concêntricos do mapa em pedra */}
            <div className="board__circle board__circle--outer" aria-hidden="true" />
            <div className="board__circle board__circle--mid" aria-hidden="true" />
            <div className="board__circle board__circle--inner" aria-hidden="true" />
            <span className="board__compass" aria-hidden="true">
              ✦
            </span>

            {boardSeats.map((seat) => (
              <button
                key={seat.id}
                type="button"
                className={`board__seat ${selectedId === seat.id ? 'is-selected' : ''}`}
                style={{ left: `${seat.x}%`, top: `${seat.y}%` }}
                onClick={() => setSelectedId(seat.id)}
                aria-pressed={selectedId === seat.id}
              >
                <span className="board__seat-rune" aria-hidden="true">
                  {seat.rune}
                </span>
                <span className="board__seat-name">{seat.name}</span>
              </button>
            ))}
          </Reveal>

          <Reveal
            className="board__panel"
            aria-live="polite"
            role="region"
            aria-label="Domínio selecionado"
          >
            <span className="board__panel-rune" aria-hidden="true">
              {selected.rune}
            </span>
            <h3 className="board__panel-title">{selected.name}</h3>
            <p className="board__panel-text">{selected.text}</p>
            <a href={selected.anchor} className="board__panel-link">
              {selected.anchorLabel} →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
