// =============================================================
// Markers.js
// -------------------------------------------------------------
// Os 5 reinos clicáveis do mapa. Cada um usa as mesmas peças
// simples (tower(), hut()) só que compostas de um jeito diferente
// conforme `reino.variante` (ver journeyData.js), para que cada
// castelo tenha personalidade própria sem precisar de modelos novos:
// - pequeno      -> Danki Code (castelo inicial, modesto)
// - vila         -> MS Negócios (vila/oficina, sem keep)
// - grande       -> Infinity School (castelo maior e imponente)
// - artistica    -> Dreams (vila com banners roxos/rosados)
// - tecnologica  -> CNX (torres altas e finas, topos de cristal)
//
// Acima de cada composição flutua um EMBLEMA (selo com a sigla do
// reino) — esse é o "logo interativo": flutua, brilha, gira devagar
// e é o alvo do raycaster (hover/click).
//
// EDITE AQUI:
// - as funções build*() -> proporções/composição de cada variante
// - createEmblemTexture -> visual do emblema/badge (cores, fonte)
// - journeyData.js -> nomes, siglas, variantes, posições e cores
// =============================================================

import * as THREE from 'three'
import { journeyPoints } from '../data/journeyData.js'
import { getTerrainHeight } from './Terrain.js'

const FLOAT_SPEED = 1.4
const FLOAT_AMPLITUDE = 0.24
const EMBLEM_MARGIN = 1.7

// Escala de LANDMARK: no mapa da referência os castelos são os
// protagonistas da silhueta, não miniaturas perdidas no terreno.
const CASTLE_SCALE = 2.6

// Pedra compartilhada entre castelos (só telhados/emblemas variam por reino).
const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x8d8478, roughness: 0.95, metalness: 0.05 })
const darkStoneMaterial = new THREE.MeshStandardMaterial({ color: 0x5b544a, roughness: 0.95, metalness: 0.05 })
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a30, roughness: 0.9, metalness: 0.05 })

function enableShadow(mesh) {
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

// -------------------------------------------------------------
// Peças básicas reutilizáveis
// -------------------------------------------------------------

// Janelinha acesa: o detalhe que faz o castelo parecer HABITADO.
const windowMaterial = new THREE.MeshStandardMaterial({
  color: 0xffc76a,
  emissive: 0xffb347,
  emissiveIntensity: 1.5,
  roughness: 0.4,
})

function addTowerWindows(group, radius, height) {
  const count = 1 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const window = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.14), windowMaterial)
    window.position.set(
      Math.cos(angle) * (radius + 0.012),
      height * (0.45 + Math.random() * 0.3),
      Math.sin(angle) * (radius + 0.012)
    )
    window.rotation.y = Math.PI / 2 - angle
    group.add(window)
  }
}

// Torre cilíndrica com telhado cônico.
function tower({ radius = 0.3, height = 1.3, roofHeight = 0.6, bodyMaterial = darkStoneMaterial, roofMaterial }) {
  const group = new THREE.Group()

  const body = enableShadow(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.06, height, 8), bodyMaterial))
  body.position.y = height / 2
  group.add(body)

  const roof = enableShadow(new THREE.Mesh(new THREE.ConeGeometry(radius + 0.14, roofHeight, 8), roofMaterial))
  roof.position.y = height + roofHeight / 2
  group.add(roof)

  addTowerWindows(group, radius, height)

  group.userData.topY = height + roofHeight
  return group
}

// Cabana/oficina de base quadrada com telhado piramidal.
function hut({ size = 0.9, height = 0.7, roofHeight = 0.55, bodyMaterial = woodMaterial, roofMaterial }) {
  const group = new THREE.Group()

  const body = enableShadow(new THREE.Mesh(new THREE.BoxGeometry(size, height, size), bodyMaterial))
  body.position.y = height / 2
  group.add(body)

  const roof = enableShadow(new THREE.Mesh(new THREE.ConeGeometry(size * 0.78, roofHeight, 4), roofMaterial))
  roof.rotation.y = Math.PI / 4
  roof.position.y = height + roofHeight / 2 - 0.05
  group.add(roof)

  group.userData.topY = height + roofHeight
  // Marca a cabana como candidata a chaminé fumegante (ver buildMarker).
  group.userData.isHut = true
  return group
}

