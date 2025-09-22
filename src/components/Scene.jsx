import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import AnimatedBox from './AnimatedBox'
import AnimatedSphere from './AnimatedSphere'

function Scene() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <directionalLight position={[-5, 5, 5]} intensity={0.5} />
          
          <AnimatedBox position={[-2, 0, 0]} color="hotpink" />
          <AnimatedSphere position={[2, 0, 0]} color="lightblue" />
          
          <mesh position={[0, -2, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="gray" />
          </mesh>
            
          <Environment preset="sunset" />
          
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Scene
