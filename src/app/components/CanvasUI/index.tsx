"use client";
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState, Suspense, act } from "react";
import { useFrame, Canvas, useLoader, useThree } from "@react-three/fiber";

import {
  MeshStandardMaterial,
  Color,
  Mesh,
  Vector3,
  Object3D,
  TextureLoader,
  SRGBColorSpace,
} from "three";

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/Addons.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { useStore } from "@/app/Store";
import { useShallow } from 'zustand/react/shallow'
import { ProjectDetailScreen } from "@/app/screens";
import { rand } from "three/webgpu";


const Fallback = () => {
  return (
    <>
    </>
  );
}


const CameraController = ({
  cameraPosition,
  orbref,
  autoRotate,
  clickedObj,
} : {
  cameraPosition: Vector3;
  orbref: React.MutableRefObject<any>;
  autoRotate: boolean;
  clickedObj: Vector3;
}) => {
  const { camera, gl, raycaster, pointer } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);
  const project = useStore((state) => state.project);
  const scene = useStore((state) => state.scene);
  const setAnimationReady = useStore((state) => state.setAnimationReady);
  const animationReady = useStore((state) => state.animationReady);


  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 4;

  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = false;
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;

/*   if (scene === "details") {
    controls.object.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  } */
  

  function onPointerMove(event) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    // use heightened coefficient for pointer. This will work without the followig line.
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
  }

  if (scene === "details") {
    // controls.enablePan = true;
    controls.screenSpacePanning = true;

    window.addEventListener("pointermove", onPointerMove);
  }

  useEffect(() => {
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 4;
    // controls.enablePan = true;
    

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  useEffect(() => {
    if (autoRotate) {
      controls.object.position.y = 0;
      controls.object.position.z = 7;
      controls.object.position.x = 0;
      controls.target.y = 7;
    }
    if (scene === "details" || scene === "overview") {
      controls.autoRotate = false;
    }
  }, [scene]);

  useFrame((state, delta) => {
    state.scene.name = scene;

    // let currentPos = new Vector3().copy(camera.position);
    if (scene === "cover") {
      controls.object.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      controls.target.set(cameraPosition.x, cameraPosition.y, cameraPosition.z - 1);
    }

    if (scene !== "details") {
      setAnimationReady(false);
      window.removeEventListener("pointermove", onPointerMove);
    }
    // initial pan to object position
    if (scene === "overview") {
      controls.object.position.lerp({x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z}, 0.05);
      controls.target.lerp({x: 0, y: 0, z: 0}, 0.05);
    }
    // interactive click-pan
    if (scene === "details") {
      controls.enableDamping = true;
      controls.dampingFactor = 2;
      // clickedObj.lerp({x: cameraPosition.x, y: cameraPosition.y + 2, z: cameraPosition.z - 2}, 0.01);
      controls.object.position.lerp(
        {x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z},
        0.04
      );
      controls.target.set(cameraPosition.x, cameraPosition.y, cameraPosition.z * 0.8);
    }

    if (scene === "details" && !animationReady) {
      setAnimationReady(true);
    }
    // interactive pan (move camera from cursor)
    if (scene === 'details' && animationReady) {
      raycaster.setFromCamera(pointer, camera);
      controls.target.lerp(
        raycaster.ray.direction.negate(),
        0.005,
      );
    }

    controls.cursor.addVectors(controls.target, controls.object.position);

    orbref.current.innerHTML = `<h3>X: ${controls.object.position.x.toFixed(3)}</h3>
                                <h3>Y: ${controls.object.position.y.toFixed(3)} </h3>
                                <h3>Z: ${controls.object.position.z.toFixed(3)}</h3>`;

    controls.update();
  });

  return null;
};

const DisplayScreen = (props) => {
  const screens = [1, 2, 3, 4, 5, 6, 7];
  const scene = useStore(state => state.scene);
  const project = useStore(state => state.project);
  const [animationFinished, setAnimationFinished] = useState(false);
  let activeScreen = screens[0];
  const display = props.showInScenes.includes(scene) || props.showInScenes.includes('all');
  const { pointer } = useThree();
  
  const loader = new TextureLoader();
  const texture = loader.load( 'https://picsum.photos/300' );
  texture.colorSpace = SRGBColorSpace;
  const texture2 = loader.load( 'https://picsum.photos/1000' );
  texture2.colorSpace = SRGBColorSpace;
  const texture3 = loader.load( 'https://picsum.photos/1000/300' );
  texture3.colorSpace = SRGBColorSpace;

  const screenPositions = {
    '1': {x: 12, y: 0, z: 0},
    '2': {x: 6, y: 4.2, z: -6},
    '3': {x: -8, y: -1, z: -6},
    '4': {x: -6, y: 4, z: -4},
    '5': {x: -2, y: -4, z: -3},
    '6': {x: -20, y: -4, z: -12},
    '7': {x: 6.5, y: -3, z: -3},
  };

  const moveToScreenPositions = Object.assign({}, screenPositions);
  moveToScreenPositions['1'] = { x: 0, y: 0, z: 0 };

  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);

  const screenMap = {
    '1': ref,
    '2': ref2,
    '3': ref3,
    '4': ref4,
    '5': ref5,
    '6': ref6,
    '7': ref7,
  };

/*   const viewVector = new Vector3();
  const viewVector2 = new Vector3();
  const viewVector3 = new Vector3();
  const viewVector4 = new Vector3();
  const viewVector5 = new Vector3();
  const viewVector6 = new Vector3();
  const viewVector7 = new Vector3(); */


  useEffect(() => {
    ref.current.material.opacity = 0;
    ref2.current.material.opacity = 0;
    ref3.current.material.opacity = 0;
    ref4.current.material.opacity = 0;
    ref5.current.material.opacity = 0;
    ref6.current.material.opacity = 0;
    ref7.current.material.opacity = 0;

    ref2.current.position.set(0, 0, 0);
    ref3.current.position.set(0, 0, 0);
    ref4.current.position.set(0, 0, 0);
    ref5.current.position.set(0, 0, 0);
    ref6.current.position.set(0, 0, 0);
    ref7.current.position.set(0, 0, 0);

    setAnimationFinished(false);
  }, [scene]);

  useEffect(() => {
    window.addEventListener('wheel', (e) => scrollImage(e));

    return () => {
      window.removeEventListener('wheel', (e) => scrollImage(e));
    };
  }, [animationFinished]);

  const animate = () => {
    if (!animationFinished) {
      if (ref.current.material.opacity < 1) {
        ref.current.material.opacity += 0.05;
      }
      if (ref2.current.material.opacity < 1) {
        ref2.current.material.opacity += 0.01;
      }
      if (ref3.current.material.opacity < 1) {
        ref3.current.material.opacity += 0.01;
      }
      if (ref4.current.material.opacity < 1) {
        ref4.current.material.opacity += 0.01;
      }
      if (ref5.current.material.opacity < 1) {
        ref5.current.material.opacity += 0.01;
      }
      if (ref6.current.material.opacity < 1) {
        ref6.current.material.opacity += 0.01;
      }
      if (ref7.current.material.opacity < 1) {
        ref7.current.material.opacity += 0.01;
      }
    }

    if (!animationFinished) {
      ref2.current.position.lerp(screenPositions['2'], 0.1);
      ref3.current.position.lerp(screenPositions['3'], 0.1);
      ref4.current.position.lerp(screenPositions['4'], 0.1);
      ref5.current.position.lerp(screenPositions['5'], 0.1);
      ref6.current.position.lerp(screenPositions['6'], 0.1);
      ref7.current.position.lerp(screenPositions['7'], 0.1);
    }

    if (animationFinished) {
      ref.current.position.lerp(moveToScreenPositions['1'], 0.1);
      ref2.current.position.lerp(moveToScreenPositions['2'], 0.1);
      ref3.current.position.lerp(moveToScreenPositions['3'], 0.1);
      ref4.current.position.lerp(moveToScreenPositions['4'], 0.1);
      ref5.current.position.lerp(moveToScreenPositions['5'], 0.1);
      ref6.current.position.lerp(moveToScreenPositions['6'], 0.1);
      ref7.current.position.lerp(moveToScreenPositions['7'], 0.1);
    }

    if (ref7.current.position.distanceTo(screenPositions['7']) < 0.1) {
      setAnimationFinished(true);
    }
  };

  const scrollImage = (e) => {
    e.preventDefault();

    if (!animationFinished) {
      return;
    }

    if (e.wheelDelta > 0 && activeScreen === screens[screens.length - 1]) {
      const targetScreen = screens[0];

      moveToScreenPositions[activeScreen.toString()] = screenPositions['1']; //TODO: copy over screenPositions to moveToScreenPositions here to reset
      screenMap[activeScreen.toString()].current.material.opacity = screenMap[targetScreen.toString()].current.material.opacity;

      moveToScreenPositions[targetScreen.toString()] = { x: 0, y: 0, z: 0 };
      screenMap[targetScreen.toString()].current.material.opacity = 1;
      screenMap[targetScreen.toString()].current.rotation.set(0, 0, 0);

      activeScreen = screens[0];
      return;
    }

    if (e.wheelDelta < 0 && activeScreen === screens[0]) {
      const targetScreen = screens[screens.length - 1];

      moveToScreenPositions[activeScreen.toString()] = screenPositions['7']; //TODO: copy over screenPositions to moveToScreenPositions here to reset
      screenMap[activeScreen.toString()].current.material.opacity = screenMap[targetScreen.toString()].current.material.opacity;

      moveToScreenPositions[targetScreen.toString()] = { x: 0, y: 0, z: 0 };
      screenMap[targetScreen.toString()].current.material.opacity = 1;
      screenMap[targetScreen.toString()].current.rotation.set(0, 0, 0);

      activeScreen = screens[screens.length - 1];
      return;
    }

    if (e.wheelDelta > 0) {
      const targetScreen = (activeScreen + 1);

      moveToScreenPositions[activeScreen.toString()] = { x: screenPositions[targetScreen.toString()].x, y: screenPositions[targetScreen.toString()].y, z: screenPositions[targetScreen.toString()].z };
      screenMap[activeScreen.toString()].current.material.opacity = screenMap[targetScreen.toString()].current.material.opacity;
      // screenMap[activeScreen.toString()].current.rotation.set(screenMap[targetScreen.toString()].current.rotation);

      moveToScreenPositions[targetScreen.toString()] = { x: 0, y: 0, z: 0 };

      // screenMap[targetScreen.toString()].current.height = 4;
      screenMap[targetScreen.toString()].current.material.opacity = 1;
      screenMap[targetScreen.toString()].current.rotation.set(0, 0, 0);
      console.log(screenMap[targetScreen.toString()].current);
      activeScreen = targetScreen;
    }

    if (e.wheelDelta < 0) {
      const targetScreen = activeScreen - 1;

      moveToScreenPositions[activeScreen.toString()] = { x: screenPositions[targetScreen.toString()].x, y: screenPositions[targetScreen.toString()].y, z: screenPositions[targetScreen.toString()].z };
      screenMap[activeScreen.toString()].current.material.opacity = screenMap[targetScreen.toString()].current.material.opacity;
      // screenMap[activeScreen.toString()].current.rotation.set(screenMap[targetScreen.toString()].current.rotation);

      moveToScreenPositions[targetScreen.toString()] = { x: 0, y: 0, z: 0 };

      screenMap[targetScreen.toString()].current.material.opacity = 1;
      screenMap[targetScreen.toString()].current.rotation.set(0, 0, 0);

      activeScreen = targetScreen;
    }
  };


  useFrame((state, delta) => {

/*     viewVector.set(state.camera.position.x + pointer.x * 0.1, state.camera.position.y + pointer.y * 0.1, state.camera.position.z);
    viewVector2.set(pointer.x * 0.1, ref2.current.position.y + pointer.y, state.camera.position.z + pointer.x).addScalar(ref2.current.position.x * 0.1);
    viewVector3.set(-ref3.current.position.x + pointer.x, -ref3.current.position.y + pointer.y, state.camera.position.z).addScalar(ref3.current.position.z * 0.1);
    viewVector4.set(ref4.current.position.x + pointer.x * 0.1, ref4.current.position.y + pointer.y * 0.1, state.camera.position.z).addScalar(ref4.current.position.z * 0.1);
    viewVector5.set(-ref5.current.position.x + pointer.x, -ref5.current.position.y + pointer.y, state.camera.position.z * 2).addScalar(ref5.current.position.x * 0.1);
    viewVector6.set(state.camera.position.z + pointer.x, -ref6.current.position.y + pointer.y * 0.1, state.camera.position.z * 2).addScalar(ref6.current.position.x * 0.1);
    viewVector7.set(-state.camera.position.z + pointer.x, pointer.y, state.camera.position.z * 2); */

    if (display) {
      for(let i = 1; i < screens.length + 1; i++) {
        if (activeScreen !== i) {

          screenMap[i.toString()].current.lookAt(pointer.x, pointer.y, state.camera.position.z);
        }
      }
/*       ref.current.lookAt(viewVector);
      ref2.current.lookAt(viewVector2);
      ref3.current.lookAt(viewVector3);
      // ref4.current.lookAt(viewVector4); //TODO: ex. disable this for the active screen to prevent the rotation
      ref5.current.lookAt(viewVector5);
      ref6.current.lookAt(viewVector6);
      ref7.current.lookAt(viewVector7); */
    }

    if (display) {
      animate();
    }
  });

  return (
    <group {...props} visible={display}>
      <mesh ref={ref2} castShadow receiveShadow>
        <meshBasicMaterial color={0x40E0D0} transparent map={texture2}/>
        <planeGeometry args={[5, 5]} />
      </mesh>
      <mesh ref={ref} castShadow receiveShadow>
        <meshPhongMaterial transparent map={texture2}/>
        <planeGeometry args={[5, 5]} />
      </mesh>
      <mesh ref={ref3} castShadow receiveShadow>
        <meshBasicMaterial color={0xFF69B4} transparent map={texture}/>
        <planeGeometry args={[5, 5]} />
      </mesh>
      <mesh ref={ref4} castShadow receiveShadow>
        <meshPhongMaterial color={0xFF69B4} transparent map={texture3}/>
        <planeGeometry args={[5, 5]} />
      </mesh>
      <mesh ref={ref5} castShadow receiveShadow>
        <meshBasicMaterial color={0x8B008B} transparent map={texture}/>
        <planeGeometry args={[5, 5]} />
      </mesh>
      <mesh ref={ref6} castShadow receiveShadow>
        <meshBasicMaterial color={0x7FFF00} transparent map={texture2}/>
        <planeGeometry args={[5, 5]} />
      </mesh>
      <mesh ref={ref7} castShadow receiveShadow>
        <meshBasicMaterial color={0x7FFF00} transparent map={texture3}/>
        <planeGeometry args={[5, 5]} />
      </mesh>
    </group>
  )
};