// Bandeirinha decorativa (usada na variante artística).
function banner(color) {
  const group = new THREE.Group()
  const pole = enableShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 5), darkStoneMaterial))
  pole.position.y = 0.45
  group.add(pole)

  // Geometria deslocada: a borda esquerda fica presa no mastro, então a
  // oscilação em Y lê como pano tremulando ao vento (não hélice girando).
  const flagGeometry = new THREE.PlaneGeometry(0.28, 0.2)
  flagGeometry.translate(0.14, 0, 0)

  const flag = enableShadow(new THREE.Mesh(
    flagGeometry,
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, side: THREE.DoubleSide })
  ))
  flag.position.set(0.02, 0.75, 0)
  flag.userData.anim = 'flag'
  flag.userData.phase = Math.random() * Math.PI * 2
  group.add(flag)

  return group
}

// -------------------------------------------------------------
// Composições por variante — todas devolvem { group, topHeight }
// -------------------------------------------------------------

function buildPequeno(reino) {
  const group = new THREE.Group()
  const roofMaterial = new THREE.MeshStandardMaterial({ color: reino.cor, emissive: reino.cor, emissiveIntensity: 0.35, roughness: 0.5 })

  const keep = tower({ radius: 0.42, height: 1.1, roofHeight: 0.55, bodyMaterial: stoneMaterial, roofMaterial })
  group.add(keep)

  // Só 2 torrezinhas laterais — reino "inicial", modesto.
  ;[-0.85, 0.85].forEach((x) => {
    const side = tower({ radius: 0.22, height: 0.75, roofHeight: 0.4, roofMaterial })
    side.position.set(x, 0, 0.15)
    group.add(side)
  })

  group.scale.setScalar(0.85)
  return { group, topHeight: keep.userData.topY * 0.85 }
}

function buildVila(reino) {
  const group = new THREE.Group()
  const roofMaterial = new THREE.MeshStandardMaterial({ color: reino.cor, emissive: reino.cor, emissiveIntensity: 0.3, roughness: 0.6 })

  const layout = [
    { size: 0.95, height: 0.75, x: 0, z: 0 },
    { size: 0.65, height: 0.55, x: 0.95, z: 0.5 },
    { size: 0.7, height: 0.6, x: -0.9, z: -0.4 },
    { size: 0.55, height: 0.5, x: -0.2, z: 0.95 },
  ]

  let maxTop = 0
  layout.forEach((spec) => {
    const cabin = hut({ size: spec.size, height: spec.height, roofHeight: spec.height * 0.7, roofMaterial })
    cabin.position.set(spec.x, 0, spec.z)
    cabin.rotation.y = Math.random() * 0.6 - 0.3
    group.add(cabin)
    maxTop = Math.max(maxTop, cabin.userData.topY)
  })

  return { group, topHeight: maxTop }
}

function buildGrande(reino) {
  const group = new THREE.Group()
  const roofMaterial = new THREE.MeshStandardMaterial({ color: reino.cor, emissive: reino.cor, emissiveIntensity: 0.4, roughness: 0.45 })

  const keep = tower({ radius: 0.75, height: 2.3, roofHeight: 1.1, bodyMaterial: stoneMaterial, roofMaterial })
  group.add(keep)

  const cornerRadius = 1.3
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + Math.PI / 4
    const corner = tower({ radius: 0.34, height: 1.5, roofHeight: 0.65, roofMaterial })
    corner.position.set(Math.cos(angle) * cornerRadius, 0, Math.sin(angle) * cornerRadius)
    group.add(corner)
  }

  // Muralha baixa ligando as torres — reforça a leitura de "fortaleza imponente".
  const wall = enableShadow(new THREE.Mesh(new THREE.TorusGeometry(cornerRadius, 0.07, 6, 4), darkStoneMaterial))
  wall.rotation.x = Math.PI / 2
  wall.rotation.z = Math.PI / 4
  wall.position.y = 0.55
  group.add(wall)

  // Infinity School é o LANDMARK dominante do mapa — ninguém pode
  // roubar a silhueta dela (hierarquia visual da referência).
  group.scale.setScalar(1.18)
  return { group, topHeight: keep.userData.topY * 1.18 }
}

