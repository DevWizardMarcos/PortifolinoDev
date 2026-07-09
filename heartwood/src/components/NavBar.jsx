import { useState } from 'react'
import { profile, navSections } from '../content/profile'
import './NavBar.css'

/**
 * Navegação persistente: o mundo é o jeito encantador de navegar,
 * esta barra é o jeito garantido (design doc §5.1).
 */
export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#inicio" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__brand-dev">{profile.brand.dev}</span>
          <span className="nav__brand-wizard">{profile.brand.wizard}</span>
          <span className="nav__brand-marcos">{profile.brand.marcos}</span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">Menu</span>
          <span className="nav__toggle-bar" aria-hidden="true" />
          <span className="nav__toggle-bar" aria-hidden="true" />
        </button>

        <nav id="nav-menu" className={`nav__menu ${open ? 'is-open' : ''}`} aria-label="Seções">
          <ul className="nav__list">
            {navSections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="nav__link" onClick={() => setOpen(false)}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <img
          src="/img/avataSalao.jpeg"
          alt=""
          aria-hidden="true"
          className="nav__avatar"
          width="34"
          height="34"
          loading="lazy"
        />
      </div>
    </header>
  )
}
