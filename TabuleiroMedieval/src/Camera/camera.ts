import * as THREE from 'three'

export const ISOMETRIC_SIZE = 10

export function createCamera(): THREE.OrthographicCamera {
  const aspect = window.innerWidth / window.innerHeight

  const camera = new THREE.OrthographicCamera(
    -ISOMETRIC_SIZE * aspect,
    ISOMETRIC_SIZE * aspect,
    ISOMETRIC_SIZE,
    -ISOMETRIC_SIZE,
    0.1,
    1000
  )

  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)

  return camera
}
