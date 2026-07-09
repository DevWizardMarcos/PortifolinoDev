// =============================================================
// MapFrame.js
// -------------------------------------------------------------
// A "diagramação" do mapa antigo por cima do 3D: borda ornamentada
// com cantos dourados, cartucho do título (baixo-esquerda) e rosa
// dos ventos (baixo-direita) — como a arte de referência, onde a
// moldura faz metade do charme.
//
// Tudo com pointer-events: none — é pura camada visual.
// EDITE AQUI os textos do cartucho.
// =============================================================

const COMPASS_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="50" cy="50" r="46" fill="rgba(14, 10, 22, 0.55)" stroke="#d9c07c" stroke-width="1.6" />
  <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(217, 192, 124, 0.45)" stroke-width="0.8" />
  <g stroke="#d9c07c" stroke-width="0.8" opacity="0.75">
    <line x1="50" y1="7" x2="50" y2="16" /><line x1="50" y1="84" x2="50" y2="93" />
    <line x1="7" y1="50" x2="16" y2="50" /><line x1="84" y1="50" x2="93" y2="50" />
  </g>
  <g>
    <polygon points="50,12 54,46 50,50 46,46" fill="#c77dff" />
    <polygon points="50,88 54,54 50,50 46,54" fill="#8d7a52" />
    <polygon points="12,50 46,46 50,50 46,54" fill="#8d7a52" />
    <polygon points="88,50 54,46 50,50 54,54" fill="#8d7a52" />
    <polygon points="24,24 45,45 50,50 41,41" fill="#6d5c3f" />
    <polygon points="76,24 55,45 50,50 59,41" fill="#6d5c3f" />
    <polygon points="24,76 45,55 50,50 41,59" fill="#6d5c3f" />
    <polygon points="76,76 55,55 50,50 59,59" fill="#6d5c3f" />
  </g>
  <circle cx="50" cy="50" r="3.2" fill="#f0d999" />
  <text x="50" y="9" text-anchor="middle" fill="#f0d999" font-size="9" font-family="Cinzel, Georgia, serif">N</text>
</svg>
`

export class MapFrame {
  constructor() {
    this.element = this.buildElement()
    document.body.appendChild(this.element)
  }

  buildElement() {
    const el = document.createElement('div')
    el.className = 'map-frame map-frame--hidden'
    el.setAttribute('aria-hidden', 'true')

    el.innerHTML = `
      <div class="map-frame__border"></div>
      <span class="map-frame__corner map-frame__corner--tl"></span>
      <span class="map-frame__corner map-frame__corner--tr"></span>
      <span class="map-frame__corner map-frame__corner--bl"></span>
      <span class="map-frame__corner map-frame__corner--br"></span>

      <div class="map-frame__cartouche">
        <h1 class="map-frame__title">Mapa da Jornada</h1>
        <p class="map-frame__motto">Conhecimento &bull; Cria&ccedil;&atilde;o &bull; Legado</p>
        <p class="map-frame__quote">&ldquo;Um caminho. Muitas escolhas. Infinitas possibilidades.&rdquo;</p>
      </div>

      <div class="map-frame__compass">${COMPASS_SVG}</div>
    `

    return el
  }

  show() {
    this.element.classList.remove('map-frame--hidden')
  }
}