export const InteractiveObjectNode = (props) => {
  const [hovered, hover] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [active, setActive] = useState(false);
  const [clicked, setClicked] = useState(false);
  const scene = useStore(state => state.scene);
  const setScene = useStore(state => state.setScene);
  const setProject = useStore(state => state.setProject);
  const loader = new TextureLoader();


  const { modelInfo, material, hitbox, position, showInScenes, label, rotation } = props;

  const textVector = new Vector3();
  // const rotationVector = new Vector3(rotation[0], rotation[1], rotation[2]);
  const meshRef = useRef(null);
  const screenPlaneRef = useRef(null);

  const AUTO_ROTATION_SPEED = 0.05;
  const MAX_ANGLE = 0.03;
  
  let display = showInScenes.includes(scene) || showInScenes.includes('all');

  if (scene === 'details' && !active) { // necessary since the label is linked to this object
   display = false;
  }

  let model = null;
  if (modelInfo) {
    model = useLoader(
      OBJLoader,
      modelInfo.name,
      (loader) => {
        const mtlLoader = new MTLLoader();
        mtlLoader.load(material, (materials) => {
          loader.setMaterials(materials);
        });
      },
    );
  }
  

  const animate = () => {

    if (screenPlaneRef.current.scale.y < 0.99) {
      screenPlaneRef.current.scale.x += (1 - screenPlaneRef.current.scale.x) * 0.08;
      screenPlaneRef.current.scale.y += (1 - screenPlaneRef.current.scale.y) * 0.05;
    } else {
      screenPlaneRef.current.scale.set(1, 1, 1);
      // setAnimationFinished(true);
    }

    if (screenPlaneRef.current.rotation.y < 0) {
      screenPlaneRef.current.rotation.y += 0.05;
    } else {
      screenPlaneRef.current.rotation.set(0, 0, 0);
      // setAnimationFinished(true);
    }
  };

  useEffect(() => {
    let objectLabel = document.createElement("div");
    objectLabel.id = label;
    objectLabel.style.position = "absolute";
    objectLabel.style.color = "black";
    // objectLabel.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    // objectLabel.style.border = "solid white 2px";
    // objectLabel.style.boxShadow = "5px 3px rgba(255, 255, 255, 1)";
    objectLabel.style.padding = "0.5rem";
    objectLabel.style.fontSize = "1.2rem";
    objectLabel.style.fontWeight = "bold";
    objectLabel.style.overflow = "hidden";
    objectLabel.style.textShadow = "0.3px 0.3px 2px rgba(255, 255, 255, 1)";
    objectLabel.innerHTML = `<h3 className="[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]">${label || ''}</h3>`;

    // objectLabel.innerHTML = `<Image src="/images/texture_text_test.png" width={100} height={50} alt="text" />`;

    document.body.appendChild(objectLabel);

  }, []);

  useEffect(() => {
    const texture = loader.load( 'https://picsum.photos/300');
    screenPlaneRef.current.material.map = texture;
    
    if (scene === "cover") { // set initial position pre-lerp
      meshRef.current.position.set(position[0], position[1], position[2]);
    }
    if (scene !== "details") {
      setActive(false);
    }
    if (scene === "details") {
      meshRef.current.position.set(0, 0, 0);
    }
    
    screenPlaneRef.current.scale.set(0, 0, 0);
    screenPlaneRef.current.rotation.set(0, -2, 0);
    // setAnimationFinished(false);
  }, [scene]);

  // Change color of the model by traversing meshes and assigning a random color
  
  useEffect(() => {
    (model as Object3D).traverse((child) => {
      if (child.type === "Mesh") {
        (child as Mesh).material = new MeshStandardMaterial({
          color: new Color(Math.random(), Math.random(), Math.random()),
          roughness: 0.2,
          metalness: 0.5,
        });
      }
    });

    // setTextureLoaded(true);
  }, [model]);

  useFrame((state, delta) => {
    meshRef.current.updateMatrixWorld();
    textVector.setFromMatrixPosition(meshRef.current.matrixWorld);
    textVector.project(state.camera);

    if (hovered || active) {
      meshRef.current.rotation.y = (Math.sin(state.clock.elapsedTime - delta) * 5) * MAX_ANGLE;
    }

    if (!hovered) {
      meshRef.current.rotation.y = 0;
    }
    
    const textElement = document.getElementById(label);
    
    if (scene === "cover") {
      meshRef.current.position.y = Math.sin((state.clock.getElapsedTime() - delta)) * AUTO_ROTATION_SPEED;
      meshRef.current.rotation.x += delta * AUTO_ROTATION_SPEED;
      meshRef.current.rotation.z += delta * AUTO_ROTATION_SPEED;
    }
    
    if(scene === "overview") {
      meshRef.current.position.lerp({x: position[0], y: position[1], z: position[2]}, 0.05);
      // rotationVector.lerp({x: rotation[0], y: rotation[1], z: rotation[2]}, 0.05);
      // meshRef.current.rotation.lerp({x: rotation[0], y: rotation[1], z: rotation[2]}, 0.01);
    } 

    if (scene === "overview" && !animationFinished) {
      animate();
    }

    const widthHalf = state.size.width / 2;
    const heightHalf = state.size.height / 2;
    const allowedWidth = state.size.width - state.size.width / 10;
    const allowedHeight = state.size.height - state.size.height / 10;
    const xOffset = 100;
    const yOffset = 6;

    textVector.x = textVector.x * widthHalf + widthHalf - xOffset;
    textVector.y = -(textVector.y * heightHalf) + heightHalf + yOffset;

    if (
      textVector.x > allowedWidth ||
      textVector.x < 0 ||
      textVector.y > allowedHeight ||
      textVector.y < 0 ||
      textVector.z < 0 ||
      textVector.z > 1
    ) {
      textElement.style.display = "none";
    } else if (textElement) {
      textElement.style.left = `${textVector.x}px`;
      textElement.style.top = `${textVector.y}px`;
      textElement.style.minWidth = "200px";
      textElement.style.fontSize = "1.5rem";
      textElement.style.fontWeight = "200";
      textElement.style.fontKerning = "wide";
      textElement.style.color = "white";
      textElement.style.textShadow = "0.8px 0.8px 0.2px rgba(99, 102, 241, 0.8)";
      textElement.style.textAlign = "center";
      textElement.style.display = display && scene !== 'cover' ? 'block' : 'none';

      props.selectedPosition.x = textVector.x;
      props.selectedPosition.y = textVector.y;
    }
  });

  return (
    <mesh ref={meshRef} rotation={rotation} visible={display} scale={hovered ? props.scale * 1.1 : props.scale}>
      <mesh position={[0, hovered ? 10 : 0, 370]} visible={scene === 'cover'}>
        <primitive object={(model as Object3D).clone()} />
      </mesh>
      <mesh 
        ref={screenPlaneRef}
        visible={scene === 'overview'} 
        position={[0, 2000, 0]}
        onPointerOver={() => {
            hover(true);
        }}
        onPointerOut={() => {
            hover(false);
        }}
        onClick={() => {
          if (scene !== "details") { 
            setClicked(true);
            setProject(label);
            props.setProjectName(`project_${props.indexNr}`);
            props.setClickedObj(meshRef.current.position); // !this is a full reference to the mesh position vector
    
            setScene("details");
            setActive(true);
            setClicked(false);
          }
        }}
      >
        <planeGeometry args={[5 * window.innerWidth * 0.7, 4 * window.innerWidth * 0.7]} />
        <meshBasicMaterial color={0x40E0D0} transparent opacity={1} />
      </mesh>
{/*       <mesh
        position={hitbox.position}
        onPointerOver={() => {
          if (scene !== "details") {
            hover(true);
          }
        }}
        onPointerOut={() => {
          {
            hover(false);
          }
        }}
        onClick={() => {
          if (scene !== "details") { 
            setClicked(true);
            setProject(label);
            props.setProjectName(`project_${props.indexNr}`);
            props.setClickedObj(meshRef.current.position); // !this is a full reference to the mesh position vector
    
            setScene("details");
            setActive(true);
            setClicked(false);
          }

        }}
      >
        {hitbox.geometry === 'box' && 
          <boxGeometry args={hitbox.size} />
        }
        {hitbox.geometry === 'sphere' && 
          <sphereGeometry args={hitbox.size} />
        }
        {hitbox.geometry === 'cone' && 
          <coneGeometry args={hitbox.size} />
        }
        <meshPhongMaterial transparent opacity={0} />
      </mesh> */}
    </mesh>
  );
};

