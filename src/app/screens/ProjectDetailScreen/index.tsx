"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/app/Store";


import { Miniloader } from "@/app/components/Miniloader";
import { Chevron } from "@/app/components/svg";


const projectMap = process.env.NODE_ENV === "development" ? {
  motherstructures: {
    title: "Motherstructures",
    subtitle: "Urban greenspaces",
    text: "Motherstructures is a New York based company that aims to create urban greenspaces from simple, easily reusable materials. The project is a collaboration between the city council and local businesses. The goal is to create a network of green spaces that are accessible to everyone. The project is currently in the planning stage, and we are looking for input from the community. If you have any ideas or suggestions, please let us know!",
    titleR: "About the project",
    description:
      "I was approached to replace a website for a local community project. The project aims to create urban greenspaces in the city. The project is a collaboration between the city council and local businesses. The goal is to create a network of green spaces that are accessible to everyone. The project is currently in the planning stage, and we are looking for input from the community. If you have any ideas or suggestions, please let us know!",
    tech: ["Next.js", "Tailwind/CSS", "Node.js"],
    link: "https://motherstructures.com/",
  },
  markanta: {
    title: "Markanta",
    subtitle: "Engineering Consultants",
    text: "Markanta is an e-commerce platform that connects buyers and sellers from around the world. The platform is designed to be easy to use, and offers a wide range of products and services. Markanta is a great place to find unique items that you won't find anywhere else. Whether you're looking for clothing, accessories, or home decor, Markanta has something for everyone.",
    titleR: "About the project",
    description:
      "I was approached to replace a website for an e-commerce platform. The platform is designed to be easy to use, and offers a wide range of products and services. Markanta is a great place to find unique items that you won't find anywhere else. Whether you're looking for clothing, accessories, or home decor, Markanta has something for everyone.",
    tech: ["Next.js", "Tailwind/CSS", "Node.js", "Google Cloud", "Firebase"],
    link: "https://markanta.se/",
  },
  "jacob dahlgren": {
    title: "jacob dahlgren",
    subtitle: "artist and designer",
    text: `Jacob Dahlgren’s work is concerned with a dialogue between the authoritative singularity of pure formal abstraction and its position within a variable, complex and social shared culture. Dahlgren’s repetitious collections of ubiquitous and ordinary objects, often domestic, industrially manufactured; stand in their gestalt form as proxy for High Modernist Abstract Painting and for all of the ideological territory that Twentieth Century Art Theory has staked out for it.`,
    titleR: "About the project",
    description:
      "I was approached to replace a website for an e-commerce platform. The platform is designed to be easy to use, and offers a wide range of products and services. Markanta is a great place to find unique items that you won't find anywhere else. Whether you're looking for clothing, accessories, or home decor, Markanta has something for everyone.",
    tech: ["Wordpress"],
    link: "https://jacobdahlgren.com/",
  },
} : {};

const getRandomAsciiChar = () => {
  const asciiStart = 32; // Space character
  const asciiEnd = 126; // Tilde (~) character
  const randomAscii =
    Math.floor(Math.random() * (asciiEnd - asciiStart + 1)) + asciiStart;
  return String.fromCharCode(randomAscii);
};

