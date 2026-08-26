// =============================================================
// InteractionPrompt.js
// -------------------------------------------------------------
// "[E] {label}" mostrado quando o jogador está perto (e dentro do
// alcance) de um objeto interativo. Ver InteractionManager.js.
// =============================================================

export class InteractionPrompt {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)
    this.currentId = null
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'interaction-prompt interaction-prompt--hidden'
    el.innerHTML = `<span class="interaction-prompt__key">E</span><span class="interaction-prompt__label"></span>`
    return el
  }

  // `entry` vem de InteractionManager.update() -> { id, label } ou null.
  set(entry) {
    if (!entry) {
      this.currentId = null
      this.element.classList.add('interaction-prompt--hidden')
      return
    }

    if (entry.id !== this.currentId) {
      this.currentId = entry.id
      this.element.querySelector('.interaction-prompt__label').textContent = entry.label
    }
    this.element.classList.remove('interaction-prompt--hidden')
  }
}
