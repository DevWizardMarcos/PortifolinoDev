// =============================================================
// Terrain.js
// -------------------------------------------------------------
// O "chão" do mapa: uma textura procedural (terra + grama + manchas
// escuras + grão + vinheta nas bordas), gerada por Canvas2D — sem
// depender de imagem externa — mais um relevo sutil (colinas rasas)
// que se achata perto dos castelos/árvore central para nada flutuar.
//
// EDITE AQUI:
// - MAP_WIDTH / MAP_DEPTH -> tamanho do mapa
// - BUMP_HEIGHT -> intensidade do relevo
// - createTerrainTexture -> cores/quantidade das manchas de grama/terra
// =============================================================

import * as THREE from 'three'
import { journeyPoints, hubPosition } from '../data/journeyData.js'

export const MAP_WIDTH = 40
export const MAP_DEPTH = 22

const BUMP_HEIGHT = 0.16
const FLATTEN_INNER_RADIUS = 2.6
const FLATTEN_OUTER_RADIUS = 4.6

// Pontos onde o terreno deve ficar liso (castelos + árvore central),
// para nenhuma construção parecer flutuando sobre um relevo irregular.
function getFlattenCenters() {
  return [
    { x: hubPosition[0], z: hubPosition[1] },
    ...journeyPoints.map((reino) => ({ x: reino.posicao[0], z: reino.posicao[1] })),
  ]
}

function smoothstep(edge0, edge1, value) {
  const t = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

// Ruído barato (soma de senos) — não é Perlin real, mas dá ondulação
// orgânica o suficiente para "colinas" discretas sem depender de libs.
function noise2D(x, z) {
  return (
    Math.sin(x * 0.35 + 1.7) * Math.cos(z * 0.4 + 0.6) * 0.6 +
    Math.sin(x * 0.9 - 2.1) * Math.cos(z * 0.8 + 3.2) * 0.3 +
    Math.sin((x + z) * 0.15) * 0.4
  )
}

// Gera a textura do terreno: base de terra + manchas de grama/terra
// escura + grão fino + vinheta escurecendo as bordas do mapa.
function createTerrainTexture() {
  const width = 1024
  const height = 576
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Base: gradiente radial de terra (mais claro no centro, mais escuro fora).
  const base = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, width * 0.65
  )
  base.addColorStop(0, '#8a6d3b')
  base.addColorStop(0.55, '#6f5730')
  base.addColorStop(1, '#4a3a22')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  // Manchas de grama (verdes) espalhadas.
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 18 + Math.random() * 60
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    const green = 70 + Math.random() * 40
    grad.addColorStop(0, `rgba(${40 + Math.random() * 20}, ${green}, ${30 + Math.random() * 15}, 0.55)`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  // Manchas de terra escura/sombras.
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = 14 + Math.random() * 46
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, 'rgba(30, 20, 12, 0.45)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.7, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  // Grão fino (ruído por pixel) via ImageData — barato e evita milhares de draws.
  const grain = ctx.getImageData(0, 0, width, height)
  const data = grain.data
  for (let i = 0; i < data.length; i += 4) {
    const jitter = (Math.random() - 0.5) * 26
    data[i] = Math.min(255, Math.max(0, data[i] + jitter))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + jitter))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + jitter))
  }
  ctx.putImageData(grain, 0, 0)

  // Vinheta: escurece as bordas para dar sensação de "borda de mapa antigo".
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, width * 0.32,
    width / 2, height / 2, width * 0.62
  )
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(6, 4, 2, 0.75)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function createTerrain() {
  const segmentsX = 64
  const segmentsZ = 36
  const geometry = new THREE.PlaneGeometry(MAP_WIDTH, MAP_DEPTH, segmentsX, segmentsZ)

  // Relevo sutil: ondula o terreno e achata perto de castelos/árvore central
  // (a mesh ainda será rotacionada -90° em X, então aqui local X/Y = mundo X/Z).
  const position = geometry.attributes.position
  const centers = getFlattenCenters()

  for (let i = 0; i < position.count; i++) {
    const worldX = position.getX(i)
    const worldZ = position.getY(i)

    let minDist = Infinity
    for (const c of centers) {
      const d = Math.hypot(worldX - c.x, worldZ - c.z)
      if (d < minDist) minDist = d
    }

    const flatten = smoothstep(FLATTEN_INNER_RADIUS, FLATTEN_OUTER_RADIUS, minDist)
    const bump = noise2D(worldX, worldZ) * BUMP_HEIGHT * flatten
    position.setZ(i, bump)
  }

  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({
    map: createTerrainTexture(),
    roughness: 0.95,
    metalness: 0.02,
  })

  const terrain = new THREE.Mesh(geometry, material)
  terrain.rotation.x = -Math.PI / 2
  terrain.receiveShadow = false
  terrain.name = 'terrain'

  return terrain
}

// Borda ornamentada simples ao redor do mapa (moldura de pergaminho),
// só uma linha dourada — troque a cor/espessura à vontade.
export function createTerrainBorder() {
  const shape = new THREE.Shape()
  const w = MAP_WIDTH / 2
  const d = MAP_DEPTH / 2

  shape.moveTo(-w, -d)
  shape.lineTo(w, -d)
  shape.lineTo(w, d)
  shape.lineTo(-w, d)
  shape.closePath()

  const points = shape.getPoints()
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0.02, p.y))
  )
  const material = new THREE.LineBasicMaterial({ color: 0xd9c07c, transparent: true, opacity: 0.6 })

  return new THREE.LineLoop(geometry, material)
}
