"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useFrame, Canvas, useLoader, useThree } from "@react-three/fiber";

import {
  MeshStandardMaterial,
  MeshBasicMaterial,
  Color,
  Mesh,
  Vector3,
  Object3D,
  TextureLoader,
  SRGBColorSpace,
  MathUtils
} from "three";

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/Addons.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { useStore } from "@/app/Store";
import { useShallow } from "zustand/react/shallow";
import { ProjectDetailScreen } from "@/app/screens";
import { ImportModel, HitBox } from "@/app/types";


const Fallback = () => {
  return <p>fallback</p>;
};

const CameraController = ({
  cameraPosition,
  orbref,
  autoRotate,
}: {
  cameraPosition: Vector3;
  orbref: React.MutableRefObject<any>;
  autoRotate: boolean;
  clickedObj: Vector3;
}) => {
  const { camera, gl, raycaster, pointer } = useThree();
  const controls = new OrbitControls(camera, gl.domElement);
  const scene = useStore((state) => state.scene);
  const project = useStore((state) => state.project);
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

    // use heightened coefficient for pointer. This will work without the following line.
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
  }

  if (scene === "details") {
    controls.screenSpacePanning = true;
    window.addEventListener("pointermove", onPointerMove);
  }

  useEffect(() => {
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 4;

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

  useFrame((state) => {
    state.scene.name = scene;

    if (scene === "cover") {
      controls.object.position.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
      );
      controls.target.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z - 1,
      );
    }

    if (scene !== "details") {
      setAnimationReady(false);
      window.removeEventListener("pointermove", onPointerMove);
    }
    // initial pan to object position
    if (scene === "overview") {
      controls.object.position.lerp(
        { x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z },
        0.05,
      );
      controls.target.lerp({ x: 0, y: 0, z: 0 }, 0.05);
    }
    // interactive click-pan
    if (scene === "details") {
      controls.enableDamping = true;
      controls.dampingFactor = 2;

      controls.object.position.lerp(
        { x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z },
        0.04,
      );
      controls.target.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z * 0.8,
      );
    }

    if (scene === "details" && !animationReady) {
      setAnimationReady(true);
    }
    // interactive pan (move camera from cursor)
    if (scene === "details" && animationReady) {
      raycaster.setFromCamera(pointer, camera);
      controls.target.lerp(raycaster.ray.direction.negate(), 0.005);
    }

    controls.cursor.addVectors(controls.target, controls.object.position);

    orbref.current.innerHTML = `<h3>X: ${controls.object.position.x.toFixed(3)}</h3>
                                <h3>Y: ${controls.object.position.y.toFixed(3)} </h3>
                                <h3>Z: ${controls.object.position.z.toFixed(3)}</h3>
                                <h3>${project ? project : 'no project selected'}</h3>`;

    controls.update();
  });

  return null;
};

