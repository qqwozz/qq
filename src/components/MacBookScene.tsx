import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function MacBookModel() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}MacBook%20Ultra.glb`)
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = false
        mesh.receiveShadow = false
      }
    })
  }, [scene])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y -= delta * 0.2
  })

  return (
    <group ref={group} scale={1.5} position={[0, -0.2, 0]}>
      <primitive object={scene} />
    </group>
  )
}

export default function MacBookScene() {
  return (
    <div className="macbook-scene">
      <Canvas
        camera={{ position: [0, 1.2, 3.5], fov: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-3, 4, -3]} intensity={0.4} />

        <Suspense fallback={null}>
          <MacBookModel />
        </Suspense>
      </Canvas>
    </div>
  )
}
