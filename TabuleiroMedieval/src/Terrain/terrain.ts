import * as THREE from 'three'

export function createTerrain(): THREE.Mesh{
    const geometry = new THREE.PlaneGeometry(18,18)
    const material = new THREE.MeshStandardMaterial({color: 0x8a6d3b})
    const terrain = new THREE.Mesh(geometry,material)
    terrain.rotation.x = -Math.PI / 2 
    return terrain
}