import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from "three";

import { useStore } from '@/app/Store';


const FilmGrain = (options: {intensity?: number, speed?: number}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { intensity = 0.5, speed = 2.0 } = options;
  const key = Object.values(options).join('-');


  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uIntensity;
    uniform float uSpeed;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      float grain = random(st + uTime * uSpeed) * uIntensity;
      gl_FragColor = vec4(vec3(grain), 0.1);
    }
  `;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh visible={intensity > 0.01}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        key={key}
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uIntensity: { value: intensity },
          uSpeed: { value: speed },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  );
};

export const Texture = () => {
  const { scene, options } = useStore((state) => state);

  return(
    <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0" key={scene}>
      {scene === 'cover' && 
        <Canvas fallback={null}>
          <Suspense fallback={null}>
            <FilmGrain {...options} />
          </Suspense>
        </Canvas>
      }
    </div>
  );
};