function buildArtistica(reino) {
  const group = new THREE.Group()
  const roofMaterial = new THREE.MeshStandardMaterial({ color: reino.cor, emissive: reino.cor, emissiveIntensity: 0.22, roughness: 0.6 })

  const layout = [
    { size: 0.85, height: 0.7, x: 0, z: 0 },
    { size: 0.6, height: 0.55, x: -0.85, z: 0.4 },
    { size: 0.55, height: 0.5, x: 0.75, z: -0.5 },
  ]

  let maxTop = 0
  layout.forEach((spec) => {
    const cabin = hut({ size: spec.size, height: spec.height, roofHeight: spec.height * 0.75, roofMaterial })
    cabin.position.set(spec.x, 0, spec.z)
    cabin.rotation.y = Math.random() * Math.PI * 0.5
    group.add(cabin)
    maxTop = Math.max(maxTop, cabin.userData.topY)

    const flag = banner(reino.cor)
    flag.position.set(spec.x + spec.size * 0.4, 0, spec.z + spec.size * 0.4)
    group.add(flag)
  })

  // Pequenas flores/luzes rosadas espalhadas pela vila.
  const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xff9ecb, emissive: 0xff9ecb, emissiveIntensity: 0.8 })
  for (let i = 0; i < 6; i++) {
    const petal = enableShadow(new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), petalMaterial))
    petal.position.set((Math.random() - 0.5) * 2.2, 0.08, (Math.random() - 0.5) * 2.2)
    petal.userData.anim = 'petal'
    group.add(petal)
  }

  return { group, topHeight: maxTop }
}

function buildTecnologica(reino) {
  const group = new THREE.Group()
  const crystalMaterial = new THREE.MeshStandardMaterial({
    color: reino.cor,
    emissive: reino.cor,
    emissiveIntensity: 1.1,
    roughness: 0.25,
    metalness: 0.6,
  })
  const stripMaterial = new THREE.MeshStandardMaterial({ color: reino.cor, emissive: reino.cor, emissiveIntensity: 1.6 })

  const layout = [
    { radius: 0.4, height: 2.6, x: 0, z: 0 },
    { radius: 0.26, height: 1.9, x: 0.9, z: 0.5 },
    { radius: 0.24, height: 1.7, x: -0.85, z: -0.4 },
  ]

  let maxTop = 0
  layout.forEach((spec) => {
    const body = enableShadow(new THREE.Mesh(new THREE.CylinderGeometry(spec.radius, spec.radius + 0.05, spec.height, 8), darkStoneMaterial))
    body.position.set(spec.x, spec.height / 2, spec.z)
    group.add(body)

    // Faixa de luz vertical (a "tecnologia" da torre).
    const strip = enableShadow(new THREE.Mesh(new THREE.BoxGeometry(0.04, spec.height * 0.85, 0.04), stripMaterial))
    strip.position.set(spec.x, spec.height / 2, spec.z + spec.radius + 0.02)
    group.add(strip)

    // Topo de cristal no lugar do telhado cônico tradicional.
    const crystal = enableShadow(new THREE.Mesh(new THREE.OctahedronGeometry(spec.radius + 0.18, 0), crystalMaterial))
    crystal.position.set(spec.x, spec.height + spec.radius + 0.1, spec.z)
    crystal.userData.anim = 'crystal'
    crystal.userData.baseY = crystal.position.y
    crystal.userData.phase = Math.random() * Math.PI * 2
    group.add(crystal)

    maxTop = Math.max(maxTop, spec.height + (spec.radius + 0.18) * 2)
  })

  // CNX é "o castelo atual", não o maior: torres esguias mas contidas,
  // para não competir com a Infinity School na silhueta geral.
  group.scale.setScalar(0.72)
  return { group, topHeight: maxTop * 0.72 }
}

