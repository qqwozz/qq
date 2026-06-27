import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function MacBookModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF('/MacBook%20Ultra.glb')
  const group = useRef<THREE.Group>(null!)
  const targetRotation = useRef(0)
  const currentRotation = useRef(0)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])

  useFrame(() => {
    if (!group.current) return
    targetRotation.current = scrollProgress * Math.PI * 2
    currentRotation.current = THREE.MathUtils.lerp(
      currentRotation.current,
      targetRotation.current,
      0.08
    )
    group.current.rotation.y = currentRotation.current
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

function Loader() {
  return null
}

interface MacBookSceneProps {
  scrollProgress: number
}

export default function MacBookScene({ scrollProgress }: MacBookSceneProps) {
  return (
    <div className="three-canvas-container">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#ffffff" />
        <pointLight position={[0, 5, 0]} intensity={0.6} color="#ffffff" distance={15} />

        <Suspense fallback={<Loader />}>
          <MacBookModel scrollProgress={scrollProgress} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}
