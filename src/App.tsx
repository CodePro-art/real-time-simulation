import React, { useState, useCallback } from 'react';
import { Monitor, Box, Code, Terminal, Layers } from 'lucide-react';
import Simulator3D from './components/Simulator3D';
import Simulator2D from './components/Simulator2D';
import BlocklyEditor from './components/BlocklyEditor';
import SensorPanel from './components/SensorPanel';
import LogPanel from './components/LogPanel';
import ControlPanel from './components/ControlPanel';
import { useWebSocket } from './hooks/useWebSocket';
import { RobotCommand, SimulationEnvironment } from './types/robot';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'2d' | '3d' | 'code' | 'logs'>('2d');
  const [currentCommands, setCurrentCommands] = useState<RobotCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const { isConnected, robotState, logs, sendCommand, clearLogs } = useWebSocket();

  // Default simulation environment
  const environment: SimulationEnvironment = {
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

  const handleCodeChange = useCallback((commands: RobotCommand[]) => {
    setCurrentCommands(commands);
  }, []);

  const handleRunProgram = useCallback(() => {
    if (currentCommands.length === 0) {
      console.warn('No commands to execute');
      return;
    }
    
    setIsRunning(true);
    
    // Send commands sequentially
    currentCommands.forEach((command, index) => {
      setTimeout(() => {
        sendCommand(command);
        if (index === currentCommands.length - 1) {
          setIsRunning(false);
        }
      }, index * 1000); // 1 second delay between commands
    });
  }, [currentCommands, sendCommand]);

  const handleStopProgram = useCallback(() => {
    setIsRunning(false);
    sendCommand({
      type: 'stop',
      id: Date.now().toString()
    });
  }, [sendCommand]);

  const handleResetSimulation = useCallback(() => {
    sendCommand({
      type: 'move',
      payload: { reset: true },
      id: Date.now().toString()
    });
  }, [sendCommand]);

  const renderMainContent = () => {
    switch (activeTab) {
      case '2d':
        return <Simulator2D robotState={robotState} environment={environment} />;
      case '3d':
        return <Simulator3D robotState={robotState} environment={environment} />;
      case 'code':
        return <BlocklyEditor onCodeChange={handleCodeChange} />;
      case 'logs':
        return <LogPanel logs={logs} onClearLogs={clearLogs} />;
      default:
        return <Simulator2D robotState={robotState} environment={environment} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Robot Simulation Platform</h1>
              <p className="text-sm text-gray-600">EV3-like Robot Programming Environment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? '● Connected' : '● Disconnected'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('2d')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === '2d'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Monitor className="w-4 h-4 mx-auto mb-1" />
                2D View
              </button>
              <button
                onClick={() => setActiveTab('3d')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === '3d'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Layers className="w-4 h-4 mx-auto mb-1" />
                3D View
              </button>
            </nav>
          </div>

          {/* Control Panel */}
          <div className="p-4 border-b">
            <ControlPanel
              isConnected={isConnected}
              isRunning={isRunning}
              onSendCommand={sendCommand}
              onRunProgram={handleRunProgram}
              onStopProgram={handleStopProgram}
              onResetSimulation={handleResetSimulation}
            />
          </div>

          {/* Sensor Panel */}
          <div className="flex-1 p-4 overflow-y-auto">
            <SensorPanel robotState={robotState} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('2d')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === '2d'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Monitor className="w-4 h-4 inline mr-2" />
                2D Simulator
              </button>
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === '3d'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Layers className="w-4 h-4 inline mr-2" />
                3D Simulator
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'code'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Block Editor
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Terminal className="w-4 h-4 inline mr-2" />
                Console
                {logs.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {logs.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;