'use client';

import { useState, useEffect } from "react";
import { useStore } from "@/app/Store";
import { useShallow } from "zustand/react/shallow";

import { Miniloader } from "@/app/components/Miniloader";
import { set } from "mongoose";


const sampleTextR = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.";
const sampleTextL = "Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem reiciendis id? Mollitia.";


export const ProjectDetailScreen = (props) => {

  const animationReady = useStore(useShallow((state) => state.animationReady));
  const [textLoaded, setTextLoaded] = useState(false);
  
  const ALLOWED_WIDTH = window.innerWidth - window.innerWidth / 5;
  const ALLOWED_HEIGHT = window.innerHeight - window.innerHeight / 5;
  const MODEL_WIDTH = 200;
  const MODEL_HEIGHT = window.innerHeight / 3;

  const typeText = (text, element, delay) => {
    setTextLoaded(false);
    const textArr = text.split("");
    element.innerHTML = "";
    let i = 0;

    const interval = setInterval(() => {
      if (i < textArr.length) {
        if (element.innerHTML[element.innerHTML.length - 1] === "▓") {
          element.innerHTML = element.innerHTML.slice(0, -2);
        }
        element.innerHTML += textArr[i];

        element.innerHTML += ' ▓';

        i++;
      } else {
        clearInterval(interval);
        element.innerHTML = element.innerHTML.slice(0, -2);
        setTextLoaded(true);
      }
    }, delay);
  }

  const setDetailsScreenPosition = () => {
    const detailsL = document.getElementById("details-screen-l");
    const detailsR = document.getElementById("details-screen-r");

    if (!detailsL || !detailsR) {
      return;
    }

    const lPosx = window.innerWidth / 3 - MODEL_WIDTH - 100 + props.selectedPosition.x % 100;
    const lPosy = props.selectedPosition.y - MODEL_HEIGHT;

    const rPosx = window.innerWidth / 2 + MODEL_WIDTH - props.selectedPosition.x % 100;
    const rPosy = lPosy;

    if (
      lPosx > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsL.style.display = "none";
    } else {
      detailsL.style.display = "block";
    }
    if (
      lPosy > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsL.style.display = "none";
    } else {
      detailsL.style.display = "block";
    }
    if (
      rPosx > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsR.style.display = "none";
    } else {
      detailsR.style.display = "block";
    }
    if (
      rPosy > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsR.style.display = "none";
    } else {
      detailsR.style.display = "block";
    }

    detailsL.style.left = `${lPosx}px`;
    detailsL.style.top = `${lPosy}px`;

    detailsR.style.left = `${rPosx}px`;
    detailsR.style.top = `${rPosy}px`;

    requestAnimationFrame(setDetailsScreenPosition);
  };

  useEffect(() => {
    setDetailsScreenPosition();
  }, [animationReady]);

  useEffect(() => {
    if (!props.visible) {
      return;
    }
    setTimeout(() => {
      typeText(sampleTextL, document.getElementById("text-l"), 30);
      typeText(sampleTextR, document.getElementById("text-r"), 40);
    }, 1000);
  }, [props.visible]);


  return (
    <div className={`${props.visible ? 'transition-opacity delay-1000 duration-1000 ease-in-out opacity-100' : 'opacity-0'}`}>
      <div id="details-screen-l" className="w-1/3 absolute">
        <h2 className="text-2xl font-bold">{props.title || "title_"}</h2>
        <h3 className="text-lg">This is a test project</h3>
        <p className="text-md pt-4 text-balance bg-blend-difference" id="text-l" />
      </div>
      <div className="absolute size-20 bg-[blue]"></div>

      <div id="details-screen-r" className="w-1/3 absolute">
        <h3 className="text-lg font-bold">This is a test project</h3>
        <p className="text-md pt-4 text-balance bg-blend-difference" id="text-r" />
        <ul className="text-md pt-4 text-balance bg-blend-difference list-disc list-inside">
          <li>Recusandae</li>
          <li>Quae adipisci</li>
          <li>Ab doloremque</li>
        </ul>
      </div>

      {props.visible && !textLoaded && 
      <div className="absolute bottom-10 right-10">
        <Miniloader />
      </div>
      }
    </div>
  );
};
