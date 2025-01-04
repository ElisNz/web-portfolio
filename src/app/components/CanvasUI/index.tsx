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

import { ProjectDetailScreen } from "@/app/screens";


const CameraController = ({
  cameraPosition,
  orbref,
  autoRotate,
  clickedObj,
  scene,
  animationReady,
  setAnimationReady,
} : {
  cameraPosition: Vector3;
  orbref: React.MutableRefObject<any>;
  autoRotate: boolean;
  clickedObj: Vector3;
  scene: string;
  animationReady: boolean;
  setAnimationReady: (ready: boolean) => void;
}) => {
  const { camera, gl, raycaster } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);
  const pointer = new Vector2();

  
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.1;

  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;

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
      controls.object.position.y = 2;
      controls.object.position.z = 7;
      controls.object.position.x = 0;
    }
    if (scene === "details") {
      controls.autoRotate = false;
    }
  }, [scene]);

  useFrame((state, delta) => {
    state.scene.name = scene;
    let currentPos = new Vector3().copy(camera.position);


    // initial pan to object position
    if (scene === "overview") {
      controls.object.position.lerp(cameraPosition, 0.01);
      controls.target.lerp(new Vector3(0, 1.2, 0), 0.01);
    }
    // interactive click-pan
    if (scene === "details") {
      // TODO: explore lerp to mutate objects to 0,0,0 instead of camera
      /* clickedObj.lerp(new Vector3(0, 0, 0), 0.01); */
      controls.target.lerp(new Vector3(clickedObj.x, clickedObj.y + 1.5, clickedObj.z), 0.1);

      controls.object.position.lerp(
        new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z),
        0.01,
      );
    }


    if (scene === "details" && !animationReady && controls.object.position.distanceTo(cameraPosition) < 1) {
      // TODO: this should use zustand store to avoid re-rendering the camera
      setAnimationReady(true);
    }

    if (animationReady) {
      raycaster.setFromCamera(pointer, camera);
      controls.object.position.lerp(
        raycaster.ray.direction.negate(),
        0.006,
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

  const { modelInfo, material, hitbox, position, scale, rotation } = props;

  const textVector = new Vector3(0, 0, 0);
  const meshRef = useRef(null);

  const hoveredRotationSpeed = 0.2;

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
    let divElem = document.createElement("div");
    divElem.id = props.label;
    divElem.style.position = "absolute";
    divElem.style.color = "white";
    divElem.style.backgroundColor = "black";
    divElem.style.border = "solid white 2px";
    divElem.style.boxShadow = "5px 3px rgba(255, 255, 255, 1)";
    divElem.style.padding = "0.5rem";
    divElem.style.fontSize = "1.2rem";
    divElem.style.fontWeight = "bold";
    divElem.style.overflow = "hidden";
    divElem.innerHTML = `<h3>${props.label}</h3>`;

    document.body.appendChild(divElem);
  }, []);

  useEffect(() => {
    if (props.scene !== "details") {
      setActive(false);
    }
  }, [props.scene]);

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
      meshRef.current.rotation.y += delta * hoveredRotationSpeed;
    }

    const textElement = document.getElementById(props.label);

    if (!textElement) {
      return;
    }
    if (props.scene === "cover") {
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
      textElement.style.display = "block";

      props.selectedPosition.x = textVector.x;
      props.selectedPosition.y = textVector.y;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <primitive object={(model as Object3D).clone()} position={[0, hovered ? 10 : 0, 370]} />
      <mesh
        position={hitbox.position}
        onPointerOver={() => {
          if (props.scene !== "details") {
            hover(true);
          }
        }}
        onPointerOut={() => {
          {
            hover(false);
          }
        }}
        onClick={() => {
          if (props.scene !== "details") {
            props.setClickedObj(meshRef.current.position);
            props.setScene("details");
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
  scene,
  setScene,
  selectedPosition,
  setProjectName,
  trackerRef,
  animationReady,
  setAnimationReady,
}) => {
  const [clickedObj, setClickedObj] = useState(new Vector3(0, 0, 4));

  class CameraProps {
    cameraPosition: Vector3;
    orbref: React.MutableRefObject<any>;
    autoRotate: boolean;
    clickedObj: Vector3;
    scene: string;
    animationReady: boolean;
    setAnimationReady: (ready: boolean) => void;
  
    constructor() {
      
      this.orbref = trackerRef;
      this.autoRotate = scene === "cover";
      this.clickedObj = clickedObj;
      this.scene = scene;
      this.cameraPosition = this.setCameraPositionFromScene(scene);
      this.animationReady = animationReady;
      this.setAnimationReady = setAnimationReady;
    }
    private setCameraPositionFromScene(scene: string) {

      if (scene === "cover") {
        return new Vector3(4, 0, 2);
      }
      if (scene === "overview") {
        return new Vector3(0, 2, 12);
      }
      if (scene === "details") {
        return new Vector3(clickedObj.x, clickedObj.y + 2, clickedObj.z + 7);
      }
    }
  };

  const cameraProps = new CameraProps();
  
  class InteractiveObjectProps extends BaseObject {
    setClickedObj: (position: Vector3) => void;
    readonly scene: string;
    setScene: (scene: string) => void;
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
      this.scene = scene;
      this.setScene = setScene;
      this.selectedPosition = selectedPosition;
      this.setProjectName = setProjectName;
      this.node = <InteractiveObjectNode key={props.label} {...this} />;
    }
  };


  const objects: InteractiveObjectProps[] = [
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: { size: [2000, 4000, 2000], position: new Vector3(0, 2000, 0), geometry: 'box' },
      position: [8, 0, 0],
      scale: 0.001,
      rotation: [0, 0, 0],
      label: 'my_project',
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/tree_q/tree_q.obj", format: "obj" },
      material: "models/tree_q/tree_q.mtl",
      hitbox: { size: [200, 400, 200], position: new Vector3(0, 200, 0), geometry: 'box' },
      position: [0, 0, 0],
      scale: 0.01,
      rotation: [0, 0, 0],
      label: 'my_other_project',
    }),
    new InteractiveObjectProps({
      modelInfo: { name: "models/_gran/__gran_final.obj", format: "obj" },
      material: "models/_gran/__gran_final.mtl",
      hitbox: { size: [2000, 8000, 2000], position: new Vector3(0, 2000, 500), geometry: 'cone' },
      position: [-8, 0, 0],
      scale: 0.001,
      rotation: [0, 0, 0],
      label: 'my_other_project_2',
    }),
  ];

  return (
    <>
      <CameraController
        {...cameraProps}
      />
      <fog attach="fog" args={["#CD7A6D", 8, 25]} />
      {scene !== "cover" && (
        <>
          <ambientLight intensity={1.5} />
          <directionalLight position={[0, 10, 0]} intensity={4} />
        </>
      )}
      {objects.map((props, key) => 
        <InteractiveObjectNode key={key} {...props} />
      )}
    </>
  );
};

export const CanvasUI = ({ scene, setScene }) => {
  const [animationReady, setAnimationReady] = useState(false);
  const [selectedPosition] = useState({ x: 0, y: 0 });
  const [projectName, setProjectName] = useState("");
  const trackerRef = useRef(null);

  useEffect(() => {
    setAnimationReady(false);
  }, [scene]);

  return (
    <div
      className={`fixed w-full h-full ${scene === "cover" ? "" : "bg-gradient-to-r from-indigo-500/50 from-10% via-purple-500 via-30% to-pink-500/50"}`}
    >
      <Canvas>
        <Suspense fallback={null}>
          <Director
            scene={scene}
            setScene={setScene}
            selectedPosition={selectedPosition}
            setProjectName={setProjectName}
            trackerRef={trackerRef}
            animationReady={animationReady}
            setAnimationReady={setAnimationReady}
          />
        </Suspense>
      </Canvas>

      {scene === "details" && animationReady && (
        <ProjectDetailScreen
          title={projectName}
          selectedPosition={selectedPosition}
          animationReady={animationReady}
        />
      )}

      <div
        ref={trackerRef}
        className="fixed bottom-4 left-0 text-2xl text-[black]/40 p-2"
      />
    </div>
  );
};
