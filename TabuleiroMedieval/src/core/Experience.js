// =============================================================
// Experience.js
// -------------------------------------------------------------
// Orquestrador principal: monta cena, câmera, renderer, controles,
// carrega o mundo real (world.glb, via WorldModel) e a UI, além de
// rodar o loop de animação.
//
// Também é dono da máquina de estados Modo Mapa <-> Modo Exploração
// (ver enterExploration()/exitToMap() e a ramificação em tick()).
// A exploração só é montada depois que o world.glb termina de
// carregar, pois depende dos nós reais da cena — ver as convenções
// de nomes no topo deste arquivo e em public/models/world/README.md.
// =============================================================

import * as THREE from 'three'
import { SceneManager } from './SceneManager.js'
import { CameraManager, PLAYER_EYE_HEIGHT } from './CameraManager.js'
import { RendererManager } from './RendererManager.js'
import { ControlsManager } from './ControlsManager.js'
import { PlayerController } from './PlayerController.js'
import { CollisionManager } from './CollisionManager.js'
import { InteractionManager } from './InteractionManager.js'
import { ZoneManager } from './ZoneManager.js'

import { WorldModel } from '../world/WorldModel.js'
import { createLights } from '../world/Lights.js'
import { BeaconsController } from '../world/Beacons.js'
import { WorldMapAltar } from '../world/WorldMapAltar.js'
import { MemoryShard } from '../world/MemoryShard.js'
import { Crystal } from '../world/props/Crystal.js'

import { IntroScreen } from '../ui/IntroScreen.js'
import { Navigation } from '../ui/Navigation.js'
import { InfoPanel } from '../ui/InfoPanel.js'
import { RotateDevice } from '../ui/RotateDevice.js'
import { ExploreButton } from '../ui/ExploreButton.js'
import { ControlsHint } from '../ui/ControlsHint.js'
import { Crosshair } from '../ui/Crosshair.js'
import { InteractionPrompt } from '../ui/InteractionPrompt.js'
import { DiscoveryBanner } from '../ui/DiscoveryBanner.js'
import { DebugOverlay } from '../ui/DebugOverlay.js'

import { DEBUG_EXPLORATION } from '../utils/debug.js'
import { siteInfo, journeyPoints, playerSpawnFallback, memories } from '../data/journeyData.js'

// Convenções de nomes esperadas no world.glb (ver public/models/world/README.md).
const NODE_PLAYER_SPAWN = ['GAME_PlayerSpawn', 'PLAYER_SPAWN']
const NODE_CAMERA_START = ['GAME_CameraStart']
const NODE_WORLD_CENTER = ['GAME_WorldCenter', 'ZONE_Core']
const NODE_TERRAIN = 'WORLD_Terrain'
const NODE_TREE_TRUNK = 'Nucleo_Tronco'

const ZONE_NODES = [
  { node: 'ZONE_Core', id: 'core', label: 'Núcleo da Criação', sublabel: 'Onde todas as estradas se encontram' },
  { node: 'ZONE_Danki', reinoId: 'danki-code' },
  { node: 'ZONE_Ms', reinoId: 'ms-negocios' },
  { node: 'ZONE_Infinity', reinoId: 'infinity-school' },
  { node: 'ZONE_Dreams', reinoId: 'dreams' },
  { node: 'ZONE_Cnx', reinoId: 'cnx' },
]

const KINGDOM_SPAWN_NODES = [
  { node: 'GAME_SpawnDanki', reinoId: 'danki-code' },
  { node: 'GAME_SpawnMs', reinoId: 'ms-negocios' },
  { node: 'GAME_SpawnInfinity', reinoId: 'infinity-school' },
  { node: 'GAME_SpawnDreams', reinoId: 'dreams' },
  { node: 'GAME_SpawnCnx', reinoId: 'cnx' },
]

const ZONE_RADIUS = 14
const KINGDOM_INTERACT_RADIUS = 4

