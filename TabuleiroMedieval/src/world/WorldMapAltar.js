// =============================================================
// WorldMapAltar.js
// -------------------------------------------------------------
// Altar perto da árvore central: "[E] Abrir mapa" no modo
// exploração devolve o jogador ao Modo Mapa — conecta a interface
// (mapa) com o mundo (exploração), como pedido.
//
// Tenta carregar public/models/props/altar.glb; sem o arquivo,
// usa um altar procedural simples (pedestal + runa flutuante).
// =============================================================

import * as THREE from 'three'
import { loadGameModel } from './GameModel.js'
import { magicGlowColor, roadColor } from '../data/journeyData.js'

function buildProceduralAltar() {
  const group = new THREE.Group()

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: 0x4a3a22, roughness: 0.9 })
  )
  base.position.y = 0.175
  group.add(base)

  const slab = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.5, 0.12, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a1f14, roughness: 0.85 })
  )
  slab.position.y = 0.41
  group.add(slab)

  const rune = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.22, 0),
    new THREE.MeshStandardMaterial({ color: roadColor, emissive: magicGlowColor, emissiveIntensity: 1.1, roughness: 0.3 })
  )
  rune.position.y = 0.7
  group.add(rune)

  const light = new THREE.PointLight(magicGlowColor, 1.2, 5, 2)
  light.position.y = 0.9
  group.add(light)

  group.userData._rune = rune
  return group
}

export class WorldMapAltar {
  // `position`: THREE.Vector3 (posição real no mundo, resolvida pelo Experience).
  constructor(position) {
    this.group = new THREE.Group()
    this.group.position.copy(position)
    this.rune = null
    this._load()
  }

  async _load() {
    const { object } = await loadGameModel({
      src: '/models/props/altar.glb',
      fallback: buildProceduralAltar,
      interactive: true,
    })
    this.group.add(object)
    this.rune = object.userData._rune ?? null
  }

  update(elapsed) {
    if (this.rune) this.rune.rotation.y = elapsed * 0.6
  }
}
