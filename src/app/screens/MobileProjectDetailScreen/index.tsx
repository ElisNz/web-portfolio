import { Suspense, useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";
import { Miniloader } from "@/app/components/Miniloader";

const projects = getDataUtility("projects");

export const MobileProjectDetailScreen = () => {
  const store = useStore((state) => state);
  const { scene, project } = store;

  useEffect(() => {
    if (scene === "details") {
      setTimeout(() => {
        const element = document.getElementById("mobile-project-detail-screen");
        if (element) {
          element.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 500);
    }
  }, [scene]);

  return (
    (
      <div
        className={`fixed w-full h-[85vh] pt-[10vh] overflow-scroll scrollbar-custom 
        ${scene === "details"
            ? "opacity-100"
            : "opacity-0 -z-50"} 
        transition-all duration-500 overflow-auto`}
      >
        <div className="flex flex-col lg:px-lg xl:px-xl">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl text-left p-md [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)] font-black">
            {project}
          </h1>
          <div className="w-full lg:w-1/2 flex flex-row justify-center mx-auto">
            <Suspense
              fallback={
                <div className="h-12 w-12 bg-[white]/20 animate-pulse" />
              }
            >
              <div
                className={`content-center h-[12svh] w-[12dvw] bg-[white]/20 ${
                  scene === "details"
                    ? "absolute right-[26dvw] top-[20dvh] opacity-80"
                    : "opacity-0 right-[100dvw]"
                } delay-800 transition-all duration-500`}
              >
                <Image
                  src={
                    projects.find((i) => i.title === project)?.images[0] || ""
                  }
                  alt={
                    projects.find((i) => i.title === project)?.title || ""
                  }
                  width={200}
                  height={200}
                />
              </div>
            </Suspense>
            <Suspense
              fallback={
                <div className="h-12 w-12 bg-[white]/20 animate-pulse" />
              }
            >
              <div
                className={`content-center h-[15dvh] w-[15dvw] bg-[white]/20 ${
                  scene === "details"
                    ? "absolute left-[10dvw] top-[25vh] opacity-40"
                    : "opacity-0 left-[10dvw]"
                } delay-3000 transition-all duration-500`}
              >
                <Image
                  src={
                    projects.find((i) => i.title === project)?.images[0] || ""
                  }
                  alt={
                    projects.find((i) => i.title === project)?.title || ""
                  }
                  width={400}
                  height={400}
                />
              </div>
            </Suspense>
            <Suspense
              fallback={
                <div className="h-12 w-12 bg-[white]/20 animate-pulse" />
              }
            >
              <div
                className={`content-center h-20 w-20 bg-[white]/20 ${
                  scene === "details"
                    ? "absolute right-[10dvw] top-[25vh] opacity-60"
                    : "opacity-0 right-[50dvw]"
                } delay-2000 transition-all duration-500`}
              >
                <Image
                  src={
                    projects.find((i) => i.title === project)?.images[0] || ""
                  }
                  alt={
                    projects.find((i) => i.title === project)?.title || ""
                  }
                  width={400}
                  height={400}
                />
              </div>
            </Suspense>
            <Suspense
              fallback={
                <div className="h-12 w-12 bg-[white]/20 animate-pulse" />
              }
            >
              <div
                className={`content-center self-center bg-[white]/20 ${
                  scene === "details" ? "opacity-100" : "opacity-0"
                } delay-3000 transition-all duration-1000`}
              >
                <Image
                  src={
                    projects.find((i) => i.title === project)?.images[0] || ""
                  }
                  alt={
                    projects.find((i) => i.title === project)?.title || ""
                  }
                  width={200}
                  height={200}
                />
              </div>
            </Suspense>
          </div>
        </div>
        <div className="p-md lg:p-lg xl:p-xl">
          <h2 className="pb-sm [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
            {projects.find((i) => i.title === project)?.subtitle}
          </h2>
          <p className="[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
            {projects.find((i) => i.title === project)?.text}
          </p>
        </div>
      </div>
    )
  )
};
