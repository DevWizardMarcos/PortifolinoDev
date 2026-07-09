// =============================================================
// RendererManager.js
// -------------------------------------------------------------
// WebGLRenderer + pipeline de pós-processamento:
// - ACESFilmicToneMapping: resposta de cor "de cinema" (os dourados
//   saturam bonito em vez de estourar branco);
// - UnrealBloomPass: tudo que é emissivo (aura da Árvore, cristais,
//   emblemas, fagulhas das trilhas, janelinhas) ganha o glow mágico
//   da arte de referência.
//
// EDITE AQUI: BLOOM_STRENGTH / BLOOM_RADIUS / BLOOM_THRESHOLD e
// toneMappingExposure para calibrar o "quanto de magia" da cena.
// =============================================================

import * as THREE from 'three'
import { sizes } from '../utils/sizes.js'

const BLOOM_STRENGTH = 0.5
const BLOOM_RADIUS = 0.55
const BLOOM_THRESHOLD = 0.72

export class RendererManager {
  constructor(container) {
    this.instance = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.instance.setSize(sizes.width, sizes.height)
    this.instance.setPixelRatio(sizes.pixelRatio)
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    this.instance.toneMapping = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 1.32
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap

    this.instance.domElement.classList.add('experience-canvas')
    container.appendChild(this.instance.domElement)

    this.composer = null
    this.composerPromise = null
    this.bloomPass = null

    sizes.on('resize', () => this.onResize())
  }

  get domElement() {
    return this.instance.domElement
  }

  // O composer precisa de cena+câmera, então é montado sob demanda na
  // primeira renderização (e reaproveitado depois).
  async setupComposer(scene, camera) {
    const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('three/examples/jsm/postprocessing/OutputPass.js'),
    ])

    const composer = new EffectComposer(this.instance)
    composer.setSize(sizes.width, sizes.height)
    composer.setPixelRatio(sizes.pixelRatio)

    composer.addPass(new RenderPass(scene, camera))

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(sizes.width, sizes.height),
      BLOOM_STRENGTH,
      BLOOM_RADIUS,
      BLOOM_THRESHOLD
    )
    composer.addPass(this.bloomPass)

    composer.addPass(new OutputPass())
    this.composer = composer
  }

  onResize() {
    this.instance.setSize(sizes.width, sizes.height)
    this.instance.setPixelRatio(sizes.pixelRatio)

    if (this.composer) {
      this.composer.setSize(sizes.width, sizes.height)
      this.composer.setPixelRatio(sizes.pixelRatio)
    }
    if (this.bloomPass) {
      this.bloomPass.resolution.set(sizes.width, sizes.height)
    }
  }

  render(scene, camera) {
    if (this.composer) {
      this.composer.render()
      return
    }

    if (!this.composerPromise) {
      this.composerPromise = this.setupComposer(scene, camera).catch((error) => {
        console.error('Falha ao carregar o pós-processamento.', error)
        this.composerPromise = null
      })
    }

    this.instance.render(scene, camera)
  }
}
