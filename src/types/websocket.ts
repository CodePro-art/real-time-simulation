export interface WebSocketMessage {
  type: 'command' | 'sensorUpdate' | 'robotState' | 'log' | 'ack';
  payload: any;
  timestamp: number;
  id?: string;
}

export interface LogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}