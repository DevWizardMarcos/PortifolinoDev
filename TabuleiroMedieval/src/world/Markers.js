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

const FLOAT_SPEED = 1.4
const FLOAT_AMPLITUDE = 0.15
const EMBLEM_MARGIN = 1.1

// Pedra compartilhada entre castelos (só telhados/emblemas variam por reino).
const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x8d8478, roughness: 0.95, metalness: 0.05 })
const darkStoneMaterial = new THREE.MeshStandardMaterial({ color: 0x5b544a, roughness: 0.95, metalness: 0.05 })
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a30, roughness: 0.9, metalness: 0.05 })

// -------------------------------------------------------------
// Peças básicas reutilizáveis
// -------------------------------------------------------------

// Torre cilíndrica com telhado cônico.
function tower({ radius = 0.3, height = 1.3, roofHeight = 0.6, bodyMaterial = darkStoneMaterial, roofMaterial }) {
  const group = new THREE.Group()

  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.06, height, 8), bodyMaterial)
  body.position.y = height / 2
  group.add(body)

  const roof = new THREE.Mesh(new THREE.ConeGeometry(radius + 0.14, roofHeight, 8), roofMaterial)
  roof.position.y = height + roofHeight / 2
  group.add(roof)

  group.userData.topY = height + roofHeight
  return group
}

// Cabana/oficina de base quadrada com telhado piramidal.
function hut({ size = 0.9, height = 0.7, roofHeight = 0.55, bodyMaterial = woodMaterial, roofMaterial }) {
  const group = new THREE.Group()

  const body = new THREE.Mesh(new THREE.BoxGeometry(size, height, size), bodyMaterial)
  body.position.y = height / 2
  group.add(body)

  const roof = new THREE.Mesh(new THREE.ConeGeometry(size * 0.78, roofHeight, 4), roofMaterial)
  roof.rotation.y = Math.PI / 4
  roof.position.y = height + roofHeight / 2 - 0.05
  group.add(roof)

  group.userData.topY = height + roofHeight
  return group
}

// Bandeirinha decorativa (usada na variante artística).
function banner(color) {
  const group = new THREE.Group()
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 5), darkStoneMaterial)
  pole.position.y = 0.45
  group.add(pole)

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(0.28, 0.2),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, side: THREE.DoubleSide })
  )
  flag.position.set(0.15, 0.75, 0)
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
  const wall = new THREE.Mesh(new THREE.TorusGeometry(cornerRadius, 0.07, 6, 4), darkStoneMaterial)
  wall.rotation.x = Math.PI / 2
  wall.rotation.z = Math.PI / 4
  wall.position.y = 0.55
  group.add(wall)

  return { group, topHeight: keep.userData.topY }
}

function buildArtistica(reino) {
  const group = new THREE.Group()
  const roofMaterial = new THREE.MeshStandardMaterial({ color: reino.cor, emissive: reino.cor, emissiveIntensity: 0.5, roughness: 0.6 })

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
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), petalMaterial)
    petal.position.set((Math.random() - 0.5) * 2.2, 0.08, (Math.random() - 0.5) * 2.2)
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
    const body = new THREE.Mesh(new THREE.CylinderGeometry(spec.radius, spec.radius + 0.05, spec.height, 8), darkStoneMaterial)
    body.position.set(spec.x, spec.height / 2, spec.z)
    group.add(body)

    // Faixa de luz vertical (a "tecnologia" da torre).
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.04, spec.height * 0.85, 0.04), stripMaterial)
    strip.position.set(spec.x, spec.height / 2, spec.z + spec.radius + 0.02)
    group.add(strip)

    // Topo de cristal no lugar do telhado cônico tradicional.
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(spec.radius + 0.18, 0), crystalMaterial)
    crystal.position.set(spec.x, spec.height + spec.radius + 0.1, spec.z)
    group.add(crystal)

    maxTop = Math.max(maxTop, spec.height + (spec.radius + 0.18) * 2)
  })

  return { group, topHeight: maxTop }
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

// -------------------------------------------------------------
// Emblema flutuante (o "logo interativo" de cada reino)
// -------------------------------------------------------------

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
  ctx.fillStyle = '#160f22'
  ctx.fill()

  ctx.lineWidth = size * 0.045
  ctx.strokeStyle = '#d9c07c'
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(center, center, size * 0.37, 0, Math.PI * 2)
  ctx.lineWidth = size * 0.02
  ctx.strokeStyle = colorCss
  ctx.stroke()

  ctx.fillStyle = '#f0d999'
  ctx.font = `bold ${size * 0.34}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(reino.sigla ?? reino.nome.slice(0, 2).toUpperCase(), center, center + size * 0.02)

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

export class MarkersController {
  constructor() {
    this.group = new THREE.Group()
    this.markers = []

    journeyPoints.forEach((reino) => this.buildMarker(reino))
  }

  buildMarker(reino) {
    const [x, z] = reino.posicao

    const wrapper = new THREE.Group()
    wrapper.position.set(x, 0, z)
    this.group.add(wrapper)

    const { group: castle, topHeight } = buildCastle(reino)
    wrapper.add(castle)

    const emblemHeight = topHeight + EMBLEM_MARGIN

    const emblemAnchor = new THREE.Group()
    emblemAnchor.position.set(0, emblemHeight, 0)
    wrapper.add(emblemAnchor)

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createGlowTexture(reino.cor), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    )
    glow.scale.setScalar(2.4)
    emblemAnchor.add(glow)

    const emblem = new THREE.Sprite(new THREE.SpriteMaterial({ map: createEmblemTexture(reino), transparent: true }))
    emblem.scale.setScalar(1.1)
    emblem.name = reino.id
    emblem.userData.reino = reino
    emblemAnchor.add(emblem)

    const light = new THREE.PointLight(reino.cor, 1.4, 7, 2)
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

  // Chamado a cada frame — o emblema flutua, gira devagar e pulsa.
  update(elapsed) {
    for (const marker of this.markers) {
      const offset = Math.sin(elapsed * FLOAT_SPEED + marker.phase) * FLOAT_AMPLITUDE
      marker.wrapper.position.y = marker.baseY + offset
      marker.mesh.material.rotation = elapsed * 0.3 + marker.phase

      const pulse = 0.85 + Math.sin(elapsed * 2 + marker.phase) * 0.15
      marker.light.intensity = 1.4 * pulse
      marker.glow.material.opacity = 0.8 * pulse
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
