// =============================================================
// Navigation.js
// -------------------------------------------------------------
// Menu superior minimalista: logo "DevWizard" + itens de navegação.
// Fica oculto até a entrada cinematográfica terminar (`show()`).
//
// EDITE AQUI o nome da logo e os itens do menu.
// =============================================================

const NAV_ITEMS = [
  { key: 'mapa', label: 'Mapa' },
  { key: 'jornada', label: 'Jornada' },
  { key: 'projetos', label: 'Projetos' },
  { key: 'sobre', label: 'Sobre Mim' },
  { key: 'contato', label: 'Contato' },
]

export class Navigation {
  constructor({ onNavigate }) {
    this.onNavigate = onNavigate
    this.element = this.buildElement()
    document.body.appendChild(this.element)
  }

  buildElement() {
    const el = document.createElement('nav')
    el.className = 'navigation navigation--hidden'

    const itemsHtml = NAV_ITEMS.map(
      (item) => `<button type="button" class="navigation__item" data-key="${item.key}">${item.label}</button>`
    ).join('')

    el.innerHTML = `
      <span class="navigation__logo">DevWizard</span>
      <div class="navigation__items">${itemsHtml}</div>
    `

    el.querySelectorAll('.navigation__item').forEach((button) => {
      button.addEventListener('click', () => this.onNavigate?.(button.dataset.key))
    })

    return el
  }

  show() {
    this.element.classList.remove('navigation--hidden')
  }
}
