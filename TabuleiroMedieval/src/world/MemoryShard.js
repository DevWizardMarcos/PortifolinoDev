// =============================================================
// MemoryShard.js
// -------------------------------------------------------------
// POI de exemplo: um fragmento de memória flutuante. Ao interagir
// (E), abre o InfoPanel com um pedaço da trajetória (dado em
// journeyData.js -> memories). Prova o sistema de POIs/memórias
// pedido — mais fragmentos podem ser adicionados só acrescentando
// itens em `memories` e instanciando um MemoryShard por item.
//
// Tenta carregar public/models/props/memory-shard.glb; sem o
// arquivo, usa um fallback procedural (cristal-livro flutuante).
// =============================================================

import * as THREE from 'three'
import { loadGameModel } from './GameModel.js'
import { magicGlowColor } from '../data/journeyData.js'

function buildProceduralShard() {
  const group = new THREE.Group()

  const shard = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.26, 0),
    new THREE.MeshStandardMaterial({
      color: magicGlowColor,
      emissive: magicGlowColor,
      emissiveIntensity: 1.3,
      roughness: 0.25,
      metalness: 0.4,
    })
  )
  shard.position.y = 0.8
  group.add(shard)

  const light = new THREE.PointLight(magicGlowColor, 1, 4, 2)
  light.position.y = 0.8
  group.add(light)

  group.userData._shard = shard
  return group
}

export class MemoryShard {
  // `position`: THREE.Vector3 (posição real no mundo, resolvida pelo
  // Experience) — `memory.posicao` é só metadado de conteúdo, não usado
  // para posicionamento 3D.
  constructor(memory, position) {
    this.memory = memory
    this.group = new THREE.Group()
    this.group.position.copy(position)
    this.shard = null
    this._load()
  }

  async _load() {
    const { object } = await loadGameModel({
      src: '/models/props/memory-shard.glb',
      fallback: buildProceduralShard,
      interactive: true,
    })
    this.group.add(object)
    this.shard = object.userData._shard ?? null
  }

  update(elapsed) {
    if (!this.shard) return
    this.shard.rotation.y = elapsed * 0.8
    this.shard.position.y = 0.8 + Math.sin(elapsed * 1.6) * 0.08
  }
}
