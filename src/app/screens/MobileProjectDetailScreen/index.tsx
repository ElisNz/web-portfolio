import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";
import { Miniloader } from "@/app/components/Miniloader";

const projects = getDataUtility("projects");

const devProjects = {
  "markanta": {
    title: "Markanta",
    subtitle: "Engineering Consultants",
    text: "Markanta is an e-commerce platform that connects buyers and sellers from around the world. The platform is designed to be easy to use, and offers a wide range of products and services. Markanta is a great place to find unique items that you won't find anywhere else. Whether you're looking for clothing, accessories, or home decor, Markanta has something for everyone.",
    titleR: "About the project",
    description:
      "I was approached to replace a website for an e-commerce platform. The platform is designed to be easy to use, and offers a wide range of products and services. Markanta is a great place to find unique items that you won't find anywhere else. Whether you're looking for clothing, accessories, or home decor, Markanta has something for everyone.",
    tech: [
      "Next.js",
      "Tailwind/CSS",
      "Node.js",
      "Google Cloud",
      "Firebase",
    ],
    link: "https://markanta.se/",
  },
"jacob dahlgren": {
    title: "jacob dahlgren",
    subtitle: "artist and designer",
    text: `Jacob Dahlgren’s work is concerned with a dialogue between the authoritative singularity of pure formal abstraction and its position within a variable, complex and social shared culture. Dahlgren’s repetitious collections of ubiquitous and ordinary objects, often domestic, industrially manufactured; stand in their gestalt form as proxy for High Modernist Abstract Painting and for all of the ideological territory that Twentieth Century Art Theory has staked out for it.`,
    titleR: "About the project",
    description:
      "I was approached to replace a website for an e-commerce platform. The platform is designed to be easy to use, and offers a wide range of products and services. Markanta is a great place to find unique items that you won't find anywhere else. Whether you're looking for clothing, accessories, or home decor, Markanta has something for everyone.",
    tech: ["Wordpress"],
    link: "https://jacobdahlgren.com/",
  }
};

export const MobileProjectDetailScreen = () => {
  const store = useStore((state) => state);
  const { scene, project } = store;
  const [showArrow, setShowArrow] = useState({ up: false, down: false });

  const visible = scene === "details";
  console.log(project);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const element = document.getElementById("mobile-project-detail-screen");
        if (element) {
          element.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 500);
    }
  }, [scene]);

  return (
    <div
      className={`grid grid-cols-2 gap-x-20 fixed w-full h-full pt-20 pb-40 overflow-scroll scrollbar-custom [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]
        ${
          visible
            ? "opacity-100"
            : "opacity-0 -z-50 scale-[0.95] pointer-events-none blur-sm"
        } 
        transition-all duration-0 overflow-auto`}
    >
      <div className="relative w-full flex flex-col items-center">
        <h1 className="capitalize [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]">
          {project}
        </h1>
        <div className="w-full lg:w-1/2 flex flex-row justify-center mx-auto">
          <Suspense
            fallback={<div className="h-12 w-12 bg-[white]/20 animate-pulse" />}
          >
            <div
              className={`content-center h-[12svh] w-[12dvw] bg-[white]/20 ${
                visible
                  ? "absolute right-[26dvw] top-[20dvh] opacity-80 hover:scale-[1.05]"
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
                  ? "absolute left-[10dvw] top-[25vh] opacity-80 hover:scale-[1.05]"
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
                  ? "absolute right-[10dvw] top-[25vh] opacity-60 hover:scale-[1.05]"
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
        className="grid grid-cols-1 gap-x-8 px-md lg:px-lg xl:px-xl pt-20"
      >
        <div>
          <h2>{devProjects[project]?.subtitle}</h2>

          <p className="pb-sm">{devProjects[project]?.text}</p>

          <h3>{devProjects[project]?.titleR}</h3>
          <p>{devProjects[project]?.description}</p>
        </div>

        <div className="flex flex-row justify-between px-md">
          <div>
            <h3 className="pt-md">Tech Stack</h3>
            <ul className="grid grid-cols-2 list-disc list-inside px-sm">
              {devProjects[project]?.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="pt-md">Link</h3>
            <p className="pb-sm">
              <a
                href={devProjects[project]?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {devProjects[project]?.link}
              </a>
            </p>
          </div>
        </div>
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
