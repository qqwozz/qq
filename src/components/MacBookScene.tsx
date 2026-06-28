import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function MacBookModel() {
  const { scene, invalidate } = useThree()
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = false
        mesh.receiveShadow = false
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace
          mat.envMapIntensity = 0.5
        }
      }
    })
  }, [scene])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y -= delta * 0.25
    invalidate()
  })

  return (
    <group ref={group} scale={1.6} position={[0, -0.3, 0]}>
      <primitive object={scene} />
    </group>
  )
}

function VisibilityPause() {
  const { gl, invalidate } = useThree()
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    containerRef.current = gl.domElement.parentElement
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gl.domElement.style.display = ''
          invalidate()
        } else {
          gl.domElement.style.display = 'none'
        }
      },
      { threshold: 0 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [gl, invalidate])

  return null
}

export default function MacBookScene() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="three-canvas-container">
      <Canvas
        camera={{ position: [0, 1.2, 3.8], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.2]}
        frameloop="demand"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, 4, -3]} intensity={0.4} color="#ffffff" />

        <Suspense fallback={null}>
          <MacBookModel />
          <Environment preset="night" environmentIntensity={0.3} />
        </Suspense>

        <VisibilityPause />
      </Canvas>
    </div>
  )
}
