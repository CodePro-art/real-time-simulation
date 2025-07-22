import React from 'react';
import { RobotState } from '../types/robot';
import { Gauge, Compass, Palette, Hand, Battery } from 'lucide-react';

interface SensorPanelProps {
  robotState: RobotState | null;
}

const SensorPanel: React.FC<SensorPanelProps> = ({ robotState }) => {
  if (!robotState) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Sensor Data</h3>
        <p className="text-gray-500">No robot data available</p>
      </div>
    );
  }

  const { sensors } = robotState;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Gauge className="w-5 h-5 mr-2" />
        Sensor Data
      </h3>
      
      <div className="space-y-4">
        {/* Ultrasonic Sensor */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="font-medium">Ultrasonic</span>
          </div>
          <span className="text-lg font-mono">{sensors.ultrasonic.toFixed(1)} cm</span>
        </div>

        {/* Gyroscope */}
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Compass className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-medium">Gyroscope</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-600">X:</span>
              <span className="ml-1 font-mono">{sensors.gyroscope.x.toFixed(2)}°</span>
            </div>
            <div>
              <span className="text-gray-600">Y:</span>
              <span className="ml-1 font-mono">{sensors.gyroscope.y.toFixed(2)}°</span>
            </div>
            <div>
              <span className="text-gray-600">Z:</span>
              <span className="ml-1 font-mono">{sensors.gyroscope.z.toFixed(2)}°</span>
            </div>
          </div>
        </div>

        {/* Color Sensor */}
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <Palette className="w-4 h-4 mr-2 text-purple-600" />
            <span className="font-medium">Color</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-6 h-6 rounded-full border-2 border-gray-300 mr-2"
              style={{ backgroundColor: sensors.color }}
            ></div>
            <span className="font-mono">{sensors.color}</span>
          </div>
        </div>

        {/* Touch Sensor */}
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center">
            <Hand className="w-4 h-4 mr-2 text-orange-600" />
            <span className="font-medium">Touch</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            sensors.touch 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {sensors.touch ? 'Pressed' : 'Released'}
          </div>
        </div>

        {/* Motor Rotation */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
            <span className="font-medium">Motor Rotation</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Left:</span>
              <span className="ml-1 font-mono">{sensors.motorRotation.left.toFixed(0)}°</span>
            </div>
            <div>
              <span className="text-gray-600">Right:</span>
              <span className="ml-1 font-mono">{sensors.motorRotation.right.toFixed(0)}°</span>
            </div>
          </div>
        </div>

        {/* Battery */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <Battery className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-medium">Battery</span>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  robotState.battery > 50 ? 'bg-green-500' : 
                  robotState.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${robotState.battery}%` }}
              ></div>
            </div>
            <span className="font-mono">{robotState.battery.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorPanel;