'use client';
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState, Suspense } from 'react';
import { useFrame, Canvas, useLoader, useThree } from '@react-three/fiber';

import { MeshLambertMaterial, Color, Mesh, Vector3 } from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { ProjectDetailScreen } from '@/app/screens';


const CameraController = ({
  orbref, 
  autoRotate, 
  clickedObj, 
  scene,
  setAnimationReady
}) => {
  const { camera, gl } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);

  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.1;

  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;

  if(scene === 'details') {
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.dampingFactor = 1;
    controls.screenSpacePanning = true;
    controls.enableZoom = true;
  }

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
    if (scene === 'details') {
      controls.autoRotate = false;
    }
  }, [scene]);

  useFrame(() => {

    let currentPos = new Vector3().copy(camera.position);
    let targetPos = new Vector3(-clickedObj.x / 4, 0, -clickedObj.z / 4);
    // initial pan to object
    if(scene === 'overview') {
      controls.target.lerp(new Vector3(0, -4, -12), 0.01);
      controls.object.position.lerp(new Vector3(0, 4, 12), 0.01);
    }
    // interactive click-pan
    if(scene === 'details') {
      controls.object.position.lerp(new Vector3(-clickedObj.x / 4, 0, -clickedObj.z / 4), 0.017);
      controls.cursor.addVectors(controls.target, controls.object.position);
    }

    if (scene === 'details' && currentPos.distanceTo(targetPos) < 0.1) {
      setAnimationReady(true);
    }

    orbref.current.innerHTML = `<h3>X: ${controls.object.position.x.toFixed(3)}</h3>
                                <h3>Y: ${controls.object.position.y.toFixed(3)} </h3>
                                <h3>Z: ${controls.object.position.z.toFixed(3)}</h3>`;

    controls.update();
  });

  return null;
};

export const Cactus_free = (props) => {
  const [hovered, hover] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  const textVector = new Vector3(0, 0, 0);
  const meshRef = useRef(null);

  const hoveredRotationSpeed = 0.2;


  const model = useLoader(OBJLoader, '/models/cactus_free/10436_Cactus_v1_max2010_it2.obj');

  useEffect(() => {

      let divElem = document.createElement('div');
      divElem.id = (props.indexNr).toString();
      divElem.style.position = 'absolute';
      divElem.style.color = 'white';
      divElem.innerHTML = `${props.label}`;

      document.body.appendChild(divElem);
    }, []);

  useEffect(() => {
    if (props.scene !== 'details') {
      setActive(false);
    }
  }, [props.scene]);
  

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
    
    meshRef.current.rotation.z += delta * 0.01;
    if (hovered || active) {
      meshRef.current.rotation.z += delta * hoveredRotationSpeed;
    }

    const textElement = document.getElementById((props.indexNr).toString());

    if (!textElement) {
      return;
    }
    if (props.scene === 'cover') {
      textElement.style.display = 'none';
      return;
    }
    
    meshRef.current.updateMatrixWorld();
    textVector.setFromMatrixPosition(meshRef.current.matrixWorld);
    textVector.project(state.camera);

    const widthHalf = state.size.width / 2;
    const heightHalf = state.size.height / 2;
    const allowedWidth = state.size.width - state.size.width / 10;
    const allowedHeight = state.size.height - state.size.height / 10;
    const xOffset = 40;
    const yOffset = 10;

    textVector.x = (textVector.x * widthHalf) + widthHalf - xOffset;
    textVector.y = -(textVector.y * heightHalf) + heightHalf + yOffset;

    if (textVector.x > allowedWidth || textVector.x < 0 || textVector.y > allowedHeight || textVector.y < 0 || textVector.z < 0 || textVector.z > 1) {
      textElement.style.display = 'none';
    } else {
      textElement.style.left = `${textVector.x}px`;
      textElement.style.top = `${textVector.y}px`;
      textElement.style.display = 'block';

      props.selectedPosition.x = textVector.x;
      props.selectedPosition.y = textVector.y;
    }
  });


  return (
    
      <mesh {...props} ref={meshRef}>
        <primitive object={model.clone()} scale={hovered ? 1.2 : 1} />
        <meshLambertMaterial color={'red'} />
        <mesh position={[0, 0, 150]} onPointerOver={(event) => {if(props.scene !== 'details') {hover(true)}}} onPointerOut={(event) => {{hover(false)}}} onClick={() => {if(props.scene !== 'details') {props.setClickedObj(meshRef.current.position); props.setScene('details'); setActive(true); props.setProjectName(`project_${props.indexNr}`) }}}>
          <boxGeometry args={[100, 100, 350]} />
          <meshPhongMaterial transparent opacity={0} />
        </mesh>
      </mesh>

  );
};

const Director = ({setClickedObj, scene, setScene, selectedPosition, setProjectName}) => {

  const radius = scene === 'cover' ? 12 : 14;
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
              <Cactus_free indexNr={index} label={'cactus_no: ' +index} key={index} position={[Math.sin(angle) * radius / 2, baseline, Math.cos(angle) * radius / 2]} scale={i[0] / 20} rotation={[-1.5, 0, 0]} setClickedObj={setClickedObj} scene={scene} setScene={setScene} selectedPosition={selectedPosition} setProjectName={setProjectName} />
          )}
        )}
    </>
  );
};

export const CanvasRotationScene = ({ scene, setScene }) => {
  
  const [clickedObj, setClickedObj] = useState(new Vector3(0, 0, 4));
  const [animationReady, setAnimationReady] = useState(false);
  const [selectedPosition] = useState({x: 0, y: 0});
  const [projectName, setProjectName] = useState('');
  const trackerRef = useRef(null);
  const canvasRef = useRef(null);



  useEffect(() => {
    setAnimationReady(false);
  }, [scene]);



  return (
    <div className={`fixed w-full h-full ${scene === 'cover' ? '' : 'bg-[coral]/50'}`}>

      <Canvas ref={canvasRef}>
        <CameraController 
          orbref={trackerRef} 
          autoRotate={scene === 'cover'} 
          clickedObj={clickedObj} 
          scene={scene} 
          setAnimationReady={setAnimationReady} 
        />
        
        <fog attach="fog" args={['#CD7A6D', 8, 25]} />

        {scene !== 'cover' &&
          <>
            <ambientLight intensity={1.5} />
          </>
        }
        <Suspense fallback={null}>
          <Director 
            setClickedObj={setClickedObj} 
            scene={scene} 
            setScene={setScene} 
            selectedPosition={selectedPosition} 
            setProjectName={setProjectName} 
          />
        </Suspense>
        
      </Canvas>

      {scene === 'details' && animationReady &&
        <ProjectDetailScreen title={projectName} selectedPosition={selectedPosition} animationReady={animationReady} />
      }

      <div ref={trackerRef} className='fixed bottom-4 left-0 text-2xl text-[black]/40 p-2' />
    </div>
  );
};
