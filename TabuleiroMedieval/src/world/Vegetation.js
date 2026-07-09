// =============================================================
// Vegetation.js
// -------------------------------------------------------------
// Composicao organica do mapa: bosques nas bordas, clareiras nos
// eixos de leitura, vegetacao lateral aos caminhos e arredores
// assimetricos ao redor de cada reino.
// =============================================================

import * as THREE from 'three'
import { journeyPoints, hubPosition } from '../data/journeyData.js'
import { MAP_WIDTH, MAP_DEPTH, getTerrainHeight, distanceToRiver } from './Terrain.js'

const TREE_COUNT = 122
const BUSH_COUNT = 150
const ROCK_COUNT = 70
const GRASS_COUNT = 260

const HUB_CLEAR_RADIUS = 6.5
const KINGDOM_CORE_RADIUS = 4.7 // plataforma de pedra + folga
const ROAD_EXCLUSION_RADIUS = 0.95
const RIVER_EXCLUSION_RADIUS = 1.9
const ROAD_SAMPLE_STEP = 0.35

const trunkGeometry = new THREE.CylinderGeometry(0.06, 0.09, 0.5, 6)
trunkGeometry.translate(0, 0.25, 0)
const foliageGeometry = new THREE.ConeGeometry(0.42, 0.9, 7)
foliageGeometry.translate(0, 0.95, 0)

const bushGeometry = new THREE.IcosahedronGeometry(0.26, 0)
const rockGeometry = new THREE.DodecahedronGeometry(0.24, 0)
const grassGeometry = new THREE.ConeGeometry(0.08, 0.28, 5)
grassGeometry.translate(0, 0.14, 0)
const moundGeometry = new THREE.SphereGeometry(1, 24, 12)

const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3522, roughness: 1, metalness: 0 })
const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x3f5c31, roughness: 0.95, metalness: 0 })
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x4d6538, roughness: 1, metalness: 0 })
const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x756d61, roughness: 1, metalness: 0 })
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x617941, roughness: 1, metalness: 0 })
const moundMaterial = new THREE.MeshStandardMaterial({ color: 0x655238, roughness: 1, metalness: 0 })

function sampleRoadPoints(roads) {
  const points = []
  for (const { curve } of roads) {
    const length = curve.getLength()
    const divisions = Math.max(18, Math.floor(length / ROAD_SAMPLE_STEP))
    for (let i = 0; i <= divisions; i++) {
      points.push(curve.getPointAt(i / divisions))
    }
  }
  return points
}

function distanceToClosestRoad(x, z, roadPoints) {
  let min = Infinity
  for (const point of roadPoints) {
    const distance = Math.hypot(x - point.x, z - point.z)
    if (distance < min) min = distance
  }
  return min
}

function isInsideKingdomCore(x, z, kingdomCenters) {
  for (const center of kingdomCenters) {
    if (Math.hypot(x - center.x, z - center.z) < KINGDOM_CORE_RADIUS) return true
  }
  return false
}

function isInsideHubCore(x, z) {
  return Math.hypot(x - hubPosition[0], z - hubPosition[1]) < HUB_CLEAR_RADIUS
}

function isValidNaturalPoint(x, z, roadPoints, kingdomCenters, roadBuffer = ROAD_EXCLUSION_RADIUS) {
  if (isInsideHubCore(x, z)) return false
  if (isInsideKingdomCore(x, z, kingdomCenters)) return false
  if (distanceToClosestRoad(x, z, roadPoints) < roadBuffer) return false
  if (distanceToRiver(x, z) < RIVER_EXCLUSION_RADIUS) return false
  return true
}

function scatterGlobalPoints(count, roadPoints, kingdomCenters, roadBuffer = ROAD_EXCLUSION_RADIUS) {
  const points = []
  let attempts = 0

  while (points.length < count && attempts < count * 90) {
    attempts++
    const x = (Math.random() - 0.5) * (MAP_WIDTH - 4)
    const z = (Math.random() - 0.5) * (MAP_DEPTH - 4)
    if (isValidNaturalPoint(x, z, roadPoints, kingdomCenters, roadBuffer)) points.push({ x, z })
  }

  return points
}

function createKingdomEnvelopes() {
  return journeyPoints.map((reino) => {
    const center = new THREE.Vector2(reino.posicao[0], reino.posicao[1])
    const hub = new THREE.Vector2(hubPosition[0], hubPosition[1])
    const towardHub = hub.clone().sub(center).normalize()
    const backward = towardHub.clone().multiplyScalar(-1)
    const left = new THREE.Vector2(-towardHub.y, towardHub.x)
    const right = left.clone().multiplyScalar(-1)

    return {
      center,
      facing: towardHub,
      anchors: [
        center.clone().add(backward.clone().multiplyScalar(6.2)),
        center.clone().add(left.clone().multiplyScalar(5.6)).add(backward.clone().multiplyScalar(3.4)),
        center.clone().add(right.clone().multiplyScalar(5.6)).add(backward.clone().multiplyScalar(3.4)),
        center.clone().add(left.clone().multiplyScalar(4.4)).add(towardHub.clone().multiplyScalar(1.8)),
        center.clone().add(right.clone().multiplyScalar(4.4)).add(towardHub.clone().multiplyScalar(1.8)),
      ],
      keepClearCenter: center.clone().add(towardHub.clone().multiplyScalar(3)),
    }
  })
}

