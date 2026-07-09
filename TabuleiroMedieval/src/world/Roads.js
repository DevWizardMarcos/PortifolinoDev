// =============================================================
// Roads.js
// -------------------------------------------------------------
// As trilhas do mapa, no estilo da arte de referência: um caminho
// PONTILHADO DOURADO que sai do Núcleo da Criação e serpenteia até
// cada reino, "sentado" no relevo (cada marco amostra a altura real
// do terreno — nada de trilho flutuando).
//
// Sobre cada trilha viaja uma FAGULHA de luz (hub -> reino): além
// de bonita, ela guia o olho do usuário para os pontos interativos.
//
// As curvas são DETERMINÍSTICAS (curvatura fixa por reino, nada de
// Math.random) para a composição do mapa ser estável entre visitas —
// e a vegetação usa exatamente estas curvas para abrir clareira.
//
// EDITE AQUI:
// - ROAD_BENDS -> personalidade da curva de cada estrada
// - DOT_SPACING / HUB_CLEARANCE / KINGDOM_CLEARANCE -> ritmo da trilha
// =============================================================

import * as THREE from 'three'
import { journeyPoints, hubPosition, roadColor } from '../data/journeyData.js'
import { getTerrainHeight } from './Terrain.js'

const DOT_SPACING = 1.05
const HUB_CLEARANCE = 4.6 // a trilha nasce fora da colina da Árvore
const KINGDOM_CLEARANCE = 4.4 // e morre na beira da plataforma do castelo
const DOT_LIFT = 0.045

// Curvatura fixa [bend@35%, bend@70%] como fração do comprimento.
const ROAD_BENDS = [
  [0.16, -0.2],
  [-0.2, 0.13],
  [0.12, 0.22],
  [-0.17, -0.09],
  [0.21, 0.08],
]

function buildRoadCurve(hub, target, bends) {
  const direction = target.clone().sub(hub)
  const length = direction.length()
  const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize()

  const p1 = hub.clone().lerp(target, 0.35).add(perpendicular.clone().multiplyScalar(bends[0] * length))
  const p2 = hub.clone().lerp(target, 0.7).add(perpendicular.clone().multiplyScalar(bends[1] * length))

  return new THREE.CatmullRomCurve3([hub, p1, p2, target], false, 'catmullrom', 0.35)
}

function createSparkTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 240, 200, 1)')
  gradient.addColorStop(0.35, 'rgba(240, 209, 130, 0.55)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export class RoadsController {
  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'roads'
    this.roads = []
    this.sparks = []

    const hub = new THREE.Vector3(hubPosition[0], 0, hubPosition[1])
    const dotTransforms = []
    const sparkTexture = createSparkTexture()

    journeyPoints.forEach((reino, index) => {
      const target = new THREE.Vector3(reino.posicao[0], 0, reino.posicao[1])
      const curve = buildRoadCurve(hub, target, ROAD_BENDS[index % ROAD_BENDS.length])
      const length = curve.getLength()

      // Janela útil da trilha (fora da colina do hub e da plataforma).
      const t0 = THREE.MathUtils.clamp(HUB_CLEARANCE / length, 0, 0.45)
      const t1 = THREE.MathUtils.clamp(1 - KINGDOM_CLEARANCE / length, 0.55, 1)

      const dotCount = Math.max(4, Math.floor((length * (t1 - t0)) / DOT_SPACING))
      for (let i = 0; i <= dotCount; i++) {
        const t = t0 + ((t1 - t0) * i) / dotCount
        const point = curve.getPointAt(t)
        const y = getTerrainHeight(point.x, point.z) + DOT_LIFT
        // Marcos maiores a cada 5 pontos — ritmo visual de "passos".
        const waystone = i % 5 === 0
        dotTransforms.push({ x: point.x, y, z: point.z, scale: waystone ? 1.45 : 1 })
      }

      // Fagulha que percorre a trilha (velocidade/fase própria por reino).
      const spark = new THREE.Sprite(new THREE.SpriteMaterial({
        map: sparkTexture,
        color: 0xffe9b8,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }))
      spark.scale.setScalar(1.05)
      this.group.add(spark)
      this.sparks.push({
        sprite: spark,
        curve,
        t0,
        t1,
        speed: 0.055 + index * 0.008,
        phase: index * 0.23,
      })

      this.roads.push({ curve })
    })

    this.buildDots(dotTransforms)
  }

  buildDots(transforms) {
    const geometry = new THREE.CylinderGeometry(0.13, 0.17, 0.07, 8)
    const material = new THREE.MeshStandardMaterial({
      color: roadColor,
      emissive: 0xc9973f,
      emissiveIntensity: 0.5,
      roughness: 0.5,
      metalness: 0.35,
    })

    const dots = new THREE.InstancedMesh(geometry, material, transforms.length)
    dots.castShadow = false
    dots.receiveShadow = true

    const dummy = new THREE.Object3D()
    transforms.forEach((transform, index) => {
      dummy.position.set(transform.x, transform.y, transform.z)
      dummy.rotation.y = Math.random() * Math.PI
      dummy.scale.setScalar(transform.scale)
      dummy.updateMatrix()
      dots.setMatrixAt(index, dummy.matrix)
    })

    dots.instanceMatrix.needsUpdate = true
    this.group.add(dots)
  }

  update(elapsed) {
    for (const spark of this.sparks) {
      const cycle = (elapsed * spark.speed + spark.phase) % 1
      const t = spark.t0 + (spark.t1 - spark.t0) * cycle
      const point = spark.curve.getPointAt(t)
      const y = getTerrainHeight(point.x, point.z)
      spark.sprite.position.set(point.x, y + 0.55, point.z)

      // Nasce e morre em fade — sem "teleporte" seco no loop.
      const fade = Math.min(1, Math.min(cycle, 1 - cycle) * 9)
      spark.sprite.material.opacity = 0.75 * fade
    }
  }
}