export const ProjectDetailScreen = (props) => {
  const animationReady = useStore((state) => state.animationReady);
  const scene = useStore((state) => state.scene);
  const project = useStore((state) => state.project);

  const [textLoaded, setTextLoaded] = useState(false);
  const [showArrow, setShowArrow] = useState({ up: false, down: false });
  const visible = scene === "details";

  const ALLOWED_WIDTH = window.innerWidth - window.innerWidth / 5;
  const ALLOWED_HEIGHT = window.innerHeight - window.innerHeight / 5;
  const MODEL_WIDTH = window.innerWidth / 3.5;
  const CARD_WIDTH = window.innerWidth / 3.25;
  const MODEL_HEIGHT = window.innerHeight / 2 - 40;
  const LEFT_TYPING_SPEED = 1;
  const RIGHT_TYPING_SPEED = 10;



  const flickerText = (text, element, delay, maxTime) => {
    const textTemplate = new Array(text.length).fill(" ");

    setTimeout(() => {
      let i = 0;
      const j = setInterval(() => {
        textTemplate[i] = text[i];
        element.innerHTML = textTemplate.join("");
        i++;

        if (textTemplate.join("") === text) {
          setTextLoaded(true);
          clearInterval(j);
        }
      }, 0.01);
    }, maxTime);

    const interval = setInterval(() => {
      if (textTemplate.join("") !== text) {
        setTextLoaded(false);
      }

      const randomElement = Math.floor(Math.random() * text.length);

      if (
        textTemplate[randomElement] === "*" ||
        textTemplate[randomElement] === text[randomElement]
      ) {
        return;
      }

      textTemplate[randomElement] = getRandomAsciiChar();
      element.innerHTML = textTemplate.join("");

      setTimeout(() => {
        textTemplate[randomElement] = text[randomElement];

        if (textTemplate.join("") === text) {
          setTextLoaded(true);
          clearInterval(interval);
        }
      }, 200);
      element.innerHTML = textTemplate.join("");
    }, delay);
  };


  const setDetailsScreenPosition = () => {
    const detailsL = document.getElementById("details-screen-l");
    const detailsR = document.getElementById("details-screen-r");

    if (!detailsL || !detailsR) {
      return;
    }

    const lPosx =
      window.innerWidth / 2 -
      MODEL_WIDTH +
      CARD_WIDTH -
      props.selectedPosition.x;
    const lPosy = props.selectedPosition.y - MODEL_HEIGHT;

    const rPosx =
      window.innerWidth / 2 +
      MODEL_WIDTH +
      CARD_WIDTH -
      props.selectedPosition.x;
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
      setShowArrow((prev) => ({ ...prev, up: true }));
    } else {
      setShowArrow((prev) => ({ ...prev, up: false }));
    }

    if (
      Math.floor(
        detailsR.scrollHeight - detailsR.scrollTop - detailsR.clientHeight,
      ) > 0
    ) {
      setShowArrow((prev) => ({ ...prev, down: true }));
    } else {
      setShowArrow((prev) => ({ ...prev, down: false }));
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
      flickerText(
        projectMap[project].text,
        document.getElementById("text-l"),
        LEFT_TYPING_SPEED,
        3000,
      );
      flickerText(
        projectMap[project].description,
        document.getElementById("text-r"),
        RIGHT_TYPING_SPEED,
        3000,
      );
      flickerText(
        projectMap[project].title,
        document.getElementById("title-l"),
        LEFT_TYPING_SPEED,
        2000,
      );
      flickerText(
        projectMap[project].subtitle,
        document.getElementById("subtitle-l"),
        LEFT_TYPING_SPEED,
        2000,
      );
      flickerText(
        projectMap[project].titleR,
        document.getElementById("title-r"),
        RIGHT_TYPING_SPEED,
        2000,
      );
    }, 500);
  }, [props.visible]);

  useEffect(() => {
    getScrollPos();
    setTextLoaded(false);
    setTimeout(() => {
      setTextLoaded(true);
    }, 1000);
  }, [visible]);

  return (
    <>
      <div
        className={`text-foreground [text-shadow:_0_0px_1px_rgb(99_102_241_/_0.8)]  ${visible ? "transition-opacity delay-500 duration-500 ease-in-out opacity-100" : "opacity-0 invisible"}`}
      >
        <div id="details-screen-l" className="w-1/4 absolute">
          <h2
            id="title-l"
            className="w-full text-4xl font-black underline underline-offset-[0.4em] pb-2"
          >
            {projectMap[project]?.title}
          </h2>
          <h3
            id="subtitle-l"
            className="text-2xl font-semibold pt-[0.3em] font-mono"
          >
            {projectMap[project]?.subtitle}
          </h3>
          <a href={projectMap[project]?.link} target="_blank" className={`${projectMap[project]?.link ? '' : 'hidden'} py-[0.3em]`}>
            <h2 className="font-[verdana] text-[#1670e9] hover:text-[white]">{projectMap[project]?.link}</h2>
          </a>
          <pre
            className="text-md pt-4 text-balance bg-blend-difference"
            id="text-l"
          >
            {projectMap[project]?.text}
          </pre>
        </div>

        <div
          id="details-screen-r"
          className="absolute w-1/4 max-h-[50vh] overflow-y-auto scrollbar-hide scroll-smooth touch-pan-y"
          onScrollCapture={getScrollPos}
        >
          {showArrow.up && (
            <div className="fixed w-full content-center top-[15vh] ml-[10%] animate-pulse">
              <Chevron width={40} height={40} />
            </div>
          )}
          {showArrow.down && (
            <div className="fixed w-full content-center bottom-[15vh] ml-[10%] animate-pulse">
              <Chevron width={40} height={40} rotate={180} />
            </div>
          )}
          <div className="[text-shadow:_0_0px_1px_rgb(99_102_241_/_0.8)]">
            <h3
              id="title-r"
              className="text-2xl font-semibold text-nowrap pr-20"
            >
              {projectMap[project]?.titleR}
            </h3>
            <pre
              className="text-md pt-4 text-balance bg-blend-difference"
              id="text-r"
            >
              {projectMap[project]?.description}
            </pre>
            <div className={`${projectMap[project]?.tech ? '' : 'hidden'} text-md font-mono flex flex-wrap justify-between gap-4 pt-4`}>
              <h3 className="w-full text-2xl font-semibold text-nowrap text-center">
                Tech
              </h3>
              <ul className="grid grid-cols-2 text-balance bg-blend-difference list-disc list-inside indent-8 px-2">
                {projectMap[project]?.tech?.map((item: string, index: number) => (
                  <li key={index} className="text-md text-balance bg-blend-difference">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {visible && !textLoaded && (
        <div className="absolute bottom-10 right-10">
          <Miniloader />
        </div>
      )}
    </>
  );
};
