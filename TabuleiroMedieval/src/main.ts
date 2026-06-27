import * as THREE from 'three'
import { createScene } from './Scene/scene'
import { createCamera, ISOMETRIC_SIZE } from './Camera/camera'
import { createLigth } from './Lights/lights'
import { createTerrain } from './Terrain/terrain'
import { createMakers,createCentralTree,reinos } from './Markers/markers'
import { createRoads } from './Roads/roads'


const scene = createScene()
const camera = createCamera()
createLigth(scene)

const terrain = createTerrain()
scene.add(terrain)

const markers = createMakers()
scene.add(markers)

const tree = createCentralTree()

scene.add(tree)

const centro = new THREE.Vector2(-0.4,0.8)
const pontos = reinos.map((reino) => new THREE.Vector2(reino.posicao[0], reino.posicao[1]))
const roads = createRoads(centro, pontos)

scene.add(roads)

const render = new THREE.WebGLRenderer({ antialias: true })
render.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(render.domElement)

function animando() {
  requestAnimationFrame(animando)
  render.render(scene, camera)
}
animando()

window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight
  camera.left = -ISOMETRIC_SIZE * aspect
  camera.right = ISOMETRIC_SIZE * aspect
  camera.top = ISOMETRIC_SIZE
  camera.bottom = -ISOMETRIC_SIZE
  camera.updateProjectionMatrix()
  render.setSize(window.innerWidth, window.innerHeight)
})
