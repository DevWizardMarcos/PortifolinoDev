// =============================================================
// Tooltip.js
// -------------------------------------------------------------
// Tooltip flutuante que segue o ponteiro, mostrando o nome do
// reino em hover, antes do clique abrir o InfoPanel.
// =============================================================

export class Tooltip {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'tooltip tooltip--hidden'
    return el
  }

  show(text, x, y) {
    this.element.textContent = text
    this.element.style.transform = `translate(${x + 16}px, ${y + 16}px)`
    this.element.classList.remove('tooltip--hidden')
  }

  move(x, y) {
    this.element.style.transform = `translate(${x + 16}px, ${y + 16}px)`
  }

  hide() {
    this.element.classList.add('tooltip--hidden')
  }
}