const DisplayScreen = (props) => {
  const screens = [1, 2, 3, 4, 5, 6, 7];
  const scene = useStore((state) => state.scene);
  const project = useStore((state) => state.project);
  const [animationFinished, setAnimationFinished] = useState(false);
  const loader = new TextureLoader();

  //const loadingImage = new VideoTexture(document.getElementById('video') as HTMLVideoElement);

  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);

  const refList = [
    ref,
    ref2,
    ref3,
    ref4,
    ref5,
    ref6,
    ref7,
  ];

  const imageColors = [
    new Color(0x40e0d0),
    new Color(0xff69b4),
    new Color(0xff69b4),
    new Color(0x00ff00),
    new Color(0x0000ff),
    new Color(0xffd700),
  ];

  let activeScreen = screens[0];
  const display =
    props.showInScenes.includes(scene) || props.showInScenes.includes("all");
  const { pointer } = useThree();

  const screenPositions = {
    "1": { x: 12, y: 0, z: 0 },
    "2": { x: 6, y: 4.2, z: -6 },
    "3": { x: -8, y: -1, z: -6 },
    "4": { x: -6, y: 4, z: -4 },
    "5": { x: -2, y: -4, z: -3 },
    "6": { x: -20, y: -4, z: -12 },
    "7": { x: 6.5, y: -3, z: -3 },
  };

  const moveToScreenPositions = Object.assign({}, screenPositions);
  moveToScreenPositions["1"] = { x: 0, y: 0, z: 0 }; // avoid putting two separate objects in the same position at 0,0,0

  const screenMap = {
    "1": ref,
    "2": ref2,
    "3": ref3,
    "4": ref4,
    "5": ref5,
    "6": ref6,
    "7": ref7,
  };


  const loadImages = async () => {

    if (!project) {
      refList.forEach((ref) => {
        ref.current.material.map = null;
      });

      return;
    }

    refList.forEach((ref, i) => {
      if (ref.current.material.name === project) {
        return;
      }
      loader.load(`images/${project}/${project}-${i + 1}.png`, (texture) => {
        texture.colorSpace = SRGBColorSpace;
        ref.current.material = new MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: i === 0 ? 1 : 0.5,
          color: imageColors[i - 1],
          name: project,
        });
      }, null, (error) => {
        console.error("Couldn't load texture. Loaded placeholder instead.", error);
        loader.load(`images/texture_text_test.png`, (texture) => {
          texture.colorSpace = SRGBColorSpace;
          ref.current.material = new MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: i === 0 ? 1 : 0.5,
            color: imageColors[i - 1],
            name: project,
          });
        });
      });
    });
  };

  useEffect(() => {
    loadImages();
  }, [project]);

  useEffect(() => {
    ref.current.material.opacity = 1;
    ref2.current.material.opacity = 0;
    ref3.current.material.opacity = 0;
    ref4.current.material.opacity = 0;
    ref5.current.material.opacity = 0;
    ref6.current.material.opacity = 0;
    ref7.current.material.opacity = 0;

    ref.current.position.set(0, 0, 0);
    ref2.current.position.set(0, 0, 0);
    ref3.current.position.set(0, 0, 0);
    ref4.current.position.set(0, 0, 0);
    ref5.current.position.set(0, 0, 0);
    ref6.current.position.set(0, 0, 0);
    ref7.current.position.set(0, 0, 0);

    ref.current.rotation.set(0, 0, 0);

    ref2.current.material.color = new Color().setHex(0x40e0d0);
    ref3.current.material.color = new Color().setHex(0xff69b4);
    ref4.current.material.color = new Color().setHex(0xff69b4);
    ref5.current.material.color = new Color().setHex(0x00ff00);
    ref6.current.material.color = new Color().setHex(0x0000ff);
    ref7.current.material.color = new Color().setHex(0xffd700);

    setAnimationFinished(false);
  }, [scene]);

