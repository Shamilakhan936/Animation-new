import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Import images from assets
import image1 from '../assets/1.jpeg'
import image2 from '../assets/2.jpeg'
import image3 from '../assets/3.jpeg'
import image4 from '../assets/4.jpeg'
import image5 from '../assets/5.jpeg'
import image7 from '../assets/7.jpeg'
import image8 from '../assets/8.jpeg'
import image9 from '../assets/9.jpeg'

// 3D Image Cube Component
function ImageCube({ image, position, scrollProgress, index }) {
  const meshRef = useRef()
  const texture = useTexture(image)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const intensity = 0.3 + scrollProgress * 0.7
      
      // Rotate the cube
      meshRef.current.rotation.x = time * 0.5 * intensity
      meshRef.current.rotation.y = time * 0.3 * intensity
      
      // Float up and down
      meshRef.current.position.y = position[1] + Math.sin(time + index) * 2 * intensity
      
      // Scale based on scroll
      meshRef.current.scale.setScalar(0.5 + scrollProgress * 0.5)
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[3, 3, 3]} />
      <meshBasicMaterial map={texture} transparent opacity={0.7 + scrollProgress * 0.3} />
    </mesh>
  )
}

// 3D Image Sphere Component
function ImageSphere({ image, position, scrollProgress, index }) {
  const meshRef = useRef()
  const texture = useTexture(image)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const intensity = 0.3 + scrollProgress * 0.7
      
      // Rotate the sphere
      meshRef.current.rotation.x = time * 0.4 * intensity
      meshRef.current.rotation.y = time * 0.6 * intensity
      
      // Orbit around center
      meshRef.current.position.x = position[0] + Math.cos(time + index) * 3 * intensity
      meshRef.current.position.z = position[2] + Math.sin(time + index) * 3 * intensity
      
      // Scale based on scroll
      meshRef.current.scale.setScalar(0.4 + scrollProgress * 0.6)
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial map={texture} transparent opacity={0.6 + scrollProgress * 0.4} />
    </mesh>
  )
}

// 3D Image Plane Component
function ImagePlane({ image, position, scrollProgress, index }) {
  const meshRef = useRef()
  const texture = useTexture(image)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const intensity = 0.3 + scrollProgress * 0.7
      
      // Rotate the plane
      meshRef.current.rotation.z = time * 0.2 * intensity
      
      // Move in wave pattern
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + index) * 1.5 * intensity
      meshRef.current.position.x = position[0] + Math.cos(time * 1.5 + index) * 2 * intensity
      
      // Scale based on scroll
      meshRef.current.scale.setScalar(0.6 + scrollProgress * 0.4)
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial map={texture} transparent opacity={0.5 + scrollProgress * 0.5} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Full Screen Image Component
function FullScreenImage({ image, scrollProgress, index, isActive }) {
  const meshRef = useRef()
  const texture = useTexture(image)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      
      if (isActive) {
        // Zoom in effect when active
        const zoomProgress = (scrollProgress - (index * 0.125)) * 8
        const clampedZoom = Math.min(Math.max(zoomProgress, 0), 1)
        
        // Scale from 0.5 to 8 for better visibility
        const scale = 0.5 + clampedZoom * 7.5
        meshRef.current.scale.setScalar(scale)
        
        // Fade in opacity - start visible earlier
        meshRef.current.material.opacity = Math.max(0.1, clampedZoom * 0.95)
        
        // Slight rotation for dynamic effect
        meshRef.current.rotation.z = time * 0.05 * clampedZoom
        
        // Position adjustment for better centering
        meshRef.current.position.z = -2 + clampedZoom * 2
      } else {
        // Hide when not active
        meshRef.current.scale.setScalar(0.1)
        meshRef.current.material.opacity = 0
        meshRef.current.position.z = -5
      }
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[20, 11.25]} />
      <meshBasicMaterial map={texture} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

// 3D Scene with sequential full screen images
function Image3DScene({ scrollProgress }) {
  const images = [image1, image2, image3, image4, image5, image7, image8, image9]
  
  return (
    <group>
      {/* Full screen images - one at a time */}
      {images.map((image, index) => {
        const imageStart = index * 0.125 // Each image gets 12.5% of scroll
        const imageEnd = (index + 1) * 0.125
        const isActive = scrollProgress >= imageStart && scrollProgress <= imageEnd
        
        return (
          <FullScreenImage
            key={`fullscreen-${index}`}
            image={image}
            scrollProgress={scrollProgress}
            index={index}
            isActive={isActive}
          />
        )
      })}
    </group>
  )
}

// Dynamic Camera Component
function DynamicCamera({ scrollProgress }) {
  const cameraRef = useRef()
  
  useFrame(() => {
    if (cameraRef.current) {
      // Camera moves closer as you scroll for zoom effect
      const zoomDistance = 15 - (scrollProgress * 10) // Move from 15 to 5
      cameraRef.current.position.z = Math.max(zoomDistance, 5)
      
      // Slight camera movement for dynamic effect
      cameraRef.current.position.x = Math.sin(scrollProgress * Math.PI * 2) * 0.3
      cameraRef.current.position.y = Math.cos(scrollProgress * Math.PI * 2) * 0.2
      
      // Look at the center
      cameraRef.current.lookAt(0, 0, 0)
    }
  })
  
  return <perspectiveCamera ref={cameraRef} position={[0, 0, 15]} fov={60} />
}

// 3D Image Display Component
function ImageDisplay({ scrollProgress }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 5 }}>
      <Canvas>
        {/* Dynamic Camera */}
        <DynamicCamera scrollProgress={scrollProgress} />
        
        {/* Lighting */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[0, 0, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[0, 0, 5]} intensity={1.0} color="#ffffff" />
        
        {/* 3D Image Scene */}
        <Image3DScene scrollProgress={scrollProgress} />
      </Canvas>
      
      {/* Simple overlay for text readability */}
      <div 
        className="absolute inset-0 bg-black/5"
        style={{ zIndex: 10 }}
      />
    </div>
  )
}

// Static Background Scene - No animations
function HeroScene({ scrollProgress }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900/50 via-slate-800/30 to-slate-900/50" style={{ zIndex: 1 }}>
      {/* Static stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          ></div>
        ))}
      </div>
    </div>
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
      {/* Dynamic Image Background */}
      <div className="fixed inset-0 w-full h-screen">
        <ImageDisplay scrollProgress={scrollProgress} />
        
        {/* Stars overlay */}
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
        
        {/* Geometric Shapes overlay */}
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
        
        {/* Ground plane overlay */}
        <div 
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800 to-transparent opacity-30"
        ></div>
      </div>
      
      {/* Static Background Scene */}
      <div className="fixed inset-0 w-full h-screen" style={{ zIndex: 1 }}>
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
