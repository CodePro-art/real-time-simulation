export interface RobotPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

export interface SensorData {
  ultrasonic: number;
  gyroscope: { x: number; y: number; z: number };
  touch: boolean;
  color: string;
  motorRotation: { left: number; right: number };
}

export interface RobotState {
  position: RobotPosition;
  sensors: SensorData;
  isMoving: boolean;
  battery: number;
  timestamp: number;
}

export interface RobotCommand {
  type: 'move' | 'rotate' | 'stop' | 'getSensors' | 'setMotor';
  payload?: any;
  id: string;
}

export interface RobotDefinition {
  name: string;
  ports: Record<string, 'motor' | 'ultrasonic' | 'touch' | 'color' | 'gyro'>;
  sensors: string[];
  dimensions: { width: number; height: number; length: number };
  maxSpeed: number;
}

export interface SimulationEnvironment {
  walls: Array<{ x: number; y: number; width: number; height: number }>;
  coloredAreas: Array<{ x: number; y: number; width: number; height: number; color: string }>;
  obstacles: Array<{ x: number; y: number; radius: number }>;
}