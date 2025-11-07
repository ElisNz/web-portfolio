import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";


const projects = getDataUtility("projects");


export const MobileProjectDetailScreen = () => {
  const store = useStore((state) => state);
  const [projectData, setProjectData] = useState(null);
  const { scene, project } = store;
  const images = projects.find((i) => i.title === project)?.images || [];

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
        <div className="w-full lg:w-1/2 flex flex-row justify-center">
          {images.map((img, idx) => (

            <Suspense
              fallback={<div className="h-20 w-20 animate-pulse" />}
              key={idx}
            >
              <div
                className={`size-40 lg:size-80 ${
                  visible
                    ? "left-[12vw] top-[15%]"
                    : "opacity-0 left-0"
                } delay-800 transition-all duration-500`}
              >
                <Image
                  src={img || ""}
                  alt={img || ""}
                  fill
                  className="object-contain"
                />
              </div>
            </Suspense>
            ))
          }
        
        
{/*           {images[0] &&
            <Suspense
              fallback={<div className="h-20 w-20 animate-pulse" />}
            >
              <div
                className={`size-40 lg:size-80 ${
                  visible
                    ? "lg:absolute left-[12vw] top-[15%]"
                    : "opacity-0 left-0"
                } delay-800 transition-all duration-500`}
              >
                <Image
                  src={images[0] || ""}
                  alt={images[0] || ""}
                  fill
                  className="object-contain"
                />
              </div>
            </Suspense>
          }

          {images[1] &&
            <Suspense
              fallback={<div className="h-12 w-12  animate-pulse" />}
            >
              <div
                className={`content-center h-[20dvh] w-[20dvw]  ${
                  visible
                    ? "lg:absolute left-[10dvw] top-[25vh] opacity-80 hover:scale-[1.05]"
                    : "opacity-0 left-[10dvw]"
                } delay-3000 transition-all duration-500`}
              >
                <Image
                  src={images[1] || ""}
                  alt={projects.find((i) => i.title === project)?.title || ""}
                  width={400}
                  height={400}
                />
              </div>
            </Suspense>
          }

          {images[2] &&
            <Suspense
              fallback={<div className="h-12 w-12  animate-pulse" />}
            >
              <div
                className={`content-center h-[10dvh] w-[10dvw]  ${
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
          }

          {images[3] &&
            <Suspense
              fallback={<div className="h-12 w-12  animate-pulse" />}
            >
              <div
                className={`w-[25dvw] h-[25dvw] content-center self-center  ${
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
          } */}
        </div>
      </div>

      <div
        className="col-span-3 grid grid-cols-1 gap-x-8 px-md lg:px-lg xl:px-xl"
      >
        <div>
          <h1 className="text-[1.5rem] md:text-[2rem] lg:text-[3em] mb-0 capitalize">
            {project}
          </h1>
          <div className="w-full lg:flex lg:flex-row justify-between pb-sm gap-x-8">

            <div className="lg:w-1/2">
              <h3 className="mb-0 text-[1rem] lg:text-[1.5em]">{projectData?.subtitle}</h3>
              <a
                href={projectData?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-fit truncate block underline pb-md pr-sm text-blue-700 font-mono text-[1.1rem]"
              >
                {projectData?.link?.replace(/(^\w+:|)\/\/(www\.)/, '')}
              </a>
            </div>

            <div className="flex flex-col lg:justify-between items-start">
              <h3 className="w-fit max-md:hidden">Stack</h3>
              <ul className="w-full grid grid-cols-2 md:grid-cols-3 list-disc list-outside md:gap-x-8 px-sm">
                {projectData?.tech?.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>

          </div>
          <h2 className="text-[1.5rem] lg:text-[2rem]">{projectData?.titleR}</h2>
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
