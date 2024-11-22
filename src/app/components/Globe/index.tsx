'use client';

import { useEffect } from "react";
import { initShaderProgram } from "../shaders";
import { initBuffers } from "./init-buffers";
import { drawScene } from "./draw-scene";

// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;
// Fragment shader program
const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;


export const Globe = () => {
  const main = () => {
    const canvas = document.querySelector("#gl-canvas") as HTMLCanvasElement;
    // Initialize the GL context
    const gl = canvas?.getContext("webgl");
    
    // Only continue if WebGL is available and working
    if (gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it.",
      );
      return;
    }
  
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    if (!shaderProgram) {
      alert("Failed to initialize shader program");
      return;
    }

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      },
    };

    const buffers = initBuffers(gl);

    if (canvas.width  !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      // Make the canvas the same size
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    
    drawScene(gl, programInfo, buffers);
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="size-full">
      <canvas id='gl-canvas' className="size-full"></canvas>
    </div>
  );
};
