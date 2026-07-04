// =============================================================
// RotateDevice.js
// -------------------------------------------------------------
// Aviso de tela cheia para pedir que o visitante gire o celular
// quando a tela é pequena e está em retrato.
//
// EDITE AQUI o texto do aviso ou o limite de largura considerado "mobile".
// =============================================================

const MOBILE_MAX_WIDTH = 820

export class RotateDevice {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)

    this.checkOrientation = this.checkOrientation.bind(this)
    window.addEventListener('resize', this.checkOrientation)
    window.addEventListener('orientationchange', this.checkOrientation)

    this.checkOrientation()
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'rotate-device rotate-device--hidden'
    el.innerHTML = `
      <div class="rotate-device__icon">📱</div>
      <p class="rotate-device__text">Gire seu dispositivo para explorar a jornada</p>
    `
    return el
  }

  checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth
    const isSmallScreen = window.innerWidth <= MOBILE_MAX_WIDTH

    if (isPortrait && isSmallScreen) {
      this.element.classList.remove('rotate-device--hidden')
    } else {
      this.element.classList.add('rotate-device--hidden')
    }
  }
}
