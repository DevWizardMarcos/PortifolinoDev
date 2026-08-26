// =============================================================
// InteractionManager.js
// -------------------------------------------------------------
// Registro central de objetos interativos do modo exploração.
// Cada objeto registrado tem uma posição (no mundo), um raio de
// alcance e uma ação. A cada frame, acha o mais próximo dentro do
// alcance e mostra "[E] {label}"; apertar E dispara a ação.
//
// Convenção para quando um world.glb existir: objetos com
// `userData.interactive === true` + `userData.interaction_id` +
// `userData.interaction_label` devem ser registrados aqui do
// mesmo jeito (ver Experience.js).
//
// EDITE AQUI:
// - DEFAULT_RADIUS -> alcance padrão de interação
// =============================================================

import * as THREE from 'three'

const DEFAULT_RADIUS = 2.4

const scratch = new THREE.Vector3()

export class InteractionManager {
  constructor() {
    this.interactables = []
    this.current = null
    this._onKeyDown = this.handleKeyDown.bind(this)
  }

  // `object3D` é usado só para achar a posição (getWorldPosition) — pode
  // ser um Group/Mesh qualquer já presente na cena.
  register({ object3D, id, label, radius = DEFAULT_RADIUS, onInteract }) {
    const entry = { object3D, id, label, radius, onInteract }
    this.interactables.push(entry)
    return entry
  }

  unregister(id) {
    this.interactables = this.interactables.filter((entry) => entry.id !== id)
    if (this.current?.id === id) this.current = null
  }

  enable() {
    document.addEventListener('keydown', this._onKeyDown)
  }

  disable() {
    document.removeEventListener('keydown', this._onKeyDown)
    this.current = null
  }

  handleKeyDown(event) {
    if (event.code !== 'KeyE' || !this.current) return
    this.current.onInteract?.()
  }

  // Chamado a cada frame — devolve o interactable ativo (ou null).
  update(playerPosition) {
    let closest = null
    let closestDist = Infinity

    for (const entry of this.interactables) {
      entry.object3D.getWorldPosition(scratch)
      const distance = playerPosition.distanceTo(scratch)
      if (distance <= entry.radius && distance < closestDist) {
        closest = entry
        closestDist = distance
      }
    }

    this.current = closest
    return closest
  }
}
