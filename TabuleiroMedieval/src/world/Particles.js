// =============================================================
// Particles.js
// -------------------------------------------------------------
// Vagalumes mágicos: pontos de luz roxos (com alguns dourados)
// derivando devagar pelo ar do mapa. É a camada de "ar vivo" do
// diorama — sem ela o mundo parece uma foto; com ela, respira.
//
// Distribuição dirigida (não uniforme): mais densa ao redor da
// Árvore central e num raio em volta de cada reino, rala no resto.
//
// EDITE AQUI: FIREFLY_COUNT, cores em createPalette(), alturas.
// =============================================================

import * as THREE from 'three'
import { journeyPoints, hubPosition, magicGlowColor } from '../data/journeyData.js'
import { getTerrainHeight } from './Terrain.js'

const FIREFLY_COUNT = 150

function createFireflyTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Sorteia um ponto de spawn perto de um "polo de magia" (Árvore ou reino).
function sampleSpawnPoint() {
  const poles = [
    { x: hubPosition[0], z: hubPosition[1], radius: 7, weight: 3 },
    ...journeyPoints.map((reino) => ({ x: reino.posicao[0], z: reino.posicao[1], radius: 6, weight: 1 })),
  ]

  const totalWeight = poles.reduce((sum, pole) => sum + pole.weight, 0)
  let pick = Math.random() * totalWeight
  let pole = poles[0]
  for (const candidate of poles) {
    pick -= candidate.weight
    if (pick <= 0) {
      pole = candidate
      break
    }
  }

  const angle = Math.random() * Math.PI * 2
  const radius = Math.sqrt(Math.random()) * pole.radius
  return {
    x: pole.x + Math.cos(angle) * radius,
    z: pole.z + Math.sin(angle) * radius,
  }
}

export class ParticlesController {
  constructor() {
    this.positions = new Float32Array(FIREFLY_COUNT * 3)
    this.seeds = []

    const colors = new Float32Array(FIREFLY_COUNT * 3)
    const purple = new THREE.Color(magicGlowColor)
    const lilac = new THREE.Color(0xc77dff)
    const gold = new THREE.Color(0xf0d999)

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const spawn = sampleSpawnPoint()
      const ground = getTerrainHeight(spawn.x, spawn.z)

      this.seeds.push({
        x: spawn.x,
        z: spawn.z,
        baseY: ground + 0.6 + Math.random() * 3.4,
        swayRadius: 0.4 + Math.random() * 1.1,
        swaySpeed: 0.12 + Math.random() * 0.3,
        bobSpeed: 0.4 + Math.random() * 0.7,
        bobAmplitude: 0.25 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      })

      const roll = Math.random()
      const color = roll < 0.6 ? purple : roll < 0.85 ? lilac : gold
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      map: createFireflyTexture(),
      size: 0.42,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    this.points = new THREE.Points(geometry, material)
    this.points.name = 'magic-fireflies'
    this.points.frustumCulled = false

    this.update(0)
  }

  update(elapsed) {
    const positions = this.positions

    for (let i = 0; i < this.seeds.length; i++) {
      const seed = this.seeds[i]
      const t = elapsed * seed.swaySpeed + seed.phase

      positions[i * 3] = seed.x + Math.cos(t) * seed.swayRadius
      positions[i * 3 + 1] = seed.baseY + Math.sin(elapsed * seed.bobSpeed + seed.phase) * seed.bobAmplitude
      positions[i * 3 + 2] = seed.z + Math.sin(t * 0.9) * seed.swayRadius
    }

    this.points.geometry.attributes.position.needsUpdate = true
  }
}
