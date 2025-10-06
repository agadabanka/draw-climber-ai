import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function useCheckeredTexture(colors = ['#FF6B35', '#FFD700']) {
  const texture = useRef();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const squareSize = 8;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? colors[0] : colors[1];
        ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    texture.current = tex;
  }, [colors]);

  return texture.current;
}

function Obstacle({ obstacle }) {
  const [texture, setTexture] = React.useState(null);

  React.useEffect(() => {
    // Create texture in useEffect to ensure it's created properly
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const squareSize = 8;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? '#FF6B35' : '#FFD700';
        ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    setTexture(tex);
  }, []);

  // Convert from screen coords (y-down) to 3D coords (y-up)
  const x = obstacle.x + obstacle.width / 2;
  const y = -(obstacle.y + obstacle.height / 2) + 300;
  const z = 0;

  return (
    <mesh
      position={[x, y, z]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[obstacle.width, obstacle.height, 100]} />
      {texture ? (
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.2}
        />
      ) : (
        <meshStandardMaterial color="#FF8C00" roughness={0.7} metalness={0.2} />
      )}
    </mesh>
  );
}

function Character({ character, legs }) {
  const cubeRef = useRef();
  const armRef = useRef();

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.position.x = character.x;
      cubeRef.current.position.y = -character.y + 300;
      cubeRef.current.position.z = 0;
      // Cube does NOT rotate!
    }

    if (armRef.current) {
      // Arm rotates around cube center
      armRef.current.rotation.z = character.armRotation || 0;
    }
  });

  const armLength = 40;

  return (
    <group ref={cubeRef}>
      {/* Character cube - STATIONARY, no rotation */}
      <mesh castShadow>
        <boxGeometry args={[character.size, character.size, character.size]} />
        <meshStandardMaterial color="#00d9ff" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Rotating arm group */}
      <group ref={armRef}>
        {/* Arm cylinder from center to tip - positioned along X axis */}
        <mesh position={[armLength / 2, 0, 5]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[4, 4, armLength, 16]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} metalness={0.3} emissive="#ff3300" emissiveIntensity={0.2} />
        </mesh>

        {/* Ball at arm tip for visibility */}
        <mesh position={[armLength, 0, 5]} castShadow>
          <sphereGeometry args={[6, 16, 16]} />
          <meshStandardMaterial color="#ff9900" roughness={0.4} metalness={0.4} />
        </mesh>

        {/* Legs attached to arm tip */}
        {legs && legs.map((leg, i) => {
          const start = new THREE.Vector3(leg.x1, -leg.y1, 0);
          const end = new THREE.Vector3(leg.x2, -leg.y2, 0);
          const direction = new THREE.Vector3().subVectors(end, start);
          const length = direction.length();
          const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

          // Calculate rotation to point cylinder from start to end
          const axis = new THREE.Vector3(0, 1, 0);
          const quaternion = new THREE.Quaternion().setFromUnitVectors(
            axis,
            direction.clone().normalize()
          );

          return (
            <mesh
              key={i}
              position={[midpoint.x, midpoint.y, 5]}
              quaternion={quaternion}
            >
              <cylinderGeometry args={[2, 2, length, 8]} />
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.3} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function Ground({ cameraX }) {
  const texture = useCheckeredTexture(['#3A5A7C', '#2C4A5E']);

  return (
    <mesh
      position={[cameraX + 400, -250, -50]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[2000, 200]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
      />
    </mesh>
  );
}

function Camera({ character }) {
  useFrame(({ camera }) => {
    // Racing game camera: behind and above the character
    const targetX = character.x - 150; // Behind the character
    const targetY = -character.y + 400; // High above
    const targetZ = 500; // Far back for perspective

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // Look ahead of the character
    camera.lookAt(character.x + 100, -character.y + 300, 0);
  });

  return null;
}

export function GameCanvas3D({ character, obstacles, legs, width = 800, height = 600 }) {
  const cameraX = Math.max(0, character.x - 200);

  return (
    <div style={{ width, height }} className="border-2 border-gray-700 rounded-lg overflow-hidden">
      <Canvas
        shadows
        camera={{
          position: [-50, 400, 500],
          fov: 60,
          near: 0.1,
          far: 3000
        }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[100, 200, 100]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[character.x, character.y + 100, 200]} intensity={0.5} />

        {/* Sky gradient effect */}
        <fog attach="fog" args={['#E0F6FF', 500, 1500]} />

        {/* Camera controller */}
        <Camera character={character} />

        {/* Ground */}
        <Ground cameraX={cameraX} />

        {/* Obstacles */}
        {obstacles.map((obs, i) => (
          <Obstacle key={i} obstacle={obs} />
        ))}

        {/* Character */}
        <Character character={character} legs={legs} />
      </Canvas>
    </div>
  );
}
