
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Group, MathUtils } from 'three';

function Model({ hover, emotion = 'idle' }: { hover: boolean; emotion: string }) {
  const group = useRef<Group>(null);
  const [position, setPosition] = useState({ x: 0, y: -0.5, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  // Animation states
  useFrame((state) => {
    if (!group.current) return;
    
    // Different animations based on emotion
    if (emotion === 'wave') {
      // Waving animation
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3, 0.05);
      // Wave hand
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
    } else if (emotion === 'thinking') {
      // Thinking animation - slight head tilt and hand to chin
      group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1, 0.05);
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    } else {
      // Idle animation - breathing effect
      group.current.position.y = MathUtils.lerp(group.current.position.y, Math.sin(state.clock.getElapsedTime()) * 0.1 - 0.5, 0.05);
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1, 0.05);
    }
    
    // Hover effect
    if (hover) {
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, Math.PI / 4, 0.05);
    }
  });

  // Simple avatar representation (cube head and body)
  return (
    <group ref={group} position={[position.x, position.y, position.z]} rotation={[rotation.x, rotation.y, rotation.z]}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial color="#0c4a6e" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.15, 1.2, 0.36]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-0.15, 1.2, 0.36]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, 1, 0.36]} castShadow rotation={[0, 0, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 16, Math.PI]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.75, 0.2, 0]} castShadow rotation={[0, 0, emotion === 'wave' ? Math.sin(Date.now() * 0.01) * 0.5 : 0]}>
        <boxGeometry args={[0.25, 1, 0.25]} />
        <meshStandardMaterial color="#0c4a6e" />
      </mesh>
      <mesh position={[-0.75, 0.2, 0]} castShadow rotation={[0, 0, emotion === 'thinking' ? -0.5 : 0]}>
        <boxGeometry args={[0.25, 1, 0.25]} />
        <meshStandardMaterial color="#0c4a6e" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0.3, -1.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#0c4a6e" />
      </mesh>
      <mesh position={[-0.3, -1.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#0c4a6e" />
      </mesh>
    </group>
  );
}

export default function Avatar3D({ mode = 'idle' }: { mode?: 'idle' | 'wave' | 'thinking' }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      className="w-full h-80 max-w-xs mx-auto relative interactive"
      data-cursor-text="Interact with me!"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model hover={hovered} emotion={mode} />
        <Environment preset="city" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  );
}
