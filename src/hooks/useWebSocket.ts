import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketMessage, LogEntry } from '../types/websocket';
import { RobotState, RobotCommand } from '../types/robot';

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  robotState: RobotState | null;
  logs: LogEntry[];
  sendCommand: (command: RobotCommand) => void;
  clearLogs: () => void;
}

export const useWebSocket = (url: string = 'http://localhost:3001'): UseWebSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [robotState, setRobotState] = useState<RobotState | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const addLog = useCallback((entry: LogEntry) => {
    setLogs(prev => [...prev.slice(-99), entry]); // Keep last 100 logs
  }, []);

  const sendCommand = useCallback((command: RobotCommand) => {
    if (socket && isConnected) {
      socket.emit('robotCommand', command);
      addLog({
        timestamp: Date.now(),
        level: 'info',
        message: `Command sent: ${command.type}`,
        data: command
      });
    } else {
      addLog({
        timestamp: Date.now(),
        level: 'warn',
        message: 'Cannot send command: WebSocket not connected'
      });
    }
  }, [socket, isConnected, addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const connectSocket = useCallback(() => {
    const newSocket = io(url, {
      transports: ['websocket'],
      timeout: 5000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      addLog({
        timestamp: Date.now(),
        level: 'info',
        message: 'Connected to robot simulation server'
      });
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      addLog({
        timestamp: Date.now(),
        level: 'warn',
        message: 'Disconnected from server'
      });
    });

    newSocket.on('robotState', (state: RobotState) => {
      setRobotState(state);
    });

    newSocket.on('log', (logEntry: LogEntry) => {
      addLog(logEntry);
    });

    newSocket.on('connect_error', (error) => {
      addLog({
        timestamp: Date.now(),
        level: 'error',
        message: `Connection error: ${error.message}`
      });
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        newSocket.connect();
      }, 3000);
    });

    setSocket(newSocket);
  }, [url, addLog]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    robotState,
    logs,
    sendCommand,
    clearLogs
  };
};