// =============================================================
// Terrain.js
// -------------------------------------------------------------
// O "tabuleiro" do mundo em miniatura.
//
// Direção de arte (referência: mapa ilustrado estilo RPG):
// - o chão é um PERGAMINHO PINTADO (canvas procedural): base quente,
//   manchas de bosque ao redor de cada reino, dois rios sinuosos,
//   clareiras douradas sob os landmarks e vinheta de mapa antigo;
// - o relevo é esculpido de verdade: colinas suaves, planícies
//   aplainadas onde ficam os reinos e CANAIS CAVADOS onde passam
//   os rios (a pintura azul corre dentro da calha);
// - as bordas dobram para baixo até a base do diorama, como um
//   mapa de mesa — o mundo termina, não "desbota".
//
// EDITE AQUI:
// - MAP_WIDTH / MAP_DEPTH -> tamanho do tabuleiro
// - RIVERS -> traçado dos rios (pontos de controle em coords do mundo)
// - TERRAIN_HEIGHT / RIVER_DEPTH -> dramaticidade do relevo
// - paintGroundCanvas() -> toda a pintura do pergaminho
//
// Exporta getTerrainHeight(x, z) e distanceToRiver(x, z): TODO objeto
// plantado no mapa (estradas, vegetação, montanhas, castelos) usa
// essas funções para "sentar" no chão em vez de flutuar.
// =============================================================

import * as THREE from 'three'
import { journeyPoints, hubPosition } from '../data/journeyData.js'

export const MAP_WIDTH = 64
export const MAP_DEPTH = 44

const TERRAIN_SEGMENTS_X = 240
const TERRAIN_SEGMENTS_Z = 170
const TERRAIN_HEIGHT = 1.35
const TERRAIN_NOISE_SCALE = 0.055
const FLATTEN_INNER_RADIUS = 4.6
const FLATTEN_OUTER_RADIUS = 9

const EDGE_FALLOFF_RANGE = 7
const EDGE_DROP = 0.6 // as bordas descem até o topo da base do diorama

const RIVER_DEPTH = 0.55
const RIVER_HALF_WIDTH = 1.15

// Traçado dos rios (x, z em coordenadas do mundo). Nascem no norte
// (montanhas) e correm até a borda sul — sem atravessar nenhum reino.
const RIVERS = [
  // Rio do Poente — margeia Danki Code e Dreams pelo oeste.
  [
    [-7, -24], [-11, -16], [-18, -12], [-22, -4], [-19, 6], [-23, 14], [-20, 24],
  ],
  // Rio do Nascente — desce entre a Árvore e os reinos do leste.
  [
    [12, -24], [10, -15], [7, -6], [6, 2], [4, 10], [2, 17], [3, 24],
  ],
]

// -------------------------------------------------------------
// Ruído Perlin (base do relevo)
// -------------------------------------------------------------

const PERMUTATION = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
  140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
  247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
  57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
  74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
  60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
  65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
  200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
  3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255,
  82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223,
  183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155,
  167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210,
  144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49,
  192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45,
  127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
  141, 128, 195, 78, 66, 215, 61, 156, 180,
]

const PERM = [...PERMUTATION, ...PERMUTATION]

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function grad(hash, x, y) {
  const h = hash & 7
  const u = h < 4 ? x : y
  const v = h < 4 ? y : x
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

function perlin2D(x, y) {
  const xi = Math.floor(x) & 255
  const yi = Math.floor(y) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const u = fade(xf)
  const v = fade(yf)

  const aa = PERM[PERM[xi] + yi]
  const ab = PERM[PERM[xi] + yi + 1]
  const ba = PERM[PERM[xi + 1] + yi]
  const bb = PERM[PERM[xi + 1] + yi + 1]

  const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u)
  const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u)
  return lerp(x1, x2, v)
}

function fractalTerrainNoise(x, z) {
  const largeForms = perlin2D(x * TERRAIN_NOISE_SCALE, z * TERRAIN_NOISE_SCALE)
  const softDetail = perlin2D(x * TERRAIN_NOISE_SCALE * 2.4 + 18.5, z * TERRAIN_NOISE_SCALE * 2.4 - 7.2)
  return largeForms * 0.78 + softDetail * 0.22
}

