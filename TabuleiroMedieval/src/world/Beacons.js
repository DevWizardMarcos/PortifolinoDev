// =============================================================
// Beacons.js
// -------------------------------------------------------------
// Faróis mágicos: uma coluna de luz colorida por reino, vista de
// longe no modo exploração — orientação melhor do que um marcador
// gigante flutuando na porta do castelo. Cor própria por reino
// (journeyData.js -> beaconColor), independente da cor do castelo.
// Visível só em exploração (no mapa a geometria do castelo já
// cumpre esse papel).
//
// Recebe as posições reais (mundo) — resolvidas pelo Experience a
// partir dos nós GAME_Spawn<Reino>/ZONE_<Reino> do world.glb — em
// vez de assumir coordenadas fixas, já que a escala do mapa real
// não é conhecida por este arquivo.
//
// EDITE AQUI:
// - BEACON_HEIGHT -> altura do facho de luz
// =============================================================

import * as THREE from 'three'

const BEACON_HEIGHT = 14
const BEACON_RADIUS = 0.1

export class BeaconsController {
  // `entries`: [{ id, position: THREE.Vector3, color: number }]
  constructor(entries = []) {
    this.group = new THREE.Group()
    this.group.visible = false
    this.beacons = []

    entries.forEach((entry) => this.buildBeacon(entry))
  }

  buildBeacon({ position, color }) {
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(BEACON_RADIUS * 0.25, BEACON_RADIUS, BEACON_HEIGHT, 8, 1, true),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    )
    beam.position.set(position.x, position.y + BEACON_HEIGHT / 2, position.z)
    this.group.add(beam)

    const light = new THREE.PointLight(color, 1.5, 9, 2)
    light.position.set(position.x, position.y + 2, position.z)
    this.group.add(light)

    this.beacons.push({ beam, light, phase: Math.random() * Math.PI * 2 })
  }

  update(elapsed) {
    for (const beacon of this.beacons) {
      const pulse = 0.75 + Math.sin(elapsed * 1.2 + beacon.phase) * 0.25
      beacon.beam.material.opacity = 0.35 * pulse
      beacon.light.intensity = 1.4 * pulse
    }
  }

  setVisible(visible) {
    this.group.visible = visible
  }
}