type ImportModel = {
  name: string;
  format: string;
};

type HitBox = {
  size: [number, number, number];
  position: Vector3;
  geometry: 'box' | 'sphere' | 'cone';
};


class BaseObject {
  modelInfo?: ImportModel;
  material?: string;
  hitbox?: HitBox;
  position?: Vector3 | [number, number, number];
  scale: number;
  rotation?: Vector3 | [number, number, number];
  showInScenes?: string[]

  constructor(
    modelInfo: ImportModel,
    material: string,
    hitbox: HitBox,
    position: Vector3 | [number, number, number],
    scale: number,
    rotation: Vector3 | [number, number, number],
    showInScenes: string[]
  ) {
    this.modelInfo = modelInfo;
    this.material = material;
    this.hitbox = hitbox;
    this.position = position;
    this.scale = scale;
    this.rotation = rotation;
    this.showInScenes = showInScenes;
  }
};


const Director = ({
  selectedPosition,
  setProjectName,
  trackerRef,
}) => {
  const [clickedObj, setClickedObj] = useState(new Vector3(0, 0, 4));
  const [allObj, setAllObj] = useState([]);
  const scene = useStore(state => state.scene);


  class CameraProps {
    cameraPosition: Vector3;
    orbref: React.MutableRefObject<any>;
    autoRotate: boolean;
    clickedObj: Vector3;
    allObj: Vector3[];
  
    constructor() {
      this.orbref = trackerRef;
      this.autoRotate = scene === "cover";
      this.clickedObj = clickedObj;
      this.allObj = allObj;
      this.cameraPosition = this.setCameraPositionFromScene();
    }
    private setCameraPositionFromScene() {
      const VIEW_DISTANCE = 7;
      const VIEW_HEIGHT = 2;

      switch (scene) {
        case "cover":
          return new Vector3(0, 0, 5);
        case "overview":
          return new Vector3(0, 0, 12);
        case "details":
          return new Vector3(0, VIEW_HEIGHT, VIEW_DISTANCE);
        default:
          return new Vector3(0, 0, 0);
      }
    }
  };

  const cameraProps = new CameraProps();
  
  class InteractiveObjectProps extends BaseObject {
    setClickedObj: (position: Vector3) => void;
    setAllObj: (interactiveObjects: Vector3[]) => void;
    readonly scene: string;
    selectedPosition: { x: number; y: number };
    setProjectName: (name: string) => void;
    label: string;
    showInScenes?: string[];
    node: JSX.Element;

    constructor(props: {
        modelInfo?: ImportModel,
        material?: string,
        label?: string,
        hitbox?: HitBox,
        position: Vector3 | [number, number, number],
        scale: number,
        rotation: Vector3 | [number, number, number],
        showInScenes: string[]
      }
    ) {
      super(props.modelInfo, props.material, props.hitbox, props.position, props.scale, props.rotation, props.showInScenes);
      this.label = props.label;
      this.setClickedObj = setClickedObj;
      this.setAllObj = setAllObj;
      this.selectedPosition = selectedPosition;
      this.setProjectName = setProjectName;
      this.node = <InteractiveObjectNode key={props.label} {...this} />;
    }
  };

  type vector = [number, number, number];

  const objectPositionDirections = {
    markanta: {
      'cover': {
        position: [3, 0, 1] as vector,
        rotation: [4, 5, 1] as vector,
      },
      'overview': {
        position: [5, 3, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [5, 2, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    motherstructures: {
      'cover': {
        position: [0, 0, -4] as vector,
        rotation: [8, 0, 4] as vector,
      },
      'overview': {
        position: [-5, 3.5, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [-5, 4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    about: {
      'cover': {
        position: [3, 1, -6] as vector,
        rotation: [2, 2, 0] as vector,
      },
      'overview': {
        position: [5, -5, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [5, -4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    various: {
      'cover': {
        position: [3, 1, -6] as vector,
        rotation: [2, 2, 0] as vector,
      },
      'overview': {
        position: [-5, -4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [-5, -4, 0]as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    display_screens: {
      'cover': {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
        scale: 0.01,
      },
      'overview': {
        position: [0, 2, 0] as vector,
        rotation: [0, 0, 0] as vector,
        scale: 1,
      },
      'details': {
        position: [0, 2, 0] as vector,
        rotation: [0.01, 0, 0] as vector,
        scale: 1,
      }
    },
    tree_g: {
      'cover': {
        position: [2, 0, 0] as vector,
        rotation: [7, 0, 1] as vector,
      },
      'overview': {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    tree_g2: {
      'cover': {
        position: [-1, -4, -3] as vector,
        rotation: [4, 0, 0] as vector,
      },
      'overview': {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
  };

  // Ensure labels are unique
  const interactiveObjects: InteractiveObjectProps[] = [
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: { size: [2000, 4000, 2000], position: new Vector3(0, 2000, 0), geometry: 'box' },
      position: objectPositionDirections.markanta[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.markanta[scene].rotation,
      label: 'markanta',
      showInScenes: ["cover", "overview"]
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      position: objectPositionDirections.various[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.various[scene].rotation,
      label: 'various',
      showInScenes: ["cover", "overview"]
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: { size: [2000, 4000, 2000], position: new Vector3(0, 2000, 0), geometry: 'box' },
      position: objectPositionDirections.tree_g2[scene].position,
      scale: 0.002,
      rotation: objectPositionDirections.tree_g2[scene].rotation,
      showInScenes: ["cover"]
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: { size: [2000, 4000, 2000], position: new Vector3(0, 2000, 0), geometry: 'box' },
      position: objectPositionDirections.about[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.about[scene].rotation,
      label: 'about_me',
      showInScenes: ["cover", "overview"]
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: { size: [2000, 8000, 2000], position: new Vector3(0, 2000, 500), geometry: 'cone' },
      position: objectPositionDirections.motherstructures[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.motherstructures[scene].rotation,
      label: 'motherstructures',
      showInScenes: ["cover", "overview"]
    }),
/*     new InteractiveObjectProps({
      modelInfo: { name: "models/_gran/__gran_final.obj", format: "obj" },
      material: "models/_gran/__gran_final.mtl",
      hitbox: { size: [2000, 8000, 2000], position: new Vector3(0, 2000, 500), geometry: 'cone' },
      position: objectPositionDirections._gran2[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections._gran[scene].rotation,
      label: 'gran_2',
      showInScenes: ["cover", "overview"]
    }), */
  ];

  const display_screens_props = new InteractiveObjectProps({
    position: objectPositionDirections.display_screens[scene].position,
    scale: objectPositionDirections.display_screens[scene].scale,
    rotation: objectPositionDirections.display_screens[scene].rotation,
    showInScenes: ["details"]
  });


  return (
    <>
      <CameraController
        {...cameraProps}
      />
      <ambientLight position={[1, 10, 0]} intensity={1} visible={scene !== "details"} />
      {/* <ambientLight intensity={2} visible={scene !== "cover"} /> */}
      {/* <directionalLight position={[0, 10, 7]} intensity={4} visible={scene === "overview"} /> */}
      {/* <fog attach="fog" args={["coral", 6, 14]} /> */}
      {/* <pointLight position={[-3, 2, 1]} intensity={4} visible={scene === "details"} /> */}
      <directionalLight position={[4, 0, 2]} intensity={4} visible={scene === "details"} />

      {interactiveObjects.map((props, key) => 
        <InteractiveObjectNode key={key} {...props} />
      )}
      
      <DisplayScreen {...display_screens_props} />  
    </>
  );
};

export const CanvasUI = () => {
  const [selectedPosition] = useState({ x: 0, y: 0 });
  const [projectName, setProjectName] = useState("");
  const project = useStore(state => state.project);
  const trackerRef = useRef(null);
  const scene = useStore(state => state.scene);
  const animationReady = useStore(useShallow((state) => state.animationReady));

  let backgroundStyle = '';

  switch (scene) {
    case "cover":
      backgroundStyle = 'bg-transparent';
      break;
    case "overview":
      backgroundStyle = 'bg-gradient-to-r from-[pink] to-[white]/60';
      break;
    case "details":
      backgroundStyle = 'bg-gradient-to-r from-[pink] to-pink-200/60';
      break;
    default:
      backgroundStyle = 'bg-transparent';
  }

  return (
    <div
      className={`transition-all duration-800 ease-in fixed w-full h-full ${backgroundStyle}`}
    >
      <Canvas fallback={Fallback()} shadows>
        <Suspense fallback={<mesh><boxGeometry args={[5, 5, 5]} /><meshBasicMaterial /></mesh>}>
          <Director
            selectedPosition={selectedPosition}
            setProjectName={setProjectName}
            trackerRef={trackerRef}
          />

        </Suspense>
      </Canvas>
      {project &&
        <ProjectDetailScreen
          visible={animationReady}
          title={projectName}
          selectedPosition={selectedPosition}
        />
      }

      <div
        ref={trackerRef}
        className={`fixed bottom-4 left-0 text-2xl ${scene === 'cover' ? 'text-foreground' : 'text-background'} p-2 z-10 [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]`}
      />
    </div>
  );
};
