import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TopographicGrid() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(36, 24, 48, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.35) * Math.cos(y * 0.35) * 0.65;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave = Math.sin(x * 0.3 + t * 0.4) * Math.cos(y * 0.3 + t * 0.3) * 0.6;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    meshRef.current.rotation.z = pointer.x * 0.05;
    meshRef.current.rotation.x = -Math.PI / 2.6 + pointer.y * 0.04;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -3.2, -4]} rotation={[-Math.PI / 2.6, 0, 0]}>
      <meshBasicMaterial color="#2D4236" wireframe transparent opacity={0.32} />
    </mesh>
  );
}

function TacticalRadarEmblem() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25 + pointer.x * 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.15 + pointer.y * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -t * 0.4;
      innerRef.current.rotation.x = t * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[3.5, 0.8, -2]}>
      <mesh>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.14} />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshBasicMaterial color="#4A6B58" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.23, 64]} />
        <meshBasicMaterial color="#D4AF37" side={THREE.DoubleSide} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function TacticalParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#D4AF37" transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

export default function TacticalScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#090C0A', 5, 16]} />
        <TopographicGrid />
        <TacticalRadarEmblem />
        <TacticalParticles />
      </Canvas>
    </div>
  );
}