const VARIANT_BUILDERS = {
  pequeno: buildPequeno,
  vila: buildVila,
  grande: buildGrande,
  artistica: buildArtistica,
  tecnologica: buildTecnologica,
}

function buildCastle(reino) {
  const builder = VARIANT_BUILDERS[reino.variante] ?? buildPequeno
  return builder(reino)
}

// Plataforma de pedra sob o castelo: ancora o landmark no chão e
// cria o "palco" da clareira dourada pintada no terreno.
function buildPlaza() {
  const group = new THREE.Group()

  const slab = enableShadow(new THREE.Mesh(
    new THREE.CylinderGeometry(3.9, 4.35, 0.5, 24),
    new THREE.MeshStandardMaterial({ color: 0x9a8f7d, roughness: 0.95, metalness: 0.02 })
  ))
  slab.position.y = -0.08
  group.add(slab)

  const trim = new THREE.Mesh(
    new THREE.TorusGeometry(3.88, 0.07, 6, 32),
    new THREE.MeshStandardMaterial({ color: 0xd9c07c, roughness: 0.5, metalness: 0.45, emissive: 0x51400f, emissiveIntensity: 0.35 })
  )
  trim.rotation.x = Math.PI / 2
  trim.position.y = 0.18
  group.add(trim)

  return group
}

// -------------------------------------------------------------
// Emblema flutuante (o "logo interativo" de cada reino)
// -------------------------------------------------------------

