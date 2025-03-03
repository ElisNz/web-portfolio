"use client";
// Tree test component using three.js with react-three-fiber
import { useEffect, useRef, useState, Suspense } from "react";
import { useFrame, Canvas, useLoader, useThree } from "@react-three/fiber";

import {
  MeshStandardMaterial,
  Color,
  Mesh,
  Vector3,
  Vector2,
  Object3D,
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
  const { camera, gl, raycaster } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);
  const pointer = new Vector2();
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
    let currentPos = new Vector3().copy(camera.position);

    if (scene !== "details") {
      setAnimationReady(false);
    }
    // initial pan to object position
    if (scene === "overview") {
      controls.object.position.lerp({x: 0, y: 3, z: 10}, 0.01);
      // controls.target.lerp(new Vector3(0, 10, 5), 0.1);
      clickedObj.lerp(new Vector3(clickedObj.x, 0, clickedObj.z), 0.01);
    }
    // interactive click-pan
    if (scene === "details") {

      clickedObj.lerp(new Vector3(clickedObj.x, 0.4, 1), 0.05);
      // controls.target.lerp({x: clickedObj.x, y: clickedObj.y + 1.5, z: clickedObj.z}, 0.1);

      /* controls.object.position.lerp(
        {x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z},
        0.1
      ); */
    }
    // console.log(cameraPosition, controls.object.position);

    if (scene === "details" && !animationReady) {
      setAnimationReady(true);
    }

    if (animationReady) {
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


export const InteractiveObjectNode = (props) => {
  const [hovered, hover] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const scene = useStore(state => state.scene);
  const setScene = useStore(state => state.setScene);

  const { modelInfo, material, hitbox, position, scale, rotation } = props;

  const textVector = new Vector3(0, 0, 0);
  const meshRef = useRef(null);

  const ROTATION_SPEED = 0.2;
  const display = scene === 'overview' || scene === 'cover' || (scene === 'details' && active);

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
    objectLabel.style.color = "white";
    // objectLabel.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    // objectLabel.style.border = "solid white 2px";
    // objectLabel.style.boxShadow = "5px 3px rgba(255, 255, 255, 1)";
    objectLabel.style.padding = "0.5rem";
    objectLabel.style.fontSize = "1.2rem";
    objectLabel.style.fontWeight = "bold";
    objectLabel.style.overflow = "hidden";
    objectLabel.innerHTML = `<h3>${props.label}</h3>`;
    // objectLabel.innerHTML = `<Image src="/images/texture_text_test.png" width={100} height={50} alt="text" />`;

    document.body.appendChild(objectLabel);
  }, []);

  useEffect(() => {
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
    textVector.setFromMatrixPosition(meshRef.current.matrixWorld);
    textVector.project(state.camera);
 
    const widthHalf = state.size.width / 2;
    const heightHalf = state.size.height / 2;
    const allowedWidth = state.size.width - state.size.width / 10;
    const allowedHeight = state.size.height - state.size.height / 10;
    const xOffset = state.size.width / 20;
    const yOffset = 40;

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
      textElement.style.display = display ? 'block' : 'none';

      props.selectedPosition.x = textVector.x;
      props.selectedPosition.y = textVector.y;
    }
  });

  return (
    <mesh {...props} ref={meshRef} visible={display}>
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
  modelInfo: ImportModel;
  material?: string;
  hitbox: HitBox;
  position?: Vector3 | [number, number, number];
  scale: number;
  rotation?: Vector3 | [number, number, number];

  constructor(
    modelInfo: ImportModel,
    material: string,
    hitbox: HitBox,
    position: Vector3 | [number, number, number],
    scale: number,
    rotation: Vector3 | [number, number, number],

  ) {
    this.modelInfo = modelInfo;
    this.material = material;
    this.hitbox = hitbox;
    this.position = position;
    this.scale = scale;
    this.rotation = rotation;
  }
};


