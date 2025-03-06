'use client';

import { useState, useEffect, use } from "react";
import { useStore } from "@/app/Store";
import { useShallow } from "zustand/react/shallow";

import { Miniloader } from "@/app/components/Miniloader";
import { Chevron } from "@/app/components/svg";



const sampleTextR = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.";
const sampleTextL = "Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem reiciendis id? Mollitia. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.";


export const ProjectDetailScreen = (props) => {

  const animationReady = useStore(useShallow((state) => state.animationReady));
  const scene = useStore(useShallow((state) => state.scene));
  const setShowLoader = useStore(useShallow((state) => state.setLoader));
  const [textLoaded, setTextLoaded] = useState(false);
  const [showArrow, setShowArrow] = useState({up: false, down: false});
  
  const ALLOWED_WIDTH = window.innerWidth - window.innerWidth / 5;
  const ALLOWED_HEIGHT = window.innerHeight - window.innerHeight / 5;
  const MODEL_WIDTH = 200;
  const MODEL_HEIGHT = window.innerHeight / 3;
  const LEFT_TYPING_SPEED = 10;
  const RIGHT_TYPING_SPEED = 20;

  const typeText = (text, element, delay) => {
    
    const textArr = text.split("");
    element.innerHTML = "";
    let i = 0;

    const interval = setInterval(() => {
      if (i < textArr.length) {

        setTextLoaded(false);
        
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

    const rPosx = window.innerWidth / 3 + window.innerWidth / 3 - props.selectedPosition.x % 100;
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

  const getScrollPos = () => {
    const detailsR = document.getElementById("details-screen-r");
    if (!detailsR) {
      return;
    }

    if (detailsR.scrollTop > 0) {
      setShowArrow(prev => ({ ...prev, up: true }));
    } else {
      setShowArrow(prev => ({ ...prev, up: false }));
    }

    if(Math.floor(detailsR.scrollHeight - detailsR.scrollTop - detailsR.clientHeight) > 0) {
      setShowArrow(prev => ({ ...prev, down: true }));
    } else {
      setShowArrow(prev => ({ ...prev, down: false }));
    }
  };

  useEffect(() => {
    setDetailsScreenPosition();
  }, [animationReady]);

  useEffect(() => {
    if (!props.visible) {
      return;
    }
    setTimeout(() => {
      typeText(sampleTextL, document.getElementById("text-l"), LEFT_TYPING_SPEED);
      typeText(sampleTextR, document.getElementById("text-r"), RIGHT_TYPING_SPEED);
    }, 1000);
  }, [props.visible]);

  useEffect(() => {
    getScrollPos();
  }, []);


  return (
    <>
      <div className={`${props.visible ? 'transition-opacity delay-1000 duration-1000 ease-in-out opacity-100' : 'opacity-0 invisible'}`}>
        <div id="details-screen-l" className="w-1/4 absolute">
          <h2 className="text-2xl font-bold">{props.title || "title_"}</h2>
          <h3 className="text-lg italic">This is a test project</h3>
          <p className="text-md pt-4 text-balance bg-blend-difference" id="text-l" />
        </div>
        {/* <div className="absolute size-20 bg-[blue]"></div> */}

        <div id="details-screen-r" className="w-1/3 absolute max-h-[40vh] overflow-y-auto scrollbar-hide" onScrollCapture={getScrollPos}>
          {showArrow.up && 
            <div className="fixed w-full content-center top-[22vh] ml-[10%]">
              <Chevron width={40} height={40} />
            </div>
          }
          {showArrow.down && 
            <div className="fixed w-full content-center bottom-[20vh] ml-[10%]">
              <Chevron width={40} height={40} rotate={180}  />
            </div>
          }
          <h3 className="text-xl font-bold font-serif [text-shadow:_0_8px_8px_rgb(99_102_241_/_0.8)]">This is a test project</h3>
          <p className="text-md pt-4 text-balance bg-blend-difference" id="text-r" />
          <ul className="text-md pt-4 text-balance bg-blend-difference list-disc list-inside">
            <li>Recusandae</li>
            <li>Quae adipisci</li>
            <li>Ab doloremque</li>
            <li>Recusandae</li>
            <li>Quae adipisci</li>
            <li>Ab doloremque</li>
            <li>Recusandae</li>
            <li>Quae adipisci</li>
            <li>Ab doloremque</li>
            <li>Recusandae</li>
            <li>Quae adipisci</li>
            <li>Ab doloremque</li>
            <li>Recusandae</li>
            <li>Quae adipisci</li>
            <li>Ab doloremque</li>
          </ul>
        </div>
        
      </div>

      {props.visible && !textLoaded && 
          <div className="absolute bottom-10 right-10">
            <Miniloader />
          </div>
      }
    </>
  );
};
