// =============================================================
// ZoneManager.js
// -------------------------------------------------------------
// Zonas circulares em volta de cada reino + do Núcleo. Ao entrar
// numa zona no modo exploração, dispara `onEnterZone(zone)` (usado
// pelo Experience para mostrar o DiscoveryBanner e atualizar
// `currentRealm`).
//
// Convenção para quando um world.glb existir: objetos nomeados
// `ZONE_*` ou com `userData.zone === true` podem alimentar esta
// mesma lista de zonas (ver Experience.js).
// =============================================================

export class ZoneManager {
  // `zones`: [{ id, label, sublabel, position: [x, z], radius }]
  constructor(zones, { onEnterZone } = {}) {
    this.zones = zones
    this.onEnterZone = onEnterZone
    this.currentZoneId = null
  }

  update(playerPosition) {
    const zone = this.zones.find((z) => {
      const [x, z2] = z.position
      return Math.hypot(playerPosition.x - x, playerPosition.z - z2) <= z.radius
    })

    const zoneId = zone?.id ?? null
    if (zoneId !== this.currentZoneId) {
      this.currentZoneId = zoneId
      if (zone) this.onEnterZone?.(zone)
    }
  }
}
