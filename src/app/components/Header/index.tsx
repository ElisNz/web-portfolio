'use client';
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/app/Store";
import { Settings } from "../svg";

export const Header = () => {
  const { scene, options, setOptions } = useStore((state) => state);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const intensitySliderRef = useRef<HTMLInputElement>(null);
  const speedSliderRef = useRef<HTMLInputElement>(null);

  const items = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    if (!intensitySliderRef.current || !speedSliderRef.current) return;

    const handleSliderChange = (target: string) => {
        const value = parseFloat(intensitySliderRef.current.value);
        setOptions({ ...options, [target]: value });    
    };

    intensitySliderRef.current.addEventListener("input", () => handleSliderChange('intensity')); 
    speedSliderRef.current.addEventListener("input", () => handleSliderChange('speed')); 

    return () => {
      if(!intensitySliderRef.current || !speedSliderRef.current) return;

      intensitySliderRef.current.removeEventListener("input", () => handleSliderChange);
      speedSliderRef.current.removeEventListener("input", () => handleSliderChange);
    };
  }, [setOptions, isSettingsOpen]);


  return (
    <div className="absolute w-full z-50 px-sm lg:px-lg">
      <div className="w-full flex flex-row items-baseline justify-between">

        <a href="/" className="text-center divide-solid divide-current divide-y-4">
          <h1 className="text-[3em] w-full mb-0 font-bold tracking-wide">
            el_ni
          </h1>
          <p className="font-bold text-[1em] w-full tracking-tight">UI/UX/WEBDEV</p>
        </a>     


        <div className="max-md:hidden flex flex-row gap-x-2 lg:gap-x-4">
          <div className="flex flex-col items-end text-lg lg:text-xl font-bold border-r-4 border-current p-4 py-2">
              <div className={`${isSettingsOpen && scene === 'cover' ? "h-[8em] opacity-100 mb-4" : "h-0 opacity-0 invisible"} px-sm transition-all duration-300 border-dotted border-b-4 border-current`}>

                <div>
                  <input
                    className="h-[0.25em]"
                    title="Intensity Slider"
                    type="range"
                    id="intensityslider"
                    min="0.0"
                    max="2"
                    step="0.1"
                    defaultValue={options.intensity || 0.5}
                    ref={intensitySliderRef}
                  />
                  <p className="h-[2em] text-[1rem] mb-0">
                    Grain: <span id="intensityslidervalue">{options.intensity > 0.01 ? options.intensity : 'off'}</span>
                  </p>
                </div>

                <div>
                  <input
                    className="h-[0.25em]"
                    title="Speed Slider"
                    type="range"
                    id="speedslider"
                    min="0.0"
                    max="2"
                    step="0.1"
                    defaultValue={options.speed || 2.0}
                    ref={speedSliderRef}
                  />
                  <p className="h-[2em] text-[1rem] mb-0">
                    Speed: <span id="speedslidervalue">{options.speed > 0.01 ? options.speed : 'none'}</span>
                  </p>
                </div>

              </div>
            

            {items.map((item, index) => (
              <a
                className="px-sm hover:underline underline-offset-4 transition-all duration-300 my-2"
                key={index}
                href={item.href}
              >
                {item.name}
              </a>
            ))}
          </div>
          {scene === "cover" && (
            <button
              type="button"
              title="settings"
              className={`transition duration-300 ease-in-out hover:-rotate-45 hover:scale-110 ${isSettingsOpen ? "text-accent -rotate-45 scale-110" : "text-foreground"}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
