// =============================================================
// Crosshair.js
// -------------------------------------------------------------
// Mira discreta (pontinho/runa) visível só no modo exploração.
// Nada de HUD estilo FPS.
// =============================================================

export class Crosshair {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'crosshair crosshair--hidden'
    return el
  }

  show() {
    this.element.classList.remove('crosshair--hidden')
  }

  hide() {
    this.element.classList.add('crosshair--hidden')
  }
}
