import { Suspense } from "react";

import { useStore } from "@/app/Store";
import Image from "next/image";

const projects = [
  {
    title: "",
    subtitle: "",
    text: "",
    images: ["/images/texture_text_test.png"],
    description: "",
  },
  {
    title: "Motherstructures",
    subtitle: "Urban greenspaces",
    text: "Motherstructures is a New York based company that aims to create urban greenspaces from simple, easily reusable materials. The project is a collaboration between the city council and local businesses. The goal is to create a network of green spaces that are accessible to everyone. The project is currently in the planning stage, and we are looking for input from the community. If you have any ideas or suggestions, please let us know! please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!please let us know!",
    images: ["https://picsum.photos/200"],
    description:
      "I was approached to replace a website for a local community project. The project aims to create urban greenspaces in the city. The project is a collaboration between the city council and local businesses. The goal is to create a network of green spaces that are accessible to everyone. The project is currently in the planning stage, and we are looking for input from the community. If you have any ideas or suggestions, please let us know!",
  },
  {
    title: "Project 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: ["https://picsum.photos/100"],
  },
  {
    title: "Project 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: ["https://picsum.photos/400"],
  },
  {
    title: "Project 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: ["https://picsum.photos/100"],
  },
  {
    title: "Project 5",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: ["https://picsum.photos/300"],
  },
];

export default function MobileProjectScreen() {
  const store = useStore((state) => state);
  const { scene, setScene, project, setProject } = store;

  const ProjectCard = ({ title, images }) => (
    <button type="button" title={title} className="h-[10rem] w-[20vw] flex flex-col text-center items-center justify-start" onClick={() => {
      setProject(title);
      setScene('details');}}
    >
      <div className="content-center h-20 w-20 bg-[white]/20">
        <Image src={images[0]} alt={title} width={100} height={100} />
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
    <>
      <div
        className={`fixed w-full h-full ${backgroundStyle} ${scene === "overview" ? "opacity-100" : "hidden opacity-0"} transition-all duration-500`}
      >
        <div className="h-full flex flex-wrap items-center justify-evenly py-[15vh] gap-4 p-md">
          {projects.map((project, index) => (
            project.title ? <ProjectCard key={index} {...project} /> : null
          ))}
        </div>
      </div>

      {scene !== "cover" && 
        <div
          className={`fixed w-full h-full pt-[10vh] pb-[20vh] overflow-scroll ${backgroundStyle} ${scene === "details" ? "opacity-100" : "opacity-0 -z-50"} transition-all duration-500`}
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
    </>
  );
}
