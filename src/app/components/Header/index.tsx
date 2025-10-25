'use client';
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/app/Store";
import { Settings } from "../svg";

export const Header = () => {
  const { options, setOptions } = useStore((state) => state);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const sliderRef = useRef<HTMLInputElement>(null);

  const items = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    if (!sliderRef.current) return;

    const sliderValueElement = document.getElementById("sliderValue");

    const handleSliderChange = () => {
        const value = parseFloat(sliderRef.current.value);
        setOptions({ ...options, intensity: value });    

        sliderValueElement.textContent = value.toFixed(1);  
    };

    sliderRef.current.addEventListener("input", handleSliderChange);  

    return () => {
      if(!sliderRef.current) return;
      sliderRef.current.removeEventListener("input", handleSliderChange);
    };
  }, [setOptions, isSettingsOpen, options]);


  return (
    <div className="absolute w-full h-20 z-50 px-sm lg:px-lg">
      <div className="w-full flex flex-row items-baseline justify-between">

        <a href="/" className="text-center divide-solid divide-current divide-y-4">
          <h1 className="text-[3em] w-full mb-0 font-bold tracking-wide">
            el_ni
          </h1>
          <p className="font-bold text-[1em] w-full tracking-tight">STHLM-TOKYO</p>
        </a>     


        <div className="max-md:hidden flex flex-row gap-2 lg:gap-4 my-4">
          <div className="flex flex-col items-end justify-evenly text-lg lg:text-xl font-bold border-r-4 border-foreground p-4 py-2 gap-2 lg:gap-4">
              <div className={`${isSettingsOpen ? "h-[4em] opacity-100" : "h-[0px] opacity-0 invisible"} px-sm transition-all duration-300 border-dotted border-b-4`}>
                <input
                  className="h-[1em]"
                  title="Intensity Slider"
                  type="range"
                  id="slider"
                  min="0.0"
                  max="2"
                  step="0.1"
                  defaultValue={options.intensity || 0.5}
                  ref={sliderRef}
                />
                <div className="h-[2em]">
                  Grain: <span id="sliderValue">{options.intensity > 0.01 ? options.intensity : 'off'}</span>
                </div>
              </div>
            

            {items.map((item, index) => (
              <a
                className="h-[2rem] px-sm hover:underline underline-offset-4 transition-all duration-300"
                key={index}
                href={item.href}
              >
                {item.name}
              </a>
            ))}
          </div>

          <button
            type="button"
            title="settings"
            className={`transition duration-300 ease-in-out hover:-rotate-45 hover:scale-110 ${isSettingsOpen ? "text-accent -rotate-45 scale-110" : "text-foreground"}`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings />
          </button>
          
        </div>
      </div>
    </div>
  );
};