/*   useEffect(() => {
    window.addEventListener("wheel", (e) => scrollImage(e));

    return () => {
      window.removeEventListener("wheel", (e) => scrollImage(e));
    };
  }, [animationFinished]); */

  const animate = () => {
    if (!animationFinished) {
      if (ref.current.material.opacity < 0.5) {
        ref.current.material.opacity += 0.05;
      }
      if (ref2.current.material.opacity < 0.5) {
        ref2.current.material.opacity += 0.01;
      }
      if (ref3.current.material.opacity < 0.5) {
        ref3.current.material.opacity += 0.01;
      }
      if (ref4.current.material.opacity < 0.5) {
        ref4.current.material.opacity += 0.01;
      }
      if (ref5.current.material.opacity < 0.5) {
        ref5.current.material.opacity += 0.01;
      }
      if (ref6.current.material.opacity < 0.5) {
        ref6.current.material.opacity += 0.01;
      }
      if (ref7.current.material.opacity < 0.5) {
        ref7.current.material.opacity += 0.01;
      }
    }

    if (!animationFinished) {
      ref2.current.position.lerp(screenPositions["2"], 0.1);
      ref3.current.position.lerp(screenPositions["3"], 0.1);
      ref4.current.position.lerp(screenPositions["4"], 0.1);
      ref5.current.position.lerp(screenPositions["5"], 0.1);
      ref6.current.position.lerp(screenPositions["6"], 0.1);
      ref7.current.position.lerp(screenPositions["7"], 0.1);
    }

    if (animationFinished) {
      ref.current.position.lerp(moveToScreenPositions["1"], 0.1);
      ref2.current.position.lerp(moveToScreenPositions["2"], 0.1);
      ref3.current.position.lerp(moveToScreenPositions["3"], 0.1);
      ref4.current.position.lerp(moveToScreenPositions["4"], 0.1);
      ref5.current.position.lerp(moveToScreenPositions["5"], 0.1);
      ref6.current.position.lerp(moveToScreenPositions["6"], 0.1);
      ref7.current.position.lerp(moveToScreenPositions["7"], 0.1);
    }

    if (ref7.current.position.distanceTo(screenPositions["7"]) < 0.1) {
      setAnimationFinished(true);
    }
  };

  const scrollImage = (e: any) => {

    if (!animationFinished) {
      return;
    }

    if (e.wheelDelta > 0 && activeScreen === screens[screens.length - 1]) {
      const targetScreen = screens[0];

      moveToScreenPositions[activeScreen.toString()] = screenPositions["1"]; //TODO: copy over screenPositions to moveToScreenPositions here to reset
      screenMap[activeScreen.toString()].current.material.opacity =
        screenMap[targetScreen.toString()].current.material.opacity;

      moveToScreenPositions[targetScreen.toString()] = { x: 0, y: 0, z: 0 };
      /* screenMap[targetScreen.toString()].current.material.opacity = 1; */
      screenMap[targetScreen.toString()].current.rotation.set(0, 0, 0);

      activeScreen = screens[0];
      return;
    }

    if (e.wheelDelta < 0 && activeScreen === screens[0]) {
      const targetScreen = screens[screens.length - 1];

      moveToScreenPositions[activeScreen.toString()] = screenPositions["7"]; //TODO: copy over screenPositions to moveToScreenPositions here to reset
      /* screenMap[activeScreen.toString()].current.material.opacity =
        screenMap[targetScreen.toString()].current.material.opacity; */

      moveToScreenPositions[targetScreen.toString()] = { x: 0, y: 0, z: 0 };
      /* screenMap[targetScreen.toString()].current.material.opacity = 1; */
      screenMap[targetScreen.toString()].current.rotation.set(0, 0, 0);

      activeScreen = screens[screens.length - 1];
      return;
    }

    const targetScreen = e.wheelDelta > 0 ? activeScreen + 1 : activeScreen - 1;

    moveToScreenPositions[activeScreen.toString()] = {
      x: screenPositions[targetScreen.toString()].x,
      y: screenPositions[targetScreen.toString()].y,
      z: screenPositions[targetScreen.toString()].z,
    };
    screenMap[activeScreen.toString()].current.material.opacity = 0.5;
    screenMap[activeScreen.toString()].current.material.color =
      screenMap[targetScreen.toString()].current.material.color;

    moveToScreenPositions[targetScreen.toString()] = { x: 0, y: 0, z: 0 };
    screenMap[targetScreen.toString()].current.material.opacity = 0.5;
    screenMap[targetScreen.toString()].current.material.color = new Color();
    screenMap[targetScreen.toString()].current.rotation.set(0, 0, 0);

    activeScreen = targetScreen;
  };

  useFrame((state) => {
    if (display) {
      for (let i = 1; i < screens.length + 1; i++) {
        if (activeScreen === i) {
          continue;
        }
        screenMap[i.toString()].current.lookAt(
          pointer.x,
          pointer.y,
          state.camera.position.z,
        );
      }

      animate();
    }
  });

  return (
    <group {...props} visible={display}>
      <mesh ref={ref2}>
        <meshBasicMaterial transparent />
        <planeGeometry args={[18 / 2, 9 / 2, 1]} />
      </mesh>
      <mesh ref={ref}>
        <meshBasicMaterial transparent />
        <planeGeometry args={[5, 5, 1]} />
      </mesh>
      <mesh ref={ref3}>
        <meshBasicMaterial transparent />
        <planeGeometry args={[18 / 2, 9 / 2, 1]} />
      </mesh>
      <mesh ref={ref4}>
        <meshPhongMaterial transparent />
        <planeGeometry args={[18 / 2, 9 / 2, 1]} />
      </mesh>
      <mesh ref={ref5}>
        <meshBasicMaterial transparent />
        <planeGeometry args={[5, 5, 1]} />
      </mesh>
      <mesh ref={ref6}>
        <meshBasicMaterial transparent />
        <planeGeometry args={[18 / 2, 9 / 2, 1]} />
      </mesh>
      <mesh ref={ref7}>
        <meshBasicMaterial transparent />
        <planeGeometry args={[5, 5, 1]} />
      </mesh>
    </group>
  );
};

