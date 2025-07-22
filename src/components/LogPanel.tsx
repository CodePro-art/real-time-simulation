import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types/websocket';
import { Terminal, Trash2, Download } from 'lucide-react';

interface LogPanelProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

const LogPanel: React.FC<LogPanelProps> = ({ logs, onClearLogs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'debug': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const downloadLogs = () => {
    const logText = logs.map(log => 
      `[${formatTimestamp(log.timestamp)}] ${log.level.toUpperCase()}: ${log.message}${
        log.data ? '\n' + JSON.stringify(log.data, null, 2) : ''
      }`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robot-logs-${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Terminal className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Console Logs</h3>
          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
            {logs.length}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={downloadLogs}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download logs"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClearLogs}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No logs yet. Start the simulation to see activity.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`p-2 rounded-lg ${getLevelColor(log.level)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs opacity-75">
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      log.level === 'error' ? 'bg-red-200 text-red-800' :
                      log.level === 'warn' ? 'bg-yellow-200 text-yellow-800' :
                      log.level === 'info' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-gray-800">{log.message}</div>
                  {log.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                        Show data
                      </summary>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogPanel;