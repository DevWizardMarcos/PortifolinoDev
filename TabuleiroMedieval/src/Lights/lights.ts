import * as THREE from 'three'

export function createLigth(scene: THREE.Scene): void{
    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(luzAmbiente)

    const luzDirecional = new THREE.DirectionalLight(0xffffff,1 )
    luzDirecional.position.set(5,10,7)
    scene.add(luzDirecional)


}