function smoothstep(edge0, edge1, value) {
  const t = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

// -------------------------------------------------------------
// Rios: amostragem densa para consultas de distância e pintura
// -------------------------------------------------------------

function sampleRiverPoints() {
  const sampled = []
  for (const river of RIVERS) {
    const curve = new THREE.CatmullRomCurve3(
      river.map(([x, z]) => new THREE.Vector3(x, 0, z)),
      false,
      'catmullrom',
      0.5
    )
    sampled.push(curve.getSpacedPoints(170))
  }
  return sampled
}

const riverPolylines = sampleRiverPoints()
const allRiverPoints = riverPolylines.flat()

export function distanceToRiver(x, z) {
  let min = Infinity
  for (const point of allRiverPoints) {
    const distance = Math.hypot(x - point.x, z - point.z)
    if (distance < min) min = distance
  }
  return min
}

// -------------------------------------------------------------
// Altura do terreno — usada por TODO o mundo (estradas, vegetação,
// montanhas, castelos) para nada ficar flutuando.
// -------------------------------------------------------------

const flattenCenters = [
  { x: hubPosition[0], z: hubPosition[1] },
  ...journeyPoints.map((reino) => ({ x: reino.posicao[0], z: reino.posicao[1] })),
]

function getEdgeFalloff(x, z) {
  const xDistanceToEdge = MAP_WIDTH / 2 - Math.abs(x)
  const zDistanceToEdge = MAP_DEPTH / 2 - Math.abs(z)
  return smoothstep(0, EDGE_FALLOFF_RANGE, Math.min(xDistanceToEdge, zDistanceToEdge))
}

export function getTerrainHeight(x, z) {
  let nearestCenterDistance = Infinity
  for (const center of flattenCenters) {
    const distance = Math.hypot(x - center.x, z - center.z)
    if (distance < nearestCenterDistance) nearestCenterDistance = distance
  }

  const flatten = smoothstep(FLATTEN_INNER_RADIUS, FLATTEN_OUTER_RADIUS, nearestCenterDistance)
  const edge = getEdgeFalloff(x, z)

  // Colinas sempre >= 0 (o "miolo" do diorama nunca fura a base).
  const hills = (fractalTerrainNoise(x, z) * 0.5 + 0.5) * TERRAIN_HEIGHT * flatten

  // Calha do rio: afunda o leito de forma suave.
  const riverDistance = distanceToRiver(x, z)
  const carve = RIVER_DEPTH * (1 - smoothstep(RIVER_HALF_WIDTH * 0.35, RIVER_HALF_WIDTH * 1.7, riverDistance))

  return (hills - carve) * edge - (1 - edge) * EDGE_DROP
}

// -------------------------------------------------------------
// Pintura do pergaminho (textura do chão)
// -------------------------------------------------------------

const CANVAS_WIDTH = 2048
const CANVAS_HEIGHT = Math.round((CANVAS_WIDTH * MAP_DEPTH) / MAP_WIDTH)
const PX_PER_UNIT = CANVAS_WIDTH / MAP_WIDTH

function worldToCanvas(x, z) {
  return {
    x: ((x + MAP_WIDTH / 2) / MAP_WIDTH) * CANVAS_WIDTH,
    y: ((z + MAP_DEPTH / 2) / MAP_DEPTH) * CANVAS_HEIGHT,
  }
}

function paintParchmentBase(ctx) {
  const base = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  base.addColorStop(0, '#cdb287')
  base.addColorStop(0.4, '#c2a97c')
  base.addColorStop(0.75, '#b89e72')
  base.addColorStop(1, '#a98f66')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Mosqueado de aquarela: manchas quentes e frias bem suaves.
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * CANVAS_WIDTH
    const y = Math.random() * CANVAS_HEIGHT
    const r = 30 + Math.random() * 110
    const warm = Math.random() > 0.5
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, warm ? 'rgba(160, 128, 82, 0.13)' : 'rgba(120, 128, 84, 0.12)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.7, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Bosques pintados: coroas de verde ao redor de cada reino (deixando
// livre o "corredor" que aponta para a Árvore central) + o grande
// bosque do Núcleo. É o que dá a leitura de "cada reino vive numa
// clareira própria", como na arte de referência.
function paintForests(ctx) {
  const hub = { x: hubPosition[0], z: hubPosition[1] }

  const paintBlob = (worldX, worldZ, worldRadius, alpha) => {
    const { x, y } = worldToCanvas(worldX, worldZ)
    const r = worldRadius * PX_PER_UNIT
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    const green = Math.random() > 0.5 ? '62, 82, 48' : '74, 95, 51'
    gradient.addColorStop(0, `rgba(${green}, ${alpha})`)
    gradient.addColorStop(0.7, `rgba(${green}, ${alpha * 0.55})`)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.78, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  journeyPoints.forEach((reino) => {
    const [cx, cz] = reino.posicao
    const towardHub = Math.atan2(hub.z - cz, hub.x - cx)

    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2
      // Não pinta bosque no corredor de entrada (direção da Árvore).
      let delta = Math.abs(angle - towardHub) % (Math.PI * 2)
      if (delta > Math.PI) delta = Math.PI * 2 - delta
      if (delta < 0.65) continue

      const radius = 4.6 + Math.random() * 3.6
      paintBlob(cx + Math.cos(angle) * radius, cz + Math.sin(angle) * radius, 1.4 + Math.random() * 1.5, 0.52)
    }
  })

  // Bosque sagrado ao redor da Árvore central.
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.35
    const radius = 5.4 + Math.random() * 2.6
    paintBlob(hub.x + Math.cos(angle) * radius, hub.z + Math.sin(angle) * radius, 1.5 + Math.random() * 1.3, 0.38)
  }

  // Vegetação ripária: mato mais verde acompanhando os rios.
  for (const polyline of riverPolylines) {
    for (let i = 4; i < polyline.length - 4; i += 7) {
      const point = polyline[i]
      const side = Math.random() > 0.5 ? 1 : -1
      paintBlob(point.x + side * (1.9 + Math.random()), point.z + (Math.random() - 0.5) * 1.6, 0.9 + Math.random() * 0.9, 0.3)
    }
  }
}

// Clareira dourada sob cada landmark: um "spot de palco" sutil que
// guia o olho para os pontos interativos (truque clássico de level
// design para hierarquia visual).
function paintLandmarkClearings(ctx) {
  const spots = [
    { x: hubPosition[0], z: hubPosition[1], r: 5.2 },
    ...journeyPoints.map((reino) => ({ x: reino.posicao[0], z: reino.posicao[1], r: 4.6 })),
  ]

  spots.forEach((spot) => {
    const { x, y } = worldToCanvas(spot.x, spot.z)
    const r = spot.r * PX_PER_UNIT
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, 'rgba(232, 205, 140, 0.4)')
    gradient.addColorStop(0.55, 'rgba(226, 196, 130, 0.18)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  })
}

function strokeRiver(ctx, polyline, width, style) {
  ctx.strokeStyle = style
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  polyline.forEach((point, index) => {
    const { x, y } = worldToCanvas(point.x, point.z)
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
}

function paintRivers(ctx) {
  for (const polyline of riverPolylines) {
    // Margem úmida -> água profunda -> água clara -> brilho central.
    strokeRiver(ctx, polyline, RIVER_HALF_WIDTH * 2.9 * PX_PER_UNIT, 'rgba(74, 62, 40, 0.55)')
    strokeRiver(ctx, polyline, RIVER_HALF_WIDTH * 2.1 * PX_PER_UNIT, '#2c4f55')
    strokeRiver(ctx, polyline, RIVER_HALF_WIDTH * 1.25 * PX_PER_UNIT, '#3c7276')
    strokeRiver(ctx, polyline, RIVER_HALF_WIDTH * 0.4 * PX_PER_UNIT, 'rgba(158, 214, 202, 0.6)')
  }
}

function paintVignette(ctx) {
  // Vinheta radial (mapa antigo) + queimado das bordas.
  const centerX = CANVAS_WIDTH / 2
  const centerY = CANVAS_HEIGHT / 2
  const vignette = ctx.createRadialGradient(
    centerX, centerY, CANVAS_HEIGHT * 0.42,
    centerX, centerY, CANVAS_WIDTH * 0.62
  )
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(0.72, 'rgba(92, 71, 44, 0.18)')
  vignette.addColorStop(1, 'rgba(58, 42, 24, 0.5)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  const edge = 54
  const burn = 'rgba(48, 34, 18, 0.42)'
  const gradients = [
    ctx.createLinearGradient(0, 0, 0, edge),
    ctx.createLinearGradient(0, CANVAS_HEIGHT, 0, CANVAS_HEIGHT - edge),
    ctx.createLinearGradient(0, 0, edge, 0),
    ctx.createLinearGradient(CANVAS_WIDTH, 0, CANVAS_WIDTH - edge, 0),
  ]
  gradients.forEach((gradient, index) => {
    gradient.addColorStop(0, burn)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    if (index === 0) ctx.fillRect(0, 0, CANVAS_WIDTH, edge)
    if (index === 1) ctx.fillRect(0, CANVAS_HEIGHT - edge, CANVAS_WIDTH, edge)
    if (index === 2) ctx.fillRect(0, 0, edge, CANVAS_HEIGHT)
    if (index === 3) ctx.fillRect(CANVAS_WIDTH - edge, 0, edge, CANVAS_HEIGHT)
  })
}

function paintGrain(ctx) {
  const grain = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  const data = grain.data
  for (let i = 0; i < data.length; i += 4) {
    const jitter = (Math.random() - 0.5) * 11
    data[i] = THREE.MathUtils.clamp(data[i] + jitter, 0, 255)
    data[i + 1] = THREE.MathUtils.clamp(data[i + 1] + jitter, 0, 255)
    data[i + 2] = THREE.MathUtils.clamp(data[i + 2] + jitter - 2, 0, 255)
  }
  ctx.putImageData(grain, 0, 0)
}

function createGroundTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')

  paintParchmentBase(ctx)
  paintForests(ctx)
  paintLandmarkClearings(ctx)
  paintRivers(ctx)
  paintVignette(ctx)
  paintGrain(ctx)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

// -------------------------------------------------------------
// Malha do terreno
// -------------------------------------------------------------

export class Terrain {
  constructor() {
    this.geometry = this.createGeometry()
    this.material = new THREE.MeshStandardMaterial({
      map: createGroundTexture(),
      roughness: 1,
      metalness: 0,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI / 2
    this.mesh.receiveShadow = true
    this.mesh.name = 'terrain'
  }

  createGeometry() {
    const geometry = new THREE.PlaneGeometry(MAP_WIDTH, MAP_DEPTH, TERRAIN_SEGMENTS_X, TERRAIN_SEGMENTS_Z)
    const position = geometry.attributes.position

    for (let i = 0; i < position.count; i++) {
      const worldX = position.getX(i)
      // O plano gira -90° em X: o eixo Y local vira -Z no mundo.
      const worldZ = -position.getY(i)
      position.setZ(i, getTerrainHeight(worldX, worldZ))
    }

    geometry.computeVertexNormals()
    return geometry
  }
}

export function createTerrain() {
  return new Terrain().mesh
}

// Base do diorama: o bloco de "mesa" sob o mapa + friso dourado.
// É o que vende a ideia de mundo em miniatura sobre o vazio.
export function createTableBase() {
  const group = new THREE.Group()
  group.name = 'table-base'

  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(MAP_WIDTH + 0.4, 2.3, MAP_DEPTH + 0.4),
    new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.92, metalness: 0.04 })
  )
  slab.position.y = -EDGE_DROP - 1.15 + 0.02
  slab.receiveShadow = true
  group.add(slab)

  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(MAP_WIDTH + 0.9, 0.09, MAP_DEPTH + 0.9),
    new THREE.MeshStandardMaterial({ color: 0xd9c07c, roughness: 0.45, metalness: 0.55, emissive: 0x3a2f14, emissiveIntensity: 0.4 })
  )
  trim.position.y = -EDGE_DROP + 0.02
  group.add(trim)

  return group
}