function scatterAroundAnchors(anchors, countRange, radiusRange, roadPoints, kingdomCenters, roadBuffer) {
  const points = []

  anchors.forEach((anchor) => {
    const count = countRange.min + Math.floor(Math.random() * (countRange.max - countRange.min + 1))
    let created = 0
    let attempts = 0

    while (created < count && attempts < count * 70) {
      attempts++
      const angle = Math.random() * Math.PI * 2
      const radius = radiusRange.min + Math.random() * (radiusRange.max - radiusRange.min)
      const x = anchor.x + Math.cos(angle) * radius
      const z = anchor.y + Math.sin(angle) * radius

      if (Math.abs(x) > MAP_WIDTH / 2 - 2 || Math.abs(z) > MAP_DEPTH / 2 - 2) continue
      if (isValidNaturalPoint(x, z, roadPoints, kingdomCenters, roadBuffer)) {
        points.push({ x, z })
        created++
      }
    }
  })

  return points
}

function scatterBorderPoints(count, roadPoints, kingdomCenters) {
  const points = []
  let attempts = 0

  while (points.length < count && attempts < count * 90) {
    attempts++
    const side = Math.floor(Math.random() * 4)
    const margin = 2.5 + Math.random() * 5.5
    let x = 0
    let z = 0

    if (side === 0) {
      x = -MAP_WIDTH / 2 + margin
      z = (Math.random() - 0.5) * (MAP_DEPTH - 4)
    } else if (side === 1) {
      x = MAP_WIDTH / 2 - margin
      z = (Math.random() - 0.5) * (MAP_DEPTH - 4)
    } else if (side === 2) {
      x = (Math.random() - 0.5) * (MAP_WIDTH - 4)
      z = -MAP_DEPTH / 2 + margin
    } else {
      x = (Math.random() - 0.5) * (MAP_WIDTH - 4)
      z = MAP_DEPTH / 2 - margin
    }

    if (isValidNaturalPoint(x, z, roadPoints, kingdomCenters, 0.9)) points.push({ x, z })
  }

  return points
}

function setInstancedShadow(mesh, cast = true, receive = true) {
  mesh.castShadow = cast
  mesh.receiveShadow = receive
  return mesh
}

function setColorVariation(target, baseHue, hueSpread, saturation, lightnessBase, lightnessSpread) {
  target.setHSL(
    baseHue + (Math.random() - 0.5) * hueSpread,
    saturation + (Math.random() - 0.5) * 0.08,
    lightnessBase + (Math.random() - 0.5) * lightnessSpread
  )
}

export class VegetationController {
  constructor(roadsController) {
    this.group = new THREE.Group()

    const kingdomCenters = journeyPoints.map((reino) => ({ x: reino.posicao[0], z: reino.posicao[1] }))
    const roadPoints = sampleRoadPoints(roadsController.roads)
    const envelopes = createKingdomEnvelopes()

    const borderTrees = scatterBorderPoints(26, roadPoints, kingdomCenters)
    const kingdomTreePoints = scatterAroundAnchors(
      envelopes.flatMap((envelope) => envelope.anchors.slice(0, 3)),
      { min: 3, max: 5 },
      { min: 0.9, max: 2.2 },
      roadPoints,
      kingdomCenters,
      0.92
    )

    const kingdomBushPoints = scatterAroundAnchors(
      envelopes.flatMap((envelope) => envelope.anchors),
      { min: 5, max: 8 },
      { min: 0.7, max: 1.9 },
      roadPoints,
      kingdomCenters,
      0.62
    )

    const kingdomRockPoints = scatterAroundAnchors(
      envelopes.flatMap((envelope) => envelope.anchors.slice(0, 4)),
      { min: 2, max: 4 },
      { min: 0.7, max: 1.7 },
      roadPoints,
      kingdomCenters,
      0.74
    )

    const kingdomGrassPoints = scatterAroundAnchors(
      envelopes.flatMap((envelope) => envelope.anchors),
      { min: 7, max: 12 },
      { min: 0.8, max: 2.35 },
      roadPoints,
      kingdomCenters,
      0.5
    )

    const treePoints = [
      ...scatterGlobalPoints(TREE_COUNT - kingdomTreePoints.length - borderTrees.length, roadPoints, kingdomCenters, 1),
      ...borderTrees,
      ...kingdomTreePoints,
    ]

    const bushPoints = [
      ...scatterGlobalPoints(BUSH_COUNT - kingdomBushPoints.length, roadPoints, kingdomCenters, 0.72),
      ...kingdomBushPoints,
    ]

    const rockPoints = [
      ...scatterGlobalPoints(ROCK_COUNT - kingdomRockPoints.length, roadPoints, kingdomCenters, 0.8),
      ...kingdomRockPoints,
    ]

    const grassPoints = [
      ...scatterGlobalPoints(GRASS_COUNT - kingdomGrassPoints.length, roadPoints, kingdomCenters, 0.55),
      ...kingdomGrassPoints,
    ]

    this.buildMounds(envelopes, roadPoints, kingdomCenters)
    this.buildTrees(treePoints)
    this.buildBushes(bushPoints)
    this.buildRocks(rockPoints)
    this.buildGrass(grassPoints)
  }

