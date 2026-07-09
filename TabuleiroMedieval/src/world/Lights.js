// =============================================================
// Lights.js
// -------------------------------------------------------------
// Iluminação de GOLDEN HOUR: sol baixo e quente vindo de sudoeste
// (sombras longas que desenham o relevo), preenchimento frio
// arroxeado nas sombras (contraste quente/frio de concept art) e
// um acento mágico sobre a Árvore central.
//
// EDITE AQUI: posição/cor do `sun` para mudar a hora do dia.
// =============================================================

import * as THREE from 'three'
import { MAP_WIDTH, MAP_DEPTH } from './Terrain.js'

export function createLights(scene) {
  const group = new THREE.Group()

  // Base ambiente levemente roxa: as sombras nunca ficam pretas nem cinzas.
  const ambient = new THREE.AmbientLight(0x6a5c82, 0.7)
  group.add(ambient)

  // Céu quente / chão arroxeado — o contraste que "pinta" o diorama.
  const hemi = new THREE.HemisphereLight(0xffe3b3, 0x554464, 0.8)
  group.add(hemi)

  // Sol de fim de tarde: baixo, dourado, vindo da frente-esquerda para
  // as faces voltadas à câmera receberem luz e o relevo ganhar desenho.
  const sun = new THREE.DirectionalLight(0xffc182, 2.6)
  sun.position.set(-26, 22, 20)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 130
  sun.shadow.camera.left = -MAP_WIDTH * 0.62
  sun.shadow.camera.right = MAP_WIDTH * 0.62
  sun.shadow.camera.top = MAP_DEPTH * 0.72
  sun.shadow.camera.bottom = -MAP_DEPTH * 0.72
  sun.shadow.bias = -0.0003
  group.add(sun)

  // Contraluz fria vinda do norte (atrás das montanhas): recorta as
  // silhuetas dos castelos contra o fundo — rim light de cinematografia.
  const rim = new THREE.DirectionalLight(0x8a7bd8, 0.5)
  rim.position.set(6, 14, -28)
  group.add(rim)

  // Acento mágico sobre o Núcleo da Criação.
  const magicAccent = new THREE.PointLight(0x9b5de5, 0.8, 30, 1.8)
  magicAccent.position.set(0, 9, 0)
  group.add(magicAccent)

  scene.add(group)
  return group
}
