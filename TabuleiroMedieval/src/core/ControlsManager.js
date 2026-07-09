// =============================================================
// ControlsManager.js
// -------------------------------------------------------------
// OrbitControls com damping, zoom e rotação limitados, para manter
// a sensação de "mapa de RPG" e nunca deixar o jogador virar a
// câmera por baixo do terreno ou de cabeça para baixo.
//
// EDITE AQUI os limites de zoom/rotação (minDistance, maxDistance,
// minPolarAngle, maxPolarAngle).
// =============================================================

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class ControlsManager {
  constructor(camera, domElement) {
    this.controls = new OrbitControls(camera, domElement)

    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08

    // Zoom limitado — não deixa aproximar demais nem afastar até perder o mapa.
    this.controls.minDistance = 14
    this.controls.maxDistance = 68

    // Rotação vertical limitada: nunca vira por baixo do tabuleiro nem
    // fica totalmente de topo — sempre a leitura de diorama em 3/4.
    this.controls.minPolarAngle = Math.PI * 0.18
    this.controls.maxPolarAngle = Math.PI * 0.46

    // Pan bem limitado — o foco é sempre o mapa, não arrastar a cena pra longe.
    this.controls.enablePan = false

    // Começa desabilitado: só libera a interação depois da entrada cinematográfica.
    this.controls.enabled = false
  }

  // Chamado a cada frame pelo Experience, já com o target sincronizado
  // ao alvo de câmera (ver CameraManager.lookAtTarget).
  update() {
    this.controls.update()
  }

  enable() {
    this.controls.enabled = true
  }

  disable() {
    this.controls.enabled = false
  }
}
