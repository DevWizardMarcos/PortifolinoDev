// =============================================================
// Ruin.js
// -------------------------------------------------------------
// Ruína decorativa (colunas quebradas + entulho) para quebrar
// áreas vazias durante a exploração.
//
// Tenta carregar public/models/props/ruins.glb; sem o arquivo,
// usa um fallback procedural.
// =============================================================

import * as THREE from 'three'
import { loadGameModel } from '../GameModel.js'

const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x554f47, roughness: 1 })

function buildProceduralRuin() {
  const group = new THREE.Group()

  const columns = [
    { x: 0, z: 0, height: 0.9 },
    { x: 0.9, z: 0.25, height: 0.55 },
    { x: -0.7, z: -0.5, height: 1.1 },
  ]

  columns.forEach(({ x, z, height }) => {
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, height, 8), stoneMaterial)
    column.position.set(x, height / 2, z)
    column.rotation.z = (Math.random() - 0.5) * 0.3
    group.add(column)
  })

  const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), stoneMaterial)
  rubble.position.set(-0.2, 0.12, 0.6)
  rubble.rotation.set(Math.random(), Math.random(), Math.random())
  group.add(rubble)

  return group
}

export class Ruin {
  constructor(position) {
    this.group = new THREE.Group()
    this.group.position.set(position[0], 0, position[1])
    this._load()
  }

  async _load() {
    const { object } = await loadGameModel({
      src: '/models/props/ruins.glb',
      fallback: buildProceduralRuin,
    })
    this.group.add(object)
  }
}
