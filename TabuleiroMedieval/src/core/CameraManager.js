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
const DEFAULT_POSITION = new THREE.Vector3(0, 13.5, 20)
const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0.6, 0)
const INTRO_POSITION = new THREE.Vector3(0, 42, 58)

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
    gsap.to(this.instance.position, {
      x: DEFAULT_POSITION.x,
      y: DEFAULT_POSITION.y,
      z: DEFAULT_POSITION.z,
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
    this.flyTo(DEFAULT_LOOK_AT, { duration })
    gsap.to(this.instance.position, {
      x: DEFAULT_POSITION.x,
      y: DEFAULT_POSITION.y,
      z: DEFAULT_POSITION.z,
      duration,
      ease: 'power2.inOut',
    })
  }
}