export class Experience {
  constructor(container) {
    this.clock = new THREE.Clock()

    // 'map' | 'exploration' — ver enterExploration()/exitToMap().
    this.mode = 'map'
    this.isTransitioning = false
    this.explorationReady = false

    this.sceneManager = new SceneManager()
    this.lights = createLights(this.sceneManager.scene)
    this.cameraManager = new CameraManager()
    this.rendererManager = new RendererManager(container)
    this.controlsManager = new ControlsManager(this.cameraManager.instance, this.rendererManager.domElement)

    this.buildUI()
    this.buildWorld()
    this.tick = this.tick.bind(this)
    this.tick()
  }

  buildUI() {
    this.rotateDevice = new RotateDevice()
    this.infoPanel = new InfoPanel({ onClose: () => this.cameraManager.resetView() })
    this.navigation = new Navigation({ onNavigate: (key) => this.handleNavigate(key) })
    this.introScreen = new IntroScreen({ onEnter: () => this.enterJourney() })

    this.exploreButton = new ExploreButton({ onExplore: () => this.enterExploration() })
    this.controlsHint = new ControlsHint()
    this.crosshair = new Crosshair()
    this.interactionPrompt = new InteractionPrompt()
    this.discoveryBanner = new DiscoveryBanner()
    this.debugOverlay = DEBUG_EXPLORATION ? new DebugOverlay() : null
  }

  async buildWorld() {
    this.world = new WorldModel()
    this.sceneManager.add(this.world.group)

    try {
      const { camera } = await this.world.load()
      this.cameraManager.configureFromBlenderCamera(camera)
      this.controlsManager.controls.target.copy(this.cameraManager.lookAtTarget)
      this.buildExploration()
      this.introScreen.setReady()
    } catch (error) {
      console.error('[WorldModel] Falha ao carregar world.glb.', error)
      const button = this.introScreen.element.querySelector('.intro-screen__button')
      if (button) button.textContent = 'Erro ao carregar o mundo'
    }
  }

  findWorldNode(...names) {
    for (const name of names) {
      const node = this.sceneManager.scene.getObjectByName(name)
      if (node) return node
    }
    return null
  }

  worldPositionOf(node, fallback) {
    if (!node) return fallback
    return node.getWorldPosition(new THREE.Vector3())
  }

