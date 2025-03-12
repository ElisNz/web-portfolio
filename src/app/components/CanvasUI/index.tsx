"use client";
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState, Suspense } from "react";
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
  // const pointer = new Vector2();
  const scene = useStore((state) => state.scene);
  const setAnimationReady = useStore((state) => state.setAnimationReady);
  const animationReady = useStore((state) => state.animationReady);


  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 2;

  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
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
    controls.dampingFactor = 1;
    controls.screenSpacePanning = true;

    window.addEventListener("pointermove", onPointerMove);
  }

  useEffect(() => {
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 4;

    controls.enableDamping = true;
    controls.dampingFactor = 2;

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
    if (scene === "details") {
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
      clickedObj.lerp(new Vector3(clickedObj.x, 0, clickedObj.z), 0.05);
    }
    // interactive click-pan
    if (scene === "details") {
      // clickedObj.lerp(new Vector3(0, 0.4, 1), 0.05);
      controls.object.position.lerp(
        {x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z},
        0.05
      );
      controls.target.lerp({x: clickedObj.x, y: clickedObj.y + 2, z: clickedObj.z}, 0.05);
    }

    if (scene === "details" && !animationReady) {
      setAnimationReady(true);
    }
    // interactive pan (move camera from cursor)
    if (scene === 'details' && animationReady) {
      raycaster.setFromCamera(pointer, camera);
      controls.target.lerp(
        raycaster.ray.direction.negate(),
        0.001,
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
  // TODO: create object for use in details
  const scene = useStore(state => state.scene);
  const project = useStore(state => state.project);
  const display = props.showInScenes.includes(scene) || props.showInScenes.includes('all');
  const { pointer } = useThree();

  const loader = new TextureLoader();
  const texture = loader.load( 'https://picsum.photos/300' );
  texture.colorSpace = SRGBColorSpace;
  const texture2 = loader.load( 'https://picsum.photos/1000' );
  texture2.colorSpace = SRGBColorSpace;
  const texture3 = loader.load( 'https://picsum.photos/1000/300' );
  texture3.colorSpace = SRGBColorSpace;

  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);

  const viewVector = new Vector3();
  const viewVector2 = new Vector3();
  const viewVector3 = new Vector3();
  const viewVector4 = new Vector3();
  const viewVector5 = new Vector3();
  const viewVector6 = new Vector3();
  const viewVector7 = new Vector3();

  useFrame((state, delta) => {

    viewVector.set(state.camera.position.x + pointer.x * 0.1, state.camera.position.y + pointer.y * 0.1, state.camera.position.z);
    viewVector2.set(-ref2.current.position.x + pointer.x * 0.1, -ref2.current.position.y + pointer.y * 0.1, state.camera.position.z);
    viewVector3.set(-ref3.current.position.x + pointer.x, -ref3.current.position.y + pointer.y, state.camera.position.z).addScalar(ref3.current.position.z * 0.1);
    viewVector4.set(ref4.current.position.x + pointer.x * 0.1, ref4.current.position.y + pointer.y * 0.1, state.camera.position.z).addScalar(ref4.current.position.z * 0.1);
    viewVector5.set(-ref5.current.position.x + pointer.x, -ref5.current.position.y + pointer.y, state.camera.position.z * 2).addScalar(ref5.current.position.x * 0.1);
    viewVector6.set(state.camera.position.z + pointer.x, -ref6.current.position.y + pointer.y * 0.1, state.camera.position.z * 2).addScalar(ref6.current.position.x * 0.1);
    viewVector7.set(-state.camera.position.z + pointer.x, pointer.y, state.camera.position.z * 2);

    if (display) {
      ref.current.lookAt(viewVector);
      ref2.current.lookAt(viewVector2);
      ref3.current.lookAt(viewVector3);
      ref4.current.lookAt(viewVector4);
      ref5.current.lookAt(viewVector5);
      ref6.current.lookAt(viewVector6);
      ref7.current.lookAt(viewVector7);
    }
    
    // console.log(ref2.current);
    // console.log(state.camera.position);
    // console.log(ref3.current.rotation);
  });

  return (
    <group {...props} visible={display}>
      <mesh position={[4, 4.2, -1]} ref={ref2}>
        <meshBasicMaterial color={0x40E0D0} transparent={true} opacity={0.5} map={texture2}/>
        <boxGeometry args={[2, 2, 0.1]} />
      </mesh>
      <mesh position={[0, 0, 0]} ref={ref}>
        <meshPhongMaterial reflectivity={1} transparent={true} opacity={1} map={texture2}/>
        <boxGeometry args={[5, 5, 0.1]} />
      </mesh>
      <mesh position={[-4, 0, -2]} ref={ref3}>
        <meshBasicMaterial color={0xFF69B4} transparent={true} opacity={0.3} map={texture}/>
        <boxGeometry args={[1, 1, 0.1]} />
      </mesh>
      <mesh position={[-3, 3.5, -1]} ref={ref4}>
        <meshPhongMaterial reflectivity={1} color={0xFF69B4} transparent={true} opacity={0.5} map={texture3}/>
        <boxGeometry args={[6, 3, 0.1]} />
      </mesh>
      <mesh position={[-1, -4, -1.5]} ref={ref5}>
        <meshBasicMaterial color={0x8B008B} transparent={true} opacity={0.4} map={texture}/>
        <boxGeometry args={[2, 2, 0.1]} />
      </mesh>
      <mesh position={[-6, -4, -2]} ref={ref6}>
        <meshBasicMaterial color={0x7FFF00} transparent={true} opacity={0.4} map={texture2}/>
        <boxGeometry args={[4, 4, 0.1]} />
      </mesh>
      <mesh position={[6.5, -3, 0]} ref={ref7}>
        <meshBasicMaterial color={0x7FFF00} transparent={true} opacity={0.4} map={texture3}/>
        <boxGeometry args={[6, 3, 0.1]} />
      </mesh>
    </group>
  )
};


export const InteractiveObjectNode = (props) => {
  const [hovered, hover] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const scene = useStore(state => state.scene);
  const setScene = useStore(state => state.setScene);
  const setProject = useStore(state => state.setProject);

  const { modelInfo, material, hitbox, position, showInScenes, label } = props;

  const textVector = new Vector3(0, 0, 0);
  const meshRef = useRef(null);

  const ROTATION_SPEED = 0.2;
  let display = showInScenes.includes(scene) || showInScenes.includes('all');

  if (scene === 'details' && !active) {
   display = false;
  }

  const model = useLoader(
    OBJLoader,
    modelInfo.name,
    (loader) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(material, (materials) => {
        loader.setMaterials(materials);
      });
    },
  );

  useEffect(() => {
    let objectLabel = document.createElement("div");
    objectLabel.id = props.label;
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
    objectLabel.innerHTML = `<h3 className="[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]">${props.label}</h3>`;
    // objectLabel.innerHTML = `<Image src="/images/texture_text_test.png" width={100} height={50} alt="text" />`;

    document.body.appendChild(objectLabel);
  }, []);

  useEffect(() => {
    if (scene === "cover") { // initial position pre-lerp
      meshRef.current.position.set(position[0], position[1], position[2]);
    }
    if (scene !== "details") {
      setActive(false);
    }
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
    setLoaded(true);
  }, [model]);

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.01;
    if (hovered || active) {
      meshRef.current.rotation.y += delta * ROTATION_SPEED;
    }
    
    const textElement = document.getElementById(props.label);
    

    if (!textElement) {
      return;
    }
    if (scene === "cover") {
      textElement.style.display = "none";
      return;
    }

    meshRef.current.updateMatrixWorld();
    if( scene === "overview") {
      meshRef.current.position.lerp({x: position[0], y: position[1], z: position[2]}, 0.05);
    } else if (scene === "details") {
      meshRef.current.position.set( 0, 0, 0);
    }
    textVector.setFromMatrixPosition(meshRef.current.matrixWorld);
    textVector.project(state.camera);
    
 
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
    } else {
      textElement.style.left = `${textVector.x}px`;
      textElement.style.top = `${textVector.y}px`;
      textElement.style.minWidth = "200px";
      textElement.style.fontSize = "1.5rem";
      textElement.style.textShadow = "0.3px 0.3px 0px rgba(0, 0, 0, 0.5)";
      textElement.style.textAlign = "center";
      textElement.style.display = display ? 'block' : 'none';

      props.selectedPosition.x = textVector.x;
      props.selectedPosition.y = textVector.y;
    }
  });

  return (
    <mesh ref={meshRef} visible={display} scale={hovered ? props.scale * 1.1 : props.scale}>
      <primitive object={(model as Object3D).clone()} position={[0, hovered ? 10 : 0, 370]} />
      <mesh
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
            props.setClickedObj(meshRef.current.position);
            
            setScene("details");
            setActive(true);
            setProject(label);
            props.setProjectName(`project_${props.indexNr}`);
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
      </mesh>
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
      this.autoRotate = false;
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
          return new Vector3(clickedObj.x, clickedObj.y + VIEW_HEIGHT, clickedObj.z + VIEW_DISTANCE);
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
        position: [-6, 0, -1] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'overview': {
        position: [4, 2, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    motherstructures: {
      'cover': {
        position: [4, 0, 2] as vector,
        rotation: [8, 0, 4] as vector,
      },
      'overview': {
        position: [-4, 2, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    about: {
      'cover': {
        position: [2, 2, 6] as vector,
        rotation: [2, 2, 0] as vector,
      },
      'overview': {
        position: [0, -4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [0, 0, 0] as vector,
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
        position: [0, 0, 0] as vector,
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
        position: [0, -4, 0] as vector,
        rotation: [0, 0, 0] as vector,
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
      label: 'Markanta',
      showInScenes: ["cover", "overview"]
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_q/tree_q.obj", format: "obj" },
      material: "models/tree_g/tree_q.mtl",
      hitbox: { size: [2000, 4000, 2000], position: new Vector3(0, 2000, 0), geometry: 'box' },
      position: objectPositionDirections.tree_g[scene].position,
      scale: 0.02,
      rotation: objectPositionDirections.tree_g[scene].rotation,
      showInScenes: ["cover"]
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "/models/kaktus_jacob/_kaktus final.obj", format: "obj" },
      material: "/models/kaktus_jacob/_kaktus.mtl",
      hitbox: { size: [2000, 4000, 2000], position: new Vector3(0, 2000, 0), geometry: 'box' },
      position: objectPositionDirections.about[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.about[scene].rotation,
      label: 'About_me',
      showInScenes: ["cover", "overview"]
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "/models/kaktus_jacob/_kaktus final.obj", format: "obj" },
      material: "/models/kaktus_jacob/_kaktus.mtl",
      hitbox: { size: [2000, 8000, 2000], position: new Vector3(0, 2000, 500), geometry: 'cone' },
      position: objectPositionDirections.motherstructures[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.motherstructures[scene].rotation,
      label: 'Motherstructures',
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
      
      <ambientLight intensity={1.5} visible={scene !== "cover"} />
      <directionalLight position={[0, 10, 7]} intensity={4} visible={scene === "overview"} />
      <directionalLight position={[0, 0, 2]} intensity={4} visible={scene === "details"} />

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
      <Canvas>
        <Suspense fallback={Fallback()}>
          <Director
            selectedPosition={selectedPosition}
            setProjectName={setProjectName}
            trackerRef={trackerRef}
          />

        </Suspense>
      </Canvas>

      <ProjectDetailScreen
        visible={animationReady}
        title={projectName}
        selectedPosition={selectedPosition}
      />

      <div
        ref={trackerRef}
        className={`fixed bottom-4 left-0 text-2xl ${scene === 'cover' ? 'text-foreground' : 'text-background'} p-2 z-10 [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]`}
      />
    </div>
  );
};
