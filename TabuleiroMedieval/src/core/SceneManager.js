// =============================================================
// SceneManager.js
// -------------------------------------------------------------
// Atmosfera de DIORAMA: o tabuleiro flutua num vazio escuro
// arroxeado (mesma família de cor da UI), com uma névoa sutil que
// só faz o fundo do mapa derreter na escuridão — nada de lavar o
// primeiro plano de cinza.
// =============================================================

import * as THREE from 'three'

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0e0a16)
    this.scene.fog = new THREE.FogExp2(0x171126, 0.0058)
  }

  add(object) {
    this.scene.add(object)
  }
}
