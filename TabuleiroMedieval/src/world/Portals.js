// =============================================================
// Portals.js
// -------------------------------------------------------------
// A Árvore Central mágica — o "Núcleo da Criação" que fica no meio
// do mapa: tronco + copa de cristais roxos + raízes brilhantes +
// dois anéis de energia (girando em direções opostas) + partículas
// orbitando a copa + uma aura que pulsa suavemente.
//
// EDITE AQUI:
// - TRUNK_HEIGHT / FOLIAGE_* -> proporções da árvore
// - ORBIT_COUNT -> quantas partículas orbitam a árvore
// - hubPosition em journeyData.js -> onde a árvore fica no mapa
// =============================================================

import * as THREE from 'three'
import { magicGlowColor, hubPosition } from '../data/journeyData.js'

const TRUNK_HEIGHT = 2.4
const ROOT_COUNT = 6
const FOLIAGE_CLUSTERS = 5
const ORBIT_COUNT = 14

const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x241a2e, roughness: 0.9, metalness: 0.1 })
const foliageMaterial = new THREE.MeshStandardMaterial({
  color: 0x2e1a3d,
  emissive: magicGlowColor,
  emissiveIntensity: 0.55,
  roughness: 0.6,
  metalness: 0.2,
})
const rootMaterial = new THREE.MeshStandardMaterial({ color: 0x1c1424, emissive: magicGlowColor, emissiveIntensity: 0.7, roughness: 0.7 })
const orbitMaterial = new THREE.MeshBasicMaterial({ color: magicGlowColor })

function createAuraTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const color = new THREE.Color(magicGlowColor)
  const [r, g, b] = [color.r * 255, color.g * 255, color.b * 255]

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.55)`)
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.18)`)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createCentralTree() {
  const group = new THREE.Group()

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, TRUNK_HEIGHT, 8), trunkMaterial)
  trunk.position.y = TRUNK_HEIGHT / 2
  group.add(trunk)

  const foliageGroup = new THREE.Group()
  foliageGroup.position.y = TRUNK_HEIGHT
  for (let i = 0; i < FOLIAGE_CLUSTERS; i++) {
    const angle = (Math.PI * 2 * i) / FOLIAGE_CLUSTERS
    const radius = i === 0 ? 0 : 0.55
    const cluster = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 0), foliageMaterial)
    cluster.position.set(Math.cos(angle) * radius, 0.35 + (i % 2) * 0.3, Math.sin(angle) * radius)
    cluster.rotation.set(Math.random(), Math.random(), Math.random())
    foliageGroup.add(cluster)
  }
  group.add(foliageGroup)

  // Aura suave por trás da copa, para reforçar o brilho mágico.
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: createAuraTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  aura.scale.setScalar(5)
  aura.position.y = TRUNK_HEIGHT + 0.4
  group.add(aura)

  const roots = []
  for (let i = 0; i < ROOT_COUNT; i++) {
    const angle = (Math.PI * 2 * i) / ROOT_COUNT
    const root = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.12, 1.4, 5), rootMaterial)
    root.position.set(Math.cos(angle) * 0.75, 0.08, Math.sin(angle) * 0.75)
    root.rotation.z = Math.PI / 2
    root.rotation.y = -angle
    group.add(root)
    roots.push(root)
  }

  const coreCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.3, 0),
    new THREE.MeshStandardMaterial({ color: magicGlowColor, emissive: magicGlowColor, emissiveIntensity: 1.4 })
  )
  coreCrystal.position.y = 0.5
  group.add(coreCrystal)

  const light = new THREE.PointLight(magicGlowColor, 2, 12, 2)
  light.position.y = 1.6
  group.add(light)

  // Partículas orbitando a copa — a "magia" visível ao redor da árvore.
  const orbitMotes = []
  for (let i = 0; i < ORBIT_COUNT; i++) {
    const mote = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), orbitMaterial)
    group.add(mote)
    orbitMotes.push({
      mesh: mote,
      radius: 1.2 + Math.random() * 1.1,
      speed: 0.25 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      height: TRUNK_HEIGHT * 0.35 + Math.random() * TRUNK_HEIGHT * 0.9,
      tilt: Math.random() * 0.7 - 0.35,
    })
  }

  return { group, foliageGroup, roots, coreCrystal, light, aura, orbitMotes }
}

// Anel de energia pulsando no chão, sob a árvore.
function createGroundRing(radius, color = magicGlowColor) {
  const group = new THREE.Group()
  group.rotation.x = -Math.PI / 2

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.055, 12, 48),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, roughness: 0.4 })
  )
  group.add(ring)

  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(radius - 0.1, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  group.add(disc)

  return { group, ring, disc }
}

export class PortalsController {
  constructor() {
    this.group = new THREE.Group()
    this.group.position.set(hubPosition[0], 0, hubPosition[1])

    this.tree = createCentralTree()
    this.ringInner = createGroundRing(1.7)
    this.ringOuter = createGroundRing(2.6)

    this.group.add(this.ringOuter.group)
    this.group.add(this.ringInner.group)
    this.group.add(this.tree.group)
  }

  // Chamado a cada frame: balanço da copa, pulso das raízes/anéis,
  // aura respirando e partículas orbitando a copa.
  update(elapsed) {
    this.tree.foliageGroup.rotation.y = Math.sin(elapsed * 0.3) * 0.08
    this.tree.coreCrystal.rotation.y = elapsed * 0.8

    const pulse = 0.8 + Math.sin(elapsed * 1.4) * 0.2
    this.tree.light.intensity = 2 * pulse
    foliageMaterial.emissiveIntensity = 0.45 + pulse * 0.2
    rootMaterial.emissiveIntensity = 0.5 + pulse * 0.3

    this.tree.aura.scale.setScalar(5 + Math.sin(elapsed * 0.9) * 0.4)
    this.tree.aura.material.opacity = 0.7 + Math.sin(elapsed * 0.9) * 0.2

    this.ringInner.ring.rotation.z = elapsed * 0.12
    this.ringInner.disc.material.opacity = 0.08 * pulse
    this.ringOuter.ring.rotation.z = -elapsed * 0.07
    this.ringOuter.disc.material.opacity = 0.06 * pulse

    for (const mote of this.tree.orbitMotes) {
      const angle = elapsed * mote.speed + mote.phase
      const x = Math.cos(angle) * mote.radius
      const z = Math.sin(angle) * mote.radius * Math.cos(mote.tilt)
      const y = mote.height + Math.sin(angle * 2) * 0.2
      mote.mesh.position.set(x, y, z)
    }
  }
}
