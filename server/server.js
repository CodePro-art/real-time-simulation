import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RobotSimulation } from './robotSimulation.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Create robot simulation instance
const robotSim = new RobotSimulation();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial robot state
  socket.emit('robotState', robotSim.getRobotState());
  socket.emit('log', {
    timestamp: Date.now(),
    level: 'info',
    message: 'Connected to robot simulation server'
  });

  // Handle robot commands
  socket.on('robotCommand', (command) => {
    console.log('Received command:', command);
    
    try {
      robotSim.executeCommand(command);
      
      // Send acknowledgment
      socket.emit('log', {
        timestamp: Date.now(),
        level: 'info',
        message: `Command executed: ${command.type}`,
        data: command
      });
    } catch (error) {
      socket.emit('log', {
        timestamp: Date.now(),
        level: 'error',
        message: `Command failed: ${error.message}`,
        data: { command, error: error.message }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Send robot state updates every 100ms
setInterval(() => {
  robotSim.update();
  io.emit('robotState', robotSim.getRobotState());
}, 100);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Robot simulation server running on port ${PORT}`);
});