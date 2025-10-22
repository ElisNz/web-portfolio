"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chevron } from "@/app/components/svg";
import MobileProjectScreen from "./screens/MobileProjectScreen";

import { CanvasUI } from "@/app/components";
import { Texture } from "@/app/texture";
import { useStore } from "@/app/Store";

import { insertBlinkingCaret, typeAndEraseWords } from "@/app/functions";

export default function Home() {
  const store = useStore((state) => state);
  const { scene, setScene, prefers, setPrefers } = store;
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const ActionButton = ({
    text,
    onClick,
    className,
  }: {
    text: string;
    onClick: any;
    className?: string;
  }) => (
    <button
      className={`w-full hover:scale-110 transition-size duration-300 relative ${className}`}
      type="button"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-center text-[1.5em]">
          {text}
        </h2>
      </div>
    </button>
  );

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 1024;
    if (prefersReducedMotion) {
      setPrefers(prefersReducedMotion ? "reduce" : "no-preference");
    }
    setIsMounted(true);
    insertBlinkingCaret("caret");
    typeAndEraseWords(
      [
        "creative web",
        "systems",
        "freelance web",
        "full-stack",
        " design-minded web",
        " detail-oriented",
        "dedicated app",
        "front-end",
      ],
      "typing",
    );
  }, []);

  return (
    <>
{/*       {prefers === "no-preference" && isMounted &&
        <div
          className={`${prefers === "no-preference" ? "" : "hidden"} size-full fixed ${scene === "cover" ? "-z-50" : ""}`}
        >
          <CanvasUI />
        </div>
      } */}
      {prefers === "no-preference" && isMounted && <Texture />}

      <MobileProjectScreen />

      <div
        className={`${scene === "cover" ? "opacity-100" : "hidden transition-all duration-300 opacity-0 invisible pointer-events-none"} [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]`}
      >
        <div
          className={`fixed w-full h-full ${prefers === "reduce" ? "bg-gradient-to-b from-[coral]/30 via-50% to-[coral]/60" : "bg-gradient-to-r from-[pink]/60 to-[white]/60"} -z-50 ${scene === "cover" ? "opacity-100" : "opacity-0"}`}
        />
        <div className="h-screen lg:h-fit flex flex-col justify-evenly px-md md:fixed lg:w-1/3 lg:bottom-20 xl:bottom-40 right-0 pt-lg">
          <div>
            <h2 className="text-pretty h-[2em] mb-[1.5em]">
              I'm a <span id="typing"></span>
              <span id="caret"></span>{" "}
              <span className="text-nowrap">developer</span>.
            </h2>
            <p>Full-stack developer for hire.</p>
            <p className="text-balance bg-blend-difference">
              My specialization is in creating web experiences with robust design and
              typography for businesses and individuals.
            </p>
            <br />
            <p className="text-pretty bg-blend-difference">
              This is a site for my projects, and a design playground.
            </p>
          </div>
          <div className="md:hidden w-full grid grid-cols-3 gap-x-12">
            <ActionButton text="About" onClick={() => setScene("overview")} />
            <ActionButton text="Projects" onClick={() => setScene("overview")} />
            <ActionButton text="Contact" onClick={() => router.push('/contact')} />
          </div>
        </div>
      </div>

      {scene === "cover" && (
        <div
          className={`max-md:hidden fixed w-full bottom-[10%] flex justify-center`}
        >
          <button
            className="w-fit hover:scale-110 transition-size duration-300 px-sm font-mono font-black"
            type="button"
            onClick={() => setScene("overview")}
          >
            <div className="flex flex-col items-center">
              <span className="max-md:hidden">
                <Chevron width={40} height={40} />
              </span>
              <h3 className="text-center w-fit [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
                overview
              </h3>
            </div>
          </button>
        </div>
      )}

      <div
        className={`w-full flex flex-row fixed bottom-0 py-sm justify-center ${scene !== "cover" ? "transition-all duration-300" : "opacity-0 invisible pointer-events-none"}`}
      >
        <button
          className="w-fit p-sm hover:scale-110 transition-size duration-300"
          type="button"
          onClick={() => {
            if (scene === "overview") {
              router.push("/", { scroll: false });
              setScene("cover");
            } else {
              setScene("overview");
            }
          }}
        >
          <div className="max-lg:h-[10vh] flex flex-col items-center">
            <Chevron width={40} height={40} rotate={180} />
            <h3 className="w-fit [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
              {scene === "overview" ? "home" : "overview"}
            </h3>
          </div>
        </button>
      </div>
    </>
  );
}
