import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";
import { Miniloader } from "@/app/components/Miniloader";

const projects = getDataUtility("projects");


export const MobileProjectDetailScreen = () => {
  const store = useStore((state) => state);
  const [projectData, setProjectData] = useState(null);
  const { scene, project } = store;

  const visible = scene === "details";

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const element = document.getElementById("mobile-project-detail-screen");
        if (element) {
          element.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 500);
    }

    setProjectData(projects.find((i) => i.title === project.toLowerCase()));
  }, [scene]);

  return (
    <div
      className={`lg:grid lg:grid-cols-5 gap-x-20 fixed w-full h-full pt-[20vh] pb-[20vh] md:pb-none overflow-scroll scrollbar-custom
        ${
          visible
            ? "opacity-100"
            : "opacity-0 -z-50 scale-[0.95] pointer-events-none blur-sm"
        } 
        transition-all duration-0 overflow-auto`}
    >
      <div className="relative lg:col-span-2 w-full flex flex-col items-center">
        
        <div className="w-full lg:w-1/3 flex flex-row justify-center mx-auto">
          <Suspense
            fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}
          >
            <div
              className={`content-center h-[12svh] w-[12dvw] bg-[white]/20 ${
                visible
                  ? "lg:absolute right-[26dvw] top-[20dvh] opacity-80 hover:scale-[1.05]"
                  : "opacity-0 right-[100dvw]"
              } delay-800 transition-all duration-500`}
            >
              <Image
                src={projects.find((i) => i.title === project)?.images[0] || ""}
                alt={projects.find((i) => i.title === project)?.title || ""}
                width={200}
                height={200}
              />
            </div>
          </Suspense>
          <Suspense
            fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}
          >
            <div
              className={`content-center h-[20dvh] w-[20dvw] bg-[white]/20 ${
                visible
                  ? "lg:absolute left-[10dvw] top-[25vh] opacity-80 hover:scale-[1.05]"
                  : "opacity-0 left-[10dvw]"
              } delay-3000 transition-all duration-500`}
            >
              <Image
                src={projects.find((i) => i.title === project)?.images[0] || ""}
                alt={projects.find((i) => i.title === project)?.title || ""}
                width={400}
                height={400}
              />
            </div>
          </Suspense>
          <Suspense
            fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}
          >
            <div
              className={`content-center h-[10dvh] w-[10dvw] bg-[white]/20 ${
                visible
                  ? "lg:absolute right-[10dvw] top-[25vh] opacity-60 hover:scale-[1.05]"
                  : "opacity-0 right-[50dvw]"
              } delay-2000 transition-all duration-500`}
            >
              <Image
                src={projects.find((i) => i.title === project)?.images[0] || ""}
                alt={projects.find((i) => i.title === project)?.title || ""}
                width={400}
                height={400}
              />
            </div>
          </Suspense>
          <Suspense
            fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}
          >
            <div
              className={`w-[25dvw] h-[25dvw] content-center self-center bg-[white]/20 ${
                visible
                  ? "opacity-100 hover:scale-[1.05] z-50"
                  : "opacity-0 blur-md"
              } delay-3000 transition-all duration-1000`}
            >
              <Image
                src={projects.find((i) => i.title === project)?.images[0] || ""}
                alt={projects.find((i) => i.title === project)?.title || ""}
                width={400}
                height={400}
              />
            </div>
          </Suspense>
        </div>
      </div>

      <div
        className="col-span-3 grid grid-cols-1 gap-x-8 px-md lg:px-lg xl:px-xl"
      >
        <div className="w-full">
          <h1 className="max-lg:text-[2rem] mb-0 capitalize">
            {project}
          </h1>
          <div className="lg:flex lg:flex-row justify-between pb-sm">

            <div>
              <h3 className="mb-0">{projectData?.subtitle}</h3>
              <a
                href={projectData?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="size-fit underline pb-md block text-blue-700 font-mono text-[1.1rem] tracking-wider"
              >
                {projectData?.link?.replace(/(^\w+:|)\/\/(www\.)/, '')}
              </a>
            </div>

            <div className="flex flex-col lg:justify-between items-start">
              <h3 className="w-fit">Stack</h3>
              <ul className="w-fit grid grid-cols-2 md:grid-cols-3 list-disc list-inside md:gap-x-8">
                {projectData?.tech?.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>

          </div>
          <h2>{projectData?.titleR}</h2>
          <p>{projectData?.text}</p>

          <p>{projectData?.description}</p>
        </div>

{/*         <div>
          <h3 className="text-center">Tech Stack</h3>
          <ul className="w-1/2 flex flex-wrap list-disc justify-center gap-x-8 gap-y-4 mx-auto">
            {projectData?.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div> */}
      </div>
      {/* <div className="px-md lg:px-lg xl:px-xl">
        <h2 className="pb-sm [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
          {projects.find((i) => i.title === project)?.subtitle}
        </h2>
        <p className="[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
          {projects.find((i) => i.title === project)?.text}
        </p>
      </div> */}
    </div>
  );
};
