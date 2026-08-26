// =============================================================
// GameModel.js
// -------------------------------------------------------------
// Wrapper único para carregar modelos GLB/GLTF (gato guardião,
// cristais, ruínas, fênix, reinos etc.), com cache por URL e
// fallback procedural caso o arquivo ainda não exista em
// public/models/. Nunca quebra o app — se o GLB não for
// encontrado, usa o fallback e avisa no console onde colocar o
// arquivo.
//
// Para plugar compressão Draco/Meshopt no futuro: importe
// DRACOLoader/MeshoptDecoder de 'three/examples/jsm/...' e chame
// `loader.setDRACOLoader(dracoLoader)` / `loader.setMeshoptDecoder(...)`
// logo abaixo da criação de `loader`. Não é necessário agora.
//
// USO:
//   const model = await loadGameModel({
//     src: '/models/props/crystal.glb',
//     fallback: () => buildProceduralCrystal(),
//     position: [0, 0, 0],
//     rotation: [0, 0, 0],
//     scale: 1,
//     castShadow: false,
//     receiveShadow: false,
//   })
//   scene.add(model.object)
// =============================================================

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
const cache = new Map() // url -> Promise<GLTF>

function loadGltf(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject)
      })
    )
  }
  return cache.get(url)
}

function applyTransform(object3D, { position, rotation, scale }) {
  if (position) object3D.position.set(...position)
  if (rotation) object3D.rotation.set(...rotation)
  if (scale !== undefined) {
    if (Array.isArray(scale)) object3D.scale.set(...scale)
    else object3D.scale.setScalar(scale)
  }
}

function applyShadows(object3D, { castShadow, receiveShadow }) {
  object3D.traverse((child) => {
    if (!child.isMesh) return
    if (castShadow) child.castShadow = true
    if (receiveShadow) child.receiveShadow = true
  })
}

// Carrega um GLB e devolve { object, animations, isFallback }. Se o
// arquivo não existir/falhar, usa `fallback()` (função síncrona que
// devolve um THREE.Object3D) e loga onde o arquivo real deve ir.
export async function loadGameModel({
  src,
  fallback,
  position,
  rotation,
  scale,
  interactive = false,
  collidable = false,
  castShadow = false,
  receiveShadow = false,
} = {}) {
  let object
  let animations = []
  let isFallback = false

  try {
    if (!src) throw new Error('src não informado')
    const gltf = await loadGltf(src)
    object = gltf.scene
    animations = gltf.animations ?? []
  } catch (error) {
    isFallback = true
    const fileName = src ? src.split('/').pop() : '(sem src)'
    console.warn(
      `[GameModel] "${fileName}" não encontrado — usando fallback. Coloque o arquivo em public${src ?? ''}`
    )
    object = fallback ? fallback() : new THREE.Group()
  }

  applyTransform(object, { position, rotation, scale })
  applyShadows(object, { castShadow, receiveShadow })

  object.userData.interactive = interactive
  object.userData.collidable = collidable
  object.userData.isFallback = isFallback

  return { object, animations, isFallback }
}

// Pré-carrega um GLB no cache sem esperar pelo resultado — use para
// modelos que serão instanciados várias vezes (ex.: props repetidos).
export function preloadGameModel(src) {
  loadGltf(src).catch(() => {
    // Silencioso: quem realmente usa o modelo já loga o aviso de fallback.
  })
}
