import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const WORLD_URL = '/models/world/world.glb'
const BLENDER_ACTIVE_CAMERA = 'GAME_TestCamera'

// O Blender exporta luzes em unidades físicas (lux para o sol, candela
// para pontuais) via KHR_lights_punctual, e o three.js aplica esses
// valores brutos ao intensity — sem reescalar, um sol de ~600 lux e
// pontuais de ~40.000 candela estouram completamente o tone mapping
// (cena inteira lava para branco). Reescala aqui para a mesma ordem de
// grandeza da iluminação manual em Lights.js.
// EDITE AQUI para ajustar o brilho geral das luzes vindas do world.glb.
const BAKED_DIRECTIONAL_SCALE = 1 / 500
const BAKED_POINT_SCALE = 1 / 6000

function rescaleBakedLights(root) {
  root.traverse((child) => {
    if (child.isDirectionalLight) {
      child.intensity *= BAKED_DIRECTIONAL_SCALE
    } else if (child.isPointLight || child.isSpotLight) {
      child.intensity *= BAKED_POINT_SCALE
    }
  })
}

export class WorldModel {
  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'BlenderWorld'
    this.mixer = null
  }

  async load() {
    const gltf = await new GLTFLoader().loadAsync(WORLD_URL)
    rescaleBakedLights(gltf.scene)
    this.group.add(gltf.scene)

    if (gltf.animations.length) {
      this.mixer = new THREE.AnimationMixer(gltf.scene)
      gltf.animations.forEach((clip) => this.mixer.clipAction(clip).play())
    }

    const camera = gltf.scene.getObjectByName(BLENDER_ACTIVE_CAMERA)
      ?? gltf.cameras.find((item) => item.name === BLENDER_ACTIVE_CAMERA)
      ?? gltf.cameras[0]

    return { camera }
  }

  update(delta) {
    this.mixer?.update(delta)
  }
}
