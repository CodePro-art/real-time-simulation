import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Text } from '@react-three/drei';
import * as THREE from 'three';
import { RobotState, SimulationEnvironment } from '../types/robot';

interface Robot3DProps {
  robotState: RobotState | null;
}

const Robot3D: React.FC<Robot3DProps> = ({ robotState }) => {
  const robotRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (robotRef.current && robotState) {
      robotRef.current.position.set(
        robotState.position.x / 100, // Scale down for 3D view
        0.1,
        robotState.position.y / 100
      );
      robotRef.current.rotation.y = robotState.position.rotation;
    }
  });

  return (
    <group ref={robotRef}>
      {/* Robot body */}
      <Box args={[0.3, 0.2, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff6b35" />
      </Box>
      
      {/* Wheels */}
      <Box args={[0.05, 0.1, 0.1]} position={[-0.18, -0.05, 0.15]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.05, 0.1, 0.1]} position={[-0.18, -0.05, -0.15]}>
        <meshStandardMaterial color="#333" />
      </Box>
      
      {/* Ultrasonic sensor */}
      <Box args={[0.08, 0.06, 0.04]} position={[0.16, 0.02, 0]}>
        <meshStandardMaterial color="#4a90e2" />
      </Box>
      
      {/* Direction indicator */}
      <Box args={[0.02, 0.02, 0.1]} position={[0.16, 0.12, 0]}>
        <meshStandardMaterial color="#00ff00" />
      </Box>
    </group>
  );
};

interface Environment3DProps {
  environment: SimulationEnvironment;
}

const Environment3D: React.FC<Environment3DProps> = ({ environment }) => {
  return (
    <>
      {/* Ground */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>
      
      {/* Walls */}
      {environment.walls.map((wall, index) => (
        <Box
          key={`wall-${index}`}
          args={[wall.width / 100, 0.5, wall.height / 100]}
          position={[wall.x / 100, 0.25, wall.y / 100]}
        >
          <meshStandardMaterial color="#8b4513" />
        </Box>
      ))}
      
      {/* Colored areas */}
      {environment.coloredAreas.map((area, index) => (
        <Plane
          key={`area-${index}`}
          args={[area.width / 100, area.height / 100]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[area.x / 100, 0.01, area.y / 100]}
        >
          <meshStandardMaterial color={area.color} transparent opacity={0.7} />
        </Plane>
      ))}
      
      {/* Obstacles */}
      {environment.obstacles.map((obstacle, index) => (
        <Box
          key={`obstacle-${index}`}
          args={[obstacle.radius / 50, 0.3, obstacle.radius / 50]}
          position={[obstacle.x / 100, 0.15, obstacle.y / 100]}
        >
          <meshStandardMaterial color="#666" />
        </Box>
      ))}
    </>
  );
};

interface Simulator3DProps {
  robotState: RobotState | null;
  environment: SimulationEnvironment;
}

const Simulator3D: React.FC<Simulator3DProps> = ({ robotState, environment }) => {
  return (
    <div className="w-full h-full bg-gray-100">
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        <Robot3D robotState={robotState} />
        <Environment3D environment={environment} />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Grid helper */}
        <gridHelper args={[20, 20, '#ccc', '#ccc']} />
      </Canvas>
    </div>
  );
};

export default Simulator3D;