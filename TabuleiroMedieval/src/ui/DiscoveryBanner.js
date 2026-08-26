// =============================================================
// DiscoveryBanner.js
// -------------------------------------------------------------
// "INFINITY SCHOOL — Império do Conhecimento": aparece suavemente
// ao entrar numa zona/região nova e some sozinho. Ver ZoneManager.js.
//
// EDITE AQUI o tempo até desaparecer (HIDE_DELAY_MS).
// =============================================================

const HIDE_DELAY_MS = 3800

export class DiscoveryBanner {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)
    this.timeoutId = null
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'discovery-banner discovery-banner--hidden'
    el.innerHTML = `
      <span class="discovery-banner__title"></span>
      <span class="discovery-banner__subtitle"></span>
    `
    return el
  }

  show(title, subtitle = '') {
    clearTimeout(this.timeoutId)
    this.element.querySelector('.discovery-banner__title').textContent = title
    this.element.querySelector('.discovery-banner__subtitle').textContent = subtitle
    this.element.classList.remove('discovery-banner--hidden')
    this.timeoutId = setTimeout(() => this.hide(), HIDE_DELAY_MS)
  }

  hide() {
    clearTimeout(this.timeoutId)
    this.element.classList.add('discovery-banner--hidden')
  }
}