  // Monta tudo que só existe no modo exploração — chamado depois que o
  // world.glb carrega, já que depende dos nós reais da cena (GAME_*,
  // ZONE_*, COL_*, WORLD_Terrain).
  buildExploration() {
    const terrainMesh = this.findWorldNode(NODE_TERRAIN)

    this.collisionManager = new CollisionManager()
    // Descobre automaticamente todos os COL_* do world.glb (pilares de
    // pontes, muralhas do Infinity etc.) — zero configuração extra.
    this.collisionManager.collectFromScene(this.sceneManager.scene)
    if (terrainMesh) this.collisionManager.setBoundsFromObject(terrainMesh)

    // Tronco da árvore central não vem com COL_ no arquivo atual — registra
    // manualmente (bounding sphere real, sem hardcode de raio de mapa).
    const trunkNode = this.findWorldNode(NODE_TREE_TRUNK)
    if (trunkNode) {
      const sphere = new THREE.Box3().setFromObject(trunkNode).getBoundingSphere(new THREE.Sphere())
      this.collisionManager.addCollider(new THREE.Vector3(sphere.center.x, 0, sphere.center.z), sphere.radius)
    }

    // Chão caminhável: o terreno real + qualquer deck de ponte (BRIDGE_*_Deck).
    const groundObjects = []
    this.sceneManager.scene.traverse((child) => {
      if (!child.isMesh) return
      if (child.name === NODE_TERRAIN || child.name.endsWith('_Deck')) groundObjects.push(child)
    })

    this.playerController = new PlayerController(this.cameraManager.instance, this.rendererManager.domElement, {
      groundObjects,
    })

    this.playerController.controls.addEventListener('lock', () => {
      this.controlsHint.onLocked()
      this.crosshair.show()
    })
    // Dispara tanto no ESC nativo do Pointer Lock quanto quando nós mesmos
    // chamamos unlock() em exitToMap() — o guard de `mode` evita duplicar.
    this.playerController.controls.addEventListener('unlock', () => {
      this.crosshair.hide()
      if (this.mode === 'exploration' && !this.isTransitioning) this.exitToMap()
    })

    this.interactionManager = new InteractionManager()

    const spawnPosition = this.resolveSpawnPosition()
    const worldCenterNode = this.findWorldNode(...NODE_WORLD_CENTER)
    const worldCenterPosition = this.worldPositionOf(worldCenterNode, new THREE.Vector3(0, 0, 0))

    // Cristal-guia perto do spawn — primeira coisa que o jogador vê ao chegar.
    this.crystal = new Crystal(spawnPosition.clone().add(new THREE.Vector3(1.8, 0, -1.2)))
    this.sceneManager.add(this.crystal.group)

    // Altar do mapa perto do Núcleo — "[E] Abrir mapa" conecta mundo <-> interface.
    this.worldMapAltar = new WorldMapAltar(worldCenterPosition.clone().add(new THREE.Vector3(3, 0, -3)))
    this.sceneManager.add(this.worldMapAltar.group)
    this.interactionManager.register({
      object3D: this.worldMapAltar.group,
      id: 'world-map-altar',
      label: 'Abrir mapa',
      radius: 2.8,
      onInteract: () => this.exitToMap(),
    })

    // 1 fragmento de memória de exemplo, perto de uma ruína real (prova o
    // sistema de POIs/memórias — mais fragmentos: adicionar em journeyData.js
    // e repetir o registro abaixo).
    const memory = memories[0]
    if (memory) {
      const ruinNode = this.findWorldNode('RUIN_BrokenAltar')
      const memoryBase = this.worldPositionOf(ruinNode, spawnPosition.clone().add(new THREE.Vector3(-2, 0, 3)))
      const memoryPosition = memoryBase.clone().add(new THREE.Vector3(0, 0, 2))
      this.memoryShard = new MemoryShard(memory, memoryPosition)
      this.sceneManager.add(this.memoryShard.group)
      this.interactionManager.register({
        object3D: this.memoryShard.group,
        id: memory.id,
        label: 'Ler fragmento',
        radius: 2.2,
        onInteract: () => this.infoPanel.open(memory),
      })
    }

    // Entradas dos reinos (GAME_Spawn<Reino>) — "[E] Ver {reino}" volta ao
    // mapa com o painel daquele reino já aberto. Também alimentam os
    // faróis mágicos (visíveis só em exploração).
    const beaconEntries = []
    KINGDOM_SPAWN_NODES.forEach(({ node: nodeName, reinoId }) => {
      const node = this.findWorldNode(nodeName)
      const reino = journeyPoints.find((r) => r.id === reinoId)
      if (!node || !reino) return

      this.interactionManager.register({
        object3D: node,
        id: `kingdom-${reino.id}`,
        label: `Ver ${reino.nome}`,
        radius: KINGDOM_INTERACT_RADIUS,
        onInteract: () => this.exitToMap({ openInfo: reino }),
      })

      beaconEntries.push({
        position: node.getWorldPosition(new THREE.Vector3()),
        color: reino.beaconColor ?? reino.cor,
      })
    })

    this.beacons = new BeaconsController(beaconEntries)
    this.sceneManager.add(this.beacons.group)

    // Zonas (ZONE_*) — nome do reino aparece suavemente ao entrar na região.
    const zones = []
    ZONE_NODES.forEach(({ node: nodeName, id, label, sublabel, reinoId }) => {
      const node = this.findWorldNode(nodeName)
      if (!node) return
      const pos = node.getWorldPosition(new THREE.Vector3())

      if (reinoId) {
        const reino = journeyPoints.find((r) => r.id === reinoId)
        if (!reino) return
        zones.push({ id: reino.id, label: reino.nome, sublabel: reino.subtitulo, position: [pos.x, pos.z], radius: ZONE_RADIUS })
      } else {
        zones.push({ id, label, sublabel, position: [pos.x, pos.z], radius: ZONE_RADIUS })
      }
    })

    this.zoneManager = new ZoneManager(zones, {
      onEnterZone: (zone) => this.discoveryBanner.show(zone.label, zone.sublabel),
    })

    this.explorationReady = true
    if (DEBUG_EXPLORATION) this.buildDebugHelpers()
  }

