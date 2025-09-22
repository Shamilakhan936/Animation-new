import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function AnimatedSphere({ position = [0, 0, 0], color = 'lightgreen' }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.z += delta * 0.2
      meshRef.current.position.x = Math.cos(state.clock.elapsedTime) * 2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default AnimatedSphere
