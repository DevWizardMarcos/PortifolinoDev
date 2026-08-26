// =============================================================
// RendererManager.js
// -------------------------------------------------------------
// Cria o WebGLRenderer e cuida do canvas + resize.
// =============================================================

import * as THREE from 'three'
import { sizes } from '../utils/sizes.js'

export class RendererManager {
  constructor(container) {
    this.instance = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.instance.setSize(sizes.width, sizes.height)
    this.instance.setPixelRatio(sizes.pixelRatio)
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    this.instance.toneMapping = THREE.AgXToneMapping
    this.instance.toneMappingExposure = 1
    this.instance.shadowMap.enabled = false

    this.instance.domElement.classList.add('experience-canvas')
    container.appendChild(this.instance.domElement)

    sizes.on('resize', () => this.onResize())
  }

  get domElement() {
    return this.instance.domElement
  }

  onResize() {
    this.instance.setSize(sizes.width, sizes.height)
    this.instance.setPixelRatio(sizes.pixelRatio)
  }

  render(scene, camera) {
    this.instance.render(scene, camera)
  }
}
