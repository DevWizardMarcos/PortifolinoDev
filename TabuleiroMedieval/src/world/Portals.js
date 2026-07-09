// =============================================================
// Portals.js
// -------------------------------------------------------------
// Elemento central do mapa: arvore GLB no centro exato com
// leitura mais natural e uma pequena colina.
// =============================================================

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fantasyTreeModelUrl from '../models/a_fantasy_tree.glb?url'
import { magicGlowColor } from '../data/journeyData.js'

const CENTER_X = 0
const CENTER_Z = 0
// A Árvore é o eixo vertical do mapa: mais alta que qualquer castelo
// (castelos ~6-8u), para a silhueta do mundo ter um clímax central.
const TREE_TARGET_HEIGHT = 11

const hillMaterial = new THREE.MeshStandardMaterial({ color: 0x5f4a2b, roughness: 1, metalness: 0 })
const rootMaterial = new THREE.MeshStandardMaterial({
  color: 0x2f222f,
  emissive: magicGlowColor,
  emissiveIntensity: 0.18,
  roughness: 0.92,
  metalness: 0.03,
})

function createAuraTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const color = new THREE.Color(magicGlowColor)
  const [r, g, b] = [color.r * 255, color.g * 255, color.b * 255]

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.55)`)
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.18)`)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function fitModelToCenter(model, targetHeight) {
  model.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const scale = targetHeight / Math.max(size.y, 0.001)
  model.scale.setScalar(scale)
  model.updateMatrixWorld(true)

  const scaledBox = new THREE.Box3().setFromObject(model)
  const center = scaledBox.getCenter(new THREE.Vector3())
  model.position.x -= center.x
  model.position.z -= center.z
  model.position.y -= scaledBox.min.y
}

function createFallbackTree() {
  const group = new THREE.Group()

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.5, 2.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x241a2e, roughness: 0.9, metalness: 0.1 })
  )
  trunk.position.y = 1.2
  group.add(trunk)

  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: 0x35522f,
    roughness: 0.9,
    metalness: 0.05,
  })

  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5
    const radius = i === 0 ? 0 : 0.55
    const cluster = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 0), foliageMaterial)
    cluster.position.set(Math.cos(angle) * radius, 2.75 + (i % 2) * 0.3, Math.sin(angle) * radius)
    cluster.rotation.set(Math.random(), Math.random(), Math.random())
    group.add(cluster)
  }

  return group
}

function createTreeModel() {
  const modelRoot = new THREE.Group()
  const loader = new GLTFLoader()

  loader.load(
    fantasyTreeModelUrl,
    (gltf) => {
      const model = gltf.scene

      model.traverse((child) => {
        if (!child.isMesh) return
        child.castShadow = true
        child.receiveShadow = true
      })

      fitModelToCenter(model, TREE_TARGET_HEIGHT)
      model.rotation.y = Math.PI * 0.18
      modelRoot.add(model)
    },
    undefined,
    () => {
      const fallback = createFallbackTree()
      fitModelToCenter(fallback, TREE_TARGET_HEIGHT)
      modelRoot.add(fallback)
    }
  )

  return modelRoot
}

function createCenterHill() {
  const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 16), hillMaterial)
  hill.scale.set(5.1, 0.92, 4.15)
  hill.position.y = -0.62
  hill.receiveShadow = true
  hill.name = 'world-center-hill'
  return hill
}

function createRootRing() {
  const group = new THREE.Group()
  const roots = []

  for (let i = 0; i < 7; i++) {
    const angle = (Math.PI * 2 * i) / 7
    const radius = 1.1 + (i % 2) * 0.35
    const start = new THREE.Vector3(0, 0.52, 0)
    const midA = new THREE.Vector3(Math.cos(angle) * radius * 0.38, 0.36, Math.sin(angle) * radius * 0.38)
    const midB = new THREE.Vector3(Math.cos(angle) * radius * 0.76, 0.18, Math.sin(angle) * radius * 0.76)
    const end = new THREE.Vector3(Math.cos(angle) * radius, 0.03, Math.sin(angle) * radius)

    const curve = new THREE.CatmullRomCurve3([start, midA, midB, end])
    const geometry = new THREE.TubeGeometry(curve, 24, 0.07, 6, false)
    const root = new THREE.Mesh(geometry, rootMaterial)
    root.receiveShadow = true
    group.add(root)
    roots.push(root)
  }

  return { group, roots }
}

function createCentralTree() {
  const group = new THREE.Group()
  const modelRoot = createTreeModel()
  modelRoot.position.y = -0.46
  group.add(modelRoot)

  const rootRing = createRootRing()
  group.add(rootRing.group)

  const aura = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createAuraTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }))
  aura.scale.setScalar(9)
  aura.position.y = 6.4
  group.add(aura)

  const light = new THREE.PointLight(magicGlowColor, 3, 24, 1.8)
  light.position.y = 4
  group.add(light)

  const trunkGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createAuraTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }))
  trunkGlow.scale.set(2.4, 3.8, 1)
  trunkGlow.position.set(0, 2, 0)
  group.add(trunkGlow)

  return { group, modelRoot, rootRing, light, aura, trunkGlow }
}

export class PortalsController {
  constructor() {
    this.group = new THREE.Group()
    this.group.position.set(CENTER_X, 0, CENTER_Z)

    this.hill = createCenterHill()
    this.tree = createCentralTree()

    this.group.add(this.hill)
    this.group.add(this.tree.group)
  }

  update(elapsed) {
    const pulse = 0.9 + Math.sin(elapsed * 0.9) * 0.1
    this.tree.light.intensity = 2.6 * pulse

    this.tree.aura.scale.setScalar(8.8 + Math.sin(elapsed * 0.5) * 0.35)
    this.tree.aura.material.opacity = 0.3 + Math.sin(elapsed * 0.5) * 0.05
    this.tree.trunkGlow.material.opacity = 0.13 + Math.sin(elapsed * 0.8) * 0.03

    for (let i = 0; i < this.tree.rootRing.roots.length; i++) {
      const root = this.tree.rootRing.roots[i]
      root.material.emissiveIntensity = 0.45 + Math.sin(elapsed * 0.8 + i * 0.4) * 0.12
    }
  }
}
