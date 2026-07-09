import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Trail } from '@react-three/drei'
import HeartTree from './HeartTree'

/**
 * O Limiar das Crônicas — a cena do herói, sob a Noite Arcana.
 *
 * Regras de produção:
 * - 2 luzes reais no máximo (lua dourada + chama da fênix nos portões).
 * - ≤ 40 partículas: um vagalume é magia, mil são ruído.
 * - DPR limitado a 1.75; sem pós-processamento.
 * - Com movimento reduzido: frameloop "demand" = um único quadro parado.
 */

// --- As pedras dos legados, à beira do caminho ---
const STONES = [
  { position: [-3.4, 0.35, 2.6], scale: 0.55, rotation: 0.4 },
  { position: [-2.2, 0.3, 3.6], scale: 0.45, rotation: 1.7 },
  { position: [2.6, 0.4, 3.0], scale: 0.6, rotation: 2.9 },
  { position: [3.8, 0.3, 1.8], scale: 0.42, rotation: 0.9 },
  // A pedra vazia, ainda não esculpida: o próximo legado
  { position: [4.6, 0.45, 3.4], scale: 0.62, rotation: 2.1, empty: true },
]

function Stones() {
  return (
    <group>
      {STONES.map((s, i) => (
        <mesh key={i} position={s.position} rotation={[0, s.rotation, 0]} scale={s.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={s.empty ? '#7d7590' : '#6f6880'}
            flatShading
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- A lanterna dos Portões: a única chama aberta — o contato ---
function Lantern() {
  return (
    <group position={[3.1, 0, 2.4]}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1.1, 5]} />
        <meshStandardMaterial color="#4d3a63" roughness={1} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial
          color="#f4de9f"
          emissive="#e0762f"
          emissiveIntensity={2.4}
        />
      </mesh>
      <pointLight
        position={[0, 1.05, 0]}
        color="#e0762f"
        intensity={4}
        distance={7}
        decay={2}
      />
    </group>
  )
}

/**
 * A Fênix — um cometa dourado que circula a copa da árvore.
 * O símbolo do renascimento sobrevoa tudo; a trilha de luz é a
 * assinatura dela no céu.
 */
function Phoenix({ animated }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!animated || !ref.current) return
    const t = clock.elapsedTime * 0.32
    ref.current.position.set(
      Math.cos(t) * 4.8,
      6.3 + Math.sin(t * 2.3) * 0.55,
      Math.sin(t) * 4.8,
    )
  })

  const body = (
    <mesh ref={ref} position={[4.8, 6.3, 0]}>
      <sphereGeometry args={[0.13, 8, 8]} />
      <meshStandardMaterial color="#f4de9f" emissive="#e0762f" emissiveIntensity={3} />
    </mesh>
  )

  if (!animated) return body

  return (
    <Trail width={2.4} length={5.5} color="#e8a04b" attenuation={(w) => w * w}>
      {body}
    </Trail>
  )
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[24, 40]} />
        <meshStandardMaterial color="#171126" roughness={1} />
      </mesh>
      {/* O caminho gasto que atravessa o limiar e chega à árvore */}
      <mesh rotation={[-Math.PI / 2, 0, 0.25]} position={[0.6, 0.01, 4]}>
        <planeGeometry args={[1.6, 12]} />
        <meshStandardMaterial color="#241a34" roughness={1} />
      </mesh>
    </group>
  )
}

/**
 * Câmera nos trilhos: paralaxe suave guiada pelo cursor.
 * O visitante escolhe para onde olhar; a câmera decide como.
 */
function CameraRig({ active }) {
  useFrame((state, delta) => {
    if (!active) return
    const damp = Math.min(delta * 2, 1)
    const targetX = state.pointer.x * 0.7
    const targetY = 2.3 + state.pointer.y * 0.35
    state.camera.position.x += (targetX - state.camera.position.x) * damp
    state.camera.position.y += (targetY - state.camera.position.y) * damp
    state.camera.lookAt(0, 2.6, 0)
  })
  return null
}

export default function GroveScene({ reducedMotion = false, onReady }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      camera={{ position: [0, 2.3, 9.5], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      {/* Fundo e névoa na mesma cor: o mundo se dissolve na Noite Arcana */}
      <color attach="background" args={['#120c1d']} />
      <fog attach="fog" args={['#120c1d', 9, 26]} />

      {/* Lua dourada baixa atrás da árvore: caminha-se em direção à luz */}
      <hemisphereLight args={['#3a2f52', '#120c1d', 0.75]} />
      <directionalLight position={[-6, 8, -5]} color="#f4de9f" intensity={1.5} />

      <HeartTree swaying={!reducedMotion} />
      <Ground />
      <Stones />
      <Lantern />
      <Phoenix animated={!reducedMotion} />

      {/* Vagalumes dourados: só perto da árvore — o saber atrai a luz */}
      <Sparkles
        count={36}
        color="#f4de9f"
        size={2.6}
        speed={reducedMotion ? 0 : 0.25}
        opacity={0.7}
        scale={[7, 5, 7]}
        position={[0, 3.6, 0]}
      />

      <CameraRig active={!reducedMotion} />
    </Canvas>
  )
}
