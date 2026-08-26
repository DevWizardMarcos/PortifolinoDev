// =============================================================
// CameraManager.js
// -------------------------------------------------------------
// Câmera em perspectiva "isométrica" olhando para o mapa, com
// métodos para voar suavemente (GSAP) até um reino ou de volta
// para a visão geral.
//
// EDITE AQUI:
// - DEFAULT_POSITION / DEFAULT_LOOK_AT -> enquadramento padrão do mapa
// - INTRO_POSITION -> de onde a câmera "cai" na entrada cinematográfica
// =============================================================

import * as THREE from 'three'
import gsap from 'gsap'
import { sizes } from '../utils/sizes.js'

// Câmera mais recuada e com FOV mais fechado (menos "olho de peixe") para
// um enquadramento cinematográfico onde castelos/árvore não cortam nas bordas.
const DEFAULT_POSITION = new THREE.Vector3(0, 45, 70)
const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0, 0)
const INTRO_POSITION = new THREE.Vector3(0, 66, 104)

// Altura dos "olhos" do jogador no modo exploração.
export const PLAYER_EYE_HEIGHT = 1.75

export class CameraManager {
  constructor() {
    this.instance = new THREE.PerspectiveCamera(32, sizes.aspect, 0.1, 250)

    // Começa na posição "de longe" para a queda cinematográfica na entrada.
    this.instance.position.copy(INTRO_POSITION)

    // Ponto para onde a câmera olha. O ControlsManager copia este vetor
    // para `controls.target` a cada frame, então basta animar ESTE vetor
    // aqui que o OrbitControls acompanha automaticamente.
    this.lookAtTarget = DEFAULT_LOOK_AT.clone()
    this.instance.lookAt(this.lookAtTarget)

    sizes.on('resize', () => this.onResize())
  }

  configureFromBlenderCamera(source) {
    if (!source) return

    source.updateWorldMatrix(true, false)
    source.getWorldPosition(this.instance.position)
    source.getWorldQuaternion(this.instance.quaternion)
    this.instance.fov = source.fov
    this.instance.near = source.near
    this.instance.far = source.far
    this.instance.updateProjectionMatrix()

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.instance.quaternion)
    this.homePosition = this.instance.position.clone()
    this.homeLookAt = this.homePosition.clone().addScaledVector(forward, 70)
    this.lookAtTarget.copy(this.homeLookAt)
    this.instance.position.addScaledVector(forward, -38)
  }

  onResize() {
    this.instance.aspect = sizes.aspect
    this.instance.updateProjectionMatrix()
  }

  // Usado pelo ControlsManager para saber para onde olhar antes do OrbitControls assumir.
  get defaultLookAt() {
    return DEFAULT_LOOK_AT.clone()
  }

  get defaultPosition() {
    return DEFAULT_POSITION.clone()
  }

  // Queda cinematográfica inicial (chamada ao clicar em "Entrar na Jornada").
  // A câmera já começa olhando para o centro do mapa; o `tick()` do
  // Experience cuida de manter o OrbitControls sincronizado a cada frame.
  playIntro({ onUpdate, onComplete } = {}) {
    const destination = this.homePosition ?? DEFAULT_POSITION
    gsap.to(this.instance.position, {
      x: destination.x,
      y: destination.y,
      z: destination.z,
      duration: 3.2,
      ease: 'power2.out',
      onUpdate,
      onComplete,
    })
  }

  // Voa suavemente até um ponto do mapa (usado ao clicar num marcador).
  flyTo(targetPosition, { duration = 1.6, onUpdate, onComplete } = {}) {
    const camGoal = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y + 6,
      targetPosition.z + 7
    )

    gsap.to(this.instance.position, {
      x: camGoal.x,
      y: camGoal.y,
      z: camGoal.z,
      duration,
      ease: 'power2.inOut',
      onUpdate,
      onComplete,
    })

    gsap.to(this.lookAtTarget, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration,
      ease: 'power2.inOut',
    })
  }

  // Volta para a visão geral do mapa (usado pelo menu "Mapa").
  resetView({ duration = 1.6 } = {}) {
    const homeTarget = this.homeLookAt ?? DEFAULT_LOOK_AT
    const homePosition = this.homePosition ?? DEFAULT_POSITION
    this.flyTo(homeTarget, { duration })
    gsap.to(this.instance.position, {
      x: homePosition.x,
      y: homePosition.y,
      z: homePosition.z,
      duration,
      ease: 'power2.inOut',
    })
  }

  // "Entrei dentro do mapa que estava observando": a câmera se aproxima de
  // um ponto de aproximação (ex.: GAME_CameraStart do world.glb), olha para
  // o Núcleo (ex.: GAME_WorldCenter) e desce até o spawn real — encadeado
  // via GSAP timeline (sem teleporte seco). `approachPosition`/
  // `approachLookAt` vêm do Experience, resolvidos a partir do world.glb
  // carregado (com fallback caso os nós não existam).
  enterExploration(spawnPosition, { approachPosition, approachLookAt, onComplete } = {}) {
    const timeline = gsap.timeline({ onComplete })

    timeline
      .to(this.instance.position, {
        x: approachPosition.x,
        y: approachPosition.y,
        z: approachPosition.z,
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(
        this.lookAtTarget,
        {
          x: approachLookAt.x,
          y: approachLookAt.y,
          z: approachLookAt.z,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '<'
      )
      .to(this.instance.position, {
        x: spawnPosition.x,
        y: spawnPosition.y,
        z: spawnPosition.z,
        duration: 2,
        ease: 'power3.inOut',
      })

    return timeline
  }

  // Sobe de volta e retorna à visão geral do mapa (ESC / "Voltar ao Mapa").
  exitToMap({ approachPosition, approachLookAt, onComplete } = {}) {
    const homePosition = this.homePosition ?? DEFAULT_POSITION
    const homeLookAt = this.homeLookAt ?? DEFAULT_LOOK_AT
    const timeline = gsap.timeline({ onComplete })

    timeline
      .to(this.instance.position, {
        x: approachPosition.x,
        y: approachPosition.y,
        z: approachPosition.z,
        duration: 1.4,
        ease: 'power2.inOut',
      })
      .to(
        this.lookAtTarget,
        {
          x: approachLookAt.x,
          y: approachLookAt.y,
          z: approachLookAt.z,
          duration: 1.4,
          ease: 'power2.inOut',
        },
        '<'
      )
      .to(this.instance.position, {
        x: homePosition.x,
        y: homePosition.y,
        z: homePosition.z,
        duration: 1.6,
        ease: 'power2.inOut',
      })
      .to(
        this.lookAtTarget,
        {
          x: homeLookAt.x,
          y: homeLookAt.y,
          z: homeLookAt.z,
          duration: 1.6,
          ease: 'power2.inOut',
        },
        '<'
      )

    return timeline
  }
}
