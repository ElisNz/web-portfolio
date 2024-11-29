'use client';
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { useFrame, Canvas, useLoader, useThree } from '@react-three/fiber';

import { MeshLambertMaterial, Color, Mesh } from 'three';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const CameraController = ({orbref, autoRotate}) => {
  const { camera, gl } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.1;
  controls.object.position.y = -Math.PI;

  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;

  const startY = controls.object.position.y;

  useEffect(
     () => {
        controls.minDistance = 3;
        controls.maxDistance = 7;
        controls.enableDamping = true;
        
        return () => {
          controls.dispose();
        };
     }, [camera, gl]
  );

  useEffect(() => {
    controls.autoRotate = autoRotate;
  }, [autoRotate]);


  useFrame((state, delta) => {
    if (!autoRotate && controls.object.position.y < 0) {
      controls.object.translateY((controls.object.position.y < startY / 2 ? (delta * -controls.object.position.y / startY + 0.01) : delta) * -controls.object.position.y);
      controls.object.translateX((controls.object.position.x < startY / 2 ? (delta * -controls.object.position.x / startY + 0.01) : delta) * -controls.object.position.x);
    }

    
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
        <primitive object={useMemo(() => model.clone(), [model])} scale={hovered ? 1.2 : 1} />
      </group>
      <mesh position={[0, 2000, 0]} onPointerOver={(event) => hover(true)} onPointerOut={(event) => hover(false)}>
        
        <boxGeometry args={[3000, 3000, 2500]} />
        <meshPhongMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export const Cactus_free = (props) => {
  const [hovered, hover] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mesh = useRef(null);
  const hoveredRotationSpeed = 0.2;

/*   const materials = useLoader(MTLLoader, ['/models/cactus_free/10436_Cactus_v1_max2010_it2.mtl']); */
  const model = useLoader(OBJLoader, '/models/cactus_free/10436_Cactus_v1_max2010_it2.obj', (loader) => {
/*     materials[0].preload();
    loader.setMaterials(materials[0]); */
  });



  // Change color of the model by traversing meshes and assigning a random color
  useEffect(() => {
    model.traverse((child) => {
      if (child.type === 'Mesh') {
        (child as Mesh).material = new MeshLambertMaterial({ color: new Color(Math.random(), Math.random(), Math.random()) });
      }
    });
    setLoaded(true);
  }, [model]);


  useFrame((state, delta) => {
    mesh.current.rotation.z += delta * 0.01;
    if (hovered) {
      mesh.current.rotation.z += delta * hoveredRotationSpeed;
    }
  });

  return (
    <group {...props} ref={mesh}>
      <primitive object={model.clone()} scale={hovered ? 1.2 : 1} />

      <meshLambertMaterial color={'red'} />
      <mesh position={[0, 0, 150]} onPointerOver={(event) => hover(true)} onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[100, 100, 350]} />
        <meshPhongMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

const Rotation = ({cover}) => {
  const [hoveredObj, setHoveredObj] = useState([0, 0, 0]);
  const [isTracking, setTracking] = useState(false);

  const radius = 8;
  const objects = [
    [0.29,0.44,0.36], 
    [0.59,0.53,0.29], 
    [0.63,0.62,0.73], 
    [0.58,0.16,0.17], 
    [0.80,0.80,0.17], 
    [0.0,0.80,0.17], 
    [0.63,0.62,0.73], 
    [0.63,0.62,0.73], 
    [0.63,0.62,0.73], 
    [0.63,0.62,0.73], 
    [0.58,0.16,0.17], 
    [0.80,0.80,0.17]
  ];

  useEffect(() => {
    setTracking(true);
  }, [hoveredObj]);


  return (
    <>
        {objects.map((i, index) => {
          const angle = index * Math.PI * 2 / objects.length;
          const baseline = i[0] * (-2) - 1.5;
          
          return (
              <Cactus_free key={index} position={[Math.sin(angle) * radius, baseline, Math.cos(angle) * radius]} scale={i[0] / 20} rotation={[-1.5, 0, 0]} setHoveredObj={setHoveredObj} />
          )}
        )}
    </>
  );
};

export const CanvasRotationScene = ({cover}) => {
  const trackerRef = useRef(null);


  return (
    <div className={`absolute w-full h-screen ${cover ? '' : 'bg-[coral]/50'}`}>

      <Canvas>
        <CameraController orbref={trackerRef} autoRotate={cover}/>
        

        <fog attach="fog" args={['#ffffff', 8, 25]} />

        {!cover &&
          <>
            <ambientLight intensity={1.5} />
          </>
        }
        <Suspense fallback={null}>
          <Rotation cover={cover} />
        </Suspense>
        
      </Canvas>
      
      <div ref={trackerRef} className='absolute bottom-4 left-0 text-2xl text-[black]/40 p-2' />
    </div>
  );
};
