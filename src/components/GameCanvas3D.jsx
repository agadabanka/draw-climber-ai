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
    }

    if (armRef.current) {
      armRef.current.rotation.z = character.armRotation || 0;
    }
  });

  const halfSize = character.size / 2;

  return (
    <group ref={cubeRef}>
      {/* Character cube - CYAN, STATIONARY */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[character.size, character.size, character.size]} />
        <meshStandardMaterial color="#00d9ff" />
      </mesh>

      {/* Rotating leg group */}
      <group ref={armRef}>
        {/* Attachment points at BOTTOM of cube (WHITE circles) */}
        <mesh position={[-8, -halfSize, 0]} castShadow>
          <sphereGeometry args={[6, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[8, -halfSize, 0]} castShadow>
          <sphereGeometry args={[6, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>

        {/* LEGS attached to bottom - BROWN color, thicker for visibility */}
        {legs && legs.length > 0 && legs.map((leg, i) => {
          const dx = leg.x2 - leg.x1;
          const dy = -(leg.y2 - leg.y1); // Flip Y for 3D
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          // Position leg segments
          const legCenterX = leg.x1 + (dx / 2);
          const legCenterY = -(leg.y1 + (leg.y2 - leg.y1) / 2);

          return (
            <mesh
              key={i}
              position={[legCenterX, legCenterY, 0]}
              rotation={[0, 0, angle - Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[5, 5, length, 8]} />
              <meshStandardMaterial
                color="#8B4513"
                emissive="#8B4513"
                emissiveIntensity={0.1}
              />
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
