import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Sky Snowfall - Snow falling as you scroll through the sky
function SkySnowfall({ scrollProgress }) {
  const snowRef = useRef()
  const snowCount = 20000
  
  const snowParticles = useMemo(() => {
    const positions = new Float32Array(snowCount * 3)
    const velocities = new Float32Array(snowCount * 3)
    const sizes = new Float32Array(snowCount)
    
    for (let i = 0; i < snowCount; i++) {
      const i3 = i * 3
      // Fill the entire sky with snow particles
      positions[i3] = (Math.random() - 0.5) * 800  // Very wide spread
      positions[i3 + 1] = Math.random() * 400 + 50 // From ground to high sky
      positions[i3 + 2] = (Math.random() - 0.5) * 800 // Deep volume
      
      // Natural snow fall
      velocities[i3] = (Math.random() - 0.5) * 1.5  
      velocities[i3 + 1] = -Math.random() * 2.0 - 1.0 
      velocities[i3 + 2] = (Math.random() - 0.5) * 1.5 
      
      // Varied snowflake sizes
      sizes[i] = Math.random() * 1.0 + 0.3
    }
    
    return { positions, velocities, sizes }
  }, [])
  
  useFrame((state) => {
    if (snowRef.current) {
      const positions = snowRef.current.geometry.attributes.position.array
      const time = state.clock.elapsedTime
      
      // Snow intensity based on scroll
      const snowIntensity = Math.max(0.3, scrollProgress * 1.5)
      
      for (let i = 0; i < snowCount; i++) {
        const i3 = i * 3
        
        // Wind effects
        const windStrength = Math.sin(time * 0.5 + positions[i3] * 0.001) * 0.2 * snowIntensity
        const altitudeFactor = positions[i3 + 1] / 300
        const turbulence = Math.sin(time * 0.8 + positions[i3 + 2] * 0.002) * 0.1 * snowIntensity
        
        // Snow movement
        positions[i3] += (windStrength * altitudeFactor + turbulence) * snowIntensity
        positions[i3 + 1] += snowParticles.velocities[i3 + 1] * snowIntensity
        positions[i3 + 2] += (snowParticles.velocities[i3 + 2] + windStrength * 0.5) * snowIntensity
        
        // Reset particles that fall below ground
        if (positions[i3 + 1] < -20) {
          positions[i3] = (Math.random() - 0.5) * 800
          positions[i3 + 1] = Math.random() * 200 + 350 // Reset high in sky
          positions[i3 + 2] = (Math.random() - 0.5) * 800
        }
      }
      
      snowRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={snowCount}
          array={snowParticles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={snowCount}
          array={snowParticles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.8}
        transparent
        opacity={scrollProgress > 0 ? Math.min(scrollProgress * 2, 1) : 0.2} // More visible snow
        sizeAttenuation
        vertexColors={false}
      />
    </points>
  )
}

// Northern Lights - Only appears when scrolling
function EpicNorthernLights({ scrollProgress }) {
  const lightsRef = useRef()
  
  useFrame((state) => {
    if (lightsRef.current) {
      const time = state.clock.elapsedTime
      const intensity = Math.pow(scrollProgress, 2) * 4
      
      // Only animate when scrolling
      if (intensity > 0) {
        lightsRef.current.rotation.y = time * 0.4 * intensity
        lightsRef.current.position.y = Math.sin(time * 0.8) * 5 * intensity
        lightsRef.current.position.x = Math.sin(time * 0.6) * 4 * intensity
        lightsRef.current.rotation.z = Math.sin(time * 0.3) * 0.1 * intensity
      }
    }
  })
  
  return (
    <group ref={lightsRef}>
      {/* Aurora layers - shimmer in the sky */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[0, 20 + i * 5, -25]} rotation={[0, 0, 0]}>
          <planeGeometry args={[80, 25]} />
          <meshBasicMaterial
            color={i % 4 === 0 ? "#00ff88" : i % 4 === 1 ? "#0088ff" : i % 4 === 2 ? "#ff0088" : "#ffff00"}
            transparent
            opacity={scrollProgress > 0 ? Math.min(scrollProgress * 2, (0.4 + i * 0.1)) : 0} // Shimmer effect
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// Wind Swirl Effects - Only appears when scrolling
function EpicWindSwirls({ scrollProgress }) {
  const swirlsRef = useRef()
  
  useFrame((state) => {
    if (swirlsRef.current) {
      const time = state.clock.elapsedTime
      const intensity = Math.pow(scrollProgress, 3) * 4
      
      // Only animate when scrolling
      if (intensity > 0) {
      swirlsRef.current.children.forEach((swirl, i) => {
          swirl.rotation.z = time * (2.0 + i * 0.5) * intensity
          swirl.position.x = Math.sin(time * 0.8 + i) * 12 * intensity
          swirl.position.y = Math.cos(time * 0.6 + i) * 6 * intensity
          swirl.position.z = -15 + scrollProgress * 30
          swirl.rotation.x = Math.sin(time * 0.4 + i) * 0.2 * intensity
          swirl.rotation.y = Math.cos(time * 0.3 + i) * 0.1 * intensity
        })
      }
    }
  })
  
  return (
    <group ref={swirlsRef}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -15]} rotation={[0, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#4A9B8E" : i % 3 === 1 ? "#0088ff" : "#ff0088"}
            transparent
            opacity={scrollProgress > 0 ? Math.min(scrollProgress * 1.5, (0.2 + i * 0.05)) : 0} // Creates motion and depth
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// Tundra Landscape - Wind pulls through this
function TundraLandscape({ scrollProgress }) {
  const landscapeRef = useRef()
  
  useFrame((state) => {
    if (landscapeRef.current) {
      const time = state.clock.elapsedTime
      const windEffect = scrollProgress * 0.5
      
      // Landscape moves with wind - creates sense of entering mysterious world
      landscapeRef.current.position.z = -20 + scrollProgress * 60
      landscapeRef.current.rotation.y = Math.sin(time * 0.1) * 0.1 * windEffect
    }
  })
  
  return (
    <group ref={landscapeRef}>
      {/* Distant mountains */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[i * 8 - 44, -5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[4, 15, 8]} />
          <meshBasicMaterial color="#2D3748" transparent opacity={0.7} />
        </mesh>
      ))}
      
      {/* Snow caps */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[i * 8 - 44, 10, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[3, 5, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
        </mesh>
      ))}
      
      {/* Ground plane */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 100]} />
        <meshBasicMaterial color="#1A202C" />
      </mesh>
    </group>
  )
}

// Sky Scroll Camera - Camera moves through sky based on scroll
function SkyScrollCamera({ scrollProgress }) {
  const cameraRef = useRef()
  
  useFrame((state) => {
    if (cameraRef.current) {
      const time = state.clock.elapsedTime
      
      // Camera movement based on scroll progress
      const scrollDistance = scrollProgress * 100 // Total distance to travel
      const skyHeight = 20 + scrollProgress * 30 // Height in the sky
      
      // Gentle wind effects
      const windSway = Math.sin(time * 0.2) * 1 * scrollProgress
      const windPitch = Math.sin(time * 0.15) * 0.05 * scrollProgress
      
      // Camera position - moves forward through sky based on scroll
      cameraRef.current.position.z = 5 + scrollDistance
      cameraRef.current.position.x = windSway
      cameraRef.current.position.y = skyHeight
      
      // Subtle camera rotation from wind
      cameraRef.current.rotation.z = windSway * 0.01
      cameraRef.current.rotation.x = windPitch
      
      // Look forward through the sky
      cameraRef.current.lookAt(windSway, skyHeight - 5, cameraRef.current.position.z + 20)
    }
  })
  
  return <perspectiveCamera ref={cameraRef} position={[0, 20, 5]} fov={70} />
}

// Sky Scroll Scene - Scrolling through the sky with snow falling
function SkyScrollScene({ scrollProgress }) {
  return (
    <group>
      {/* Tundra Landscape - Far below */}
      <TundraLandscape scrollProgress={scrollProgress} />
      
      {/* Sky Snowfall - Snow falling all around */}
      <SkySnowfall scrollProgress={scrollProgress} />
      
      {/* Epic Northern Lights - Above */}
      <EpicNorthernLights scrollProgress={scrollProgress} />
      
      {/* Epic Wind Swirls - Around the scroll path */}
      <EpicWindSwirls scrollProgress={scrollProgress} />
      
      {/* Sky starfield for depth */}
      {Array.from({ length: 500 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 600,
            Math.random() * 300 + 150,
            (Math.random() - 0.5) * 600
          ]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}


function HeroScene({ scrollProgress }) {
  return (
    <Canvas camera={{ position: [0, 20, 5], fov: 70 }}>
      <SkyScrollCamera scrollProgress={scrollProgress} />
      
      {/* Sky lighting - atmospheric and dramatic */}
      <ambientLight intensity={0.15 + scrollProgress * 0.25} />
      <pointLight position={[0, 60, 25]} intensity={0.9 + scrollProgress * 1.2} color="#4A9B8E" />
      <pointLight position={[-40, 30, 20]} intensity={0.7 + scrollProgress * 1.0} color="#0088ff" />
      <pointLight position={[40, 30, 20]} intensity={0.7 + scrollProgress * 1.0} color="#ff0088" />
      <pointLight position={[0, 100, 0]} intensity={0.5 + scrollProgress * 0.8} color="#ffff00" />
      <directionalLight position={[0, 120, 60]} intensity={0.4 + scrollProgress * 0.6} color="#E0F2FE" />
      
      {/* Sky Scroll Scene */}
      <SkyScrollScene scrollProgress={scrollProgress} />
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  )
}

function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      // Make hero section 5x the viewport height for extended scroll
      const heroHeight = window.innerHeight * 5
      const progress = Math.min(scrollTop / heroHeight, 1)
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Get current section based on scroll progress
  const getCurrentSection = () => {
    if (scrollProgress < 0.2) return 'arctic-birth'
    if (scrollProgress < 0.4) return 'arctic-winds'
    if (scrollProgress < 0.6) return 'world-stages'
    if (scrollProgress < 0.8) return 'legacy'
    return 'journey'
  }
  
  const currentSection = getCurrentSection()
  
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '500vh' }}>
      {/* Simple Background like the image */}
      <div className="fixed inset-0 w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Geometric Shapes like in the image */}
      <div className="absolute inset-0">
          {/* Light blue trapezoid from top-left */}
          <div 
            className="absolute w-96 h-96 opacity-20"
            style={{
              background: 'linear-gradient(135deg, #4A9B8E, #0088ff)',
              clipPath: 'polygon(0% 0%, 60% 0%, 40% 100%, 0% 100%)',
              top: '-10%',
              left: '-10%',
              transform: 'rotate(-15deg)'
            }}
          ></div>
          
          {/* Purple/magenta shape from top-right */}
          <div 
            className="absolute w-80 h-80 opacity-15"
            style={{
              background: 'linear-gradient(225deg, #ff0088, #7C3AED)',
              clipPath: 'polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)',
              top: '-5%',
              right: '-5%',
              transform: 'rotate(15deg)'
            }}
          ></div>
        </div>
        
        {/* Ground plane like in the image */}
        <div 
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800 to-transparent opacity-30"
        ></div>
      </div>
      
      {/* 3D Background Scene - Only visible when scrolling */}
      <div className="fixed inset-0 w-full h-screen" style={{ 
        opacity: scrollProgress > 0 ? Math.min(scrollProgress * 3, 1) : 0, 
        transition: 'opacity 0.3s ease' 
      }}>
        <HeroScene scrollProgress={scrollProgress} />
      </div>
      
      {/* Fixed Main Content */}
      <div className="fixed top-0 left-0 w-full h-screen z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Dynamic Content based on scroll progress */}
        {currentSection === 'arctic-birth' && (
          <>
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">BORN IN THE</span>
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mt-2">NORTH</span>
              </h1>
            </div>
            <div className="mb-16">
              <p className="text-gray-300 text-lg md:text-xl tracking-wide">
                Raised by the Winds
              </p>
            </div>
          </>
        )}
        
        {currentSection === 'arctic-winds' && (
          <>
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">ARCTIC WINDS</span>
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mt-2">BLOW STRONG</span>
              </h1>
            </div>
            <div className="mb-16">
              <p className="text-gray-300 text-lg md:text-xl tracking-wide">
                The Spirit of the North Awakens
              </p>
            </div>
          </>
        )}
        
        {currentSection === 'world-stages' && (
          <>
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">TO THE WORLD'S</span>
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mt-2">STAGES</span>
              </h1>
            </div>
            <div className="mb-16">
              <p className="text-gray-300 text-lg md:text-xl tracking-wide">
                From Arctic Winds to Global Dreams
              </p>
            </div>
          </>
        )}
        
        {currentSection === 'legacy' && (
          <>
        <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">A LEGACY</span>
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mt-2">BORN</span>
          </h1>
        </div>
            <div className="mb-16">
              <p className="text-gray-300 text-lg md:text-xl tracking-wide">
                Every Performance Carries Arctic Strength
              </p>
            </div>
          </>
        )}
        
        {currentSection === 'journey' && (
          <>
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">THE JOURNEY</span>
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mt-2">CONTINUES</span>
              </h1>
            </div>
        <div className="mb-16">
              <p className="text-gray-300 text-lg md:text-xl tracking-wide">
                From Frozen Peaks to Brightest Lights
          </p>
        </div>
          </>
        )}
        
        {/* Scroll Indicator */}
        <div className="relative">
          <p className="text-gray-300 text-sm md:text-base tracking-wide">
            SCROLL TO EXPLORE
          </p>
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 border border-gray-300 rounded-full scroll-indicator"></div>
          </div>
        </div>
      </div>
      
      {/* Progress Indicator */}
      <div className="fixed top-8 right-8 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="text-sm font-semibold mb-2 text-teal-400">
            {currentSection.replace('-', ' ').toUpperCase()}
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
        ></div>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {Math.round(scrollProgress * 100)}% through the journey
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
