// =============================================================
// DebugOverlay.js
// -------------------------------------------------------------
// Painel de debug do modo exploração (posição do jogador, zona
// atual, FPS). Só é instanciado quando DEBUG_EXPLORATION (ver
// src/utils/debug.js) está ativo — ?debug=1 na URL.
// =============================================================

export class DebugOverlay {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'debug-overlay'
    el.innerHTML = `
      <div>modo: <span data-field="mode">-</span></div>
      <div>pos: <span data-field="position">-</span></div>
      <div>zona: <span data-field="zone">-</span></div>
      <div>fps: <span data-field="fps">-</span></div>
    `
    return el
  }

  update({ mode, position, zone, fps }) {
    if (mode !== undefined) this.element.querySelector('[data-field="mode"]').textContent = mode
    if (position) {
      this.element.querySelector('[data-field="position"]').textContent =
        `${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}`
    }
    if (zone !== undefined) this.element.querySelector('[data-field="zone"]').textContent = zone ?? '-'
    if (fps !== undefined) this.element.querySelector('[data-field="fps"]').textContent = fps.toFixed(0)
  }
}