// Cada selo carrega a IDENTIDADE REAL da marca (logo aproximada em
// canvas), mantendo a moldura dourada comum — mesma linguagem de
// "selo de reino", personalidades diferentes dentro.
const EMBLEM_PAINTERS = {
  // <danki.code> — monospace branco com brackets e ponto roxos.
  'danki-code'(ctx, size) {
    const c = size / 2
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#9b5de5'
    ctx.font = `bold ${size * 0.24}px Consolas, 'Courier New', monospace`
    ctx.fillText('<', c - size * 0.24, c + size * 0.005)
    ctx.fillText('>', c + size * 0.24, c + size * 0.005)

    ctx.font = `bold ${size * 0.22}px Consolas, 'Courier New', monospace`
    ctx.fillStyle = '#f5f2ff'
    ctx.fillText('d', c - size * 0.1, c)
    ctx.fillText('c', c + size * 0.105, c)
    ctx.fillStyle = '#9b5de5'
    ctx.fillText('.', c + size * 0.002, c - size * 0.01)
  },

  // MS — monograma em traço fino azul dentro de um círculo delicado.
  'ms-negocios'(ctx, size) {
    const c = size / 2

    ctx.beginPath()
    ctx.arc(c, c, size * 0.295, 0, Math.PI * 2)
    ctx.lineWidth = size * 0.014
    ctx.strokeStyle = '#5d86f2'
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `italic ${size * 0.3}px Georgia, serif`
    ctx.lineWidth = size * 0.012
    ctx.strokeStyle = '#7ba0ff'
    ctx.strokeText('MS', c, c + size * 0.015)
    ctx.fillStyle = 'rgba(123, 160, 255, 0.22)'
    ctx.fillText('MS', c, c + size * 0.015)
  },

  // Infinity School — brasão quadrado vermelho com "IN" serifado branco.
  'infinity-school'(ctx, size) {
    const c = size / 2
    const half = size * 0.21

    const gradient = ctx.createLinearGradient(c, c - half, c, c + half)
    gradient.addColorStop(0, '#c73a2e')
    gradient.addColorStop(1, '#8f241c')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(c - half, c - half, half * 2, half * 2, size * 0.02)
    ctx.fill()
    ctx.lineWidth = size * 0.008
    ctx.strokeStyle = 'rgba(255, 235, 225, 0.55)'
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fdf6ee'
    ctx.font = `${size * 0.24}px Georgia, 'Times New Roman', serif`
    ctx.fillText('IN', c, c + size * 0.015)
  },

  // CNX Connect — círculos entrelaçados e texto em gradiente laranja->roxo.
  cnx(ctx, size) {
    const c = size / 2
    const r = size * 0.155

    ctx.lineWidth = size * 0.014
    ctx.strokeStyle = '#ff6b3d'
    ctx.beginPath()
    ctx.arc(c - size * 0.075, c - size * 0.02, r, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = '#b14fd0'
    ctx.beginPath()
    ctx.arc(c + size * 0.075, c - size * 0.02, r, 0, Math.PI * 2)
    ctx.stroke()

    // Nós do circuito nas intersecções.
    ctx.fillStyle = '#ff6b3d'
    ctx.beginPath()
    ctx.arc(c, c - size * 0.155, size * 0.022, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#c44fd0'
    ctx.beginPath()
    ctx.arc(c, c + size * 0.115, size * 0.022, 0, Math.PI * 2)
    ctx.fill()

    const gradient = ctx.createLinearGradient(c - size * 0.18, 0, c + size * 0.18, 0)
    gradient.addColorStop(0, '#ff6b3d')
    gradient.addColorStop(0.55, '#e0529a')
    gradient.addColorStop(1, '#9b5de5')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = gradient
    ctx.font = `bold ${size * 0.155}px Verdana, 'Segoe UI', sans-serif`
    ctx.fillText('CNX', c, c + size * 0.005)
  },
}

function paintDefaultEmblem(ctx, size, reino) {
  ctx.fillStyle = '#f0d999'
  ctx.font = `bold ${size * 0.34}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(reino.sigla ?? reino.nome.slice(0, 2).toUpperCase(), size / 2, size / 2 + size * 0.02)
}

function createEmblemTexture(reino) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const center = size / 2
  const color = new THREE.Color(reino.cor)
  const colorCss = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`

  ctx.beginPath()
  ctx.arc(center, center, size * 0.46, 0, Math.PI * 2)
  ctx.fillStyle = '#12101d'
  ctx.fill()

  ctx.lineWidth = size * 0.045
  ctx.strokeStyle = '#d9c07c'
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(center, center, size * 0.37, 0, Math.PI * 2)
  ctx.lineWidth = size * 0.02
  ctx.strokeStyle = colorCss
  ctx.stroke()

  const painter = EMBLEM_PAINTERS[reino.id]
  if (painter) painter(ctx, size, reino)
  else paintDefaultEmblem(ctx, size, reino)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createGlowTexture(hexColor) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const color = new THREE.Color(hexColor)
  const [r, g, b] = [color.r * 255, color.g * 255, color.b * 255]

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`)
  gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.3)`)
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Fumaça de chaminé: sprites cinza reciclados num loop sobe-e-esvai.
function createSmokeTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(226, 220, 208, 0.85)')
  gradient.addColorStop(0.55, 'rgba(226, 220, 208, 0.3)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const smokeTexture = createSmokeTexture()

function createSmokeEmitter() {
  const group = new THREE.Group()
  const puffs = []

  for (let i = 0; i < 3; i++) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: smokeTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }))
    group.add(sprite)
    puffs.push({
      sprite,
      offset: i / 3,
      speed: 0.14 + Math.random() * 0.05,
      drift: Math.random() * Math.PI * 2,
    })
  }

  return { group, puffs }
}

export class MarkersController {
  constructor() {
    this.group = new THREE.Group()
    this.markers = []

    // Registro central de "vida" do mapa: tudo que balança, gira,
    // pulsa ou fumega é coletado aqui e animado num único update().
    this.flags = []
    this.crystals = []
    this.petalMaterials = new Set()
    this.smokePuffs = []

    journeyPoints.forEach((reino) => this.buildMarker(reino))
  }

