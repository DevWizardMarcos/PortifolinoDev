// =============================================================
// ControlsHint.js
// -------------------------------------------------------------
// Dupla função:
// 1) Portão de entrada do Pointer Lock — mostra "Clique para
//    explorar" (o mouse-look só é ativado depois de um clique
//    explícito, nunca automaticamente).
// 2) Depois de travado o mouse, vira um lembrete rápido dos
//    controles (WASD/mouse/Shift/E/ESC) que some sozinho.
//
// EDITE AQUI o texto ou o tempo até desaparecer (HIDE_DELAY_MS).
// =============================================================

const HIDE_DELAY_MS = 5000

export class ControlsHint {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)
    this.timeoutId = null
    this.lockButton = this.element.querySelector('.controls-hint__lock-btn')
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'controls-hint controls-hint--hidden'
    el.innerHTML = `
      <button type="button" class="controls-hint__lock-btn">Clique para explorar</button>
      <div class="controls-hint__list">
        <div class="controls-hint__row"><span>WASD</span> mover</div>
        <div class="controls-hint__row"><span>Mouse</span> olhar</div>
        <div class="controls-hint__row"><span>Shift</span> correr</div>
        <div class="controls-hint__row"><span>E</span> interagir</div>
        <div class="controls-hint__row"><span>ESC</span> voltar ao mapa</div>
      </div>
    `
    return el
  }

  // Mostra o portão + lista de controles. `onLockRequested` é chamado ao
  // clicar no botão (deve chamar playerController.lock()).
  show(onLockRequested) {
    clearTimeout(this.timeoutId)
    this.element.classList.remove('controls-hint--hidden')
    this.element.classList.remove('controls-hint--locked')
    this.lockButton.onclick = () => onLockRequested?.()
  }

  // Chamado quando o Pointer Lock realmente engata — some o botão e inicia
  // o timer de fade da lista de controles.
  onLocked() {
    this.element.classList.add('controls-hint--locked')
    this.timeoutId = setTimeout(() => this.hide(), HIDE_DELAY_MS)
  }

  hide() {
    clearTimeout(this.timeoutId)
    this.element.classList.add('controls-hint--hidden')
  }
}
