'use client';
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState, Suspense } from 'react';
import { useFrame, Canvas, useLoader, useThree } from '@react-three/fiber';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const CameraController = ({orbref}) => {
  const { camera, gl } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);

  useEffect(
     () => {
        controls.minDistance = 3;
        controls.maxDistance = 7;
        console.log(controls);
        
        return () => {
          controls.dispose();
        };
     }, [camera, gl]
  );

  useFrame(() => {
    orbref.current.innerHTML = `<h3>X: ${controls.object.position.x.toFixed(3)}</h3>
                                <h3>Y: ${controls.object.position.y.toFixed(3)} </h3>
                                <h3>Z: ${controls.object.position.z.toFixed(3)}</h3>`;
    controls.update();
  });

  return null;
};


export const Cactus = (props) => {
  const [hovered, hover] = useState(false);
  const mesh = useRef(null);
  const hoveredRotationSpeed = 0.7;

  const materials = useLoader(MTLLoader, '/models/kaktus_jacob/_kaktus.mtl');
  const model = useLoader(OBJLoader, '/models/kaktus_jacob/_kaktus final.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });


  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.01;
    if (hovered) {
      mesh.current.rotation.y += delta * hoveredRotationSpeed;
    }
  });

  const trackObject = () => {
    props.setHoveredObj([mesh.current.position.x, mesh.current.position.y, mesh.current.position.z]);
  };

  return (
    <group {...props} ref={mesh}>
      <group>
        <primitive object={model.clone()} scale={hovered ? 1.2 : 1} />
      </group>
      <mesh position={[0, 2000, 0]} onPointerOver={(event) => hover(true)} onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[3000, 3000, 2500]} />
        <meshPhongMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

const Rotation = ({trackerRef, cover}) => {
  const cameraRef = useRef(null);
  const [hoveredObj, setHoveredObj] = useState([0, 0, 0]);
  const [isTracking, setTracking] = useState(false);

  const radius = 10;
  const objects = [[0.29,0.44,0.36], [0.59,0.53,0.29], [0.63,0.62,0.73], [0.58,0.16,0.17], [0.80,0.80,0.17], [0.0,0.80,0.17]];
  const rotationSpeed = 0.03;


  useFrame((state, delta) => {
      if (cover) {
      cameraRef.current.rotateY(delta * rotationSpeed);
      }
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
      <camera ref={cameraRef} position={[0, 0.3, -radius * 0.8]}>
      
        {objects.map((i, index) => {
          const angle = index * Math.PI * 2 / objects.length;
          const baseline = i[0] * (-3) - 1.5;
          const xOffset = -1.5;
          
          return (
            <Cactus key={index} color={i} position={[radius * Math.sin(angle) + xOffset, baseline, radius * Math.cos(angle)]} scale={i[0] * 0.02 / radius} rotation={[0, 0, 0]} setHoveredObj={setHoveredObj} />
          )}
        )}
      </camera>
    </>
  );
};

export const CanvasRotationScene = ({cover}) => {
  const trackerRef = useRef(null);


  return (
    <div className={`absolute w-full h-screen ${cover ? '' : 'bg-[lightpink]/50'}`}>

      <Canvas>
        {!cover &&
          <CameraController orbref={trackerRef} />
        }
        <Suspense fallback={null}>
          <ambientLight />
          <directionalLight position={[0, 8, 5]} />
          <Rotation trackerRef={trackerRef} cover={cover} />
        </Suspense>
      </Canvas>
      
      <div ref={trackerRef} className='absolute bottom-4 left-0 text-2xl text-[black]/40 p-2' />
    </div>
  );
};
