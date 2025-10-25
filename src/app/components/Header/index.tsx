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

  const handleSliderChange = (target: string) => {
    let sliderRef;
    if (target === 'intensity') sliderRef = intensitySliderRef;
    if (target === 'speed') sliderRef = speedSliderRef;
    const value = parseFloat(sliderRef.current.value);
    setOptions({ ...options, [target]: value });    
  };

  useEffect(() => {
    if (!intensitySliderRef.current || !speedSliderRef.current) return;

    intensitySliderRef.current.addEventListener("input", () => handleSliderChange('intensity')); 
    speedSliderRef.current.addEventListener("input", () => handleSliderChange('speed')); 

    return () => {
      if(!intensitySliderRef.current || !speedSliderRef.current) return;

      intensitySliderRef.current.removeEventListener("input", () => handleSliderChange);
      speedSliderRef.current.removeEventListener("input", () => handleSliderChange);
    };
  }, [scene]);
  

  return (
    <div className="absolute w-full z-50 px-sm lg:px-lg">
      <div className="w-full flex flex-row items-baseline justify-between">

        <a href="/" className="text-center divide-solid divide-current divide-y-4">
          <h1 className="text-[3em] w-full mb-0 font-bold tracking-wide">
            el_ni
          </h1>
          <p className="font-bold text-[1em] w-full tracking-tight">UI/UX/WEBDEV</p>
        </a>     


        <div className="max-md:hidden flex flex-row items-center gap-x-2 lg:gap-x-4">
          <div className="flex flex-col items-end text-lg lg:text-xl font-bold border-r-4 border-current p-sm py-2">
              <div className={`${isSettingsOpen && scene === 'cover' ? "h-[6em] opacity-100 mb-4" : "h-0 opacity-0 invisible"} px-sm transition-all duration-300 border-dotted border-b-4 border-current`}>

                <div>
                  <input
                    className="h-[0.25em]"
                    title="Intensity Slider"
                    type="range"
                    min="0.0"
                    max="2"
                    step="0.1"
                    defaultValue={options.intensity || 0.5}
                    ref={intensitySliderRef}
                  />
                  <p className="h-[1em] text-[1rem] font-light mb-0">
                    Grain: {options.intensity > 0.01 ? options.intensity : 'off'}
                  </p>
                </div>

                <div>
                  <input
                    className="h-[0.25em]"
                    title="Speed Slider"
                    type="range"
                    min="0"
                    max="1"
                    step="1"
                    defaultValue={options.speed || 0.1}
                    ref={speedSliderRef}
                  />
                  <p className="h-[1em] text-[1rem] font-light mb-0">
                    Render on/off: {options.speed > 0 ? 'on' : 'off'}
                  </p>
                </div>
              </div>
            

            {items.map((item, index) => (
              <a
                className="px-sm hover:underline underline-offset-4 transition-all duration-300"
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
              className={`size-fit transition duration-300 ease-in-out hover:-rotate-45 hover:scale-110 ${isSettingsOpen ? "text-accent -rotate-45 scale-110" : "text-foreground"}`}
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
