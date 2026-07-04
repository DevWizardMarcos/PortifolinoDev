// =============================================================
// sizes.js
// -------------------------------------------------------------
// Fonte única de "tamanho da tela" para o app inteiro.
// CameraManager e RendererManager escutam via `sizes.on('resize', cb)`
// em vez de cada um colocar seu próprio listener em `window`.
// =============================================================

class Sizes extends EventTarget {
  constructor() {
    super()

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.dispatchEvent(new Event('resize'))
    })
  }

  get aspect() {
    return this.width / this.height
  }

  on(eventName, callback) {
    this.addEventListener(eventName, callback)
  }
}

// Singleton: todo o app compartilha a mesma instância.
export const sizes = new Sizes()
