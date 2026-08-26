// =============================================================
// IntroScreen.js
// -------------------------------------------------------------
// Tela inicial: título, subtítulo e botão "Entrar na Jornada".
// Ao clicar, dispara o callback `onEnter` e depois se desfaz com fade.
//
// EDITE AQUI os textos do título/subtítulo/botão.
// =============================================================

const TITLE = 'Mapa da Jornada'
const SUBTITLE = 'Conhecimento • Criação • Liderança • Legado'
const BUTTON_LABEL = 'Entrar na Jornada'

export class IntroScreen {
  constructor({ onEnter }) {
    this.onEnter = onEnter
    this.element = this.buildElement()
    document.body.appendChild(this.element)
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'intro-screen'
    el.innerHTML = `
      <div class="intro-screen__frame">
        <h1 class="intro-screen__title">${TITLE}</h1>
        <p class="intro-screen__subtitle">${SUBTITLE}</p>
        <button type="button" class="intro-screen__button">${BUTTON_LABEL}</button>
      </div>
    `

    const button = el.querySelector('.intro-screen__button')
    button.disabled = true
    button.textContent = 'Carregando o mundo...'
    button.addEventListener('click', () => this.handleEnter())

    return el
  }

  setReady() {
    const button = this.element.querySelector('.intro-screen__button')
    if (!button) return
    button.disabled = false
    button.textContent = BUTTON_LABEL
  }

  handleEnter() {
    this.onEnter?.()
    this.fadeOutAndDestroy()
  }

  fadeOutAndDestroy() {
    this.element.classList.add('intro-screen--fade-out')
    this.element.addEventListener(
      'transitionend',
      () => this.element.remove(),
      { once: true }
    )
  }
}
