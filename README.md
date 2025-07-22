# Real-Time Robot Simulation Platform

A comprehensive browser-based robot simulation platform modeled after [Open Roberta](https://lab.open-roberta.org), designed for EV3-like robots with real-time programming and simulation capabilities.

## 🚀 Features

### Core Functionality
- **2D & 3D Simulation Environment** using Three.js
- **Scratch-like Block Programming** with Blockly integration
- **Real-time WebSocket Communication** between frontend and backend
- **Live Sensor Monitoring** with realistic sensor simulation
- **Interactive Control Panel** with manual and programmatic control

### Robot Capabilities
- **Movement Control**: Forward, backward, rotation with realistic physics
- **Sensor Suite**: 
  - Ultrasonic distance sensor
  - Gyroscope with 3-axis readings
  - Color detection sensor
  - Touch/collision sensor
  - Motor rotation tracking
- **Battery Simulation**: Realistic power consumption
- **Collision Detection**: Walls, obstacles, and boundaries

### Programming Environment
- **Visual Block Editor**: Drag-and-drop programming interface
- **Real-time Code Execution**: Immediate feedback and execution
- **Command Queue System**: Sequential command processing
- **Error Handling**: Comprehensive error reporting and logging

### Monitoring & Debugging
- **Live Console Logs**: Real-time activity monitoring
- **Sensor Data Visualization**: Live sensor readings display
- **Connection Status**: WebSocket connection monitoring
- **Log Export**: Download session logs for analysis

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Three.js** via @react-three/fiber for 3D rendering
- **Blockly** for visual programming interface
- **Socket.IO Client** for real-time communication
- **Tailwind CSS** for modern, responsive UI

### Backend (Node.js + Express)
- **Express.js** server with CORS support
- **Socket.IO** for WebSocket communication
- **Robot Simulation Engine** with physics simulation
- **Command Processing System** with queue management
- **Environment Simulation** with obstacles and colored areas

### Key Components

#### Frontend Components
- `Simulator3D`: Three.js-based 3D robot visualization
- `Simulator2D`: Canvas-based 2D top-down view
- `BlocklyEditor`: Visual programming interface
- `SensorPanel`: Live sensor data display
- `LogPanel`: Real-time logging console
- `ControlPanel`: Manual and program control interface

#### Backend Systems
- `RobotSimulation`: Core simulation engine
- `Command Processing`: Sequential command execution
- `Sensor Simulation`: Realistic sensor behavior
- `Physics Engine`: Movement and collision detection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-time-simulation
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Start the development environment**
   ```bash
   npm run start:all
   ```

   This will start both:
   - Frontend development server on `http://localhost:5173`
   - Backend WebSocket server on `http://localhost:3001`

### Alternative: Start servers separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

## 🎮 Usage

### Programming the Robot

1. **Open the Block Editor tab**
2. **Drag blocks from the toolbox**:
   - Movement: Move forward, turn left/right, stop
   - Sensors: Ultrasonic distance, color detection
   - Logic: If/else conditions, comparisons
   - Loops: Repeat, while loops
   - Math: Numbers, arithmetic operations

3. **Connect blocks** to create your program
4. **Click "Run Program"** to execute

### Manual Control

1. **Enable Manual Control** in the Control Panel
2. **Use directional buttons** for immediate robot control
3. **Monitor sensor readings** in real-time

### Monitoring

- **2D/3D Views**: Watch robot movement and environment interaction
- **Sensor Panel**: Live readings from all sensors
- **Console Logs**: Detailed activity and error logs
- **Connection Status**: WebSocket connection health

## 🔧 Customization

### Environment Configuration

Modify the simulation environment in `src/App.tsx`:

```typescript
const environment: SimulationEnvironment = {
  walls: [
    { x: -200, y: -150, width: 400, height: 20 },
    // Add more walls...
  ],
  coloredAreas: [
    { x: -100, y: -50, width: 80, height: 80, color: '#ff0000' },
    // Add colored zones...
  ],
  obstacles: [
    { x: -50, y: 80, radius: 25 },
    // Add obstacles...
  ]
};
```

### Robot Parameters

Adjust robot behavior in `server/robotSimulation.js`:

```javascript
// Movement speed
const speed = 50; // pixels per second

// Sensor ranges
let minDistance = 300; // Maximum ultrasonic range

// Robot dimensions
const robotSize = 15; // Robot radius for collision detection
```

### Adding Custom Blocks

Extend the block library in `src/components/BlocklyEditor.tsx`:

```javascript
Blockly.Blocks['custom_block'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("custom action");
    // Block configuration...
  }
};
```

## 🔮 Future Enhancements

### Planned Features
- **Multi-Robot Simulation**: Support for multiple robots
- **Advanced Sensors**: Camera, microphone, GPS simulation
- **Custom Robot Definitions**: JSON-based robot configuration
- **Collaborative Programming**: Multi-user editing
- **AI Integration**: Smart error detection and suggestions
- **Mobile Support**: Touch-friendly interface

### Extensibility
- **Plugin System**: Custom sensor and actuator plugins
- **Environment Editor**: Visual environment design tools
- **Code Import/Export**: Save and share programs
- **Performance Analytics**: Execution time and efficiency metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Open Roberta](https://lab.open-roberta.org)
- Built with [React](https://reactjs.org/), [Three.js](https://threejs.org/), and [Blockly](https://developers.google.com/blockly)
- WebSocket communication powered by [Socket.IO](https://socket.io/)

---

**Happy Robot Programming! 🤖**