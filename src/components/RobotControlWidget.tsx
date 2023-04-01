import React, { useState } from 'react';

const RobotControlWidget: React.FC = () => {
  const [isManualMode, setIsManualMode] = useState(false);

  const handleManualModeToggle = () => {
    setIsManualMode(!isManualMode);
  };

  const handleGamepadControl = () => {
    // Connect to Xbox/PS4 controller and take control of the robot
    // TODO: Implement the logic for controlling the robot with a gamepad
  };

  return (
    <div className="absolute top-5 right-5 z-10 bg-gray-700 w-1/4 p-4 flex flex-col">
      <p className="text-gray-300 text-center pb-5 font-bold">Robot Control</p>
      <div className="flex flex-col items-center mt-2 gap-5">
        <button
          className={`px-4 py-2 rounded-md bg-gray-400 text-black font-bold ${
            isManualMode ? 'bg-green-400' : ''
          }`}
          onClick={handleManualModeToggle}
        >
          {isManualMode ? 'Back To Automatic' : 'Take Manual Control'}
        </button>
        {isManualMode && (
          <button
            className="ml-4 px-4 py-2 rounded-md bg-blue-400 text-gray-700 font-bold"
            onClick={handleGamepadControl}
          >
            Use Xbox/PS4 Controller
          </button>
        )}
      </div>
    </div>
  );
};

export default RobotControlWidget;