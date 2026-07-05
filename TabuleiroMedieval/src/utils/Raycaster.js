// =============================================================
// Raycaster.js
// -------------------------------------------------------------
// Pequeno helper que embrulha o THREE.Raycaster para achar o que
// está sob o mouse/dedo do usuário (hover e clique nos marcadores).
// =============================================================

import * as THREE from 'three'

export class PointerRaycaster {
  constructor(camera, domElement) {
    this.camera = camera
    this.domElement = domElement

    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
  }

  // Converte a posição do mouse/toque em coordenadas normalizadas (-1..1)
  // e devolve a lista de objetos atingidos pelo raio, ordenada por distância.
  intersect(event, objects) {
    const rect = this.domElement.getBoundingClientRect()

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    this.raycaster.setFromCamera(this.pointer, this.camera)

    return this.raycaster.intersectObjects(objects, false)
  }
}
