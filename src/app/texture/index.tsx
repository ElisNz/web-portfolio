import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from "three";

import { useStore } from '@/app/Store';


const FilmGrain = ({intensity = 0.5, speed = 2.0}: {intensity?: number, speed?: number}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  console.log(intensity, speed);
  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;

    // Intensity and speed factors
    const float intensity = 0.5; // Adjust this for grain visibility (0.0 to 1.0)
    const float speed = 2.0;    // Adjust this for animation speed

    // Random function to generate noise
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      float grain = random(st + uTime);
      gl_FragColor = vec4(vec3(grain), 0.1); // Adjust alpha for transparency
    }
  `;

  // Animate the time uniform to create dynamic grain
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  );
};

export const Texture = () => {
  const { scene } = useStore((state) => state);

  return(
    <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
      <Canvas fallback={null}>
        <Suspense fallback={null}>
          {scene === 'cover' && <FilmGrain />}
        </Suspense>
      </Canvas>
    </div>
  );
};
