import React, { useState } from 'react';
import { Play, Square, RotateCcw, Settings, Wifi, WifiOff } from 'lucide-react';
import { RobotCommand } from '../types/robot';
import { v4 as uuidv4 } from 'uuid';

interface ControlPanelProps {
  isConnected: boolean;
  isRunning: boolean;
  onSendCommand: (command: RobotCommand) => void;
  onRunProgram: () => void;
  onStopProgram: () => void;
  onResetSimulation: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isConnected,
  isRunning,
  onSendCommand,
  onRunProgram,
  onStopProgram,
  onResetSimulation
}) => {
  const [manualMode, setManualMode] = useState(false);

  const sendManualCommand = (type: 'move' | 'rotate' | 'stop', payload?: any) => {
    onSendCommand({
      type,
      payload,
      id: uuidv4()
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Control Panel</h3>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Program Control */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3">Program Control</h4>
        <div className="flex space-x-2">
          <button
            onClick={onRunProgram}
            disabled={!isConnected || isRunning}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              !isConnected || isRunning
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Play className="w-4 h-4 mr-2" />
            Run Program
          </button>
          
          <button
            onClick={onStopProgram}
            disabled={!isConnected || !isRunning}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              !isConnected || !isRunning
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </button>
          
          <button
            onClick={onResetSimulation}
            disabled={!isConnected}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              !isConnected
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Manual Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-medium">Manual Control</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={manualMode}
              onChange={(e) => setManualMode(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Enable</span>
          </label>
        </div>
        
        {manualMode && (
          <div className="space-y-3">
            {/* Movement Controls */}
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <button
                onClick={() => sendManualCommand('move', { direction: 'forward', distance: 50 })}
                disabled={!isConnected}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                ↑
              </button>
              <div></div>
              
              <button
                onClick={() => sendManualCommand('rotate', { direction: 'left', angle: 45 })}
                disabled={!isConnected}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => sendManualCommand('stop')}
                disabled={!isConnected}
                className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"
              >
                ⏹
              </button>
              <button
                onClick={() => sendManualCommand('rotate', { direction: 'right', angle: 45 })}
                disabled={!isConnected}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                →
              </button>
              
              <div></div>
              <button
                onClick={() => sendManualCommand('move', { direction: 'backward', distance: 50 })}
                disabled={!isConnected}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div>
        <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
          <Settings className="w-4 h-4 mr-2" />
          Simulation Settings
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;