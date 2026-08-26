// =============================================================
// ExploreButton.js
// -------------------------------------------------------------
// Botão "Explorar o Mundo" mostrado no modo mapa (depois da
// entrada cinematográfica). Escondido em telas touch/estreitas —
// mobile mantém só o modo mapa por enquanto (sem joystick FPS).
//
// EDITE AQUI o texto do botão ou o limite de largura "mobile"
// (mantido igual ao de RotateDevice.js).
// =============================================================

const MOBILE_MAX_WIDTH = 820

function isExplorationSupported() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  const isNarrow = window.innerWidth <= MOBILE_MAX_WIDTH
  return !isTouch && !isNarrow
}

export class ExploreButton {
  constructor({ onExplore } = {}) {
    this.onExplore = onExplore
    this.supported = isExplorationSupported()
    this.visible = false

    this.element = this.buildElement()
    document.body.appendChild(this.element)

    this._onResize = () => {
      this.supported = isExplorationSupported()
      this.refresh()
    }
    window.addEventListener('resize', this._onResize)
  }

  buildElement() {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'explore-button explore-button--hidden'
    el.textContent = 'Explorar o Mundo'
    el.addEventListener('click', () => this.onExplore?.())
    return el
  }

  refresh() {
    if (this.visible && this.supported) {
      this.element.classList.remove('explore-button--hidden')
    } else {
      this.element.classList.add('explore-button--hidden')
    }
  }

  show() {
    this.visible = true
    this.refresh()
  }

  hide() {
    this.visible = false
    this.refresh()
  }
}
