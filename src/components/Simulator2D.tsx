import React, { useRef, useEffect } from 'react';
import { RobotState, SimulationEnvironment } from '../types/robot';

interface Simulator2DProps {
  robotState: RobotState | null;
  environment: SimulationEnvironment;
}

const Simulator2D: React.FC<Simulator2DProps> = ({ robotState, environment }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up coordinate system (center origin)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1); // Flip Y axis to match typical coordinate system

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = -canvas.width / 2; i < canvas.width / 2; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, -canvas.height / 2);
      ctx.lineTo(i, canvas.height / 2);
      ctx.stroke();
    }
    for (let i = -canvas.height / 2; i < canvas.height / 2; i += 20) {
      ctx.beginPath();
      ctx.moveTo(-canvas.width / 2, i);
      ctx.lineTo(canvas.width / 2, i);
      ctx.stroke();
    }

    // Draw colored areas
    environment.coloredAreas.forEach(area => {
      ctx.fillStyle = area.color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(area.x - area.width / 2, area.y - area.height / 2, area.width, area.height);
      ctx.globalAlpha = 1;
    });

    // Draw walls
    ctx.fillStyle = '#8b4513';
    environment.walls.forEach(wall => {
      ctx.fillRect(wall.x - wall.width / 2, wall.y - wall.height / 2, wall.width, wall.height);
    });

    // Draw obstacles
    ctx.fillStyle = '#666';
    environment.obstacles.forEach(obstacle => {
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw robot
    if (robotState) {
      ctx.save();
      ctx.translate(robotState.position.x, robotState.position.y);
      ctx.rotate(robotState.position.rotation);

      // Robot body
      ctx.fillStyle = '#ff6b35';
      ctx.fillRect(-15, -10, 30, 20);

      // Direction indicator
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(15, -2, 8, 4);

      // Ultrasonic sensor range (if close to obstacles)
      if (robotState.sensors.ultrasonic < 100) {
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, robotState.sensors.ultrasonic, -Math.PI / 6, Math.PI / 6);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
    }

    ctx.restore();
  }, [robotState, environment]);

  return (
    <div className="w-full h-full bg-white border border-gray-300">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full"
      />
    </div>
  );
};

export default Simulator2D;