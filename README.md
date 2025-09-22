# 3D Animation Project

A modern React application built with Three.js, react-three-fiber, and Tailwind CSS for creating stunning 3D animations and interactive experiences.

## 🚀 Features

- **React 18** with Vite for fast development
- **Three.js** via react-three-fiber for 3D graphics
- **Tailwind CSS** for modern styling
- **Animated 3D objects** with smooth transitions
- **Interactive camera controls** (orbit, zoom, pan)
- **Realistic lighting** and environment mapping

## 📦 Dependencies

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for react-three-fiber
- `three` - 3D graphics library
- `tailwindcss` - Utility-first CSS framework

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🎮 Controls

- **Mouse drag** - Rotate the camera around the scene
- **Mouse wheel** - Zoom in/out
- **Right-click + drag** - Pan the camera

## 📁 Project Structure

```
src/
├── components/
│   ├── Scene.jsx          # Main 3D scene component
│   ├── AnimatedBox.jsx    # Animated cube component
│   └── AnimatedSphere.jsx # Animated sphere component
├── App.jsx                # Main application component
├── index.css              # Tailwind CSS imports
└── main.jsx               # Application entry point
```

## 🎨 Customization

### Adding New 3D Objects

Create new components in the `src/components/` directory:

```jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function MyObject() {
  const meshRef = useRef()
  
  useFrame((state, delta) => {
    // Animation logic here
    meshRef.current.rotation.y += delta
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}
```

### Styling with Tailwind

The project uses Tailwind CSS for all styling. You can customize the UI overlay in `App.jsx`:

```jsx
<div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
  {/* Your UI content */}
</div>
```

## 🚀 Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📚 Learn More

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).# 3d-animation
# Animation
# Updated by Shamilakhan936
