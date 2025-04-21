import { Suspense, useMemo } from "react";
import Image from "next/image";

import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";


export default function MobileProjectScreen() {
  const store = useStore((state) => state);
  const { scene, setScene, project, setProject } = store;
  const projects = useMemo(() => getDataUtility("projects"), []);


  const ProjectCard = ({ title, images }) => (
    <button type="button" title={title} className="flex flex-col text-center items-center justify-start" onClick={() => {
      setProject(title);
      setScene('details');}}
    >
      <div className="relative size-full content-center bg-[white]/20">
        <Image src={images[0]} alt={title} width={200} height={200} />
      </div>
      <h2 className="pt-2 break-all">{title}</h2>
    </button>
  );


  let backgroundStyle = "";

  switch (scene) {
    case "cover":
      backgroundStyle = "bg-transparent";
      break;
    case "overview":
      backgroundStyle = "bg-gradient-to-r from-[pink] to-[coral]/40";
      break;
    case "details":
      backgroundStyle = "bg-gradient-to-b from-[pink] to-[coral]/60";
      break;
    default:
      backgroundStyle = "bg-transparent";
  }

  return (
    <div className={`fixed w-full h-full ${backgroundStyle} text-background`}>
      <div
        className={`fixed w-full h-full ${scene === "overview" ? "opacity-100" : "hidden opacity-0"} transition-all duration-500 overflow-hidden`}
      >
        <div className="h-[70vh] grid grid-cols-2 items-center justify-center mt-[15vh] gap-4 px-md overflow-auto">
          {projects?.map((project, index) => (
            project.title ? <ProjectCard key={index} {...project} /> : null
          ))}
        </div>
      </div>

      {scene !== "cover" && 
        <div
          className={`fixed w-full h-[85vh] pt-[10vh] pb-[20vh] overflow-scroll ${scene === "details" ? "opacity-100" : "opacity-0 -z-50"} transition-all duration-500 overflow-auto`}
        >
          <div className="flex flex-col">
            <h1 className="text-4xl text-left p-md [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)] font-black">{project}</h1>
            <Suspense fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}>
              <div className={`content-center h-12 w-12 bg-[white]/20 ${scene === "details" ? "absolute right-[4dvw] top-[40vh] opacity-20" : "opacity-0 right-[100dvw]"} delay-800 transition-all duration-500`}>
                  <Image src={projects.find(i => i.title === project)?.images[0] || ''} alt={projects.find(i => i.title === project)?.title || ''} width={100} height={100} />
              </div>
            </Suspense>
            <Suspense fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}>
              <div className={`content-center h-16 w-16 bg-[white]/20 ${scene === "details" ? "absolute left-[5dvw] top-[30vh] opacity-40" : "opacity-0 left-[10dvw]"} delay-3000 transition-all duration-500`}>
                <Image src={projects.find(i => i.title === project)?.images[0] || ''} alt={projects.find(i => i.title === project)?.title || ''} width={100} height={100} />
              </div>
            </Suspense>
            <Suspense fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}>
              <div className={`content-center h-20 w-20 bg-[white]/20 ${scene === "details" ? "absolute right-[10dvw] top-[25vh] opacity-60" : "opacity-0 right-[50dvw]"} delay-2000 transition-all duration-500`}>
                <Image src={projects.find(i => i.title === project)?.images[0] || ''} alt={projects.find(i => i.title === project)?.title || ''} width={100} height={100} />
              </div>
            </Suspense>
            <Suspense fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}>
              <div className={`z-50 content-center self-center h-40 w-40 bg-[white]/20 ${scene === "details" ? "opacity-100" : "opacity-0"} delay-3000 transition-all duration-1000`}>
                <Image src={projects.find(i => i.title === project)?.images[0] || ''} alt={projects.find(i => i.title === project)?.title || ''} width={200} height={200} />
              </div>
            </Suspense>
          </div>
          <div className="p-md">
            <h2 className="text-2xl pb-sm font-semibold [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">{projects.find(i => i.title === project)?.subtitle}</h2>
            <p className="text-[1rem] [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">{projects.find(i => i.title === project)?.text}</p>
          </div>
        </div>
      }
    </div>
  );
}
