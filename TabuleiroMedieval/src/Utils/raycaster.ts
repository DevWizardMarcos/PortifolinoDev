import * as THREE from 'three'

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

let hovered: THREE.Mesh | null = null

export function setupInteractions(
    camera: THREE.Camera,
    marker: THREE.Group,
    render: THREE.WebGLRenderer
    
): void{
window.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersecoes = raycaster.intersectObjects(marker.children)

  if (intersecoes.length > 0) {
    const objeto = intersecoes[0].object as THREE.Mesh

    if (hovered !== objeto) {
      if (hovered) {
        (hovered.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000)
      }

      hovered = objeto
      ;(hovered.material as THREE.MeshStandardMaterial).emissive.setHex(0x444444)
      render.domElement.style.cursor = 'pointer'
    }
  } else {
    if (hovered) {
      (hovered.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000)
      hovered = null
    }
    render.domElement.style.cursor = 'default'
  }
})

}