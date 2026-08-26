// =============================================================
// PlayerController.js
// -------------------------------------------------------------
// Movimento em 1ª pessoa do modo exploração: WASD relativo à
// direção da câmera (PointerLockControls cuida do mouse-look),
// Shift para correr, e gravidade simples via raycast para baixo
// contra o terreno/objetos "walkable" (sem física complexa, sem
// movimento vertical livre).
//
// O Pointer Lock NUNCA é ativado sozinho — só quando algo externo
// chama `.lock()` (feito pelo Experience em resposta a um clique
// explícito do usuário no overlay "clique para explorar").
//
// EDITE AQUI:
// - WALK_SPEED / RUN_SPEED -> velocidade de andar/correr
// - GROUND_SNAP_LAMBDA -> quão rápido o jogador "gruda" no chão em rampas
// =============================================================

import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { PLAYER_EYE_HEIGHT } from './CameraManager.js'

const WALK_SPEED = 3.2 // unidades/segundo
const RUN_SPEED = 6.4
const GROUND_RAY_START = 6 // altura de onde o raio parte, acima da cabeça
const GROUND_SNAP_LAMBDA = 12 // suaviza o ajuste de altura (rampas/relevo)

const KEY_MAP = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'run',
  ShiftRight: 'run',
}

export class PlayerController {
  constructor(camera, domElement, { groundObjects = [] } = {}) {
    this.camera = camera
    this.controls = new PointerLockControls(camera, domElement)
    this.groundObjects = groundObjects

    this.enabled = false
    this.move = { forward: false, backward: false, left: false, right: false, run: false }

    this.raycaster = new THREE.Raycaster()
    this.raycaster.far = GROUND_RAY_START * 2
    this._rayOrigin = new THREE.Vector3()

    this._onKeyDown = this.handleKey.bind(this, true)
    this._onKeyUp = this.handleKey.bind(this, false)
  }

  get isLocked() {
    return this.controls.isLocked
  }

  get position() {
    return this.camera.position
  }

  setGroundObjects(objects) {
    this.groundObjects = objects
  }

  spawnAt(position) {
    this.camera.position.set(position.x, PLAYER_EYE_HEIGHT, position.z)
  }

  // Liga a escuta do teclado (chamado ao entrar no modo exploração).
  enable() {
    if (this.enabled) return
    this.enabled = true
    document.addEventListener('keydown', this._onKeyDown)
    document.addEventListener('keyup', this._onKeyUp)
  }

  // Desliga tudo (chamado ao voltar para o mapa).
  disable() {
    this.enabled = false
    this.move.forward = false
    this.move.backward = false
    this.move.left = false
    this.move.right = false
    this.move.run = false
    document.removeEventListener('keydown', this._onKeyDown)
    document.removeEventListener('keyup', this._onKeyUp)
    if (this.controls.isLocked) this.controls.unlock()
  }

  lock() {
    this.controls.lock()
  }

  unlock() {
    this.controls.unlock()
  }

  handleKey(isDown, event) {
    const action = KEY_MAP[event.code]
    if (!action || !this.enabled) return
    this.move[action] = isDown
  }

  // Chamado a cada frame pelo Experience (só quando modo === 'exploration').
  update(delta) {
    if (!this.enabled || !this.controls.isLocked) return

    const speed = this.move.run ? RUN_SPEED : WALK_SPEED
    const distance = speed * delta

    if (this.move.forward) this.controls.moveForward(distance)
    if (this.move.backward) this.controls.moveForward(-distance)
    if (this.move.right) this.controls.moveRight(distance)
    if (this.move.left) this.controls.moveRight(-distance)

    this.applyGravity(delta)
  }

  // Raycast para baixo a partir de acima da cabeça do jogador — encontra o
  // chão (terreno ou qualquer mesh com userData.walkable) e ajusta a altura
  // suavemente (sem voar, sem cair através do mapa).
  applyGravity(delta) {
    if (this.groundObjects.length === 0) return

    this._rayOrigin.set(this.camera.position.x, this.camera.position.y + GROUND_RAY_START, this.camera.position.z)
    this.raycaster.set(this._rayOrigin, new THREE.Vector3(0, -1, 0))

    const hits = this.raycaster.intersectObjects(this.groundObjects, false)
    if (hits.length === 0) return

    const targetY = hits[0].point.y + PLAYER_EYE_HEIGHT
    const t = 1 - Math.exp(-GROUND_SNAP_LAMBDA * delta)
    this.camera.position.y += (targetY - this.camera.position.y) * t
  }
}
