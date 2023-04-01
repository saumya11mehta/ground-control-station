import React, { useState } from 'react';

const LiveViewWidget: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleUnminimize = () => {
    setIsMinimized(false);
  };

  return (
    <div className={`bg-gray-300 w-full ${isMinimized ? 'h-12' : 'h-64'} flex flex-col`}>
      <div className="flex justify-between items-center bg-gray-400 px-4 py-2">
        <p className="text-gray-700 font-bold">Live View</p>
        <div className="flex items-center">
          <button
            className={`text-gray-700 ${isMinimized ? 'hidden' : ''}`}
            onClick={handleMinimize}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V5H5a1 1 0 0 1-1-1zm11 12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 
                  1 0 0 1 1-1h10a1 1 0 0 1 1 1v10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className={`text-gray-700 ${isMinimized ? '' : 'hidden'}`}
            onClick={handleUnminimize}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V5H5a1 1 0 0 1-1-1zm11 12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 
                  1 0 0 1 1-1h10a1 1 0 0 1 1 1v10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {isMinimized ? null : (
        <div className="flex-1 p-4 flex items-center justify-center">
          <p className="text-gray-700">Live view of cameras will appear here</p>
        </div>
      )}
    </div>
  );
};

export default LiveViewWidget;