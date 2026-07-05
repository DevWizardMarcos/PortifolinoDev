// =============================================================
// Vegetation.js
// -------------------------------------------------------------
// Árvores, arbustos e pedras low poly espalhados pelo mapa,
// evitando estradas e a área dos castelos/árvore central. Usa
// InstancedMesh (poucas draw calls) para manter tudo leve mesmo
// com dezenas de objetos.
//
// EDITE AQUI:
// - TREE_COUNT / BUSH_COUNT / ROCK_COUNT -> quantidade de cada tipo
// - EXCLUSION_RADIUS / ROAD_EXCLUSION_RADIUS -> "zonas proibidas"
// =============================================================

import * as THREE from 'three'
import { journeyPoints, hubPosition } from '../data/journeyData.js'
import { MAP_WIDTH, MAP_DEPTH } from './Terrain.js'

const TREE_COUNT = 46
const BUSH_COUNT = 60
const ROCK_COUNT = 34

const EXCLUSION_RADIUS = 3.2 // ao redor de castelos e da árvore central
const ROAD_EXCLUSION_RADIUS = 1.05 // faixa livre ao redor de cada estrada
const ROAD_SAMPLE_STEP = 0.4 // distância entre amostras ao longo da curva

const trunkGeometry = new THREE.CylinderGeometry(0.06, 0.09, 0.5, 6)
trunkGeometry.translate(0, 0.25, 0)
const foliageGeometry = new THREE.ConeGeometry(0.42, 0.9, 7)
foliageGeometry.translate(0, 0.5 + 0.45, 0)

const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x3b2a1c, roughness: 1 })
const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x2f5233, roughness: 0.9 })

const bushGeometry = new THREE.IcosahedronGeometry(0.28, 0)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x3a5a34, roughness: 0.95 })

const rockGeometry = new THREE.DodecahedronGeometry(0.24, 0)
const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x6b6862, roughness: 1 })

// Amostra pontos ao longo de cada curva de estrada, para usar como
// "zona proibida" na hora de espalhar vegetação.
function sampleRoadPoints(roads) {
  const points = []
  for (const { curve } of roads) {
    const length = curve.getLength()
    const divisions = Math.max(12, Math.floor(length / ROAD_SAMPLE_STEP))
    for (let i = 0; i <= divisions; i++) {
      points.push(curve.getPointAt(i / divisions))
    }
  }
  return points
}

function isValidPoint(x, z, exclusionCenters, roadPoints) {
  for (const c of exclusionCenters) {
    if (Math.hypot(x - c.x, z - c.z) < EXCLUSION_RADIUS) return false
  }
  for (const p of roadPoints) {
    if (Math.hypot(x - p.x, z - p.z) < ROAD_EXCLUSION_RADIUS) return false
  }
  return true
}

function scatterPoints(count, exclusionCenters, roadPoints) {
  const points = []
  let attempts = 0

  while (points.length < count && attempts < count * 60) {
    attempts++
    const x = (Math.random() - 0.5) * (MAP_WIDTH - 2)
    const z = (Math.random() - 0.5) * (MAP_DEPTH - 2)
    if (isValidPoint(x, z, exclusionCenters, roadPoints)) points.push({ x, z })
  }

  return points
}

export class VegetationController {
  // `roadsController` vem de Roads.js — usamos as mesmas curvas já
  // geradas para saber onde NÃO plantar vegetação.
  constructor(roadsController) {
    this.group = new THREE.Group()

    const exclusionCenters = [
      { x: hubPosition[0], z: hubPosition[1] },
      ...journeyPoints.map((reino) => ({ x: reino.posicao[0], z: reino.posicao[1] })),
    ]
    const roadPoints = sampleRoadPoints(roadsController.roads)

    this.buildTrees(scatterPoints(TREE_COUNT, exclusionCenters, roadPoints))
    this.buildBushes(scatterPoints(BUSH_COUNT, exclusionCenters, roadPoints))
    this.buildRocks(scatterPoints(ROCK_COUNT, exclusionCenters, roadPoints))
  }

  buildTrees(points) {
    if (points.length === 0) return

    const trunks = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, points.length)
    const foliage = new THREE.InstancedMesh(foliageGeometry, foliageMaterial, points.length)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    points.forEach((p, i) => {
      const scale = 0.8 + Math.random() * 0.6
      dummy.position.set(p.x, 0, p.z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()

      trunks.setMatrixAt(i, dummy.matrix)
      foliage.setMatrixAt(i, dummy.matrix)

      color.setHSL(0.32 + Math.random() * 0.05, 0.35 + Math.random() * 0.15, 0.2 + Math.random() * 0.1)
      foliage.setColorAt(i, color)
    })

    trunks.instanceMatrix.needsUpdate = true
    foliage.instanceMatrix.needsUpdate = true
    if (foliage.instanceColor) foliage.instanceColor.needsUpdate = true

    this.group.add(trunks, foliage)
  }

  buildBushes(points) {
    if (points.length === 0) return

    const mesh = new THREE.InstancedMesh(bushGeometry, bushMaterial, points.length)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    points.forEach((p, i) => {
      dummy.position.set(p.x, 0.14, p.z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      dummy.scale.set(0.8 + Math.random() * 0.6, 0.6 + Math.random() * 0.4, 0.8 + Math.random() * 0.6)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      color.setHSL(0.3 + Math.random() * 0.06, 0.3, 0.2 + Math.random() * 0.1)
      mesh.setColorAt(i, color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    this.group.add(mesh)
  }

  buildRocks(points) {
    if (points.length === 0) return

    const mesh = new THREE.InstancedMesh(rockGeometry, rockMaterial, points.length)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    points.forEach((p, i) => {
      dummy.position.set(p.x, 0.1, p.z)
      dummy.rotation.set(Math.random() * 0.4, Math.random() * Math.PI * 2, Math.random() * 0.4)
      const s = 0.6 + Math.random() * 0.8
      dummy.scale.set(s, s * 0.8, s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      color.setHSL(0, 0, 0.35 + Math.random() * 0.2)
      mesh.setColorAt(i, color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    this.group.add(mesh)
  }
}
