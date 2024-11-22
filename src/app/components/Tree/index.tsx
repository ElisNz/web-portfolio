'use client';
// Tree test component using three.js with react-three-fiber
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export const Sphere = () => {
  const [hovered, hover] = useState(false);
  const mesh = useRef<Mesh>(null);

  useFrame((state,delta) => (mesh.current.rotation.x += delta))


  return (
    <>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <mesh 
          ref={mesh} 
          position={[0, 0, 0]} 
          onPointerOver={(event) => hover(true)}
          onPointerOut={(event) => hover(false)}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color={hovered ? 'hotpink' : 'orange' } />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
      </>
  );
};

export const Tree = () => {
  return (
    <div className='w-full h-screen'>
      <Canvas>
        <Sphere />
      </Canvas>
    </div>
  );
};
