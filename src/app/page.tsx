"use client";

import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { UpArrow, Chevron } from "@/app/components/svg";

import { CanvasUI } from "@/app/components";
import { useStore } from "@/app/Store";

export default function Home() {
  const store = useStore(state => state);
  const { scene, setScene } = store;
  const showLoader = useStore(useShallow(state => state.showLoader));
  const router = useRouter();

  const fadeOverlay = () => {
    // Fade out overlay
  };

  return (
    <>
      <div className={`size-full fixed ${scene === "cover" ? "-z-50" : ""}`}>
        <CanvasUI />
      </div>

        <div className={`text-white ${scene === 'cover' ? "opacity-100" : 'transition-all duration-300 opacity-0 invisible pointer-events-none'} [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]`}>
          <div className={`fixed w-full h-full bg-[coral]/60 -z-40 ${scene === 'cover' ? "opacity-100" : 'opacity-0'}`}></div>
          <div className="invisible md:visible fixed w-1/3 flex flex-col bottom-20 xl:bottom-40 right-0">
            <h2 className="text-4xl font-bold">I'm a web designer.</h2>
            <p className="text-lg pt-[1.5rem] text-balance bg-blend-difference font-mono">
              I specialize in creating web experiences with robust design and typography for businesses and individuals.
            </p>
            <br/>
            <p className="text-lg text-pretty font-mono">
              This is a site for my projects, and a design playground.
            </p>
          </div>

          <div className="w-full flex flex-row fixed bottom-[10%] justify-center">
            <button
              className="w-fit hover:scale-110 transition-size duration-300"
              type="button"
              onClick={() => {
                fadeOverlay();
                setScene("overview");
                router.push("/", { scroll: false });
              }}
            >
              <div className="flex flex-col items-center">
                <Chevron width={40} height={40} />
                <h2 className="text-black w-fit text-2xl [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)]">See some projects</h2>
              </div>
            </button>
          </div>
        </div>

        <>
          <div className={`w-full flex flex-row fixed bottom-[3%] justify-center transition-all duration-100 ${scene !== 'cover' ? "opacity-100" : 'opacity-0 invisible pointer-events-none'}`}>
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
                <h2 className="w-fit text-2xl">
                  {scene === "overview" ? "Home" : "Overview"}
                </h2>
              </div>
            </button>
          </div>
        </>
    </>
  );
}