export const InteractiveObjectNode = (props) => {
  const [hovered, hover] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [active, setActive] = useState(false);
  const scene = useStore((state) => state.scene);
  const setScene = useStore((state) => state.setScene);
  const project = useStore((state) => state.project);
  const setProject = useStore((state) => state.setProject);
  const setAnimationReady = useStore((state) => state.setAnimationReady);
  const loader = new TextureLoader();
  // console.log('Render InteractiveObjectNode');
  const {
    modelInfo,
    material,
    position,
    showInScenes,
    label,
    rotation,
  } = props;

  const textVector = new Vector3();
  const meshRef = useRef(null);
  const screenPlaneRef = useRef(null);

  const AUTO_ROTATION_SPEED = 0.05;
  const MAX_ANGLE = 0.03;
  const PORTRAIT_WIDTH = window.innerWidth / 20 * 100;
  const PORTRAIT_HEIGHT = window.innerHeight / 15 * 100;

  let display = showInScenes.includes(scene) || showInScenes.includes("all");

  if (scene === "details" && !active) {
    // necessary since the label is linked to this object
    display = false;
  }

  let model = null;
  if (modelInfo) {
    model = useLoader(OBJLoader, modelInfo.name, (loader) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(material, (materials) => {
        loader.setMaterials(materials);
      });
    });
  }

  const animate = () => {
    if (screenPlaneRef.current.scale.y < 0.99) {
      screenPlaneRef.current.scale.x +=
        (1 - screenPlaneRef.current.scale.x) * 0.08;
      screenPlaneRef.current.scale.y +=
        (1 - screenPlaneRef.current.scale.y) * 0.05;
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
    objectLabel.innerHTML = `<h3 className="[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]">${label || ""}</h3>`;

    // objectLabel.innerHTML = `<Image src="/images/texture_text_test.png" width={100} height={50} alt="text" />`;

    document.body.appendChild(objectLabel);
  }, []);

  useEffect(() => {
    
    if (scene === "cover") {
      // set initial position pre-lerp
      meshRef.current.position.set(position[0], position[1], position[2]);
    }
    if (scene !== "details") {
      setActive(false);
    }
    if (scene === "details") {
      const texture = loader.load("https://picsum.photos/300");
      screenPlaneRef.current.material.map = texture;
      meshRef.current.position.set(0, 0, 0);
      setAnimationReady(true);
    }

    screenPlaneRef.current.scale.set(0, 0, 0);
    screenPlaneRef.current.rotation.set(0, -2, 0);
    // setAnimationFinished(false);
  }, [scene]);


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
  }, [model]);

  useFrame((state, delta) => {
    meshRef.current.updateMatrixWorld();
    textVector.setFromMatrixPosition(meshRef.current.matrixWorld);
    textVector.project(state.camera);


    const textElement = document.getElementById(label);

    if (scene === "cover") {
      meshRef.current.rotation.y =
        (state.clock.elapsedTime - delta) * MAX_ANGLE;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
      meshRef.current.scale.set(props.scale, props.scale, props.scale);
    }

    if (scene === "overview") {     
      
      meshRef.current.rotation.z = 
        Math.sin(state.clock.elapsedTime - delta) * 0.1;
      
      meshRef.current.position.lerp(
        { x: position[0], y: position[1], z: position[2] },
        0.05,
      );
      // rotationVector.lerp({x: rotation[0], y: rotation[1], z: rotation[2]}, 0.05);
      // meshRef.current.rotation.lerp({x: rotation[0], y: rotation[1], z: rotation[2]}, 0.01);
    }

    if (scene === "overview" && !animationFinished) {
      animate();
    }

    if (scene === "overview") {

      const scaleLerp = MathUtils.lerp(
        meshRef.current.scale.x,
        hovered ? props.scale * 1.3 : props.scale,
        0.05,
      );
      meshRef.current.scale.set(scaleLerp, scaleLerp, scaleLerp);
      const zLerp = MathUtils.lerp(
        meshRef.current.position.z,
        hovered ? 4 : props.position[2],
        0.05,
      );
      meshRef.current.position.z = zLerp;
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
      textElement.style.pointerEvents = "none";
      textElement.style.left = `${textVector.x}px`;
      textElement.style.top = `${textVector.y + window.innerHeight / 15}px`;
      textElement.style.minWidth = "200px";
      textElement.style.maxWidth = PORTRAIT_WIDTH + "px";
      textElement.style.fontFamily = "monospace, sans-serif";
      textElement.style.fontSize = "1.5rem";
      textElement.style.fontWeight = "200";
      textElement.style.fontKerning = "wide";
      textElement.style.color = "white";
      textElement.style.textShadow =
        "0.8px 0.8px 0.2px rgba(99, 102, 241, 0.8)";
      textElement.style.textAlign = "center";
      textElement.style.opacity = scene === 'overview' ? "1" : "0";
      textElement.style.transition = scene === 'overview' ? "opacity 0.7s ease-in" : "opacity 0.1s ease-out";
/*       textElement.style.display =
        display && scene === "overview" ? "block" : "none"; */

      props.selectedPosition.x = textVector.x;
      props.selectedPosition.y = textVector.y;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={rotation}
      visible={display}
      scale={props.scale}
    >
      <mesh position={[0, hovered ? 10 : 0, 370]} visible={scene === "cover"}>
        <primitive object={(model as Object3D).clone()} />
      </mesh>
      <mesh
        ref={screenPlaneRef}
        visible={scene === "overview"}

        onPointerOver={() => {
          hover(true);
          setProject(label);
        }}
        onPointerOut={() => {
          hover(false);
        }}
        onClick={() => {
            if (!project) {return;}
            props.setClickedObj(meshRef.current.position); // !this is a reference to the mesh position vector

            if (scene !== "details") {
              setScene("details");
              setActive(true);
          }
        }}
      >
        <boxGeometry
          args={[PORTRAIT_WIDTH, PORTRAIT_HEIGHT, 1]}
        />
        <meshBasicMaterial color={0x40e0d0} transparent opacity={1} />
      </mesh>
    </mesh>
  );
};

/* class BaseObject {
  modelInfo?: ImportModel;
  material?: string;
  hitbox?: HitBox;
  position?: Vector3 | [number, number, number];
  scale: number;
  rotation?: Vector3 | [number, number, number];
  showInScenes?: string[];

  constructor(
    modelInfo: ImportModel,
    material: string,
    hitbox: HitBox,
    position: Vector3 | [number, number, number],
    scale: number,
    rotation: Vector3 | [number, number, number],
    showInScenes: string[],
  ) {
    this.modelInfo = modelInfo;
    this.material = material;
    this.hitbox = hitbox;
    this.position = position;
    this.scale = scale;
    this.rotation = rotation;
    this.showInScenes = showInScenes;
  }
} */

const Director = ({ selectedPosition, trackerRef }) => {
  const [clickedObj, setClickedObj] = useState(new Vector3(0, 0, 4));
  const [allObj, setAllObj] = useState([]);
  const scene = useStore((state) => state.scene);
  // console.log('Rendering Director', scene);
/*   class CameraProps {
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
  } */

  const setCameraPositionFromScene = () => {
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
  };

  interface CameraProps {
    cameraPosition: Vector3;
    orbref: React.MutableRefObject<any>;
    autoRotate: boolean;
    clickedObj: Vector3;
    allObj: Vector3[];
  }

  const cameraProps: CameraProps = {
    cameraPosition: setCameraPositionFromScene(),
    orbref: trackerRef,
    autoRotate: scene === "cover",
    clickedObj: clickedObj,
    allObj: allObj,
  }

/*   class InteractiveObjectProps extends BaseObject {
    setClickedObj: (position: Vector3) => void;
    setAllObj: (interactiveObjects: Vector3[]) => void;
    readonly scene: string;
    selectedPosition: { x: number; y: number };
    label: string;
    showInScenes?: string[];
    node: JSX.Element;

    constructor(props: {
      modelInfo?: ImportModel;
      material?: string;
      label?: string;
      hitbox?: HitBox;
      position: Vector3 | [number, number, number];
      scale: number;
      rotation: Vector3 | [number, number, number];
      showInScenes: string[];
    }) {
      super(
        props.modelInfo,
        props.material,
        props.hitbox,
        props.position,
        props.scale,
        props.rotation,
        props.showInScenes,
      );
      this.label = props.label;
      this.setClickedObj = setClickedObj;
      this.setAllObj = setAllObj;
      this.selectedPosition = selectedPosition;
    }
  } */

  interface InteractiveObjectProps {
    modelInfo?: ImportModel;
    material?: string;
    label?: string;
    hitbox?: HitBox;
    position: Vector3 | [number, number, number];
    scale: number;
    rotation: Vector3 | [number, number, number];
    showInScenes: string[];
    setClickedObj?: typeof setClickedObj;
    setAllObj?: typeof setAllObj;
    selectedPosition?: {
      x: number;
      y: number;
    };
  };

  type vector = [number, number, number];

  const objectPositionDirections = {
    markanta: {
      cover: {
        position: [3, 0, 1] as vector,
        rotation: [4, 5, 1] as vector,
      },
      overview: {
        position: [5, 3, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      details: {
        position: [5, 2, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
    },
    motherstructures: {
      cover: {
        position: [0, 0, -4] as vector,
        rotation: [8, 0, 4] as vector,
      },
      overview: {
        position: [-5, 3.5, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      details: {
        position: [-5, 4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
    },
    jacobdahlgren: {
      cover: {
        position: [0, 0, -4] as vector,
        rotation: [8, 0, 4] as vector,
      },
      overview: {
        position: [-6, -3.5, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      details: {
        position: [-5, 4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
    },
    about: {
      cover: {
        position: [3, 1, -6] as vector,
        rotation: [2, 2, 0] as vector,
      },
      overview: {
        position: [5, -5, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      details: {
        position: [5, -4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
    },
    various: {
      cover: {
        position: [3, 1, -6] as vector,
        rotation: [2, 2, 0] as vector,
      },
      overview: {
        position: [-5, -4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      details: {
        position: [-5, -4, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
    },
    display_screens: {
      cover: {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
        scale: 0.01,
      },
      overview: {
        position: [0, 2, 0] as vector,
        rotation: [0, 0, 0] as vector,
        scale: 1,
      },
      details: {
        position: [0, 2, 0] as vector,
        rotation: [0.01, 0, 0] as vector,
        scale: 1,
      },
    },
    tree_g2: {
      cover: {
        position: [1, -3.5, -1] as vector,
        rotation: [0, 0, 0] as vector,
      },
      overview: {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
      details: {
        position: [0, 0, 0] as vector,
        rotation: [0, 0, 0] as vector,
      },
    },
  };

  // Ensure labels are unique
  const interactiveObjects: InteractiveObjectProps[] = [
    {
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: {
        size: [2000, 4000, 2000],
        position: new Vector3(0, 2000, 0),
        geometry: "box",
      },
      position: objectPositionDirections.markanta[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.markanta[scene].rotation,
      label: "markanta",
      showInScenes: ["overview"],
      setClickedObj: setClickedObj,
      setAllObj: setAllObj,
      selectedPosition: selectedPosition,
    },
    {
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: {
        size: [2000, 4000, 2000],
        position: new Vector3(0, 2000, 0),
        geometry: "box",
      },
      position: objectPositionDirections.jacobdahlgren[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.jacobdahlgren[scene].rotation,
      label: "jacob dahlgren",
      showInScenes: ["overview"],
      setClickedObj: setClickedObj,
      setAllObj: setAllObj,
      selectedPosition: selectedPosition,
    },
    {
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: {
        size: [8000, 8000, 4000],
        position: new Vector3(1000, 2000, 0),
        geometry: "box",
      },
      position: objectPositionDirections.tree_g2[scene].position,
      scale: 0.002,
      rotation: objectPositionDirections.tree_g2[scene].rotation,
      showInScenes: ["cover"],
      setClickedObj: setClickedObj,
      setAllObj: setAllObj,
      selectedPosition: selectedPosition,
    },
    {
      modelInfo: { name: "models/tree_g/tree_g.obj", format: "obj" },
      material: "models/tree_g/tree_g.mtl",
      hitbox: {
        size: [2000, 8000, 2000],
        position: new Vector3(0, 2000, 500),
        geometry: "cone",
      },
      position: objectPositionDirections.motherstructures[scene].position,
      scale: 0.001,
      rotation: objectPositionDirections.motherstructures[scene].rotation,
      label: "motherstructures",
      showInScenes: ["overview"],
      setClickedObj: setClickedObj,
      setAllObj: setAllObj,
      selectedPosition: selectedPosition,
    },
  ];

  const display_screens_props = {
    position: objectPositionDirections.display_screens[scene].position,
    scale: objectPositionDirections.display_screens[scene].scale,
    rotation: objectPositionDirections.display_screens[scene].rotation,
    showInScenes: ["details"],
  };

  return (
    <>
      <CameraController {...cameraProps} />
      <ambientLight
        position={[1, 10, 0]}
        intensity={1}
        visible={scene !== "details"}
      />

      <fog attach="fog" args={["white", 7.5, 20]} />

      <directionalLight
        position={[4, 0, 2]}
        intensity={4}
        visible={scene === "details"}
      />

      {interactiveObjects.map((props, key) => (
        <InteractiveObjectNode key={key} {...props} />
      ))}

      <DisplayScreen {...display_screens_props} />
    </>
  );
};

export const CanvasUI = () => {
  const selectedPosition = useState({ x: 0, y: 0 });
  const project = useStore((state) => state.project);
  const trackerRef = useRef(null);
  const scene = useStore((state) => state.scene);

  let backgroundStyle = "";

  switch (scene) {
    case "cover":
      backgroundStyle = "bg-transparent";
      break;
    case "overview":
      backgroundStyle = "bg-gradient-to-r from-[pink] to-[white]/60";
      break;
    case "details":
      backgroundStyle = "bg-gradient-to-r from-[pink] to-pink-200/60";
      break;
    default:
      backgroundStyle = "bg-transparent";
  }

  return (
    <div
      className={`transition-all duration-800 ease-in fixed w-full h-full ${backgroundStyle} ${scene === "cover" ? "blur-[1px]" : ""}`}
    >
      <Canvas fallback={Fallback()}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[5, 5, 5]} />
              <meshBasicMaterial />
            </mesh>
          }
        >
          <Director
            selectedPosition={selectedPosition}
            trackerRef={trackerRef}
          />
        </Suspense>
      </Canvas>

      {project && 
        <>
          <ProjectDetailScreen
            selectedPosition={selectedPosition}
          />
        </>
      }

      <div
        ref={trackerRef}
        className={`fixed bottom-4 left-0 text-2xl ${scene === "cover" ? "text-foreground" : "text-background"} p-2 z-10 [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]`}
      />

      {/* <video src="/svg/spinner.gif" autoPlay loop muted className="hidden" id="video" /> */}
    </div>
  );
};