const Director = ({
  selectedPosition,
  setProjectName,
  trackerRef,
}) => {
  const [clickedObj, setClickedObj] = useState(new Vector3(0, 0, 4));
  const [allObj, setAllObj] = useState([]);
  const store = useStore(state => state);
  const { scene } = store;

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
          return new Vector3(4, 0, 2);
        case "overview":
          return new Vector3(0, 2, 12);
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
    setAllObj: (objects: Vector3[]) => void;
    readonly scene: string;
    selectedPosition: { x: number; y: number };
    setProjectName: (name: string) => void;
    label: string;

    node: JSX.Element;

    constructor(props: {
        modelInfo: ImportModel,
        material: string,
        label: string,
        hitbox: HitBox,
        position: Vector3 | [number, number, number],
        scale: number,
        rotation: Vector3 | [number, number, number],
      }
    ) {
      super(props.modelInfo, props.material, props.hitbox, props.position, props.scale, props.rotation);
      this.label = props.label;
      this.setClickedObj = setClickedObj;
      this.setAllObj = setAllObj;
      this.selectedPosition = selectedPosition;
      this.setProjectName = setProjectName;
      this.node = <InteractiveObjectNode key={props.label} {...this} />;
    }
  };

  type vector = [number, number, number];

  const objectPositionDIrections = {
    tree_g: {
      'cover': {
        position: [8, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'overview': {
        position: [8, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [8, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
    tree_q: {
      'cover': {
        position: [0, 0, 1] as vector,
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
    _gran: {
      'cover': {
        position: [-8, 0, 1] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'overview': {
        position: [-8, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      'details': {
        position: [-8, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      }
    },
  };


  const objects: InteractiveObjectProps[] = [
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: { size: [2000, 4000, 2000], position: new Vector3(0, 2000, 0), geometry: 'box' },
      position: objectPositionDIrections.tree_g[scene].position,
      scale: 0.001,
      rotation: objectPositionDIrections.tree_g[scene].rotation,
      label: 'markanta',
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_q/tree_q.obj", format: "obj" },
      material: "models/tree_q/tree_q.mtl",
      hitbox: { size: [200, 400, 200], position: new Vector3(0, 200, 0), geometry: 'box' },
      position: objectPositionDIrections.tree_q[scene].position,
      scale: 0.01,
      rotation: objectPositionDIrections.tree_q[scene].rotation,
      label: 'about_me',
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/_gran/__gran_final.obj", format: "obj" },
      material: "models/_gran/__gran_final.mtl",
      hitbox: { size: [2000, 8000, 2000], position: new Vector3(0, 2000, 500), geometry: 'cone' },
      position: objectPositionDIrections._gran[scene].position,
      scale: 0.001,
      rotation: objectPositionDIrections._gran[scene].rotation,
      label: 'motherstructures',
    }),
  ];

  return (
    <>
      <CameraController
        {...cameraProps}
      />
      <fog attach="fog" args={["#CD7A6D", 8, 25]} />
      <ambientLight intensity={1.5} visible={scene !== "cover"} />
      <directionalLight position={[0, 10, 0]} intensity={4} visible={scene !== "cover"} />

      {objects.map((props, key) => 
        <InteractiveObjectNode key={key} {...props} />
      )}
    </>
  );
};

export const CanvasUI = () => {
  const [selectedPosition] = useState({ x: 0, y: 0 });
  const [projectName, setProjectName] = useState("");
  const trackerRef = useRef(null);
  const scene = useStore(state => state.scene);
  const animationReady = useStore(useShallow((state) => state.animationReady));

  return (
    <div
      className={`fixed w-full h-full ${scene === "cover" ? "" : "bg-gradient-to-r from-indigo-500/50 from-10% via-purple-500 via-30% to-pink-500/50"}`}
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
        className="fixed bottom-4 left-0 text-2xl text-[black]/40 p-2"
      />
    </div>
  );
};