  buildMarker(reino) {
    const [x, z] = reino.posicao

    const wrapper = new THREE.Group()
    // Cada reino "senta" na altura real do terreno (a planície é
    // aplainada ao redor, mas nunca assumimos y=0).
    wrapper.position.set(x, getTerrainHeight(x, z) + 0.08, z)
    this.group.add(wrapper)

    wrapper.add(buildPlaza())

    const { group: castle, topHeight } = buildCastle(reino)
    castle.scale.multiplyScalar(CASTLE_SCALE)
    castle.position.y = 0.17
    wrapper.add(castle)

    // Coleta as partes vivas deste reino (bandeiras, cristais, pétalas)
    // e acende chaminés em metade das cabanas.
    let hutIndex = 0
    castle.traverse((object) => {
      if (object.userData.anim === 'flag') this.flags.push(object)
      if (object.userData.anim === 'crystal') this.crystals.push(object)
      if (object.userData.anim === 'petal') this.petalMaterials.add(object.material)

      if (object.userData.isHut && hutIndex++ % 2 === 0) {
        const emitter = createSmokeEmitter()
        emitter.group.position.y = object.userData.topY - 0.04
        object.add(emitter.group)
        this.smokePuffs.push(...emitter.puffs)
      }
    })

    const emblemHeight = topHeight * CASTLE_SCALE + EMBLEM_MARGIN

    const emblemAnchor = new THREE.Group()
    emblemAnchor.position.set(0, emblemHeight, 0)
    wrapper.add(emblemAnchor)

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createGlowTexture(reino.cor), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    )
    glow.scale.setScalar(3.1)
    emblemAnchor.add(glow)

    const emblem = new THREE.Sprite(new THREE.SpriteMaterial({ map: createEmblemTexture(reino), transparent: true }))
    emblem.scale.setScalar(1.9)
    emblem.name = reino.id
    emblem.userData.reino = reino
    emblemAnchor.add(emblem)

    const light = new THREE.PointLight(reino.cor, 1.4, 10, 2)
    emblemAnchor.add(light)

    this.markers.push({
      reino,
      mesh: emblem,
      wrapper: emblemAnchor,
      glow,
      light,
      baseY: emblemHeight,
      phase: Math.random() * Math.PI * 2,
    })
  }

  // Chamado a cada frame — emblemas flutuam/pulsam e os reinos "vivem":
  // bandeiras ao vento, cristais girando, pétalas pulsando, janelas
  // tremeluzindo como luz de lareira e fumaça subindo das chaminés.
  update(elapsed) {
    for (const marker of this.markers) {
      const offset = Math.sin(elapsed * FLOAT_SPEED + marker.phase) * FLOAT_AMPLITUDE
      marker.wrapper.position.y = marker.baseY + offset

      const pulse = 0.85 + Math.sin(elapsed * 2 + marker.phase) * 0.15
      marker.light.intensity = 1.4 * pulse
      marker.glow.material.opacity = 0.42 * pulse
    }

    // Duas senoides dessincronizadas = tremulação orgânica de fogo.
    windowMaterial.emissiveIntensity = 1.35 + Math.sin(elapsed * 7.3) * 0.09 + Math.sin(elapsed * 13.7) * 0.07

    for (const flag of this.flags) {
      flag.rotation.y = Math.sin(elapsed * 2.1 + flag.userData.phase) * 0.38
    }

    for (const crystal of this.crystals) {
      crystal.rotation.y = elapsed * 0.6 + crystal.userData.phase
      crystal.position.y = crystal.userData.baseY + Math.sin(elapsed * 1.2 + crystal.userData.phase) * 0.09
    }

    for (const material of this.petalMaterials) {
      material.emissiveIntensity = 0.65 + Math.sin(elapsed * 1.8) * 0.3
    }

    for (const puff of this.smokePuffs) {
      const t = (elapsed * puff.speed + puff.offset) % 1
      puff.sprite.position.set(
        Math.sin(t * 5 + puff.drift) * 0.05,
        t * 0.6,
        Math.cos(t * 4.2 + puff.drift) * 0.05
      )
      const grow = 0.12 + t * 0.24
      puff.sprite.scale.setScalar(grow)
      puff.sprite.material.opacity = Math.sin(Math.PI * t) * 0.34
    }
  }

  // Objetos que devem ser testados pelo raycaster (hover/click) — os emblemas.
  getRaycastTargets() {
    return this.markers.map((marker) => marker.mesh)
  }

  // Recupera os dados/objetos do marcador a partir do objeto atingido pelo raio.
  findByMesh(mesh) {
    return this.markers.find((marker) => marker.mesh === mesh)
  }
}
