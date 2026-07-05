// =============================================================
// Roads.js
// -------------------------------------------------------------
// Estradas douradas em "raio de roda": todas partem da Árvore
// Central (hubPosition) até cada um dos 5 castelos. Cada estrada tem:
// - um tubo dourado principal (o caminho em si)
// - uma linha fina e brilhante por cima (o "friso mágico")
// - 2 pontos de energia roxos percorrendo o caminho continuamente
//
// EDITE AQUI:
// - ROAD_RADIUS -> largura da estrada
// - ENERGY_SPEED -> velocidade dos pontos de energia
// - MOTES_PER_ROAD -> quantos pontos de luz por caminho
// =============================================================

import * as THREE from 'three'
import { journeyPoints, roadColor, magicGlowColor, hubPosition } from '../data/journeyData.js'

const ROAD_RADIUS = 0.14
const ROAD_Y = 0.05
const ENERGY_SPEED = 0.08 // "voltas" por segundo ao longo do caminho
const MOTES_PER_ROAD = 2

const roadMaterial = new THREE.MeshStandardMaterial({
  color: roadColor,
  emissive: roadColor,
  emissiveIntensity: 0.15,
  roughness: 0.6,
  metalness: 0.3,
})

// Friso fino e brilhante que corre por cima do tubo principal.
const glowLineMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff2c0,
  emissive: 0xfff2c0,
  emissiveIntensity: 1.5,
  roughness: 0.3,
  metalness: 0.5,
})

const energyMaterial = new THREE.MeshStandardMaterial({
  color: magicGlowColor,
  emissive: magicGlowColor,
  emissiveIntensity: 2,
})

// Curva com 2 pontos de controle deslocados perpendicularmente ao
// segmento hub->reino, escalados pela distância — dá uma sinuosidade
// natural sem exagerar em caminhos curtos.
function buildRoadCurve(hub, target) {
  const direction = target.clone().sub(hub)
  const length = direction.length()
  const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize()

  const bendA = (Math.random() - 0.5) * length * 0.18
  const bendB = (Math.random() - 0.5) * length * 0.18

  const p1 = hub.clone().lerp(target, 0.35).add(perpendicular.clone().multiplyScalar(bendA))
  const p2 = hub.clone().lerp(target, 0.7).add(perpendicular.clone().multiplyScalar(bendB))
  p1.y = ROAD_Y
  p2.y = ROAD_Y

  return new THREE.CatmullRomCurve3([hub, p1, p2, target], false, 'catmullrom', 0.35)
}

// Curva-espelho elevada, usada só para desenhar o friso brilhante por
// cima do tubo principal (evita ele ficar "afundado" dentro do tubo).
function buildGlowCurve(curve) {
  const points = curve.getPoints(80).map((p) => new THREE.Vector3(p.x, p.y + ROAD_RADIUS * 0.92, p.z))
  return new THREE.CatmullRomCurve3(points)
}

export class RoadsController {
  constructor() {
    this.group = new THREE.Group()
    this.roads = []

    const hub = new THREE.Vector3(hubPosition[0], ROAD_Y, hubPosition[1])

    journeyPoints.forEach((reino, index) => {
      const target = new THREE.Vector3(reino.posicao[0], ROAD_Y, reino.posicao[1])
      const curve = buildRoadCurve(hub, target)

      const tubeGeometry = new THREE.TubeGeometry(curve, 120, ROAD_RADIUS, 8, false)
      this.group.add(new THREE.Mesh(tubeGeometry, roadMaterial))

      const glowCurve = buildGlowCurve(curve)
      const glowGeometry = new THREE.TubeGeometry(glowCurve, 120, ROAD_RADIUS * 0.28, 6, false)
      this.group.add(new THREE.Mesh(glowGeometry, glowLineMaterial))

      const motes = []
      for (let m = 0; m < MOTES_PER_ROAD; m++) {
        const energyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), energyMaterial)
        const energyLight = new THREE.PointLight(magicGlowColor, 1.2, 4, 2)
        energyMesh.add(energyLight)
        this.group.add(energyMesh)
        motes.push({ mesh: energyMesh, phase: m / MOTES_PER_ROAD })
      }

      this.roads.push({ curve, motes, offset: index / journeyPoints.length })
    })
  }

  // Chamado a cada frame — desloca os pontos de energia ao longo da curva.
  update(elapsed) {
    for (const road of this.roads) {
      for (const mote of road.motes) {
        const t = (elapsed * ENERGY_SPEED + road.offset + mote.phase) % 1
        const point = road.curve.getPointAt(t)
        mote.mesh.position.set(point.x, point.y + 0.15, point.z)
      }
    }
  }
}
