export class RobotSimulation {
  constructor() {
    this.robot = {
      position: { x: 0, y: 0, z: 0, rotation: 0 },
      velocity: { x: 0, y: 0, angular: 0 },
      sensors: {
        ultrasonic: 100,
        gyroscope: { x: 0, y: 0, z: 0 },
        touch: false,
        color: '#ffffff',
        motorRotation: { left: 0, right: 0 }
      },
      isMoving: false,
      battery: 100,
      timestamp: Date.now()
    };

    this.environment = {
      walls: [
        { x: -200, y: -150, width: 400, height: 20 },
        { x: -200, y: 150, width: 400, height: 20 },
        { x: -200, y: 0, width: 20, height: 300 },
        { x: 200, y: 0, width: 20, height: 300 },
      ],
      coloredAreas: [
        { x: -100, y: -50, width: 80, height: 80, color: '#ff0000' },
        { x: 100, y: 50, width: 60, height: 60, color: '#00ff00' },
        { x: 0, y: 0, width: 40, height: 40, color: '#0000ff' },
      ],
      obstacles: [
        { x: -50, y: 80, radius: 25 },
        { x: 80, y: -80, radius: 30 },
      ]
    };

    this.commandQueue = [];
    this.currentCommand = null;
    this.commandStartTime = 0;
  }

  executeCommand(command) {
    switch (command.type) {
      case 'move':
        this.handleMoveCommand(command);
        break;
      case 'rotate':
        this.handleRotateCommand(command);
        break;
      case 'stop':
        this.handleStopCommand();
        break;
      case 'getSensors':
        // Sensors are updated automatically
        break;
      default:
        throw new Error(`Unknown command type: ${command.type}`);
    }
  }

  handleMoveCommand(command) {
    if (command.payload?.reset) {
      this.robot.position = { x: 0, y: 0, z: 0, rotation: 0 };
      this.robot.velocity = { x: 0, y: 0, angular: 0 };
      this.robot.isMoving = false;
      return;
    }

    const { direction = 'forward', distance = 100 } = command.payload || {};
    const speed = 50; // pixels per second
    const duration = (distance / speed) * 1000; // milliseconds

    this.currentCommand = {
      type: 'move',
      direction,
      distance,
      duration,
      startTime: Date.now()
    };

    // Set velocity based on direction
    const angle = this.robot.position.rotation;
    const multiplier = direction === 'forward' ? 1 : -1;
    
    this.robot.velocity.x = Math.cos(angle) * speed * multiplier;
    this.robot.velocity.y = Math.sin(angle) * speed * multiplier;
    this.robot.isMoving = true;
  }

  handleRotateCommand(command) {
    const { direction = 'left', angle = 90 } = command.payload || {};
    const angularSpeed = Math.PI; // radians per second
    const targetAngle = (angle * Math.PI) / 180; // convert to radians
    const duration = (targetAngle / angularSpeed) * 1000; // milliseconds

    this.currentCommand = {
      type: 'rotate',
      direction,
      angle: targetAngle,
      duration,
      startTime: Date.now()
    };

    const multiplier = direction === 'left' ? 1 : -1;
    this.robot.velocity.angular = angularSpeed * multiplier;
    this.robot.isMoving = true;
  }

  handleStopCommand() {
    this.robot.velocity = { x: 0, y: 0, angular: 0 };
    this.robot.isMoving = false;
    this.currentCommand = null;
  }

