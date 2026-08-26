// =============================================================
// CollisionManager.js
// -------------------------------------------------------------
// Colisão simples (esferas + limites do mapa) para o modo
// exploração: o jogador não atravessa castelos, o tronco da
// árvore central, nem sai do mapa. Sem física complexa —
// só push-out radial, resolvido depois do movimento do
// PlayerController a cada frame.
//
// Reconhece a convenção do world.glb: meshes com nome começando em
// "COL_" (ou `userData.collidable`/`userData.walkable === true`) são
// coletados automaticamente via collectFromScene(). Limites do mapa e
// colisores extras (ex.: tronco da árvore central) são resolvidos pelo
// Experience a partir dos nós reais do world.glb e registrados via
// addCollider()/setBoundsFromObject() — este arquivo não assume nenhuma
// dimensão fixa de mapa.
//
// EDITE AQUI:
// - DEFAULT_MARGIN -> quão perto da borda do terreno o jogador pode chegar
// - PLAYER_RADIUS -> "largura" do jogador para efeito de colisão
// =============================================================

import * as THREE from 'three'

const DEFAULT_MARGIN = 1.5
const PLAYER_RADIUS = 0.35
const UNBOUNDED = 100000

export class CollisionManager {
  constructor() {
    this.colliders = []
    // Sem limites até setBoundsFromObject() ser chamado (evita travar o
    // jogador caso o terreno real não seja encontrado por algum motivo).
    this.bounds = { minX: -UNBOUNDED, maxX: UNBOUNDED, minZ: -UNBOUNDED, maxZ: UNBOUNDED }
  }

  addCollider(position, radius) {
    this.colliders.push({ position, radius })
  }

  // Calcula os limites do mapa a partir da geometria real do terreno
  // (ex.: WORLD_Terrain do world.glb) — sem hardcode de tamanho.
  setBoundsFromObject(object3D, margin = DEFAULT_MARGIN) {
    if (!object3D) return
    const box = new THREE.Box3().setFromObject(object3D)
    this.bounds = {
      minX: box.min.x + margin,
      maxX: box.max.x - margin,
      minZ: box.min.z + margin,
      maxZ: box.max.z - margin,
    }
  }

  // Descobre colisores num world.glb futuro (hoje não encontra nada no
  // mundo procedural — é o contrato pronto para quando ele existir).
  collectFromScene(scene) {
    scene.traverse((child) => {
      if (!child.isMesh) return
      const byName = typeof child.name === 'string' && child.name.startsWith('COL_')
      const byFlag = child.userData?.collidable === true
      if (!byName && !byFlag) return

      const sphere = new THREE.Box3().setFromObject(child).getBoundingSphere(new THREE.Sphere())
      this.addCollider(new THREE.Vector3(sphere.center.x, 0, sphere.center.z), sphere.radius)
      child.visible = false
    })
  }

  // Empurra `position` (Vector3, mutado in-place) para fora de qualquer
  // colisor e para dentro dos limites do mapa.
  resolve(position) {
    for (const collider of this.colliders) {
      const dx = position.x - collider.position.x
      const dz = position.z - collider.position.z
      const dist = Math.hypot(dx, dz)
      const minDist = collider.radius + PLAYER_RADIUS

      if (dist > 0.0001 && dist < minDist) {
        const push = (minDist - dist) / dist
        position.x += dx * push
        position.z += dz * push
      }
    }

    position.x = THREE.MathUtils.clamp(position.x, this.bounds.minX, this.bounds.maxX)
    position.z = THREE.MathUtils.clamp(position.z, this.bounds.minZ, this.bounds.maxZ)
  }
}
