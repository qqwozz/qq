import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function MacBookModel() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}MacBook%20Ultra.glb`)
  const group = useRef<THREE.Group>(null!)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.3
  })

  return (
    <group ref={group} scale={1.8}>
      <primitive object={scene} />
    </group>
  )
}

function Loader() {
  return null
}

export default function MacBookScene() {
  return (
    <div className="three-canvas-container">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" distance={15} />

        <Suspense fallback={<Loader />}>
          <MacBookModel />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}