  update() {
    const now = Date.now();
    const deltaTime = 0.1; // 100ms update interval

    // Update robot position based on velocity
    this.robot.position.x += this.robot.velocity.x * deltaTime;
    this.robot.position.y += this.robot.velocity.y * deltaTime;
    this.robot.position.rotation += this.robot.velocity.angular * deltaTime;

    // Keep rotation in 0-2π range
    this.robot.position.rotation = this.robot.position.rotation % (2 * Math.PI);
    if (this.robot.position.rotation < 0) {
      this.robot.position.rotation += 2 * Math.PI;
    }

    // Check if current command is complete
    if (this.currentCommand) {
      const elapsed = now - this.currentCommand.startTime;
      if (elapsed >= this.currentCommand.duration) {
        this.handleStopCommand();
      }
    }

    // Update sensors
    this.updateSensors();

    // Update motor rotations (simulate wheel rotation)
    if (this.robot.isMoving) {
      const speed = Math.sqrt(this.robot.velocity.x ** 2 + this.robot.velocity.y ** 2);
      this.robot.sensors.motorRotation.left += speed * deltaTime * 2;
      this.robot.sensors.motorRotation.right += speed * deltaTime * 2;
    }

    // Simulate battery drain
    if (this.robot.isMoving) {
      this.robot.battery = Math.max(0, this.robot.battery - 0.01);
    }

    this.robot.timestamp = now;
  }

  updateSensors() {
    // Update ultrasonic sensor (distance to nearest obstacle)
    this.robot.sensors.ultrasonic = this.calculateUltrasonicDistance();
    
    // Update gyroscope (simulate some noise)
    this.robot.sensors.gyroscope = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: this.robot.position.rotation * (180 / Math.PI) + (Math.random() - 0.5) * 5
    };

    // Update color sensor
    this.robot.sensors.color = this.detectColor();

    // Update touch sensor (collision detection)
    this.robot.sensors.touch = this.detectCollision();
  }

  calculateUltrasonicDistance() {
    const robotX = this.robot.position.x;
    const robotY = this.robot.position.y;
    const robotAngle = this.robot.position.rotation;
    
    let minDistance = 300; // Maximum sensor range

    // Check distance to walls
    this.environment.walls.forEach(wall => {
      const distance = this.distanceToRectangle(robotX, robotY, wall);
      if (distance < minDistance) {
        minDistance = distance;
      }
    });

    // Check distance to obstacles
    this.environment.obstacles.forEach(obstacle => {
      const distance = Math.sqrt(
        (robotX - obstacle.x) ** 2 + (robotY - obstacle.y) ** 2
      ) - obstacle.radius;
      if (distance < minDistance && distance > 0) {
        minDistance = distance;
      }
    });

    return Math.max(5, minDistance); // Minimum reading of 5cm
  }

  distanceToRectangle(px, py, rect) {
    const dx = Math.max(rect.x - rect.width/2 - px, 0, px - (rect.x + rect.width/2));
    const dy = Math.max(rect.y - rect.height/2 - py, 0, py - (rect.y + rect.height/2));
    return Math.sqrt(dx * dx + dy * dy);
  }

  detectColor() {
    const robotX = this.robot.position.x;
    const robotY = this.robot.position.y;

    // Check if robot is over any colored area
    for (const area of this.environment.coloredAreas) {
      if (
        robotX >= area.x - area.width / 2 &&
        robotX <= area.x + area.width / 2 &&
        robotY >= area.y - area.height / 2 &&
        robotY <= area.y + area.height / 2
      ) {
        return area.color;
      }
    }

    return '#ffffff'; // White (no color detected)
  }

  detectCollision() {
    const robotX = this.robot.position.x;
    const robotY = this.robot.position.y;
    const robotSize = 15; // Robot radius

    // Check collision with walls
    for (const wall of this.environment.walls) {
      if (
        robotX + robotSize >= wall.x - wall.width / 2 &&
        robotX - robotSize <= wall.x + wall.width / 2 &&
        robotY + robotSize >= wall.y - wall.height / 2 &&
        robotY - robotSize <= wall.y + wall.height / 2
      ) {
        return true;
      }
    }

    // Check collision with obstacles
    for (const obstacle of this.environment.obstacles) {
      const distance = Math.sqrt(
        (robotX - obstacle.x) ** 2 + (robotY - obstacle.y) ** 2
      );
      if (distance <= obstacle.radius + robotSize) {
        return true;
      }
    }

    return false;
  }

  getRobotState() {
    return { ...this.robot };
  }
}