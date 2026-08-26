// =============================================================
// Lights.js
// -------------------------------------------------------------
// Iluminação geral da cena: uma luz quente (sol baixo, clima de
// entardecer) + ambiente/hemisfério para não ficar tudo preto,
// e um leve acento roxo para casar com o glow mágico do mapa.
//
// EDITE AQUI as cores/intensidades para mudar o "clima" da cena.
// =============================================================

import * as THREE from 'three'

export function createLights(scene) {
  const group = new THREE.Group()

  const ambient = new THREE.AmbientLight(0x453552, 0.3)
  group.add(ambient)

  const hemi = new THREE.HemisphereLight(0x7a5cff, 0x2a1a0f, 0.3)
  group.add(hemi)

  // Luz quente principal (o "sol" do entardecer) — um pouco mais forte
  // para que a textura/relevo do terreno e os castelos leiam bem.
  const sun = new THREE.DirectionalLight(0xffd9a0, 1.1)
  sun.position.set(8, 14, 6)
  group.add(sun)

  // Luz de preenchimento fria do lado oposto, só para suavizar sombras
  // duras sem competir com o sol.
  const fill = new THREE.DirectionalLight(0x6f5aa8, 0.2)
  fill.position.set(-10, 8, -8)
  group.add(fill)

  // Acento roxo mágico geral, reforçando o glow dos marcadores/árvore.
  const magicAccent = new THREE.PointLight(0x9b5de5, 0.6, 34, 2)
  magicAccent.position.set(0, 8, 0)
  group.add(magicAccent)

  scene.add(group)
  return group
}
