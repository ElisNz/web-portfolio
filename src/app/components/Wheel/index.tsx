'use client';

import { useEffect } from "react";

export const Wheel = () => {


  const draw = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
      
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const linGrad = ctx.createRadialGradient(0, 30, 150, 150, 150, 150);
        linGrad.addColorStop(0, '#8ED6FF');
        linGrad.addColorStop(0.5, '#004CB3');
        linGrad.addColorStop(1, '#003366');


        ctx.fillStyle = linGrad;

        ctx.fillRect(0, 0, 400, 350);
      }
    }
  };
  
  useEffect(() => {
      draw();
  }, []);

  

  return (
    <>
      <div className="w-80 h-80">
        <canvas id='canvas' width={400} height={350}></canvas>
      </div>
      {/* <div className="size-96 rounded- bg-[#fffff]" style={{background: 'radial-gradient(circle at 50% 0,red,rgba(242,13,13,.8) 10%,rgba(230,26,26,.6) 20%,rgba(204,51,51,.4) 30%,rgba(166,89,89,.2) 40%,hsla(0,0%,50%,0) 50%),radial-gradient(circle at 85.35533905932738% 14.644660940672622%,#ffbf00,rgba(242,185,13,.8) 10%,rgba(230,179,26,.6) 20%,rgba(204,166,51,.4) 30%,rgba(166,147,89,.2) 40%,hsla(0,0%,50%,0) 50%),radial-gradient(circle at 100% 50%,#80ff00,rgba(128,242,13,.8) 10%,rgba(128,230,26,.6) 20%,rgba(128,204,51,.4) 30%,rgba(128,166,89,.2) 40%,hsla(0,0%,50%,0) 50%),radial-gradient(circle at 85.35533905932738% 85.35533905932738%,#00ff40,rgba(13,242,70,.8) 10%,rgba(26,230,77,.6) 20%,rgba(51,204,89,.4) 30%,rgba(89,166,108,.2) 40%,hsla(0,0%,50%,0) 50%),radial-gradient(circle at 50.00000000000001% 100%,#0ff,rgba(13,242,242,.8) 10%,rgba(26,230,230,.6) 20%,rgba(51,204,204,.4) 30%,rgba(89,166,166,.2) 40%,hsla(0,0%,50%,0) 50%),radial-gradient(circle at 14.64466094067263% 85.35533905932738%,#0040ff,rgba(13,70,242,.8) 10%,rgba(26,77,230,.6) 20%,rgba(51,89,204,.4) 30%,rgba(89,108,166,.2) 40%,hsla(0,0%,50%,0) 50%),radial-gradient(circle at 0 50.00000000000001%,#8000ff,rgba(128,13,242,.8) 10%,rgba(128,26,230,.6) 20%,rgba(128,51,204,.4) 30%,rgba(128,89,166,.2) 40%,hsla(0,0%,50%,0) 50%),radial-gradient(circle at 14.644660940672615% 14.64466094067263%,#ff00bf,rgba(242,13,185,.8) 10%,rgba(230,26,179,.6) 20%,rgba(204,51,166,.4) 30%,rgba(166,89,147,.2) 40%,hsla(0,0%,50%,0) 50%)'}}></div> */}
    </>
  )
};
