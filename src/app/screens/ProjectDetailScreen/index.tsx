'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/app/Store";
import { useShallow } from "zustand/react/shallow";

import { Miniloader } from "@/app/components/Miniloader";
import { Chevron } from "@/app/components/svg";


const sampleTextR = "Let's keep a short description here including some details. Outline keywords below in the list.";
const sampleTextL = "Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem reiciendis id? Mollitia. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.";


export const ProjectDetailScreen = (props) => {

  const animationReady = useStore(useShallow((state) => state.animationReady));
  //const scene = useStore(useShallow((state) => state.scene));
  //const setShowLoader = useStore(useShallow((state) => state.setLoader));
  const [textLoaded, setTextLoaded] = useState(false);
  const [showArrow, setShowArrow] = useState({up: false, down: false});
  
  const ALLOWED_WIDTH = window.innerWidth - window.innerWidth / 5;
  const ALLOWED_HEIGHT = window.innerHeight - window.innerHeight / 5;
  const MODEL_WIDTH = 400;
  const CARD_WIDTH = window.innerWidth / 8;
  const MODEL_HEIGHT = window.innerHeight / 2;
  const LEFT_TYPING_SPEED = 1;
  const RIGHT_TYPING_SPEED = 10;

  const flickerText = (text, element, delay, maxTime) => {
    const textTemplate = [];
    for (let i = 0; i < text.length; i++) {
      textTemplate.push(' ');
    }

    setTimeout(() => {
      let i = 0;
      const j = setInterval(() => {
        textTemplate[i] = text[i];
        element.innerHTML = textTemplate.join("");
        i++;
        
        if (textTemplate.join('') === text) {
          setTextLoaded(true);
          clearInterval(j);
        }
      }, 10);
    }, maxTime);

    const interval = setInterval(() => {
      if (textTemplate.join("") !== text) {
        setTextLoaded(false);
      }

      const randomElement = Math.floor(Math.random() * text.length);

      if (textTemplate[randomElement] === "*" || textTemplate[randomElement] === text[randomElement]) {
        return;
      }

      textTemplate[randomElement] = "▓";
      element.innerHTML = textTemplate.join("");
      
      setTimeout(() => {
        textTemplate[randomElement] = text[randomElement];

        if (textTemplate.join("") === text) {
          setTextLoaded(true);
          clearInterval(interval);
        }
      }, 300);
      element.innerHTML = textTemplate.join("");
    }, delay);
  };

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

    const lPosx = window.innerWidth / 2 - MODEL_WIDTH - CARD_WIDTH + props.selectedPosition.x % 100;
    const lPosy = props.selectedPosition.y - MODEL_HEIGHT;

    const rPosx = window.innerWidth / 2 + CARD_WIDTH - props.selectedPosition.x % 100;
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
      flickerText(sampleTextL, document.getElementById("text-l"), LEFT_TYPING_SPEED, 700);
      flickerText(sampleTextR, document.getElementById("text-r"), RIGHT_TYPING_SPEED, 1000);
    }, 500);
  }, [props.visible]);

  useEffect(() => {
    getScrollPos();
  }, []);


  return (
    <>
      <div className={`${props.visible ? 'transition-opacity delay-500 duration-500 ease-in-out opacity-100' : 'opacity-0 invisible'}`}>
        <div id="details-screen-l" className="w-1/4 absolute">
          <h2 className="text-4xl font-black">{props.title || "title_"}</h2>
          <h3 className="text-2xl pt-[0.3em]">Subtitle goes here</h3>
          <pre className="text-md pt-4 text-balance bg-blend-difference font-Geist" id="text-l" />
        </div>

        <div id="details-screen-r" className="absolute w-1/3 max-h-[50vh] overflow-y-auto scrollbar-hide scroll-smooth touch-pan-y" onScrollCapture={getScrollPos}>
          {showArrow.up && 
            <div className="fixed w-full content-center top-[10vh] ml-[10%]">
              <Chevron width={40} height={40} />
            </div>
          }
          {showArrow.down && 
            <div className="fixed w-full content-center bottom-[20vh] ml-[10%]">
              <Chevron width={40} height={40} rotate={180}  />
            </div>
          }
          <div>
            <h3 className="text-[1.5rem] font-bold font-mono text-pretty tracking-[0.2rem] [text-shadow:_0_4px_2px_rgb(99_102_241_/_0.8)] pr-20">This is a description of the project</h3>
            <pre className="text-md pt-4 text-balance bg-blend-difference" id="text-r" />
            <div className="flex flex-row gap-4 pt-4">
              <ul className="text-md text-balance bg-blend-difference list-disc list-inside indent-8">
                <li>Recusandae</li>
                <li>Quae adipisci</li>
                <li>Ab doloremque</li>
                <li>Recusandae</li>
              </ul>
              <Image src="https://picsum.photos/300/200" width={300} height={200} className="self-center place-self-start px-8" alt="text" />
            </div>
          </div>
          
          <div className="w-full flex flex-row justify-evenly gap-12 pt-12 pr-20">
            <Image src="https://picsum.photos/150" width={150} height={150} alt="text" />
            <Image src="/images/texture_text_test.png" width={150} height={200} alt="text" className="self-center" />
          </div>
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
