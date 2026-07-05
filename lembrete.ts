const scene = new THREE.Scene()

scene.background = new THREE.Color(0x202030)

const camera = new THREE.PerspectiveCamera(
  75, // fov campo de visao da lente (zoom)
  window.innerWidth / window.innerHeight, // aspect ratio (proporção da tela)
  0.1, // distancia min (qualquer coisa perto disso é cortada)
  1000 // distancia max visivel
); 
camera.position.z = 5 // afasta a camera no eixo z


const render = new THREE.WebGLRenderer({antialias: true})
render.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(render.domElement)

const geomerty = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geomerty,material)
scene.add(cube)

function animando(){
  requestAnimationFrame(animando)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  render.render(scene, camera)
}

animando()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  render.setSize(window.innerWidth, window.innerHeight)
})