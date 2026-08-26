// =============================================================
// Crystal.js
// -------------------------------------------------------------
// Cristal-guia perto da árvore central: flutua, gira, emite luz e
// tem partículas orbitando — pode ser usado futuramente pelo gato
// guardião para orientar o jogador (ver seção 19 do pedido original).
//
// Tenta carregar public/models/props/crystal.glb; sem o arquivo,
// usa um fallback procedural.
// =============================================================

import * as THREE from 'three'
import { loadGameModel } from '../GameModel.js'
import { magicGlowColor } from '../../data/journeyData.js'

const MOTE_COUNT = 8

function buildProceduralCrystal() {
  const group = new THREE.Group()

  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.MeshStandardMaterial({
      color: magicGlowColor,
      emissive: magicGlowColor,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.5,
    })
  )
  crystal.position.y = 1.1
  group.add(crystal)

  const light = new THREE.PointLight(magicGlowColor, 1.3, 5, 2)
  light.position.y = 1.1
  group.add(light)

  const moteMaterial = new THREE.MeshBasicMaterial({ color: magicGlowColor })
  const motes = []
  for (let i = 0; i < MOTE_COUNT; i++) {
    const mote = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), moteMaterial)
    group.add(mote)
    motes.push({
      mesh: mote,
      radius: 0.35 + Math.random() * 0.2,
      speed: 0.4 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      height: 0.9 + Math.random() * 0.5,
    })
  }

  group.userData._crystal = crystal
  group.userData._motes = motes
  return group
}

export class Crystal {
  // `position`: THREE.Vector3 (posição real no mundo, resolvida pelo Experience).
  constructor(position) {
    this.group = new THREE.Group()
    this.group.position.copy(position)
    this.crystal = null
    this.motes = []
    this._load()
  }

  async _load() {
    const { object } = await loadGameModel({
      src: '/models/props/crystal.glb',
      fallback: buildProceduralCrystal,
    })
    this.group.add(object)
    this.crystal = object.userData._crystal ?? null
    this.motes = object.userData._motes ?? []
  }

  update(elapsed) {
    if (this.crystal) {
      this.crystal.rotation.y = elapsed * 0.5
      this.crystal.position.y = 1.1 + Math.sin(elapsed * 1.1) * 0.08
    }
    for (const mote of this.motes) {
      const angle = elapsed * mote.speed + mote.phase
      mote.mesh.position.set(Math.cos(angle) * mote.radius, mote.height, Math.sin(angle) * mote.radius)
    }
  }
}
