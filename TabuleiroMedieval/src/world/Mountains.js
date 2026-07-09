// =============================================================
// Mountains.js
// -------------------------------------------------------------
// A moldura natural do mundo. Regras de composição (level design):
// - CORDILHEIRA PESADA no norte: fecha o horizonte atrás dos três
//   reinos do conhecimento e dá escala ao mapa (como na referência);
// - cantos ancorados com maciços médios, para o tabuleiro não
//   "vazar" na diagonal;
// - o SUL fica mais aberto (só colinas baixas): é o "respiro" da
//   composição e de onde o jogador olha o mapa;
// - onde um rio encosta na borda norte, a cordilheira abre uma
//   PASSAGEM — o rio visivelmente "nasce nas montanhas".
//
// EDITE AQUI: NORTH_RANGE / CORNERS / SOUTH_HILLS para redesenhar
// a moldura, SNOW_MIN_HEIGHT para nevar mais ou menos picos.
// =============================================================

import * as THREE from 'three'
import { MAP_WIDTH, MAP_DEPTH, getTerrainHeight, distanceToRiver } from './Terrain.js'

const SNOW_MIN_HEIGHT = 4.2
const RIVER_PASS_WIDTH = 3.4

// Cone irregular compartilhado: o jitter é ASSADO na geometria uma
// única vez; a variedade visual vem de escala/rotação por instância.
function createCraggyConeGeometry() {
  const geometry = new THREE.ConeGeometry(1, 1, 8, 3)
  const position = geometry.attributes.position

  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i)
    // Não mexe no pico (y=0.5) para o snow cap encaixar certinho.
    if (y > 0.45) continue
    const jitter = 0.16 * (0.5 - y)
    position.setX(i, position.getX(i) + (Math.random() - 0.5) * jitter)
    position.setZ(i, position.getZ(i) + (Math.random() - 0.5) * jitter)
  }

  geometry.computeVertexNormals()
  return geometry
}

function buildPlacements() {
  const placements = []
  const halfW = MAP_WIDTH / 2
  const halfD = MAP_DEPTH / 2

  const tryAdd = (x, z, height, radius) => {
    if (distanceToRiver(x, z) < RIVER_PASS_WIDTH) return
    placements.push({ x, z, height, radius })
  }

  // Cordilheira norte: dupla fileira, mais alta no fundo.
  for (let x = -halfW + 3; x <= halfW - 3; x += 2.3) {
    const jitterX = x + (Math.random() - 0.5) * 1.4
    // Fileira de trás (borda) — os picos-heróis.
    tryAdd(
      jitterX,
      -halfD + 2.2 + Math.random() * 1.6,
      4.2 + Math.random() * 3.4,
      2.1 + Math.random() * 1.3
    )
    // Fileira da frente — sopé, menor e mais espaçado.
    if (Math.random() > 0.45) {
      tryAdd(
        jitterX + (Math.random() - 0.5) * 2,
        -halfD + 4.6 + Math.random() * 1.8,
        2 + Math.random() * 1.8,
        1.4 + Math.random() * 0.9
      )
    }
  }

  // Maciços dos cantos leste/oeste (descendo um pouco pelas laterais).
  const corners = [
    { x: -halfW + 2.6, zStart: -halfD + 5, zEnd: -halfD + 13 },
    { x: halfW - 2.6, zStart: -halfD + 5, zEnd: -halfD + 13 },
    { x: -halfW + 2.4, zStart: halfD - 8, zEnd: halfD - 3 },
    { x: halfW - 2.4, zStart: halfD - 8, zEnd: halfD - 3 },
  ]

  corners.forEach((corner, index) => {
    const south = index >= 2
    for (let z = corner.zStart; z <= corner.zEnd; z += 2.4) {
      tryAdd(
        corner.x + (Math.random() - 0.5) * 1.8,
        z + (Math.random() - 0.5) * 1.2,
        south ? 1.6 + Math.random() * 1.4 : 2.8 + Math.random() * 2.4,
        south ? 1.2 + Math.random() * 0.7 : 1.6 + Math.random() * 1
      )
    }
  })

  // Colinas baixas esparsas na borda sul — fecham sem pesar.
  for (let x = -halfW + 8; x <= halfW - 8; x += 5.5) {
    if (Math.random() > 0.6) continue
    tryAdd(
      x + (Math.random() - 0.5) * 2.5,
      halfD - 2.6 + (Math.random() - 0.5) * 1.2,
      1.2 + Math.random() * 1.1,
      1.3 + Math.random() * 0.9
    )
  }

  return placements
}

export class MountainsController {
  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'mountains'

    const placements = buildPlacements()
    const snowy = placements.filter((p) => p.height >= SNOW_MIN_HEIGHT)

    const rockGeometry = createCraggyConeGeometry()
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: 0x958b7f,
      roughness: 1,
      metalness: 0,
      flatShading: true,
    })

    const rocks = new THREE.InstancedMesh(rockGeometry, rockMaterial, placements.length)
    rocks.castShadow = true
    rocks.receiveShadow = true

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const hazePurple = new THREE.Color(0x6f6180)

    placements.forEach((placement, index) => {
      const groundY = Math.max(getTerrainHeight(placement.x, placement.z), -0.55)
      dummy.position.set(placement.x, groundY + placement.height / 2 - 0.25, placement.z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      dummy.scale.set(placement.radius, placement.height, placement.radius * (0.85 + Math.random() * 0.3))
      dummy.updateMatrix()
      rocks.setMatrixAt(index, dummy.matrix)

      // Perspectiva atmosférica: quanto mais ao norte (fundo), mais a
      // rocha puxa para o roxo da névoa — profundidade de matte painting.
      color.setHSL(0.08, 0.08, 0.44 + Math.random() * 0.12)
      const depth = THREE.MathUtils.clamp((-placement.z - MAP_DEPTH * 0.25) / (MAP_DEPTH * 0.3), 0, 1)
      color.lerp(hazePurple, depth * 0.55)
      rocks.setColorAt(index, color)
    })

    rocks.instanceMatrix.needsUpdate = true
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true
    this.group.add(rocks)

    // Neve nos picos-heróis.
    if (snowy.length > 0) {
      const snowGeometry = new THREE.ConeGeometry(0.34, 0.36, 8)
      const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xf4efe4, roughness: 0.85, metalness: 0 })
      const caps = new THREE.InstancedMesh(snowGeometry, snowMaterial, snowy.length)
      caps.castShadow = false
      caps.receiveShadow = false

      snowy.forEach((placement, index) => {
        const groundY = Math.max(getTerrainHeight(placement.x, placement.z), -0.55)
        const baseY = groundY - 0.25
        dummy.position.set(placement.x, baseY + placement.height * 0.845, placement.z)
        dummy.rotation.y = 0
        dummy.scale.set(placement.radius, placement.height, placement.radius * 0.95)
        dummy.updateMatrix()
        caps.setMatrixAt(index, dummy.matrix)
      })

      caps.instanceMatrix.needsUpdate = true
      this.group.add(caps)
    }
  }
}
