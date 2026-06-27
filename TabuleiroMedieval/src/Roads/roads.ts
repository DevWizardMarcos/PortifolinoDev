import * as THREE from 'three'

function createRoad(from: THREE.Vector2, to: THREE.Vector2): THREE.Mesh {
  const distancia = from.distanceTo(to)

  const geometry = new THREE.BoxGeometry(0.4, 0.05, distancia)
  const material = new THREE.MeshStandardMaterial({ color: 0xd9c89e })
  const road = new THREE.Mesh(geometry, material)

  const meio = from.clone().add(to).multiplyScalar(0.5)
  road.position.set(meio.x, 0.03, meio.y)

  const angulo = Math.atan2(to.x - from.x, to.y - from.y)
  road.rotation.y = angulo

  return road
}

export function createRoads(centro: THREE.Vector2, pontos: THREE.Vector2[]): THREE.Group {
  const grupo = new THREE.Group()

  for (const ponto of pontos) {
    grupo.add(createRoad(centro, ponto))
  }

  return grupo
}
