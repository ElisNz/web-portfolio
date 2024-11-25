'use client';
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { Mesh, PerspectiveCamera, Vector3 } from 'three';


export const Sphere = (props) => {
  const [hovered, hover] = useState(false);
  const mesh = useRef<Mesh>(null);
  const hoveredRotationSpeed = 0.7;

  useFrame((state, delta) => {
    if (hovered) {
      mesh.current.rotation.y += delta * hoveredRotationSpeed;
      }
    });

  const trackObject = () => {
    props.setHoveredObj([mesh.current.position.x, mesh.current.position.y, mesh.current.position.z]);
  };

  return (
    <>
      <mesh 
        {...props}
        ref={mesh}    
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}
        onClick={(event) => trackObject()}
        scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
        rotation={[0, 2, 0]}
      >
        <mesh position={[0, 0, -1]}>
          <boxGeometry args={[1, 5, 1]} />
          <meshStandardMaterial color={hovered ? 'hotpink' : props.color } />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[1, 1, 5]} />
          <meshStandardMaterial color={hovered ? 'hotpink' : props.color } />
        </mesh>
        <mesh position={[0, 0, 1]}>
          <boxGeometry args={[1, 5, 1]} />
          <meshStandardMaterial color={hovered ? 'hotpink' : props.color } />
        </mesh>
      </mesh>
    </>
  );
};

const Rotation = ({trackerRef}) => {
  const cameraRef = useRef<PerspectiveCamera>(null);
  const [hoveredObj, setHoveredObj] = useState([0, 0, 0]);
  const [isTracking, setTracking] = useState(false);

  const radius = 7;
  const objects = [[0.29,0.44,0.36], [0.59,0.53,0.29], [0.63,0.62,0.73], [0.58,0.16,0.17], [0.80,0.80,0.17], [0.0,0.80,0.17]];
  const rotationSpeed = 0.03;

  useFrame((state, delta) => {
    
      cameraRef.current.rotateY(delta * rotationSpeed);
      
      trackerRef.current.innerHTML = `
        <h3>Y: ${cameraRef.current.rotation.y.toFixed(3)}</h3>
        <h3>X: ${cameraRef.current.rotation.x.toFixed(3)}</h3>
        <h3>Z: ${cameraRef.current.rotation.z.toFixed(3)}</h3>`;
  });

  useEffect(() => {
    setTracking(true);
  }, [hoveredObj]);


  return (
    <>
      <perspectiveCamera ref={cameraRef} position={[0, 0.3, -radius * 0.8]} fov={60} aspect={window.innerWidth / window.innerHeight}>
        {objects.map((i, index) => {
          const angle = index * Math.PI * 2 / objects.length;
          return (
            <Sphere key={index} color={i} position={[radius * Math.sin(angle), 0, radius * Math.cos(angle)]} setHoveredObj={setHoveredObj} />
          )}
        )}
      </perspectiveCamera>
    </>
  );
};

export const CanvasRotation = () => {
  const trackerRef = useRef(null);

  return (
    <div className='absolute w-full h-screen bg-[pink]/40'>

      <Canvas>
        <ambientLight />
        <directionalLight position={[0, 8, 5]} />
        <Rotation trackerRef={trackerRef} />
      </Canvas>

      <div ref={trackerRef} className='absolute bottom-0 left-0 text-2xl text-[black]/40 p-2' />

    </div>
  );
};
