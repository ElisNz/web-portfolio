"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chevron } from "@/app/components/svg";
import MobileProjectScreen from "./screens/MobileProjectScreen";

import { CanvasUI } from "@/app/components";
import { useStore } from "@/app/Store";


export default function Home() {
  const store = useStore((state) => state);
  const { scene, setScene, prefers, setPrefers } = store;
  const router = useRouter();

  const ActionButton = ({ text, onClick, className }: {text: string, onClick: any, className?: string}) => (
    <button
      className={`w-fit hover:scale-110 transition-size duration-300 px-sm font-mono font-black relative ${className}`}
      type="button"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <span className="max-md:hidden">
          <Chevron width={40} height={40} />
        </span>
        <h2 className="text-center text-black/70 dark:text-white/90 w-fit text-2xl [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
          {text}
        </h2>
      </div>
    </button>
  );

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 600;
    setPrefers(prefersReducedMotion ? "reduce" : "no-preference");
  }, []);

  return (
    <>
      <div
        className={`${prefers === "no-preference" ? "" : "hidden"} size-full fixed ${scene === "cover" ? "-z-50" : ""}`}
      >
        <CanvasUI />
      </div>

      <div
        className={`fixed ${prefers === "reduce" ? "" : "hidden"} ${scene === "cover" ? "-z-50" : ""}`}
      >
        <MobileProjectScreen />
      </div>

      <div
        className={`${scene === "cover" ? "opacity-100" : "transition-all duration-300 opacity-0 invisible pointer-events-none"} [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]`}
      >
        <div
          className={`fixed w-full h-full  ${prefers === 'reduce' ? 'bg-gradient-to-b from-[coral]/30 via-50% to-[coral]/60': 'bg-gradient-to-r from-[pink]/60 to-[white]/60'} -z-50 ${scene === "cover" ? "opacity-100" : "opacity-0"}`}
        />
        <div className="h-screen lg:h-fit flex flex-col justify-evenly px-md md:fixed lg:w-1/3 lg:bottom-20 xl:bottom-40 right-0 pt-lg">
          <div>
            <h2 className="text-4xl font-bold [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
              I'm a web designer.
            </h2>
            <p className="dark:opacity-80 text-lg pt-[1.5rem] text-balance bg-blend-difference font-mono [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
              I specialize in creating web experiences with robust design and
              typography for businesses and individuals.
            </p>
            <br />
            <p className="dark:opacity-80 text-lg text-pretty font-mono [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_8px_rgb(99_102_241_/_0.8)]">
              This is a site for my projects, and a design playground.
            </p>
          </div>
          <div className="md:hidden w-full flex flex-row justify-center font-mono font-black px-sm [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_8px_rgb(99_102_241_/_0.8)]">
            <ActionButton 
              text="About" 
              onClick={() => setScene("overview")} 
            />
            <span className="text-[2rem]">|</span>
            <ActionButton
              text="Projects"
              onClick={() => setScene("overview")}
            />
            <span className="text-[2rem]">|</span>
            <ActionButton 
              text="Contact" 
              onClick={() => setScene("overview")} 
            />
          </div>
        </div>
      </div>

      {scene === "cover" && 
        <div className={`max-md:hidden fixed w-full bottom-[10%] flex justify-center`}>
          <button
            className="w-fit hover:scale-110 transition-size duration-300 px-sm font-mono font-black"
            type="button"
            onClick={() => setScene("overview")}
          >
            <div className="flex flex-col items-center">
              <span className="max-md:hidden">
                <Chevron width={40} height={40} />
              </span>
              <h2 className="text-center text-black/70 w-fit text-2xl [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]">
                Overview
              </h2>
            </div>
          </button>
        </div>
      }
      
      <div
        className={`w-full flex flex-row fixed bottom-[3%] justify-center transition-all duration-100 ${scene !== "cover" ? "opacity-100" : "opacity-0 invisible pointer-events-none"}`}
      >
        <button
          className="w-fit hover:scale-110 transition-size duration-300"
          type="button"
          onClick={() => {
            if (scene === "overview") {
              setScene("cover");
            } else {
              setScene("overview");
              router.push("/", { scroll: false });
            }
          }}
        >
          <div className="flex flex-col items-center">
            <Chevron width={40} height={40} rotate={180} />
            <h2 className="w-fit text-2xl font-mono text-[black] [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
              {scene === "overview" ? "Home" : "Overview"}
            </h2>
          </div>
        </button>
      </div>
    </>
  );
}
