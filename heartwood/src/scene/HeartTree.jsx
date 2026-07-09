import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * O Carvalho — a árvore-coração da clareira.
 * Construída com primitivas low-poly (flat shading): estilização
 * escolhida, não fotorrealismo barato. A copa balança com o vento;
 * o tronco, nunca — árvores antigas não se curvam fácil.
 */

// Verdes profundos e frios: a copa vive sob luz de lua dourada e violeta
const CANOPY_CLUSTERS = [
  { position: [0, 5.1, 0], radius: 1.9, color: '#4c6647' },
  { position: [-1.5, 4.5, 0.4], radius: 1.3, color: '#41573d' },
  { position: [1.4, 4.6, -0.3], radius: 1.35, color: '#5a7a52' },
  { position: [0.6, 5.9, 0.5], radius: 1.1, color: '#66875c' },
  { position: [-0.8, 5.7, -0.6], radius: 1.0, color: '#41573d' },
]

const BRANCHES = [
  { position: [-0.7, 3.4, 0], rotation: [0, 0, 0.9], length: 1.8 },
  { position: [0.75, 3.7, 0.1], rotation: [0, 0.4, -0.8], length: 1.6 },
  { position: [0.1, 4.0, -0.6], rotation: [0.8, 0, 0.1], length: 1.4 },
]

export default function HeartTree({ swaying = true }) {
  const canopyRef = useRef()

  useFrame(({ clock }) => {
    if (!swaying || !canopyRef.current) return
    const t = clock.elapsedTime
    // Amplitude mínima: vento, não vendaval (design doc §9.2)
    canopyRef.current.rotation.z = Math.sin(t * 0.4) * 0.02
    canopyRef.current.rotation.x = Math.cos(t * 0.27) * 0.014
  })

  return (
    <group>
      {/* Tronco: cônico, levemente inclinado — árvores perfeitas não existem */}
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, 0.04]} castShadow>
        <cylinderGeometry args={[0.34, 0.78, 4.4, 9]} />
        <meshStandardMaterial color="#4a3a2a" flatShading roughness={0.95} />
      </mesh>

      {/* Raízes aparentes na base */}
      {[0, 1.3, 2.4, 3.8, 5.1].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.72, 0.12, Math.sin(angle) * 0.72]}
          rotation={[Math.PI / 2.4, angle, 0]}
        >
          <cylinderGeometry args={[0.09, 0.22, 0.9, 6]} />
          <meshStandardMaterial color="#41321f" flatShading roughness={1} />
        </mesh>
      ))}

      {/* Galhos principais */}
      {BRANCHES.map((b, i) => (
        <mesh key={i} position={b.position} rotation={b.rotation}>
          <cylinderGeometry args={[0.08, 0.18, b.length, 6]} />
          <meshStandardMaterial color="#4a3a2a" flatShading roughness={0.95} />
        </mesh>
      ))}

      {/* Copa: aglomerados icosaédricos, o grupo inteiro respira junto */}
      <group ref={canopyRef}>
        {CANOPY_CLUSTERS.map((c, i) => (
          <mesh key={i} position={c.position} castShadow>
            <icosahedronGeometry args={[c.radius, 1]} />
            <meshStandardMaterial color={c.color} flatShading roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