  buildMounds(envelopes, roadPoints, kingdomCenters) {
    envelopes.forEach((envelope, index) => {
      const moundAnchors = [envelope.anchors[0], envelope.anchors[1], envelope.anchors[2]]
      const moundCount = 2 + (index % 2)

      for (let i = 0; i < moundCount; i++) {
        const anchor = moundAnchors[i % moundAnchors.length]
        let attempts = 0

        while (attempts < 24) {
          attempts++
          const angle = Math.random() * Math.PI * 2
          const radius = 0.7 + Math.random() * 1.5
          const x = anchor.x + Math.cos(angle) * radius
          const z = anchor.y + Math.sin(angle) * radius
          if (!isValidNaturalPoint(x, z, roadPoints, kingdomCenters, 0.86)) continue

          const mound = new THREE.Mesh(moundGeometry, moundMaterial)
          mound.position.set(x, getTerrainHeight(x, z) - 0.22 + Math.random() * 0.05, z)
          mound.scale.set(0.9 + Math.random() * 1.35, 0.12 + Math.random() * 0.1, 0.9 + Math.random() * 1.25)
          mound.rotation.y = Math.random() * Math.PI
          mound.receiveShadow = true
          this.group.add(mound)
          break
        }
      }
    })
  }

  buildTrees(points) {
    if (points.length === 0) return

    const trunks = setInstancedShadow(new THREE.InstancedMesh(trunkGeometry, trunkMaterial, points.length))
    const foliage = setInstancedShadow(new THREE.InstancedMesh(foliageGeometry, foliageMaterial, points.length))
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    points.forEach((point, index) => {
      const scale = 0.9 + Math.random() * 1.5
      dummy.position.set(point.x, getTerrainHeight(point.x, point.z), point.z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      dummy.scale.set(scale, scale * (0.88 + Math.random() * 0.32), scale)
      dummy.updateMatrix()

      trunks.setMatrixAt(index, dummy.matrix)
      foliage.setMatrixAt(index, dummy.matrix)

      setColorVariation(color, 0.28, 0.05, 0.28, 0.28, 0.1)
      foliage.setColorAt(index, color)
    })

    trunks.instanceMatrix.needsUpdate = true
    foliage.instanceMatrix.needsUpdate = true
    if (foliage.instanceColor) foliage.instanceColor.needsUpdate = true

    this.group.add(trunks, foliage)
  }

  buildBushes(points) {
    if (points.length === 0) return

    const mesh = setInstancedShadow(new THREE.InstancedMesh(bushGeometry, bushMaterial, points.length))
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    points.forEach((point, index) => {
      dummy.position.set(point.x, getTerrainHeight(point.x, point.z) + 0.12, point.z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      dummy.scale.set(0.65 + Math.random() * 0.92, 0.52 + Math.random() * 0.45, 0.68 + Math.random() * 0.98)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)

      setColorVariation(color, 0.26, 0.04, 0.26, 0.26, 0.08)
      mesh.setColorAt(index, color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    this.group.add(mesh)
  }

  buildRocks(points) {
    if (points.length === 0) return

    const mesh = setInstancedShadow(new THREE.InstancedMesh(rockGeometry, rockMaterial, points.length))
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    points.forEach((point, index) => {
      const scale = 0.52 + Math.random() * 1
      dummy.position.set(point.x, getTerrainHeight(point.x, point.z) + 0.08, point.z)
      dummy.rotation.set(Math.random() * 0.42, Math.random() * Math.PI * 2, Math.random() * 0.38)
      dummy.scale.set(scale, scale * (0.7 + Math.random() * 0.22), scale * (0.85 + Math.random() * 0.25))
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)

      color.setHSL(0.09, 0.07, 0.38 + Math.random() * 0.14)
      mesh.setColorAt(index, color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    this.group.add(mesh)
  }

  buildGrass(points) {
    if (points.length === 0) return

    const mesh = new THREE.InstancedMesh(grassGeometry, grassMaterial, points.length)
    mesh.receiveShadow = true
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    points.forEach((point, index) => {
      dummy.position.set(point.x, getTerrainHeight(point.x, point.z) + 0.02, point.z)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.2)
      const scale = 0.65 + Math.random() * 0.95
      dummy.scale.set(scale * 0.78, scale, scale * 0.78)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)

      setColorVariation(color, 0.25, 0.05, 0.26, 0.32, 0.1)
      mesh.setColorAt(index, color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    this.group.add(mesh)
  }
}
