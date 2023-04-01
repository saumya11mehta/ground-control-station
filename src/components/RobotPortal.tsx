import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import THREE from 'three';
import DroneCanvas from './DroneCanvas';

type Drone = {
  id: number;
  name: string;
  modelUrl: string;
};

const drones: Drone[] = [
  {
    id: 1,
    name: 'Phantom 4',
    modelUrl: '/models/light_drone.glb',
  },
  {
    id: 2,
    name: 'Mavic Air 2',
    modelUrl: '/models/light_drone.glb',
  },
  {
    id: 3,
    name: 'Inspire 2',
    modelUrl: '/models/light_drone.glb',
  },
];

const DronePortalPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const groupRef = useRef<THREE.Group>(null);

  const handleModelLoaded = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += event.movementX * 0.01;
        groupRef.current.rotation.x += event.movementY * 0.01;
      }
    };

    const canvas = document.querySelector('canvas');
    canvas?.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="container mx-auto px-20 py-8 h-screen bg-white">
      <h1 className="text-4xl font-bold mb-8 text-black">Drone Portal</h1>
      <div className="grid grid-cols-3 gap-4">
        {drones.map((drone) => (
          <div key={drone.id} className="shadow-lg rounded-lg overflow-hidden">
            <div className="w-50 h-50 max-w-full max-h-full">
            {isLoading && <div className="bg-gray-300 w-full h-full flex items-center justify-center w-50 h-50 max-w-full max-h-full ">Loading...</div>}
            {
              (
                <DroneCanvas modelUrl={drone.modelUrl} onLoaded={handleModelLoaded} />
            )}
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4">
              <div className="font-bold text-xl mb-2 text-black">{drone.name}</div>
              <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="/map">
                  Plan mission
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DronePortalPage;