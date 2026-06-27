import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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

function VisibilityPause() {
  const { gl } = useThree()
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    containerRef.current = gl.domElement.parentElement
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        gl.domElement.style.display = entry.isIntersecting ? '' : 'none'
      },
      { threshold: 0 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [gl])

  return null
}

export default function MacBookScene() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="three-canvas-container">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" distance={15} />

        <Suspense fallback={<Loader />}>
          <MacBookModel />
          <Environment preset="night" />
        </Suspense>

        <VisibilityPause />
      </Canvas>
    </div>
  )
}
