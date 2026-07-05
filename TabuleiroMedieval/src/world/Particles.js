// =============================================================
// Particles.js
// -------------------------------------------------------------
// Poeira mágica roxa/branca espalhada pelo mapa. Contagem baixa e
// atualização simples (sem recriar geometria) para não pesar o FPS.
//
// EDITE AQUI:
// - COUNT -> quantidade de partículas (cuidado com performance)
// - SPREAD_X / SPREAD_Z -> área do mapa coberta
// =============================================================

import * as THREE from 'three'
import { MAP_WIDTH, MAP_DEPTH } from './Terrain.js'

const COUNT = 260
const SPREAD_X = MAP_WIDTH * 0.9
const SPREAD_Z = MAP_DEPTH * 0.9
const MAX_HEIGHT = 6

export class ParticlesController {
  constructor() {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    this.basePositions = new Float32Array(COUNT * 3)
    this.phases = new Float32Array(COUNT)

    const purple = new THREE.Color(0x9b5de5)
    const white = new THREE.Color(0xffffff)

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X
      const y = Math.random() * MAX_HEIGHT
      const z = (Math.random() - 0.5) * SPREAD_Z

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      this.basePositions[i * 3] = x
      this.basePositions[i * 3 + 1] = y
      this.basePositions[i * 3 + 2] = z
      this.phases[i] = Math.random() * Math.PI * 2

      // Metade roxo, metade branco — mistura mágica sutil.
      const color = Math.random() > 0.5 ? purple : white
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    this.points = new THREE.Points(geometry, material)
  }

  // Movimento sutil: sobe/desce em câmera lenta + leve deriva lateral.
  update(elapsed) {
    const positionAttribute = this.points.geometry.getAttribute('position')

    for (let i = 0; i < COUNT; i++) {
      const phase = this.phases[i]
      const baseX = this.basePositions[i * 3]
      const baseY = this.basePositions[i * 3 + 1]
      const baseZ = this.basePositions[i * 3 + 2]

      positionAttribute.setXYZ(
        i,
        baseX + Math.sin(elapsed * 0.2 + phase) * 0.4,
        baseY + Math.sin(elapsed * 0.5 + phase) * 0.5,
        baseZ + Math.cos(elapsed * 0.2 + phase) * 0.4
      )
    }

    positionAttribute.needsUpdate = true
  }
}
