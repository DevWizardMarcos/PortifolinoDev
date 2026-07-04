// =============================================================
// SceneManager.js
// -------------------------------------------------------------
// Cria a THREE.Scene, define o "clima" de fundo (cor + neblina) e
// um céu estrelado distante e estático (barato: um único Points).
// EDITE AQUI a cor de fundo, a neblina e a quantidade de estrelas.
// =============================================================

import * as THREE from 'three'

const STAR_COUNT = 600
const STAR_RADIUS = 90

function createStarfield() {
  const positions = new Float32Array(STAR_COUNT * 3)

  for (let i = 0; i < STAR_COUNT; i++) {
    // Distribui as estrelas numa semiesfera acima do horizonte, a uma
    // distância fixa — só para dar profundidade ao fundo escuro.
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.42
    const radius = STAR_RADIUS * (0.85 + Math.random() * 0.15)

    positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius
    positions[i * 3 + 1] = Math.cos(phi) * radius
    positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xf2e9ff,
    size: 0.6,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.7,
  })

  return new THREE.Points(geometry, material)
}

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene()

    // Fundo escuro elegante, com leve tom arroxeado.
    this.scene.background = new THREE.Color(0x0a0710)

    // Neblina mais sutil que antes — o mapa fica mais iluminado/legível,
    // mas ainda com profundidade e clima misterioso nas bordas.
    this.scene.fog = new THREE.FogExp2(0x140b1c, 0.013)

    this.scene.add(createStarfield())
  }

  add(object) {
    this.scene.add(object)
  }
}
