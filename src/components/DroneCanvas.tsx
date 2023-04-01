import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import DroneModel from "./DroneModel";
import { OrbitControls } from "@react-three/drei";

type DroneCanvasProps = {
    modelUrl: string;
    onLoaded: () => void;
};
  
const DroneCanvas: React.FC<DroneCanvasProps> = ({ modelUrl, onLoaded }) => {
    const groupRef = useRef<THREE.Group>(null);
  
    return (
      <Canvas camera={{ position: [0, 2, 2] }}>
        <ambientLight />
        <OrbitControls enableZoom={false} />
        <DroneModel modelUrl={modelUrl} groupRef={groupRef} onLoaded={onLoaded} />
      </Canvas>
    );
  };

export default DroneCanvas;