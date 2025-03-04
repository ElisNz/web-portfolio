"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { UpArrow } from "@/app/components/svg";

import { CanvasUI } from "@/app/components";
import { useStore } from "@/app/Store";

export default function Home() {
  const store = useStore(state => state);
  const { scene, setScene } = store;
  const router = useRouter();

  const fadeOverlay = () => {
    // Fade out overlay
  };

  return (
    <>
      <div className={`size-full fixed ${scene === "cover" ? "-z-50" : ""}`}>
        <CanvasUI />
      </div>

      {scene === "cover" && (
        <>
          <div className={`fixed w-full h-full bg-[coral]/60 -z-40`}></div>
          <div className="invisible md:visible fixed w-1/3 flex flex-col bottom-20 xl:bottom-40 right-0 pr-12">
            <h2 className="text-4xl font-bold">I'm a web designer.</h2>
            <p className="text-lg pt-[1.5rem] text-balance bg-blend-difference">
              I specialize in creating web experiences with robust design and typography for businesses and individuals.
            </p>
            <p className="text-lg text-pretty pt-[0.7rem]">
              This is a site for my projects, and a design playground.
            </p>
          </div>

          <div className="w-full flex flex-row fixed bottom-[10%] justify-center">
            <button
              type="button"
              onClick={() => {
                fadeOverlay();
                setScene("overview");
                router.push("/", { scroll: false });
              }}
            >
              <div className="flex flex-col items-center">
                <UpArrow width={40} height={40} />
                <h2 className="w-fit text-2xl">See some projects</h2>
              </div>
            </button>
          </div>
        </>
      )}
      {scene !== "cover" && (
        <>
          <div className="w-full flex flex-row fixed bottom-[3%] justify-center">
            <button
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
                <UpArrow width={40} height={40} rotate={180} />
                <h2 className="w-fit text-2xl">
                  {scene === "overview" ? "Home" : "Overview"}
                </h2>
              </div>
            </button>
          </div>
{/*           <div className="absolute w-2/3 flex flex-row -z-50 gap-4 bottom-2 -right-20 overflow-clip opacity-50">
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
          </div>
          <div className="absolute w-2/3 flex flex-row -z-50 gap-4 top-20 -left-20 overflow-clip opacity-50">
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
            <Image src="/images/texture_text_test.png" width={200} height={100} alt="text" />
          </div> */}
        </>
      )}
    </>
  );
}
