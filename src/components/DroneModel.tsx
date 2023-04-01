import { useEffect } from "react";
import { Box3, Vector3 } from "three";
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

 const DroneModel: React.FC<{ modelUrl: string, groupRef: React.RefObject<THREE.Group>,onLoaded: () => void }> = ({ modelUrl, groupRef, onLoaded }) => {
    useEffect(() => {
      const loader = new GLTFLoader();
      const dispose = () => {
        groupRef.current?.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            // Dispose of geometry
            child.geometry.dispose();

            // Dispose of materials
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                material.dispose();
              });
            } else {
              child.material.dispose();
            }
          }
        });
      };

      loader.load(modelUrl, (gltf) => {
        const model = gltf.scene.children[0]; // Get the first child of the scene
        if (model) {
          const box = new Box3().setFromObject(model);
          const center = new Vector3();
          box.getCenter(center);
          model.position.sub(center);
          model.scale.set(2, 2, 2); // Scale the model up by a factor of 2
        }
        groupRef.current?.add(model);
        onLoaded();
      });

      return () => {
        dispose();
      };
    }, [groupRef, modelUrl, onLoaded]);
  
    return <group ref={groupRef as React.RefObject<THREE.Group>} position={[0, 0, 0]} />;
};

export default DroneModel;