  // Visualização de debug (?debug=1): esferas nos colisores, ponto no
  // spawn, anéis nas zonas e no alcance de interação.
  buildDebugHelpers() {
    this.debugHelpers = new THREE.Group()

    this.collisionManager.colliders.forEach((collider) => {
      const helper = new THREE.Mesh(
        new THREE.SphereGeometry(collider.radius, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0xff2255, wireframe: true, transparent: true, opacity: 0.5 })
      )
      helper.position.copy(collider.position)
      this.debugHelpers.add(helper)
    })

    const spawn = this.resolveSpawnPosition()
    const spawnHelper = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0x22ff88 })
    )
    spawnHelper.position.copy(spawn)
    this.debugHelpers.add(spawnHelper)

    this.zoneManager.zones.forEach((zone) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(zone.radius - 0.05, zone.radius, 32),
        new THREE.MeshBasicMaterial({ color: 0x66aaff, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.set(zone.position[0], 0.2, zone.position[1])
      this.debugHelpers.add(ring)
    })

    this.interactionManager.interactables.forEach((entry) => {
      const pos = entry.object3D.getWorldPosition(new THREE.Vector3())
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(entry.radius - 0.03, entry.radius, 24),
        new THREE.MeshBasicMaterial({ color: 0xffcc55, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.set(pos.x, pos.y + 0.1, pos.z)
      this.debugHelpers.add(ring)
    })

    this.sceneManager.add(this.debugHelpers)
  }

  handleNavigate(key) {
    if (key === 'mapa' || key === 'jornada') {
      this.infoPanel.close()
      this.cameraManager.resetView()
      return
    }
    if (siteInfo[key]) this.infoPanel.open(siteInfo[key])
  }

  enterJourney() {
    this.cameraManager.playIntro({
      onComplete: () => {
        this.controlsManager.enable()
        this.navigation.show()
        if (this.explorationReady) this.exploreButton.show()
      },
    })
  }

  // Acha onde o jogador deve nascer: procura por GAME_PlayerSpawn/
  // PLAYER_SPAWN (ou userData.type === 'player_spawn') no world.glb; sem
  // isso, cai no fallback perto do Núcleo (journeyData.playerSpawnFallback).
  resolveSpawnPosition() {
    let node = this.findWorldNode(...NODE_PLAYER_SPAWN)

    if (!node) {
      this.sceneManager.scene.traverse((child) => {
        if (!node && child.userData?.type === 'player_spawn') node = child
      })
    }

    if (node) return node.getWorldPosition(new THREE.Vector3())
    return new THREE.Vector3(playerSpawnFallback[0], PLAYER_EYE_HEIGHT, playerSpawnFallback[1])
  }

  // Ponto de aproximação da cinemática (GAME_CameraStart) e para onde ela
  // olha durante a transição (GAME_WorldCenter) — com fallback defensivo.
  resolveApproachPoints() {
    const approachNode = this.findWorldNode(...NODE_CAMERA_START)
    const centerNode = this.findWorldNode(...NODE_WORLD_CENTER)

    const approachPosition = this.worldPositionOf(
      approachNode,
      (this.cameraManager.homePosition ?? this.cameraManager.instance.position).clone()
    )
    const approachLookAt = this.worldPositionOf(centerNode, new THREE.Vector3(0, 0, 0))

    return { approachPosition, approachLookAt }
  }

  // "Entrei dentro do mapa que estava observando": câmera desce até o
  // spawn real, WASD só é liberado depois que a cinemática termina.
  enterExploration() {
    if (this.mode !== 'map' || this.isTransitioning || !this.explorationReady) return
    this.isTransitioning = true
    this.mode = 'exploration'

    this.exploreButton.hide()
    this.navigation.hide()
    this.controlsManager.disable()
    this.infoPanel.close()
    this.sceneManager.setFogDensity('exploration')
    this.beacons.setVisible(true)

    const spawn = this.resolveSpawnPosition()
    const { approachPosition, approachLookAt } = this.resolveApproachPoints()

    this.cameraManager.enterExploration(spawn, {
      approachPosition,
      approachLookAt,
      onComplete: () => {
        this.isTransitioning = false
        this.playerController.enable()
        this.interactionManager.enable()
        this.controlsHint.show(() => this.playerController.lock())
      },
    })
  }

  // ESC / interações "Ver {reino}"/"Abrir mapa": controle bloqueado, câmera
  // sobe de volta, HUD do mapa reaparece. `openInfo` (opcional) já deixa o
  // InfoPanel daquele reino aberto ao chegar.
  exitToMap({ openInfo } = {}) {
    if (this.mode !== 'exploration' || this.isTransitioning) return
    this.isTransitioning = true
    this.mode = 'map'

    this.playerController.disable()
    this.interactionManager.disable()
    this.interactionPrompt.set(null)
    this.controlsHint.hide()
    this.crosshair.hide()
    this.discoveryBanner.hide()
    this.sceneManager.setFogDensity('map')
    this.beacons.setVisible(false)

    const { approachPosition, approachLookAt } = this.resolveApproachPoints()

    this.cameraManager.exitToMap({
      approachPosition,
      approachLookAt,
      onComplete: () => {
        this.isTransitioning = false
        this.controlsManager.enable()
        this.navigation.show()
        this.exploreButton.show()
        if (openInfo) this.infoPanel.open(openInfo)
      },
    })
  }

  tick() {
    const delta = this.clock.getDelta()
    const elapsed = this.clock.elapsedTime

    this.world?.update(delta)

    if (this.explorationReady) {
      this.beacons.update(elapsed)
      this.worldMapAltar.update(elapsed)
      this.crystal.update(elapsed)
      this.memoryShard?.update(elapsed)
    }

    if (this.isTransitioning) {
      // Mantém a câmera olhando para onde o GSAP está levando `lookAtTarget`
      // durante a cinemática (OrbitControls fica desabilitado nesse momento).
      this.cameraManager.instance.lookAt(this.cameraManager.lookAtTarget)
    } else if (this.mode === 'map') {
      this.controlsManager.controls.target.copy(this.cameraManager.lookAtTarget)
      this.controlsManager.update()
    } else {
      this.playerController.update(delta)
      this.collisionManager.resolve(this.playerController.position)
      this.zoneManager.update(this.playerController.position)
      const activeInteraction = this.interactionManager.update(this.playerController.position)
      this.interactionPrompt.set(activeInteraction)
    }

    if (this.debugOverlay && this.explorationReady) {
      this.debugOverlay.update({
        mode: this.mode,
        position: this.mode === 'exploration' ? this.playerController.position : this.cameraManager.instance.position,
        zone: this.zoneManager.currentZoneId,
        fps: 1 / Math.max(delta, 0.0001),
      })
    }

    this.rendererManager.render(this.sceneManager.scene, this.cameraManager.instance)
    requestAnimationFrame(this.tick)
  }
}
