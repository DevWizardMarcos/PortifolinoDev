// =============================================================
// InfoPanel.js
// -------------------------------------------------------------
// Painel lateral estilo pergaminho, aberto ao clicar num reino
// (ou num item do menu como Sobre Mim/Contato).
//
// EDITE AQUI a estrutura do HTML do painel (o estilo vive em style.css).
// =============================================================

export class InfoPanel {
  constructor({ onClose } = {}) {
    this.onClose = onClose
    this.element = this.buildElement()
    document.body.appendChild(this.element)
  }

  buildElement() {
    const el = document.createElement('aside')
    el.className = 'info-panel info-panel--hidden'
    el.innerHTML = `
      <button type="button" class="info-panel__close" aria-label="Fechar">✕</button>
      <div class="info-panel__content">
        <p class="info-panel__subtitle" data-field="subtitulo"></p>
        <h2 class="info-panel__title" data-field="titulo"></h2>
        <p class="info-panel__description" data-field="descricao"></p>
        <div class="info-panel__tech" data-field="tecnologias"></div>
        <div class="info-panel__links" data-field="links"></div>
      </div>
    `

    el.querySelector('.info-panel__close').addEventListener('click', () => this.close())

    return el
  }

  // `data` segue o formato de journeyData.js: { nome|titulo, subtitulo, descricao, tecnologias, links }
  open(data) {
    const titulo = data.nome ?? data.titulo ?? ''
    this.element.querySelector('[data-field="titulo"]').textContent = titulo
    this.element.querySelector('[data-field="subtitulo"]').textContent = data.subtitulo ?? ''
    this.element.querySelector('[data-field="descricao"]').textContent = data.descricao ?? ''

    const techContainer = this.element.querySelector('[data-field="tecnologias"]')
    techContainer.innerHTML = (data.tecnologias ?? [])
      .map((tech) => `<span class="info-panel__chip">${tech}</span>`)
      .join('')

    const linksContainer = this.element.querySelector('[data-field="links"]')
    linksContainer.innerHTML = (data.links ?? [])
      .map((link) => `<a class="info-panel__link" href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`)
      .join('')

    this.element.classList.remove('info-panel--hidden')
  }

  close() {
    this.element.classList.add('info-panel--hidden')
    this.onClose?.()
  }
}
