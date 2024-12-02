'use client';
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { useFrame, Canvas, useLoader, useThree } from '@react-three/fiber';

import { MeshLambertMaterial, Color, Mesh, Vector3 } from 'three';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const CameraController = ({orbref, autoRotate, clickedObj, isTracking, overview, cover}) => {
  const { camera, gl } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);

  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.1;


/*   controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = false; */
  controls.enableDamping = true;
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;


  const startY = controls.object.position.y;
  const startZ = controls.object.position.z;
  let zTarget = 4;
  let xTarget = 0;
  let yTarget = 0;

  useEffect(
     () => {
        controls.minDistance = 3;
        controls.maxDistance = 7;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.minPolarAngle = Math.PI / 4;

        controls.enableDamping = true;
        controls.dampingFactor = 1;
        controls.screenSpacePanning = false;

        
        return () => {
          controls.dispose();
        };
     }, [camera, gl]
  );

  useEffect(() => {
    if (autoRotate) {
      controls.object.position.y = -2;
      controls.object.position.z = 4;
      controls.object.position.x = -Math.PI / 2;
    }
    controls.autoRotate = autoRotate;
    
  }, [autoRotate, overview]);

  useEffect(() => {
    if (isTracking) {
      controls.autoRotate = false;
    }
  }, [isTracking]);

  useFrame((state, delta) => {

    // initial pan to object
    if(overview && !cover) {
      controls.target.lerp(new Vector3(0, -4, -12), 0.01);
      controls.object.position.lerp(new Vector3(0, 4, 12), 0.01);
    }
    // interactive click-pan
    if(isTracking && !overview) {
      controls.object.position.lerp(new Vector3(-clickedObj.x / 4, 0, -clickedObj.z / 4).round(), 0.008);
      controls.target.lerp(new Vector3(clickedObj.x / 4, 0, clickedObj.z / 4).round(), 0.008);
      controls.cursor.addVectors(controls.target, controls.object.position);
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
      <mesh position={[0, 0, 150]} onPointerOver={(event) => hover(true)} onPointerOut={(event) => hover(false)} onClick={() => {props.setClickedObj(mesh.current.position); props.setTracking(true); props.setOverview(false); }}>
        <boxGeometry args={[100, 100, 350]} />
        <meshPhongMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

const Rotation = ({setClickedObj, setTracking, cover, setOverview}) => {

  const radius = cover ? 12 : 14;
  const objects = [
    [0.29,0.44,0.36], 
    [0.59,0.53,0.29], 
    [0.63,0.62,0.73], 
    [0.58,0.16,0.17], 
    [0.80,0.80,0.17], 
  ];


  return (
    <>
        {objects.map((i, index) => {
          const angle = index * Math.PI * 2 / objects.length;
          const baseline = i[0] * (-2) - 1.5;
          
          return (
              <Cactus_free key={index} position={[Math.sin(angle) * radius / 2, baseline, Math.cos(angle) * radius / 2]} scale={i[0] / 20} rotation={[-1.5, 0, 0]} setClickedObj={setClickedObj} setTracking={setTracking} setOverview={setOverview} />
          )}
        )}
        <mesh position={[0, 10, 0]}>
          <boxGeometry args={[100, 100, 100]} />
          <meshPhongMaterial color={'red'} />
        </mesh>
    </>
  );
};

export const CanvasRotationScene = ({cover, overview, setOverview}) => {
  const [clickedObj, setClickedObj] = useState(new Vector3(0, 0, 4));
  const [isTracking, setTracking] = useState(false);

  const trackerRef = useRef(null);
  const textRef = useRef(null);


  useEffect(() => {
    console.log(clickedObj);
  }, [clickedObj]);

  useEffect(() => {
    if (cover) {
      setTracking(false);
    }
  }, [cover]);


  return (
    <div className={`fixed w-full h-full ${cover ? '' : 'bg-[coral]/50'}`}>

      <Canvas>
        <CameraController orbref={trackerRef} autoRotate={cover} clickedObj={clickedObj} isTracking={isTracking} overview={overview} cover={cover} />
        

        <fog attach="fog" args={['#ffffff', 8, 25]} />

        {!cover &&
          <>
            <ambientLight intensity={1.5} />
          </>
        }
        <Suspense fallback={null}>
          <Rotation setClickedObj={setClickedObj} setTracking={setTracking} cover={cover} setOverview={setOverview} />
        </Suspense>
        
      </Canvas>
      
      <div ref={textRef} />
      <div ref={trackerRef} className='fixed bottom-4 left-0 text-2xl text-[black]/40 p-2' />
    </div>
  );
};
