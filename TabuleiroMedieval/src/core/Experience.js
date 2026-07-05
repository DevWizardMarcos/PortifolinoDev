// =============================================================
// Experience.js
// -------------------------------------------------------------
// Orquestrador principal: monta cena, câmera, renderer, controles,
// o mundo (terreno/marcadores/estradas/partículas/portais) e a UI,
// além de rodar o loop de animação e ligar os eventos de interação.
//
// Normalmente não é necessário editar este arquivo para mudar textos
// ou cores — veja journeyData.js, e os arquivos dentro de world/ e ui/.
// =============================================================

import * as THREE from 'three'

import { SceneManager } from './SceneManager.js'
import { CameraManager } from './CameraManager.js'
import { RendererManager } from './RendererManager.js'
import { ControlsManager } from './ControlsManager.js'

import { createTerrain, createTerrainBorder } from '../world/Terrain.js'
import { createLights } from '../world/Lights.js'
import { MarkersController } from '../world/Markers.js'
import { RoadsController } from '../world/Roads.js'
import { ParticlesController } from '../world/Particles.js'
import { PortalsController } from '../world/Portals.js'
import { VegetationController } from '../world/Vegetation.js'

import { IntroScreen } from '../ui/IntroScreen.js'
import { Navigation } from '../ui/Navigation.js'
import { InfoPanel } from '../ui/InfoPanel.js'
import { Tooltip } from '../ui/Tooltip.js'
import { RotateDevice } from '../ui/RotateDevice.js'

import { PointerRaycaster } from '../utils/Raycaster.js'
import { siteInfo } from '../data/journeyData.js'

export class Experience {
  constructor(container) {
    this.container = container
    this.clock = new THREE.Clock()

    this.sceneManager = new SceneManager()
    this.cameraManager = new CameraManager()
    this.rendererManager = new RendererManager(container)
    this.controlsManager = new ControlsManager(this.cameraManager.instance, this.rendererManager.domElement)

    this.buildWorld()
    this.buildUI()
    this.setupInteractions()

    this.tick = this.tick.bind(this)
    this.tick()
  }

  buildWorld() {
    createLights(this.sceneManager.scene)

    this.terrain = createTerrain()
    this.terrainBorder = createTerrainBorder()
    this.markers = new MarkersController()
    this.roads = new RoadsController()
    // Depende das curvas do RoadsController para não plantar vegetação em cima das estradas.
    this.vegetation = new VegetationController(this.roads)
    this.particles = new ParticlesController()
    this.portals = new PortalsController()

    this.sceneManager.add(this.terrain)
    this.sceneManager.add(this.terrainBorder)
    this.sceneManager.add(this.markers.group)
    this.sceneManager.add(this.roads.group)
    this.sceneManager.add(this.vegetation.group)
    this.sceneManager.add(this.particles.points)
    this.sceneManager.add(this.portals.group)
  }

  buildUI() {
    this.tooltip = new Tooltip()
    this.rotateDevice = new RotateDevice()

    this.infoPanel = new InfoPanel({
      onClose: () => this.cameraManager.resetView(),
    })

    this.navigation = new Navigation({
      onNavigate: (key) => this.handleNavigate(key),
    })

    this.introScreen = new IntroScreen({
      onEnter: () => this.enterJourney(),
    })
  }

  setupInteractions() {
    this.raycaster = new PointerRaycaster(this.cameraManager.instance, this.rendererManager.domElement)
    const domElement = this.rendererManager.domElement

    domElement.addEventListener('pointermove', (event) => this.handlePointerMove(event))
    domElement.addEventListener('click', (event) => this.handleClick(event))
  }

  handlePointerMove(event) {
    const hits = this.raycaster.intersect(event, this.markers.getRaycastTargets())

    if (hits.length > 0) {
      const marker = this.markers.findByMesh(hits[0].object)
      this.tooltip.show(marker.reino.nome, event.clientX, event.clientY)
      this.rendererManager.domElement.style.cursor = 'pointer'
    } else {
      this.tooltip.hide()
      this.rendererManager.domElement.style.cursor = 'default'
    }
  }

  handleClick(event) {
    const hits = this.raycaster.intersect(event, this.markers.getRaycastTargets())
    if (hits.length === 0) return

    const marker = this.markers.findByMesh(hits[0].object)
    this.focusMarker(marker)
  }

  focusMarker(marker) {
    this.cameraManager.flyTo(marker.wrapper.position)
    this.infoPanel.open(marker.reino)
  }

  handleNavigate(key) {
    switch (key) {
      case 'mapa':
        this.infoPanel.close()
        this.cameraManager.resetView()
        break
      case 'jornada': {
        const first = this.markers.markers.find((m) => m.reino.order === 0)
        if (first) this.focusMarker(first)
        break
      }
      case 'projetos':
        this.cameraManager.resetView()
        this.infoPanel.open(siteInfo.projetos)
        break
      case 'sobre':
        this.cameraManager.resetView()
        this.infoPanel.open(siteInfo.sobre)
        break
      case 'contato':
        this.cameraManager.resetView()
        this.infoPanel.open(siteInfo.contato)
        break
      default:
        break
    }
  }

  // Chamado ao clicar em "Entrar na Jornada": câmera cai suavemente até
  // a visão padrão do mapa e libera os controles + menu.
  enterJourney() {
    this.cameraManager.playIntro({
      onComplete: () => {
        this.controlsManager.enable()
        this.navigation.show()
      },
    })
  }

  tick() {
    const elapsed = this.clock.getElapsedTime()

    this.markers.update(elapsed)
    this.roads.update(elapsed)
    this.particles.update(elapsed)
    this.portals.update(elapsed)

    // Mantém o OrbitControls apontando para onde o GSAP está levando a câmera.
    this.controlsManager.controls.target.copy(this.cameraManager.lookAtTarget)
    this.controlsManager.update()

    this.rendererManager.render(this.sceneManager.scene, this.cameraManager.instance)

    requestAnimationFrame(this.tick)
  }
}
