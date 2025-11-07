import { useMemo, Suspense } from "react";
import Image from "next/image";

import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";

import { MobileProjectDetailScreen } from "../MobileProjectDetailScreen";


export default function MobileProjectScreen() {
  const store = useStore((state) => state);
  const { scene, setScene, setProject } = store;
  const projects = useMemo(() => getDataUtility("projects"), []);

  const ProjectCard = ({ title, images }) => (
    <Suspense fallback={<p>Loading...</p>}>
      <button
        type="button"
        title={title}
        className="flex flex-col text-center items-center justify-center lg:justify-center lg:gap-4 select-none hover:scale-[1.1] transition-scale duration-300 pb-8 md:pb-0"
        onClick={() => {
          setProject(title?.toLowerCase());
          setScene("details");
        }}
      >
        <div className="size-40 md:size-[15rem] relative">
          {images[0] ?  
            <Image draggable="false" src={images[0]} alt={title} fill /> : 
            <div className="max-md:h-[10em] place-content-center overflow-hidden">
              <strong className="max-md:h-full text-[10em] max-md:leading-[1.5rem] uppercase font-black">{title[0]}</strong>
            </div>
          }
        </div>
        <h2
          className={`${scene !== "overview" ? "invisible" : ""} mb-0 text-center text-nowrap capitalize tracking-tighter md:pt-2 break-all text-[1.5em] lg:text-xl xl:text-2xl md:max-w-[8rem] lg:max-w-[15rem]`}
        >
          {title}
        </h2>
      </button>
    </Suspense>
  );

  let backgroundStyle = "";

  switch (scene) {
    case "cover":
      backgroundStyle = "bg-transparent";
      break;
    case "overview":
      backgroundStyle = "bg-gradient-to-r from-[pink] to-[white]/60";
      break;
    case "details":
      backgroundStyle = "bg-gradient-to-b from-[coral]/40 to-[pink]/60";
      break;
    default:
      backgroundStyle = "bg-transparent -z-50";
  }

  return (
    <div className={`fixed w-full h-full ${backgroundStyle} text-background`}>
      <div
        className={`fixed w-full h-full ${
          scene === "overview"
            ? "opacity-100"
            : "opacity-10 scale-[0.95] pointer-events-none blur-sm"
        } transition-all duration-500 overflow-scroll lg:overflow-hidden`}
      >
        <div className="md:h-[75vh] w-full flex flex-col md:flex-wrap mt-40 md:mt-20 max-md:mb-40 justify-center gap-8 scrollbar-custom lg:gap-8">
          {projects?.map((project, index) =>
            project.title ? <ProjectCard key={index} {...project} /> : null,
          )}
        </div>
      </div>

      {scene !== "cover" && <MobileProjectDetailScreen />}
    </div>
  );
}
